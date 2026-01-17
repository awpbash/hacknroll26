const { db, admin } = require('../config/firebase');

const usersCollection = db.collection('users');

class User {
  // Create a new user
  static async create(userData) {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const docRef = await usersCollection.add({
      username: userData.username,
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      solvedChallenges: [],
      totalScore: 0,
      rank: null,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }

  // Find user by ID
  static async findById(userId) {
    const doc = await usersCollection.doc(userId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  // Find user by email
  static async findByEmail(email) {
    const snapshot = await usersCollection
      .where('email', '==', email.toLowerCase().trim())
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  // Find user by username
  static async findByUsername(username) {
    const snapshot = await usersCollection
      .where('username', '==', username)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  // Find user by email or username
  static async findOne(query) {
    if (query.email) {
      return this.findByEmail(query.email);
    }
    if (query.username) {
      return this.findByUsername(query.username);
    }
    return null;
  }

  // Update user
  static async updateById(userId, updateData) {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    await usersCollection.doc(userId).update({
      ...updateData,
      updatedAt: timestamp
    });

    return this.findById(userId);
  }

  // Add solved challenge to user
  static async addSolvedChallenge(userId, challengeData) {
    const user = await this.findById(userId);
    if (!user) return null;

    const solvedChallenge = {
      challengeId: challengeData.challengeId,
      architectureData: challengeData.architectureData || null,
      cost: challengeData.cost || 0,
      complexity: challengeData.complexity || 0,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    await usersCollection.doc(userId).update({
      solvedChallenges: admin.firestore.FieldValue.arrayUnion(solvedChallenge),
      totalScore: admin.firestore.FieldValue.increment(challengeData.score || 0),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return this.findById(userId);
  }

  // Get all users (for leaderboard)
  static async find(query = {}) {
    let queryRef = usersCollection;

    // Apply filters if provided
    if (query.limit) {
      queryRef = queryRef.limit(query.limit);
    }

    const snapshot = await queryRef.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Get users sorted by score (leaderboard)
  static async getLeaderboard(limit = 100) {
    const snapshot = await usersCollection
      .orderBy('totalScore', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc, index) => ({
      id: doc.id,
      ...doc.data(),
      rank: index + 1
    }));
  }

  // Delete user
  static async deleteById(userId) {
    await usersCollection.doc(userId).delete();
    return { success: true };
  }

  // Count users
  static async count() {
    const snapshot = await usersCollection.count().get();
    return snapshot.data().count;
  }
}

module.exports = User;
