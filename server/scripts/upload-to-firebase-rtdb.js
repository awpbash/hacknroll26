const XLSX = require('xlsx');
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json'));

// Initialize with Realtime Database URL
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
});

const db = admin.database();

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

  const match = priceStr.match(/\$?([\d.]+)/);
  if (!match) return 0;

  const value = parseFloat(match[1]);

  if (priceStr.includes('/month') || priceStr.includes('/mo')) {
    return value / 730;
  }

  if (priceStr.includes('/hr') || priceStr.includes('/hour')) {
    return value;
  }

  return value;
}

// Calculate monthly base cost
function calculateMonthlyCost(priceStr) {
  if (!priceStr || priceStr === '-' || priceStr === 'Free') return 0;

  const hourlyRate = parsePriceToHourly(priceStr);

  if (hourlyRate < 0.001) return hourlyRate;

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

    // Upload to Firebase Realtime Database
    console.log('\n🔥 Uploading to Firebase Realtime Database...');

    // Store the entire structure
    await db.ref('cloudServices').set({
      data: servicesByProvider,
      lastUpdated: admin.database.ServerValue.TIMESTAMP,
      version: '1.0',
      totalServices: data.length
    });

    console.log(`✅ Successfully uploaded to Firebase Realtime Database!`);
    console.log('\n📋 Database structure:');
    console.log('   - /cloudServices/data - Structured data for frontend');
    console.log('   - /cloudServices/lastUpdated - Timestamp');
    console.log('   - /cloudServices/totalServices - Count');

    console.log('\n🎉 Firebase upload complete!');

    // Verify by reading back
    console.log('\n🔍 Verifying upload...');
    const snapshot = await db.ref('cloudServices/totalServices').once('value');
    const count = snapshot.val();
    console.log(`✅ Verification successful! Database contains ${count} services`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);

    if (error.message.includes('Cannot parse Firebase url')) {
      console.error('\n⚠️  Firebase Realtime Database URL not reachable.');
      console.error('Please enable Realtime Database in Firebase Console:');
      console.error('1. Go to https://console.firebase.google.com/');
      console.error(`2. Select project: ${serviceAccount.project_id}`);
      console.error('3. Click Build → Realtime Database');
      console.error('4. Click "Create Database" and choose a location\n');
    }

    process.exit(1);
  }
}

// Run the upload
console.log('🚀 Starting Firebase Realtime Database upload...\n');
uploadToFirebase();
