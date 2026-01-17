const express = require('express');
const router = express.Router();
const cloudServices = require('../data/cloudServices');

// Get all cloud services
router.get('/', (req, res) => {
  res.json(cloudServices);
});

// Get services for specific provider
router.get('/:provider', (req, res) => {
  const { provider } = req.params;
  const providerServices = cloudServices[provider];

  if (!providerServices) {
    return res.status(404).json({ message: 'Provider not found' });
  }

  res.json(providerServices);
});

// Get services by category
router.get('/:provider/:category', (req, res) => {
  const { provider, category } = req.params;
  const providerServices = cloudServices[provider];

  if (!providerServices) {
    return res.status(404).json({ message: 'Provider not found' });
  }

  const categoryServices = providerServices[category];
  if (!categoryServices) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.json(categoryServices);
});

module.exports = router;
