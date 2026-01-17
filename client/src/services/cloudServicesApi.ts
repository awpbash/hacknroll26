import axios from 'axios';
import { CloudServicesData } from '../types';
import { cloudServices as fallbackData } from '../data/cloudServices';

// API base URL - use environment variable or default to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4888/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
});

// Cache for cloud services
let cachedServices: CloudServicesData | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes (matches backend cache)

/**
 * Fetch all cloud services from the backend API
 * Falls back to hardcoded data if the API is unavailable
 */
export async function fetchCloudServices(): Promise<CloudServicesData> {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedServices && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
    return cachedServices;
  }

  try {
    const response = await api.get<CloudServicesData>('/services');

    // Update cache
    cachedServices = response.data;
    cacheTimestamp = now;

    console.log('✅ Cloud services fetched from API');
    return response.data;
  } catch (error) {
    console.warn('⚠️ Failed to fetch from API, using fallback data:', error);

    // Use fallback data from local file
    cachedServices = fallbackData;
    cacheTimestamp = now;

    return fallbackData;
  }
}

/**
 * Fetch services for a specific provider
 */
export async function fetchProviderServices(provider: string): Promise<any> {
  try {
    const response = await api.get(`/services/${provider}`);
    return response.data;
  } catch (error) {
    console.warn(`Failed to fetch ${provider} services:`, error);
    // Fallback to cached or hardcoded data
    const allServices = await fetchCloudServices();
    return allServices[provider] || {};
  }
}

/**
 * Clear the cache (useful for development or manual refresh)
 */
export function clearCloudServicesCache(): void {
  cachedServices = null;
  cacheTimestamp = null;
  console.log('🔄 Cloud services cache cleared');
}

/**
 * Check if backend API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    await axios.get(`${API_BASE_URL.replace('/api', '')}/api/health`, { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}
