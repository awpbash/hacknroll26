import { challengesAPI } from './api';
import { mockChallenges } from '../data/mockData';
import type { Challenge, ChallengeQueryParams } from './api';

// Cache management
let cachedChallenges: Challenge[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch all challenges from API with optional filters
 * Falls back to mock data if API is unavailable
 * Implements 5-minute caching to reduce API calls
 */
export async function fetchChallenges(filters?: ChallengeQueryParams): Promise<Challenge[]> {
  // Check cache validity
  if (cachedChallenges && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
    console.log('[ChallengesAPI] Using cached challenges');
    return filterCached(cachedChallenges, filters);
  }

  try {
    // Try fetching from API
    console.log('[ChallengesAPI] Fetching challenges from API...');
    const response = await challengesAPI.getAll(filters);
    cachedChallenges = response.data;
    cacheTimestamp = Date.now();
    console.log(`[ChallengesAPI] Loaded ${response.data.length} challenges from API`);
    return response.data;
  } catch (error) {
    // Fallback to mock data
    console.warn('[ChallengesAPI] API unavailable, using mock data:', error);
    cachedChallenges = mockChallenges;
    cacheTimestamp = Date.now();
    return filterLocal(mockChallenges, filters);
  }
}

/**
 * Fetch a single challenge by ID
 * Falls back to mock data if API is unavailable
 * Checks cache first for performance
 */
export async function fetchChallengeById(id: string): Promise<Challenge | null> {
  // Try to get from cached list first
  if (cachedChallenges) {
    const cached = cachedChallenges.find(c => c.id === id);
    if (cached) {
      console.log(`[ChallengesAPI] Using cached challenge: ${id}`);
      return cached;
    }
  }

  try {
    // Try fetching from API
    console.log(`[ChallengesAPI] Fetching challenge ${id} from API...`);
    const response = await challengesAPI.getById(id);
    return response.data;
  } catch (error) {
    // Fallback to mock data
    console.warn(`[ChallengesAPI] API unavailable, using mock data for challenge: ${id}`, error);
    return mockChallenges.find(c => c.id === id) || null;
  }
}

/**
 * Clear the challenges cache
 * Useful for forcing a fresh fetch from API
 */
export function clearChallengesCache(): void {
  console.log('[ChallengesAPI] Clearing challenges cache');
  cachedChallenges = null;
  cacheTimestamp = null;
}

/**
 * Filter cached challenges by difficulty and/or category
 */
function filterCached(challenges: Challenge[], filters?: ChallengeQueryParams): Challenge[] {
  if (!filters) return challenges;

  return challenges.filter(c => {
    if (filters.difficulty && c.difficulty !== filters.difficulty) return false;
    if (filters.category && c.category !== filters.category) return false;
    return true;
  });
}

/**
 * Filter local mock challenges (same logic as filterCached)
 */
function filterLocal(challenges: Challenge[], filters?: ChallengeQueryParams): Challenge[] {
  return filterCached(challenges, filters);
}
