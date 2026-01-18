const { db } = require('../config/firebase');
const { FieldValue } = require('firebase-admin/firestore');

class QuestProgress {
  static collectionName = 'questProgress';

  /**
   * Get user's quest progress
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Quest progress object or null if not found
   */
  static async getUserProgress(userId) {
    try {
      const docRef = db.collection(this.collectionName).doc(userId);
      const doc = await docRef.get();

      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error('Error fetching quest progress:', error);
      throw new Error('Failed to fetch quest progress');
    }
  }

  /**
   * Create initial quest progress for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Created quest progress object
   */
  static async createUserProgress(userId) {
    try {
      const initialProgress = {
        userId,
        completedChallenges: [],
        currentPosition: 0,
        lastUpdated: FieldValue.serverTimestamp(),
        challengeDetails: {},
        createdAt: FieldValue.serverTimestamp()
      };

      const docRef = db.collection(this.collectionName).doc(userId);
      await docRef.set(initialProgress);

      return {
        id: userId,
        ...initialProgress,
        lastUpdated: new Date(),
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error creating quest progress:', error);
      throw new Error('Failed to create quest progress');
    }
  }

  /**
   * Update user's quest progress when a challenge is completed
   * @param {string} userId - User ID
   * @param {string} challengeId - Challenge ID that was completed
   * @param {Object} details - Additional details (score, attempts, etc.)
   * @returns {Promise<Object>} Updated quest progress
   */
  static async updateProgress(userId, challengeId, details = {}) {
    try {
      const docRef = db.collection(this.collectionName).doc(userId);
      const doc = await docRef.get();

      let progress;
      if (!doc.exists) {
        // Create initial progress if doesn't exist
        progress = await this.createUserProgress(userId);
      } else {
        progress = { id: doc.id, ...doc.data() };
      }

      // Check if challenge is already completed
      if (progress.completedChallenges.includes(challengeId)) {
        // Already completed, just update details if needed
        await docRef.update({
          [`challengeDetails.${challengeId}`]: {
            completed: true,
            timestamp: FieldValue.serverTimestamp(),
            score: details.score || progress.challengeDetails[challengeId]?.score || 0,
            attempts: (progress.challengeDetails[challengeId]?.attempts || 0) + 1
          },
          lastUpdated: FieldValue.serverTimestamp()
        });
      } else {
        // New completion
        await docRef.update({
          completedChallenges: FieldValue.arrayUnion(challengeId),
          currentPosition: progress.completedChallenges.length + 1,
          [`challengeDetails.${challengeId}`]: {
            completed: true,
            timestamp: FieldValue.serverTimestamp(),
            score: details.score || 0,
            attempts: 1
          },
          lastUpdated: FieldValue.serverTimestamp()
        });
      }

      // Fetch and return updated progress
      const updatedDoc = await docRef.get();
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      console.error('Error updating quest progress:', error);
      throw new Error('Failed to update quest progress');
    }
  }

  /**
   * Reset user's quest progress
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Reset quest progress
   */
  static async resetProgress(userId) {
    try {
      const docRef = db.collection(this.collectionName).doc(userId);

      const resetProgress = {
        userId,
        completedChallenges: [],
        currentPosition: 0,
        challengeDetails: {},
        lastUpdated: FieldValue.serverTimestamp()
      };

      await docRef.set(resetProgress, { merge: true });

      return {
        id: userId,
        ...resetProgress,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error resetting quest progress:', error);
      throw new Error('Failed to reset quest progress');
    }
  }

  /**
   * Get quest progress for multiple users (for leaderboards, etc.)
   * @param {number} limit - Number of users to fetch
   * @returns {Promise<Array>} Array of quest progress objects
   */
  static async getTopProgress(limit = 10) {
    try {
      const snapshot = await db.collection(this.collectionName)
        .orderBy('currentPosition', 'desc')
        .orderBy('lastUpdated', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching top quest progress:', error);
      throw new Error('Failed to fetch top quest progress');
    }
  }

  /**
   * Check if a specific challenge is unlocked for a user
   * @param {string} userId - User ID
   * @param {number} challengePosition - Position of challenge in quest (0-indexed)
   * @returns {Promise<boolean>} True if unlocked, false otherwise
   */
  static async isChallengeUnlocked(userId, challengePosition) {
    try {
      const progress = await this.getUserProgress(userId);

      // First challenge (position 0) is always unlocked
      if (challengePosition === 0) {
        return true;
      }

      // Challenge is unlocked if previous challenges are completed
      if (!progress) {
        return false;
      }

      // Unlocked if we've completed enough challenges to reach this position
      return progress.currentPosition >= challengePosition;
    } catch (error) {
      console.error('Error checking if challenge is unlocked:', error);
      return false;
    }
  }
}

module.exports = QuestProgress;
