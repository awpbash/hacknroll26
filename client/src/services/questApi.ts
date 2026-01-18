import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface QuestProgress {
  completedChallenges: string[];
  currentPosition: number;
  totalChallenges: number;
  challengeDetails: {
    [challengeId: string]: {
      completed: boolean;
      timestamp: Date;
      score: number;
      attempts: number;
    };
  };
  lastUpdated?: Date;
}

export interface QuestProgressResponse {
  success: boolean;
  progress: QuestProgress;
  message?: string;
}

/**
 * Fetch user's quest progress
 */
export async function fetchQuestProgress(): Promise<QuestProgress> {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      // Return empty progress if not authenticated
      return {
        completedChallenges: [],
        currentPosition: 0,
        totalChallenges: 11,
        challengeDetails: {}
      };
    }

    const response = await axios.get<QuestProgressResponse>(`${API_URL}/quest/progress`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data.progress;
  } catch (error: any) {
    console.error('Error fetching quest progress:', error);

    // Return empty progress on error
    return {
      completedChallenges: [],
      currentPosition: 0,
      totalChallenges: 11,
      challengeDetails: {}
    };
  }
}

/**
 * Update quest progress (mark challenge as completed)
 */
export async function updateQuestProgress(
  challengeId: string,
  score?: number,
  attempts?: number
): Promise<QuestProgress> {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await axios.post<QuestProgressResponse>(
      `${API_URL}/quest/progress`,
      { challengeId, score, attempts },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data.progress;
  } catch (error: any) {
    console.error('Error updating quest progress:', error);
    throw error;
  }
}

/**
 * Reset quest progress
 */
export async function resetQuestProgress(): Promise<QuestProgress> {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await axios.post<QuestProgressResponse>(
      `${API_URL}/quest/reset`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data.progress;
  } catch (error: any) {
    console.error('Error resetting quest progress:', error);
    throw error;
  }
}

/**
 * Check if a specific challenge is unlocked
 */
export async function isChallengeUnlocked(challengePosition: number): Promise<boolean> {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      // First challenge is always unlocked for unauthenticated users
      return challengePosition === 0;
    }

    const response = await axios.get<{ success: boolean; unlocked: boolean }>(
      `${API_URL}/quest/unlock-status/${challengePosition}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data.unlocked;
  } catch (error: any) {
    console.error('Error checking unlock status:', error);
    // Default to locked on error
    return false;
  }
}

/**
 * Get quest leaderboard (optional feature)
 */
export async function fetchQuestLeaderboard(limit: number = 10): Promise<any[]> {
  try {
    const response = await axios.get(`${API_URL}/quest/leaderboard?limit=${limit}`);
    return response.data.leaderboard || [];
  } catch (error: any) {
    console.error('Error fetching quest leaderboard:', error);
    return [];
  }
}
