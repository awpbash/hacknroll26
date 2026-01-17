const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const ArchitectureEvaluator = require('../utils/evaluator');
const { authenticateToken } = require('../middleware/auth');

// Helper function to run Phase 3 evaluation asynchronously
async function runPhase3Async(submissionId, submissionData, challenge, apiKey, provider) {
  try {
    console.log(`\n🤖 [Async Phase 3] Starting for submission ${submissionId}`);

    // Create evaluator with LLM enabled for Phase 3
    const evaluator = new ArchitectureEvaluator(
      submissionData,
      challenge,
      true,  // useLLM - enable Phase 3
      { apiKey, provider }  // llmConfig
    );

    // Run full evaluation (Phase 1, 2, 3)
    const fullEvaluation = await evaluator.evaluate();
    console.log(`\n✅ [Async Phase 3] Complete for submission ${submissionId}`);
    console.log('📊 [Async Phase 3] Final score:', fullEvaluation.score);

    // Update submission with Phase 3 results
    await Submission.updateEvaluation(submissionId, {
      ...fullEvaluation,
      phase3Status: 'completed'
    });

    console.log(`✅ [Async Phase 3] Submission ${submissionId} updated with Phase 3 results`);
  } catch (error) {
    console.error(`❌ [Async Phase 3] Error for submission ${submissionId}:`, error.message);

    // Update submission to mark Phase 3 as failed
    try {
      const submission = await Submission.findById(submissionId);
      if (submission) {
        await Submission.updateEvaluation(submissionId, {
          ...submission.evaluation,
          phase3Status: 'failed',
          phase3Error: error.message
        });
      }
    } catch (updateError) {
      console.error('Failed to update submission with Phase 3 error:', updateError);
    }
  }
}

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

    // Create evaluator (Phase 3 will run async)
    console.log(`\n📊 Creating evaluator with LLM ${hasLLMKey ? '✅ ENABLED' : '⊗ DISABLED'}`);
    const evaluator = new ArchitectureEvaluator(
      submissionData,
      challenge,
      false,  // useLLM - disable Phase 3 for now (run async later)
      null  // llmConfig
    );

    console.log('🔄 Starting Phase 1 & 2 evaluation (fast)...\n');
    const initialEvaluation = await evaluator.evaluate();
    console.log('\n✅ Phase 1 & 2 complete!');
    console.log('📊 Initial Results:', {
      passed: initialEvaluation.passed,
      score: initialEvaluation.score,
      cost: initialEvaluation.cost,
      complexity: initialEvaluation.complexity
    });

    // Create submission record with initial evaluation
    console.log('💾 Creating submission record...');
    const submission = await Submission.create({
      userId: req.userId,
      challengeId,
      architecture,
      provider,
      evaluation: {
        ...initialEvaluation,
        phase3Status: hasLLMKey ? 'pending' : 'disabled'
      },
      status: initialEvaluation.status
    });
    console.log(`✅ Submission created with ID: ${submission.id}`);

    // Update challenge statistics
    console.log('📈 Updating challenge statistics...');
    await Challenge.incrementSubmissions(challengeId, initialEvaluation.passed);

    // Update user record if accepted (based on Phase 1 & 2)
    if (initialEvaluation.passed) {
      console.log('🎉 Submission passed Phase 1 & 2! Updating user record...');
      const user = await User.findById(req.userId);

      // Check if user already solved this challenge
      const existingSolution = user.solvedChallenges?.find(
        sc => sc.challengeId === challengeId
      );

      if (existingSolution) {
        // Update if new solution is better
        if (initialEvaluation.score > existingSolution.complexity) {
          // Find and update the existing solution in the array
          const updatedSolutions = user.solvedChallenges.map(sc => {
            if (sc.challengeId === challengeId) {
              return {
                challengeId,
                architectureData: architecture,
                cost: initialEvaluation.cost,
                complexity: initialEvaluation.complexity,
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
          cost: initialEvaluation.cost,
          complexity: initialEvaluation.complexity,
          score: initialEvaluation.score
        });
      }
    }

    // Start Phase 3 (LLM) evaluation in background if available
    if (hasLLMKey && initialEvaluation.passed) {
      console.log('🚀 Starting Phase 3 (LLM) evaluation in background...');

      // Run Phase 3 asynchronously (don't await)
      runPhase3Async(submission.id, submissionData, challenge, apiKey, llmProvider).catch(err => {
        console.error('❌ Phase 3 async evaluation failed:', err);
      });
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

// Get single submission by ID (for polling Phase 3 status)
router.get('/:submissionId', authenticateToken, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Verify user owns this submission
    if (submission.userId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({
      submission: {
        id: submission.id,
        status: submission.status,
        evaluation: submission.evaluation
      }
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ message: 'Server error' });
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
