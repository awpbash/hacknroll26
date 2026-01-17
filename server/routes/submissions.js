const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const ArchitectureEvaluator = require('../utils/evaluator');
const LLMEvaluator = require('../utils/llmEvaluator');
const { authenticateToken } = require('../middleware/auth');

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
    const submission = await Submission.create({
      userId: req.userId,
      challengeId,
      architecture,
      provider,
      evaluation,
      status: evaluation.status
    });

    // Update challenge statistics
    await Challenge.incrementSubmissions(challengeId, evaluation.passed);

    // Update user record if accepted
    if (evaluation.passed) {
      const user = await User.findById(req.userId);

      // Check if user already solved this challenge
      const existingSolution = user.solvedChallenges?.find(
        sc => sc.challengeId === challengeId
      );

      if (existingSolution) {
        // Update if new solution is better
        if (evaluation.score > existingSolution.complexity) {
          // Find and update the existing solution in the array
          const updatedSolutions = user.solvedChallenges.map(sc => {
            if (sc.challengeId === challengeId) {
              return {
                challengeId,
                architectureData: architecture,
                cost: evaluation.cost,
                complexity: evaluation.complexity,
                timestamp: new Date()
              };
            }
            return sc;
          });

          // Recalculate total score
          const totalScore = updatedSolutions.reduce((sum, sc) => sum + (sc.complexity || 0), 0);

          await User.updateById(req.userId, {
            solvedChallenges: updatedSolutions,
            totalScore
          });
        }
      } else {
        // Add new solution
        await User.addSolvedChallenge(req.userId, {
          challengeId,
          architectureData: architecture,
          cost: evaluation.cost,
          complexity: evaluation.complexity,
          score: evaluation.score
        });
      }
    }

    res.json({
      submission: {
        id: submission.id,
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
    const submissions = await Submission.getUserChallengeSubmissions(
      req.userId,
      req.params.challengeId
    );

    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's all submissions
router.get('/my-submissions', authenticateToken, async (req, res) => {
  try {
    const submissions = await Submission.getUserSubmissions(req.userId, 50);

    // Manually populate challenge data
    const populatedSubmissions = await Promise.all(
      submissions.map(async (submission) => {
        const challenge = await Challenge.findById(submission.challengeId);
        return {
          ...submission,
          challenge: challenge ? {
            id: challenge.id,
            title: challenge.title,
            difficulty: challenge.difficulty,
            category: challenge.category
          } : null
        };
      })
    );

    res.json(populatedSubmissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
