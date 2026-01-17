const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Submission = require('../models/Submission');

// Get global leaderboard
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;

    const leaderboard = await User.getLeaderboard(limit);

    // Format response
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      totalScore: user.totalScore || 0,
      solvedCount: user.solvedChallenges?.length || 0
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard for specific challenge
router.get('/challenge/:challengeId', async (req, res) => {
  try {
    const { challengeId } = req.params;

    // Get all accepted submissions for this challenge
    const submissions = await Submission.find({
      challengeId,
      status: 'Accepted'
    });

    // Manually populate user data
    const populatedSubmissions = await Promise.all(
      submissions.map(async (sub) => {
        const user = await User.findById(sub.userId);
        return {
          ...sub,
          user: user ? { id: user.id, username: user.username } : null
        };
      })
    );

    // Group by user and keep best submission
    const userBestSubmissions = {};
    populatedSubmissions.forEach(sub => {
      if (!sub.user) return;

      const userId = sub.userId;
      if (!userBestSubmissions[userId] ||
          sub.evaluation.score > userBestSubmissions[userId].evaluation.score ||
          (sub.evaluation.score === userBestSubmissions[userId].evaluation.score &&
           sub.evaluation.cost < userBestSubmissions[userId].evaluation.cost)) {
        userBestSubmissions[userId] = sub;
      }
    });

    // Convert to array and sort
    const leaderboard = Object.values(userBestSubmissions)
      .sort((a, b) => {
        if (b.evaluation.score !== a.evaluation.score) {
          return b.evaluation.score - a.evaluation.score;
        }
        return a.evaluation.cost - b.evaluation.cost;
      })
      .map((sub, index) => ({
        rank: index + 1,
        username: sub.user.username,
        score: sub.evaluation.score,
        cost: sub.evaluation.cost,
        complexity: sub.evaluation.complexity,
        timestamp: sub.createdAt
      }));

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get cost leaderboard (most cost-efficient solutions)
router.get('/cost-efficient', async (req, res) => {
  try {
    const submissions = await Submission.find({
      status: 'Accepted',
      limit: 50
    });

    // Sort by cost (ascending)
    const sortedSubmissions = submissions.sort((a, b) =>
      a.evaluation.cost - b.evaluation.cost
    );

    // Manually populate user and challenge data
    const leaderboard = await Promise.all(
      sortedSubmissions.map(async (sub, index) => {
        const user = await User.findById(sub.userId);
        const challenge = await Challenge.findById(sub.challengeId);

        return {
          rank: index + 1,
          username: user?.username || 'Unknown',
          challenge: challenge?.title || 'Unknown',
          cost: sub.evaluation.cost,
          score: sub.evaluation.score,
          timestamp: sub.createdAt
        };
      })
    );

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
