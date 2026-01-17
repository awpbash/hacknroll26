const express = require('express');
const router = express.Router();
const QuestProgress = require('../models/QuestProgress');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route   GET /api/quest/progress
 * @desc    Get user's quest progress
 * @access  Private (requires authentication)
 */
router.get('/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    let progress = await QuestProgress.getUserProgress(userId);

    // Create initial progress if user hasn't started quest mode yet
    if (!progress) {
      progress = await QuestProgress.createUserProgress(userId);
    }

    res.json({
      success: true,
      progress: {
        completedChallenges: progress.completedChallenges || [],
        currentPosition: progress.currentPosition || 0,
        totalChallenges: 11, // Total number of quest challenges
        challengeDetails: progress.challengeDetails || {},
        lastUpdated: progress.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error fetching quest progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quest progress',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/quest/progress
 * @desc    Update user's quest progress (mark challenge as completed)
 * @access  Private (requires authentication)
 */
router.post('/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { challengeId, score, attempts } = req.body;

    // Validate input
    if (!challengeId) {
      return res.status(400).json({
        success: false,
        message: 'Challenge ID is required'
      });
    }

    // Update progress
    const updatedProgress = await QuestProgress.updateProgress(userId, challengeId, {
      score: score || 0,
      attempts: attempts || 1
    });

    res.json({
      success: true,
      message: 'Quest progress updated successfully',
      progress: {
        completedChallenges: updatedProgress.completedChallenges || [],
        currentPosition: updatedProgress.currentPosition || 0,
        totalChallenges: 11,
        challengeDetails: updatedProgress.challengeDetails || {},
        lastUpdated: updatedProgress.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error updating quest progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update quest progress',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/quest/reset
 * @desc    Reset user's quest progress
 * @access  Private (requires authentication)
 */
router.post('/reset', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    const resetProgress = await QuestProgress.resetProgress(userId);

    res.json({
      success: true,
      message: 'Quest progress reset successfully',
      progress: {
        completedChallenges: resetProgress.completedChallenges || [],
        currentPosition: resetProgress.currentPosition || 0,
        totalChallenges: 11,
        challengeDetails: resetProgress.challengeDetails || {},
        lastUpdated: resetProgress.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error resetting quest progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset quest progress',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/quest/leaderboard
 * @desc    Get top users by quest progress (optional feature)
 * @access  Public
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topProgress = await QuestProgress.getTopProgress(limit);

    res.json({
      success: true,
      leaderboard: topProgress.map(progress => ({
        userId: progress.userId,
        currentPosition: progress.currentPosition,
        completedChallenges: progress.completedChallenges.length,
        lastUpdated: progress.lastUpdated
      }))
    });
  } catch (error) {
    console.error('Error fetching quest leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quest leaderboard',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/quest/unlock-status/:challengeId
 * @desc    Check if a specific challenge is unlocked for the user
 * @access  Private (requires authentication)
 */
router.get('/unlock-status/:challengePosition', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const challengePosition = parseInt(req.params.challengePosition);

    if (isNaN(challengePosition) || challengePosition < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid challenge position'
      });
    }

    const isUnlocked = await QuestProgress.isChallengeUnlocked(userId, challengePosition);

    res.json({
      success: true,
      unlocked: isUnlocked,
      challengePosition
    });
  } catch (error) {
    console.error('Error checking unlock status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check unlock status',
      error: error.message
    });
  }
});

module.exports = router;
