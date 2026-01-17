import { useState, useEffect, useCallback } from 'react';
import { fetchQuestProgress, updateQuestProgress as apiUpdateProgress, QuestProgress } from '../services/questApi';

export type ChallengeStatus = 'locked' | 'available' | 'completed';

export interface ChallengeProgressState {
  challengeId: string;
  position: number;
  status: ChallengeStatus;
  score?: number;
  attempts?: number;
  timestamp?: Date;
}

export interface UseQuestProgressReturn {
  progress: QuestProgress | null;
  loading: boolean;
  error: string | null;
  refreshProgress: () => Promise<void>;
  getChallengeStatus: (challengeId: string, position: number) => ChallengeStatus;
  isUnlocked: (position: number) => boolean;
  completionPercentage: number;
}

/**
 * Custom hook to manage Quest Mode progress
 * Handles fetching, caching, and updating quest progress
 */
export function useQuestProgress(): UseQuestProgressReturn {
  const [progress, setProgress] = useState<QuestProgress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch quest progress from API
   */
  const refreshProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedProgress = await fetchQuestProgress();
      setProgress(fetchedProgress);
    } catch (err: any) {
      console.error('Error fetching quest progress:', err);
      setError(err.message || 'Failed to load quest progress');

      // Set default empty progress on error
      setProgress({
        completedChallenges: [],
        currentPosition: 0,
        totalChallenges: 11,
        challengeDetails: {}
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Initial load of quest progress
   */
  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  /**
   * Get the status of a challenge (locked, available, completed)
   */
  const getChallengeStatus = useCallback(
    (challengeId: string, position: number): ChallengeStatus => {
      if (!progress) {
        return position === 1 ? 'available' : 'locked';
      }

      // Check if completed
      if (progress.completedChallenges.includes(challengeId)) {
        return 'completed';
      }

      // Check if available (current position or first challenge)
      if (position === 1 || position === progress.currentPosition + 1) {
        return 'available';
      }

      // Otherwise locked
      return 'locked';
    },
    [progress]
  );

  /**
   * Check if a challenge at a given position is unlocked
   */
  const isUnlocked = useCallback(
    (position: number): boolean => {
      if (!progress) {
        return position === 1;
      }

      // First challenge is always unlocked
      if (position === 1) {
        return true;
      }

      // Challenge is unlocked if we've completed up to or past this position
      return progress.currentPosition >= position - 1;
    },
    [progress]
  );

  /**
   * Calculate completion percentage
   */
  const completionPercentage = progress
    ? Math.round((progress.completedChallenges.length / progress.totalChallenges) * 100)
    : 0;

  return {
    progress,
    loading,
    error,
    refreshProgress,
    getChallengeStatus,
    isUnlocked,
    completionPercentage
  };
}

/**
 * Hook to manually update quest progress (for testing or manual updates)
 */
export function useUpdateQuestProgress() {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProgress = useCallback(async (challengeId: string, score?: number, attempts?: number) => {
    try {
      setUpdating(true);
      setError(null);

      await apiUpdateProgress(challengeId, score, attempts);
    } catch (err: any) {
      console.error('Error updating quest progress:', err);
      setError(err.message || 'Failed to update quest progress');
      throw err;
    } finally {
      setUpdating(false);
    }
  }, []);

  return {
    updateProgress,
    updating,
    error
  };
}
