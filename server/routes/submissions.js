const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const ArchitectureEvaluator = require('../utils/evaluator');
const { authenticateToken } = require('../middleware/auth');

// Submit solution
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║  NEW SUBMISSION RECEIVED                       ║');
    console.log('╚════════════════════════════════════════════════╝');

    const { challengeId, architecture, provider } = req.body;
    console.log(`📋 Challenge ID: ${challengeId}`);
    console.log(`📋 Provider: ${provider}`);
    console.log(`📋 Architecture nodes: ${architecture?.nodes?.length || 0}`);
    console.log(`📋 Architecture edges: ${architecture?.edges?.length || 0}`);

    // Validate input
    if (!challengeId || !architecture || !provider) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      console.log('❌ Challenge not found');
      return res.status(404).json({ message: 'Challenge not found' });
    }
    console.log(`✅ Challenge found: ${challenge.title}`);

    // Evaluate submission with Phase 3 (LLM) if API key is available
    const submissionData = { architecture, provider };

    // Check if LLM is available
    const hasLLMKey = !!(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY);
    const llmProvider = process.env.ANTHROPIC_API_KEY ? 'anthropic' : 'openai';
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;

    console.log(`\n🔍 LLM Configuration Check:`);
    console.log(`   - ANTHROPIC_API_KEY present: ${!!process.env.ANTHROPIC_API_KEY}`);
    console.log(`   - OPENAI_API_KEY present: ${!!process.env.OPENAI_API_KEY}`);
    console.log(`   - Selected provider: ${llmProvider}`);
    console.log(`   - Has LLM Key: ${hasLLMKey}`);

    // Create evaluator with LLM enabled (Phase 3) if API key exists
    console.log(`\n📊 Creating evaluator with LLM ${hasLLMKey ? '✅ ENABLED' : '⊗ DISABLED'}`);
    const evaluator = new ArchitectureEvaluator(
      submissionData,
      challenge,
      hasLLMKey,  // useLLM - enables Phase 3
      hasLLMKey ? { apiKey, provider: llmProvider } : null  // llmConfig
    );

    console.log('🔄 Starting evaluation...\n');
    const evaluation = await evaluator.evaluate();
    console.log('\n✅ Evaluation complete!');
    console.log('📊 Results:', {
      passed: evaluation.passed,
      score: evaluation.score,
      cost: evaluation.cost,
      complexity: evaluation.complexity,
      hasPhase3: !!evaluation.phases?.phase3
    });

    // Create submission record
    console.log('💾 Creating submission record...');
    const submission = await Submission.create({
      userId: req.userId,
      challengeId,
      architecture,
      provider,
      evaluation,
      status: evaluation.status
    });
    console.log(`✅ Submission created with ID: ${submission.id}`);

    // Update challenge statistics
    console.log('📈 Updating challenge statistics...');
    await Challenge.incrementSubmissions(challengeId, evaluation.passed);

    // Update user record if accepted
    if (evaluation.passed) {
      console.log('🎉 Submission passed! Updating user record...');
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

    console.log('📤 Sending response to client...\n');
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║  SUBMISSION PROCESSED SUCCESSFULLY             ║');
    console.log('╚════════════════════════════════════════════════╝\n');

    res.json({
      submission: {
        id: submission.id,
        status: submission.status,
        evaluation: submission.evaluation
      }
    });
  } catch (error) {
    console.error('\n❌❌❌ ERROR PROCESSING SUBMISSION ❌❌❌');
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
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
