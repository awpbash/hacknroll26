#!/usr/bin/env node
// Helper script to generate Firebase env vars for Vercel in different formats
// Usage: node scripts/generateVercelEnv.js

const path = require('path');
const fs = require('fs');

const keyPath = path.resolve(__dirname, '../serviceAccountKey.json');

try {
  if (!fs.existsSync(keyPath)) {
    console.error('❌ serviceAccountKey.json not found!');
    console.error('📍 Expected location:', keyPath);
    process.exit(1);
  }

  const serviceAccount = require(keyPath);

  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔑 Firebase Environment Variables for Vercel');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  // Method 1: Using literal \n (sometimes works)
  console.log('📋 METHOD 1: Standard Format (with \\n)');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('');
  console.log('FIREBASE_PROJECT_ID');
  console.log(serviceAccount.project_id);
  console.log('');
  console.log('FIREBASE_CLIENT_EMAIL');
  console.log(serviceAccount.client_email);
  console.log('');
  console.log('FIREBASE_PRIVATE_KEY');
  console.log('⚠️  Paste exactly as shown, keeping the \\n characters:');
  console.log('');
  console.log(JSON.stringify(serviceAccount.private_key));
  console.log('');
  console.log('JWT_SECRET');
  console.log('dfe182c82736a763771dd794253adf625b563bdd5b175d47ff36bea28ca4424a03a4f08404bea280143e6bf7e7bda17c1747c24d57e000f116412379a59f5443');
  console.log('');
  console.log('NODE_ENV');
  console.log('production');
  console.log('');

  // Method 2: Base64 encoded (most reliable for Vercel)
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📋 METHOD 2: Base64 Encoded (RECOMMENDED - Most Reliable!)');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('');
  console.log('Use this method if Method 1 fails. Set ONLY these variables:');
  console.log('');
  console.log('FIREBASE_PROJECT_ID');
  console.log(serviceAccount.project_id);
  console.log('');
  console.log('FIREBASE_CLIENT_EMAIL');
  console.log(serviceAccount.client_email);
  console.log('');
  console.log('FIREBASE_PRIVATE_KEY_BASE64');
  console.log('⚠️  Copy this entire string (no quotes needed):');
  console.log('');
  const base64Key = Buffer.from(serviceAccount.private_key).toString('base64');
  console.log(base64Key);
  console.log('');
  console.log('JWT_SECRET');
  console.log('dfe182c82736a763771dd794253adf625b563bdd5b175d47ff36bea28ca4424a03a4f08404bea280143e6bf7e7bda17c1747c24d57e000f116412379a59f5443');
  console.log('');
  console.log('NODE_ENV');
  console.log('production');
  console.log('');

  console.log('═══════════════════════════════════════════════════════════');
  console.log('📝 Instructions:');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('1. Go to Vercel Dashboard → Your Backend Project');
  console.log('2. Settings → Environment Variables');
  console.log('3. Try METHOD 1 first (standard format)');
  console.log('4. If deployment fails with "Invalid PEM", use METHOD 2');
  console.log('5. Click Save and redeploy');
  console.log('');
  console.log('Optional: Add these for AI evaluation (Phase 3)');
  console.log('  ANTHROPIC_API_KEY = sk-ant-xxxxx');
  console.log('  OR');
  console.log('  OPENAI_API_KEY = sk-xxxxx');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
