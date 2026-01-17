const XLSX = require('xlsx');
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

const db = admin.firestore();

// Map Excel categories to frontend categories
const categoryMapping = {
  'Compute': 'compute',
  'Storage': 'storage',
  'Database': 'database',
  'Networking': 'networking',
  'Serverless': 'serverless',
  'AI/ML': 'ai',
  'Cache': 'cache',
  'Messaging': 'messaging'
};

// Parse price string to hourly rate number
function parsePriceToHourly(priceStr) {
  if (!priceStr || priceStr === '-' || priceStr === 'Free') return 0;

  // Extract number from string like "$0.0042/hr" or "$25/month"
  const match = priceStr.match(/\$?([\d.]+)/);
  if (!match) return 0;

  const value = parseFloat(match[1]);

  // Convert monthly to hourly (730 hours/month)
  if (priceStr.includes('/month') || priceStr.includes('/mo')) {
    return value / 730;
  }

  // Already hourly
  if (priceStr.includes('/hr') || priceStr.includes('/hour')) {
    return value;
  }

  // Per request/operation pricing (keep as-is)
  return value;
}

// Calculate monthly base cost
function calculateMonthlyCost(priceStr) {
  if (!priceStr || priceStr === '-' || priceStr === 'Free') return 0;

  const hourlyRate = parsePriceToHourly(priceStr);

  // If it's a very small number (per-request pricing), keep it small
  if (hourlyRate < 0.001) return hourlyRate;

  // Otherwise convert to monthly (730 hours)
  return hourlyRate * 730;
}

// Format specs string from Excel columns
function formatSpecs(row) {
  const parts = [];

  if (row.vCPU && row.vCPU !== '-') parts.push(`${row.vCPU} vCPU`);
  if (row.RAM && row.RAM !== '-') parts.push(row.RAM);
  if (row['GPU/VRAM'] && row['GPU/VRAM'] !== '-') parts.push(row['GPU/VRAM']);

  return parts.length > 0 ? parts.join(', ') : 'See documentation';
}

// Generate unique ID from provider and service name
function generateId(provider, serviceName) {
  return `${provider.toLowerCase()}-${serviceName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
}

// Transform Excel row to CloudService format
function transformToCloudService(row) {
  const category = categoryMapping[row.Category] || row.Category.toLowerCase();

  return {
    id: generateId(row.Provider, row['Service Name']),
    name: row['Service Name'],
    provider: row.Provider,
    category: category,
    baseCost: calculateMonthlyCost(row.Price),
    specs: formatSpecs(row),
    description: row.Summary || row.Overview || '',
    inputSpec: row['Common Use Cases'] || '',
    outputSpec: row['Documentation Link'] || ''
  };
}

async function uploadToFirebase() {
  try {
    console.log('📖 Reading Excel file...');
    const filePath = path.join(__dirname, '../data/cloud_resources.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log(`✅ Found ${data.length} cloud services`);

    // Group services by Provider -> Category
    const servicesByProvider = {};

    data.forEach((row, index) => {
      try {
        const service = transformToCloudService(row);

        if (!servicesByProvider[service.provider]) {
          servicesByProvider[service.provider] = {};
        }

        if (!servicesByProvider[service.provider][service.category]) {
          servicesByProvider[service.provider][service.category] = [];
        }

        servicesByProvider[service.provider][service.category].push(service);
      } catch (err) {
        console.error(`⚠️  Error transforming row ${index + 1}:`, err.message);
      }
    });

    console.log('\n📊 Services grouped by provider:');
    Object.keys(servicesByProvider).forEach(provider => {
      const categories = Object.keys(servicesByProvider[provider]);
      const totalServices = categories.reduce((sum, cat) => sum + servicesByProvider[provider][cat].length, 0);
      console.log(`   ${provider}: ${totalServices} services across ${categories.length} categories`);
    });

    // Upload to Firebase
    console.log('\n🔥 Uploading to Firebase...');

    const batch = db.batch();
    let uploadCount = 0;

    // Store the entire cloud services structure in a single document
    const cloudServicesRef = db.collection('cloudServices').doc('allServices');
    batch.set(cloudServicesRef, {
      data: servicesByProvider,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      version: '1.0',
      totalServices: data.length
    });
    uploadCount++;

    // Also store individual services for easier querying
    for (const [provider, categories] of Object.entries(servicesByProvider)) {
      for (const [category, services] of Object.entries(categories)) {
        for (const service of services) {
          const serviceRef = db.collection('services').doc(service.id);
          batch.set(serviceRef, {
            ...service,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
          uploadCount++;
        }
      }
    }

    await batch.commit();

    console.log(`✅ Successfully uploaded ${uploadCount} documents to Firebase!`);
    console.log('\n📋 Collections created:');
    console.log('   - cloudServices/allServices (structured data for frontend)');
    console.log('   - services/* (individual service documents for queries)');

    console.log('\n🎉 Firebase upload complete!');

    // Verify by reading back
    console.log('\n🔍 Verifying upload...');
    const snapshot = await db.collection('cloudServices').doc('allServices').get();
    if (snapshot.exists) {
      const data = snapshot.data();
      console.log(`✅ Verification successful! Document contains ${data.totalServices} services`);
    } else {
      console.log('⚠️  Warning: Could not verify upload');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the upload
console.log('🚀 Starting Firebase upload process...\n');
uploadToFirebase();
