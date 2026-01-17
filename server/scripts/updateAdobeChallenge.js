// Script to update Adobe AI Platform Challenge in Firestore
const admin = require('firebase-admin');
const adobeAIChallenge = require('../data/adobeAIChallenge');

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function updateAdobeChallenge() {
  try {
    console.log('🔄 Updating Adobe AI Platform Challenge in Firestore...\n');

    // Find the Adobe challenge by title
    const snapshot = await db.collection('challenges')
      .where('title', '==', 'Adobe AI Platform Architecture')
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.log('❌ Adobe challenge not found in database');
      console.log('💡 Run addAdobeChallenge.js first to create the challenge');
      process.exit(1);
    }

    const challengeDoc = snapshot.docs[0];
    console.log(`📝 Found challenge with ID: ${challengeDoc.id}`);

    // Update the challenge
    await challengeDoc.ref.update({
      description: adobeAIChallenge.description, // Plain text without HTML
      requirements: adobeAIChallenge.requirements, // Array format
      companyLogo: adobeAIChallenge.companyLogo, // Adobe logo
      companyName: adobeAIChallenge.companyName, // Adobe
      solutions: adobeAIChallenge.solutions, // Solutions with video URL
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Challenge updated successfully!');
    console.log(`📊 Description: Plain text (no HTML tags)`);
    console.log(`🏢 Company: ${adobeAIChallenge.companyName}`);
    console.log(`🎨 Logo: ${adobeAIChallenge.companyLogo}`);
    console.log(`📋 Requirements updated: ${adobeAIChallenge.requirements.length} items`);
    console.log('\nUpdated Requirements:');
    adobeAIChallenge.requirements.forEach((req, idx) => {
      console.log(`  ${idx + 1}. ${req}`);
    });

    console.log('\n✅ Adobe AI Platform Challenge is now compatible with the frontend!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating challenge:', error);
    process.exit(1);
  }
}

// Run the script
updateAdobeChallenge();
