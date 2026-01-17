// Script to add Adobe AI Platform Challenge to Firestore
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

async function addAdobeChallenge() {
  try {
    console.log('🚀 Adding Adobe AI Platform Challenge to Firestore...\n');

    // Add the challenge to the challenges collection
    const challengeRef = await db.collection('challenges').add({
      ...adobeAIChallenge,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      submissionCount: 0,
      averageScore: 0
    });

    console.log('✅ Challenge added successfully!');
    console.log(`📝 Challenge ID: ${challengeRef.id}`);
    console.log(`📊 Title: ${adobeAIChallenge.title}`);
    console.log(`🎯 Difficulty: ${adobeAIChallenge.difficulty}`);
    console.log(`💰 Max Cost: $${adobeAIChallenge.constraints.maxCost.toLocaleString()}/month`);
    console.log(`🔧 Required Services: ${adobeAIChallenge.constraints.requiredServices.join(', ')}`);
    console.log(`✨ Solutions Included: ${adobeAIChallenge.solutions.length}`);
    console.log(`🎬 Video Solution: ${adobeAIChallenge.videoSolutionUrl}`);

    // Display solution summary
    if (adobeAIChallenge.solutions.length > 0) {
      console.log('\n📦 Solution Details:');
      adobeAIChallenge.solutions.forEach((sol, idx) => {
        console.log(`\n  Solution ${idx + 1}:`);
        console.log(`    Author: ${sol.author}`);
        console.log(`    Title: ${sol.title}`);
        console.log(`    Cost: $${sol.totalCost.toLocaleString()}/month`);
        console.log(`    Upvotes: ${sol.upvotes}`);
        console.log(`    Provider: ${sol.provider}`);
        console.log(`    Services: ${sol.architecture.nodes.length} nodes, ${sol.architecture.edges.length} connections`);
      });
    }

    console.log('\n✅ Adobe AI Platform Challenge is now live in the database!');
    console.log('🌐 Users can now attempt this challenge from the frontend.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding challenge:', error);
    process.exit(1);
  }
}

// Run the script
addAdobeChallenge();
