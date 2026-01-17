const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Initialize Firebase Admin
let serviceAccount;

// Try to load from file first, otherwise use environment variables
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    try {
      // Resolve the path relative to the server directory (parent of config/)
      const keyPath = path.resolve(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

      // Check if file exists
      if (!fs.existsSync(keyPath)) {
        throw new Error(`File not found at: ${keyPath}`);
      }

      serviceAccount = require(keyPath);
    } catch (fileError) {
      console.error('\n❌ Firebase Service Account Key not found!');
      console.error('📝 Please follow these steps:\n');
      console.error('1. Go to Firebase Console: https://console.firebase.google.com/');
      console.error('2. Select your project (or create a new one)');
      console.error('3. Click the gear icon → Project Settings → Service Accounts');
      console.error('4. Click "Generate New Private Key"');
      console.error('5. Save the file as "serviceAccountKey.json" in the server/ folder\n');
      console.error(`Looking for: ${process.env.FIREBASE_SERVICE_ACCOUNT_PATH}\n`);
      throw fileError;
    }
  } else if (process.env.FIREBASE_PROJECT_ID) {
    // Use environment variables
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // Handle different private key formats
    if (privateKey) {
      // If base64 encoded, decode it
      if (process.env.FIREBASE_PRIVATE_KEY_BASE64) {
        privateKey = Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, 'base64').toString('utf-8');
      }
      // Replace literal \n with actual newlines
      else if (privateKey.includes('\\n')) {
        privateKey = privateKey.replace(/\\n/g, '\n');
      }
      // If it doesn't have proper newlines, try to fix common issues
      else if (!privateKey.includes('\n') && privateKey.includes('BEGIN PRIVATE KEY')) {
        // Key might be on one line, try to split it properly
        privateKey = privateKey
          .replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
          .replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----');
      }
    }

    serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: privateKey,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
    };
  } else {
    console.error('\n❌ No Firebase configuration found!');
    console.error('Please set either FIREBASE_SERVICE_ACCOUNT_PATH or Firebase environment variables in .env\n');
    throw new Error('Missing Firebase configuration');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error.message);
  process.exit(1);
}

const db = admin.firestore();

// Firestore settings
db.settings({
  ignoreUndefinedProperties: true
});

module.exports = { admin, db };
