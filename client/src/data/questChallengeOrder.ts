/**
 * Curated Quest Mode challenge order
 * Progresses from Easy → Medium → Hard for optimal learning experience
 */

export interface QuestChallenge {
  position: number; // 1-indexed position in quest
  challengeTitle: string; // Challenge title for matching
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string; // Short description for UI
}

/**
 * Curated order of challenges for Quest Mode
 * Designed to provide a smooth learning curve from basics to advanced
 */
export const QUEST_CHALLENGE_ORDER: QuestChallenge[] = [
  {
    position: 1,
    challengeTitle: 'Simple Static Website Hosting',
    difficulty: 'Easy',
    description: 'Learn the basics with a simple static website'
  },
  {
    position: 2,
    challengeTitle: 'Add Caching to Slow API',
    difficulty: 'Easy',
    description: 'Speed up an existing API with caching'
  },
  {
    position: 3,
    challengeTitle: 'Serverless REST API',
    difficulty: 'Medium',
    description: 'Build a scalable serverless API'
  },
  {
    position: 4,
    challengeTitle: 'High-Traffic Web Application',
    difficulty: 'Medium',
    description: 'Handle 10,000 requests per minute'
  },
  {
    position: 5,
    challengeTitle: 'AI Chatbot Deployment',
    difficulty: 'Medium',
    description: 'Deploy an AI-powered chatbot service'
  },
  {
    position: 6,
    challengeTitle: 'Add Search to Existing E-commerce',
    difficulty: 'Medium',
    description: 'Add full-text search to an e-commerce platform'
  },
  {
    position: 7,
    challengeTitle: 'Add AI Image Recognition to Photo App',
    difficulty: 'Medium',
    description: 'Add AI capabilities to detect objects in photos'
  },
  {
    position: 8,
    challengeTitle: 'Real-time Data Processing Pipeline',
    difficulty: 'Hard',
    description: 'Process real-time data streams at scale'
  },
  {
    position: 9,
    challengeTitle: 'Multi-Region Disaster Recovery',
    difficulty: 'Hard',
    description: 'Build a resilient multi-region architecture'
  },
  {
    position: 10,
    challengeTitle: 'Extend Video Platform with Analytics',
    difficulty: 'Hard',
    description: 'Add analytics to a video streaming platform'
  },
  {
    position: 11,
    challengeTitle: 'Adobe AI Platform Architecture',
    difficulty: 'Hard',
    description: 'Design Adobe\'s enterprise AI platform'
  }
];

/**
 * Total number of quest challenges
 */
export const TOTAL_QUEST_CHALLENGES = QUEST_CHALLENGE_ORDER.length;

/**
 * Get quest challenge by position (1-indexed)
 */
export function getQuestChallengeByPosition(position: number): QuestChallenge | undefined {
  return QUEST_CHALLENGE_ORDER.find(qc => qc.position === position);
}

/**
 * Get position of a challenge by title
 */
export function getPositionByTitle(title: string): number | undefined {
  const questChallenge = QUEST_CHALLENGE_ORDER.find(
    qc => qc.challengeTitle.toLowerCase() === title.toLowerCase()
  );
  return questChallenge?.position;
}

/**
 * Check if a challenge is part of Quest Mode
 */
export function isQuestChallenge(title: string): boolean {
  return QUEST_CHALLENGE_ORDER.some(
    qc => qc.challengeTitle.toLowerCase() === title.toLowerCase()
  );
}

/**
 * Map challenges to quest order
 * @param challenges - Array of all challenges from API
 * @returns Array of challenges ordered for quest mode
 */
export function orderChallengesForQuest(challenges: any[]): any[] {
  const orderedChallenges: any[] = [];

  QUEST_CHALLENGE_ORDER.forEach(questChallenge => {
    const match = challenges.find(
      c => c.title.toLowerCase() === questChallenge.challengeTitle.toLowerCase()
    );

    if (match) {
      orderedChallenges.push({
        ...match,
        questPosition: questChallenge.position
      });
    }
  });

  return orderedChallenges;
}
