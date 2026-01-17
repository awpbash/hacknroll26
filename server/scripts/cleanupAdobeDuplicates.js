const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function cleanup() {
  try {
    console.log('🔍 Finding Adobe challenge duplicates...\n');

    const snapshot = await db.collection('challenges')
      .where('title', '==', 'Adobe AI Platform Architecture')
      .get();

    console.log(`Found ${snapshot.size} Adobe challenge(s)`);

    if (snapshot.size > 1) {
      // Keep the most recent one, delete the rest
      const docs = snapshot.docs.sort((a, b) => {
        const aTime = a.data().updatedAt?._seconds || a.data().createdAt?._seconds || 0;
        const bTime = b.data().updatedAt?._seconds || b.data().createdAt?._seconds || 0;
        return bTime - aTime;
      });

      console.log(`\n✅ Keeping most recent: ${docs[0].id}`);
      console.log(`❌ Deleting ${docs.length - 1} duplicate(s):\n`);

      for (let i = 1; i < docs.length; i++) {
        console.log(`   Deleting: ${docs[i].id}`);
        await docs[i].ref.delete();
      }

      console.log(`\n✅ Cleanup complete! Only 1 Adobe challenge remains.`);
    } else {
      console.log('✅ No duplicates found.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanup();
