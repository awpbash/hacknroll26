#!/usr/bin/env node
// Helper script to extract Firebase credentials for Vercel deployment
// Usage: node scripts/getFirebaseEnvVars.js

const path = require('path');
const fs = require('fs');

const keyPath = path.resolve(__dirname, '../serviceAccountKey.json');

try {
  if (!fs.existsSync(keyPath)) {
    console.error('❌ serviceAccountKey.json not found!');
    console.error('📍 Expected location:', keyPath);
    console.error('\n💡 Get your service account key from:');
    console.error('   https://console.firebase.google.com/');
    console.error('   Project Settings → Service Accounts → Generate New Private Key\n');
    process.exit(1);
  }

  const serviceAccount = require(keyPath);

  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔑 Firebase Environment Variables for Vercel');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('Copy these to Vercel Dashboard → Settings → Environment Variables:');
  console.log('');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('');
  console.log('FIREBASE_PROJECT_ID');
  console.log(serviceAccount.project_id);
  console.log('');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('');
  console.log('FIREBASE_CLIENT_EMAIL');
  console.log(serviceAccount.client_email);
  console.log('');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('');
  console.log('FIREBASE_PRIVATE_KEY');
  console.log('⚠️  IMPORTANT: Copy the ENTIRE key including the BEGIN/END lines');
  console.log('⚠️  Keep the \\n characters - do NOT replace with actual newlines');
  console.log('');
  console.log(serviceAccount.private_key);
  console.log('');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('');
  console.log('✅ All values extracted successfully!');
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Go to Vercel Dashboard → Your Backend Project');
  console.log('2. Settings → Environment Variables');
  console.log('3. Add each variable above (Production environment)');
  console.log('4. Redeploy: vercel --prod');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

} catch (error) {
  console.error('❌ Error reading serviceAccountKey.json:', error.message);
  process.exit(1);
}
