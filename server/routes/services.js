const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// Cache for cloud services (optional - reduces Firestore reads)
let cachedServices = null;
let lastCacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to transform service data (map baseCost to cost)
function transformServiceData(services) {
  const transformed = {};

  for (const [provider, categories] of Object.entries(services)) {
    transformed[provider] = {};

    for (const [category, serviceList] of Object.entries(categories)) {
      transformed[provider][category] = serviceList.map(service => ({
        ...service,
        cost: service.cost !== undefined ? service.cost : service.baseCost // Map baseCost to cost
      }));
    }
  }

  return transformed;
}

// Helper function to get services from Firebase with caching
async function getServicesFromFirebase() {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedServices && lastCacheTime && (now - lastCacheTime < CACHE_DURATION)) {
    return cachedServices;
  }

  try {
    const doc = await db.collection('cloudServices').doc('allServices').get();

    if (!doc.exists) {
      throw new Error('Cloud services not found in Firebase. Please run the upload script.');
    }

    const data = doc.data();
    const rawServices = data.data; // The actual services structure

    // Transform the data to map baseCost to cost
    cachedServices = transformServiceData(rawServices);
    lastCacheTime = now;

    return cachedServices;
  } catch (error) {
    console.error('Error fetching from Firebase:', error);
    // Fallback to hardcoded data if Firebase fails
    const cloudServices = require('../data/cloudServices');
    return cloudServices;
  }
}

// Get all cloud services
router.get('/', async (req, res) => {
  try {
    const services = await getServicesFromFirebase();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
});

// Get services for specific provider
router.get('/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    const services = await getServicesFromFirebase();
    const providerServices = services[provider];

    if (!providerServices) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json(providerServices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
});

// Get services by category
router.get('/:provider/:category', async (req, res) => {
  try {
    const { provider, category } = req.params;
    const services = await getServicesFromFirebase();
    const providerServices = services[provider];

    if (!providerServices) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const categoryServices = providerServices[category];
    if (!categoryServices) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(categoryServices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
});

// Force refresh cache (admin endpoint)
router.post('/refresh-cache', async (req, res) => {
  try {
    cachedServices = null;
    lastCacheTime = null;
    const services = await getServicesFromFirebase();
    res.json({ message: 'Cache refreshed successfully', serviceCount: Object.keys(services).length });
  } catch (error) {
    res.status(500).json({ message: 'Error refreshing cache', error: error.message });
  }
});

module.exports = router;
