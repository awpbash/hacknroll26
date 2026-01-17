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

    const challenges = await Challenge.find(query);

    // Remove sensitive fields
    const sanitizedChallenges = challenges.map(challenge => {
      const { optimalSolution, testCases, ...rest } = challenge;
      return rest;
    });

    res.json(sanitizedChallenges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single challenge
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Don't send the optimal solution to client
    const { optimalSolution, ...sanitizedChallenge } = challenge;

    res.json(sanitizedChallenge);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Initialize sample challenges (for development)
router.post('/initialize', async (req, res) => {
  try {
    // Get all existing challenges
    const existingChallenges = await Challenge.find({});

    // Delete existing challenges (Firebase doesn't have deleteMany)
    const { db } = require('../config/firebase');
    const batch = db.batch();
    existingChallenges.forEach(challenge => {
      const docRef = db.collection('challenges').doc(challenge.id);
      batch.delete(docRef);
    });
    await batch.commit();

    // Insert sample challenges
    const challenges = [];
    for (const challengeData of sampleChallenges) {
      const challenge = await Challenge.create(challengeData);
      challenges.push(challenge);
    }

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
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Only return stats fields
    res.json({
      submissions: challenge.submissions,
      accepted: challenge.accepted,
      acceptanceRate: challenge.acceptanceRate,
      difficulty: challenge.difficulty
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
