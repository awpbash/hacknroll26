const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Submission = require('../models/Submission');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const ArchitectureEvaluator = require('../utils/evaluator');
const LLMEvaluator = require('../utils/llmEvaluator');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No authentication token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Submit solution
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { challengeId, architecture, provider } = req.body;

    // Validate input
    if (!challengeId || !architecture || !provider) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Evaluate submission
    const submissionData = { architecture, provider };
    const evaluator = new ArchitectureEvaluator(submissionData, challenge);
    const evaluation = await evaluator.evaluate();

    // Optional: Use LLM for additional evaluation
    let llmEvaluation = null;
    if (process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY) {
      const llmProvider = process.env.ANTHROPIC_API_KEY ? 'anthropic' : 'openai';
      const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
      const llmEvaluator = new LLMEvaluator(apiKey, llmProvider);

      llmEvaluation = await llmEvaluator.evaluateArchitecture(
        { ...architecture, provider },
        challenge
      );

      // Combine scores if LLM evaluation succeeded
      if (llmEvaluation.usedLLM) {
        // Weighted average: 60% rule-based, 40% LLM
        evaluation.score = Math.round(evaluation.score * 0.6 + llmEvaluation.overallScore * 0.4);
        evaluation.llmFeedback = llmEvaluation.llmFeedback;
      }
    }

    // Create submission record
    const submission = new Submission({
      userId: req.userId,
      challengeId,
      architecture,
      provider,
      evaluation,
      status: evaluation.status
    });

    await submission.save();

    // Update challenge statistics
    challenge.submissions += 1;
    if (evaluation.passed) {
      challenge.accepted += 1;
    }
    challenge.acceptanceRate = (challenge.accepted / challenge.submissions) * 100;
    await challenge.save();

    // Update user record if accepted
    if (evaluation.passed) {
      const user = await User.findById(req.userId);

      // Check if user already solved this challenge
      const existingSolution = user.solvedChallenges.find(
        sc => sc.challengeId.toString() === challengeId
      );

      if (existingSolution) {
        // Update if new solution is better
        if (evaluation.score > existingSolution.complexity) {
          existingSolution.architectureData = architecture;
          existingSolution.cost = evaluation.cost;
          existingSolution.complexity = evaluation.complexity;
          existingSolution.timestamp = new Date();

          // Update total score
          user.totalScore = user.solvedChallenges.reduce((sum, sc) => sum + (sc.complexity || 0), 0);
        }
      } else {
        // Add new solution
        user.solvedChallenges.push({
          challengeId,
          architectureData: architecture,
          cost: evaluation.cost,
          complexity: evaluation.complexity
        });
        user.totalScore += evaluation.score;
      }

      await user.save();
    }

    res.json({
      submission: {
        id: submission._id,
        status: submission.status,
        evaluation: submission.evaluation
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's submissions for a challenge
router.get('/challenge/:challengeId', authenticateToken, async (req, res) => {
  try {
    const submissions = await Submission.find({
      userId: req.userId,
      challengeId: req.params.challengeId
    }).sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's all submissions
router.get('/my-submissions', authenticateToken, async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.userId })
      .populate('challengeId', 'title difficulty category')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
