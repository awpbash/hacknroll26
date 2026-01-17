const { db, admin } = require('../config/firebase');

const submissionsCollection = db.collection('submissions');

class Submission {
  // Create a new submission
  static async create(submissionData) {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const docRef = await submissionsCollection.add({
      userId: submissionData.userId,
      challengeId: submissionData.challengeId,
      architecture: submissionData.architecture || {
        nodes: [],
        edges: []
      },
      provider: submissionData.provider,
      evaluation: submissionData.evaluation || {
        passed: false,
        cost: 0,
        complexity: 0,
        score: 0,
        feedback: [],
        errors: []
      },
      status: submissionData.status,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }

  // Find submission by ID
  static async findById(submissionId) {
    const doc = await submissionsCollection.doc(submissionId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  // Find submissions with query
  static async find(query = {}) {
    let queryRef = submissionsCollection;

    // Apply filters
    if (query.userId) {
      queryRef = queryRef.where('userId', '==', query.userId);
    }
    if (query.challengeId) {
      queryRef = queryRef.where('challengeId', '==', query.challengeId);
    }
    if (query.status) {
      queryRef = queryRef.where('status', '==', query.status);
    }
    if (query.provider) {
      queryRef = queryRef.where('provider', '==', query.provider);
    }

    // Sorting
    if (query.sort) {
      const sortField = query.sort.startsWith('-') ? query.sort.substring(1) : query.sort;
      const sortOrder = query.sort.startsWith('-') ? 'desc' : 'asc';
      queryRef = queryRef.orderBy(sortField, sortOrder);
    } else {
      queryRef = queryRef.orderBy('createdAt', 'desc');
    }

    // Limit
    if (query.limit) {
      queryRef = queryRef.limit(query.limit);
    }

    const snapshot = await queryRef.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Get user submissions
  static async getUserSubmissions(userId, limit = 50) {
    const snapshot = await submissionsCollection
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Get challenge submissions
  static async getChallengeSubmissions(challengeId, limit = 50) {
    const snapshot = await submissionsCollection
      .where('challengeId', '==', challengeId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Get user submissions for a specific challenge
  static async getUserChallengeSubmissions(userId, challengeId) {
    const snapshot = await submissionsCollection
      .where('userId', '==', userId)
      .where('challengeId', '==', challengeId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Update submission
  static async updateById(submissionId, updateData) {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    await submissionsCollection.doc(submissionId).update({
      ...updateData,
      updatedAt: timestamp
    });

    return this.findById(submissionId);
  }

  // Update evaluation
  static async updateEvaluation(submissionId, evaluation) {
    await submissionsCollection.doc(submissionId).update({
      evaluation: evaluation,
      status: evaluation.passed ? 'Accepted' : evaluation.status || 'Wrong Architecture',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return this.findById(submissionId);
  }

  // Delete submission
  static async deleteById(submissionId) {
    await submissionsCollection.doc(submissionId).delete();
    return { success: true };
  }

  // Count submissions
  static async count(query = {}) {
    let queryRef = submissionsCollection;

    if (query.userId) {
      queryRef = queryRef.where('userId', '==', query.userId);
    }
    if (query.challengeId) {
      queryRef = queryRef.where('challengeId', '==', query.challengeId);
    }
    if (query.status) {
      queryRef = queryRef.where('status', '==', query.status);
    }

    const snapshot = await queryRef.count().get();
    return snapshot.data().count;
  }

  // Get accepted submissions count for a user
  static async getAcceptedCount(userId) {
    const snapshot = await submissionsCollection
      .where('userId', '==', userId)
      .where('status', '==', 'Accepted')
      .count()
      .get();

    return snapshot.data().count;
  }

  // Get recent submissions
  static async getRecent(limit = 10) {
    const snapshot = await submissionsCollection
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Populate user and challenge data
  static async populate(submission, fields = ['userId', 'challengeId']) {
    const populated = { ...submission };

    if (fields.includes('userId') && submission.userId) {
      const User = require('./User');
      const user = await User.findById(submission.userId);
      populated.user = user;
    }

    if (fields.includes('challengeId') && submission.challengeId) {
      const Challenge = require('./Challenge');
      const challenge = await Challenge.findById(submission.challengeId);
      populated.challenge = challenge;
    }

    return populated;
  }
}

module.exports = Submission;
