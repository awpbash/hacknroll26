const { db, admin } = require('../config/firebase');

const challengesCollection = db.collection('challenges');

class Challenge {
  // Create a new challenge
  static async create(challengeData) {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const docRef = await challengesCollection.add({
      title: challengeData.title,
      difficulty: challengeData.difficulty,
      description: challengeData.description,
      requirements: challengeData.requirements || [],
      constraints: challengeData.constraints || {
        maxCost: null,
        requiredServices: [],
        optionalServices: [],
        minServices: 1,
        maxServices: 20
      },
      category: challengeData.category,
      testCases: challengeData.testCases || [],
      optimalSolution: challengeData.optimalSolution || {
        architecture: null,
        cost: 0,
        complexity: 0,
        explanation: ''
      },
      acceptanceRate: 0,
      submissions: 0,
      accepted: 0,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }

  // Find challenge by ID
  static async findById(challengeId) {
    const doc = await challengesCollection.doc(challengeId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  // Find all challenges with optional filters
  static async find(query = {}) {
    let queryRef = challengesCollection;

    // Apply filters
    if (query.difficulty) {
      queryRef = queryRef.where('difficulty', '==', query.difficulty);
    }
    if (query.category) {
      queryRef = queryRef.where('category', '==', query.category);
    }

    const snapshot = await queryRef.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Find one challenge with query
  static async findOne(query) {
    let queryRef = challengesCollection;

    if (query.title) {
      queryRef = queryRef.where('title', '==', query.title);
    }

    const snapshot = await queryRef.limit(1).get();
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  // Update challenge
  static async updateById(challengeId, updateData) {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    await challengesCollection.doc(challengeId).update({
      ...updateData,
      updatedAt: timestamp
    });

    return this.findById(challengeId);
  }

  // Increment submission count
  static async incrementSubmissions(challengeId, accepted = false) {
    const updateData = {
      submissions: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (accepted) {
      updateData.accepted = admin.firestore.FieldValue.increment(1);
    }

    await challengesCollection.doc(challengeId).update(updateData);

    // Update acceptance rate
    const challenge = await this.findById(challengeId);
    if (challenge && challenge.submissions > 0) {
      const acceptanceRate = (challenge.accepted / challenge.submissions) * 100;
      await challengesCollection.doc(challengeId).update({
        acceptanceRate: parseFloat(acceptanceRate.toFixed(2))
      });
    }

    return this.findById(challengeId);
  }

  // Get challenges by difficulty
  static async getByDifficulty(difficulty) {
    const snapshot = await challengesCollection
      .where('difficulty', '==', difficulty)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Get challenges by category
  static async getByCategory(category) {
    const snapshot = await challengesCollection
      .where('category', '==', category)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Delete challenge
  static async deleteById(challengeId) {
    await challengesCollection.doc(challengeId).delete();
    return { success: true };
  }

  // Count challenges
  static async count(query = {}) {
    let queryRef = challengesCollection;

    if (query.difficulty) {
      queryRef = queryRef.where('difficulty', '==', query.difficulty);
    }
    if (query.category) {
      queryRef = queryRef.where('category', '==', query.category);
    }

    const snapshot = await queryRef.count().get();
    return snapshot.data().count;
  }

  // Get all challenges sorted by creation date
  static async getAllSorted(sortBy = 'createdAt', order = 'desc', limit = 100) {
    const snapshot = await challengesCollection
      .orderBy(sortBy, order)
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

module.exports = Challenge;
