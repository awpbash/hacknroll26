const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const sampleChallenges = require('../data/sampleChallenges');

// Get all challenges
router.get('/', async (req, res) => {
  try {
    const { difficulty, category } = req.query;
    let query = {};

    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;

    const challenges = await Challenge.find(query)
      .select('-optimalSolution.architecture -testCases')
      .sort({ difficulty: 1, title: 1 });

    res.json(challenges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single challenge
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .select('-optimalSolution'); // Don't send the optimal solution to client

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json(challenge);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Initialize sample challenges (for development)
router.post('/initialize', async (req, res) => {
  try {
    // Clear existing challenges
    await Challenge.deleteMany({});

    // Insert sample challenges
    const challenges = await Challenge.insertMany(sampleChallenges);

    res.json({
      message: 'Sample challenges initialized',
      count: challenges.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get challenge statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .select('submissions accepted acceptanceRate difficulty');

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json(challenge);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
