const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Submission = require('../models/Submission');

// Get global leaderboard
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;

    const leaderboard = await User.find()
      .select('username totalScore solvedChallenges')
      .sort({ totalScore: -1 })
      .limit(limit);

    // Add rank
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      totalScore: user.totalScore,
      solvedCount: user.solvedChallenges.length
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
    })
      .populate('userId', 'username')
      .sort({ 'evaluation.score': -1, 'evaluation.cost': 1 });

    // Group by user and keep best submission
    const userBestSubmissions = {};
    submissions.forEach(sub => {
      const userId = sub.userId._id.toString();
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
        username: sub.userId.username,
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
      status: 'Accepted'
    })
      .populate('userId', 'username')
      .populate('challengeId', 'title')
      .sort({ 'evaluation.cost': 1 })
      .limit(50);

    const leaderboard = submissions.map((sub, index) => ({
      rank: index + 1,
      username: sub.userId.username,
      challenge: sub.challengeId.title,
      cost: sub.evaluation.cost,
      score: sub.evaluation.score,
      timestamp: sub.createdAt
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
