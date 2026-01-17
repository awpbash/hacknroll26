import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

// API Response Types
export interface User {
  id: string;
  username: string;
  email: string;
  totalScore?: number;
  solvedCount?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  requirements: string[];
  constraints: {
    maxCost?: number;
    requiredServices?: string[];
    optionalServices?: string[];
    minServices?: number;
    maxServices?: number;
  };
  category: string;
  acceptanceRate?: number;
  submissions?: number;
  existingInfrastructure?: {
    nodes: any[];
    edges: any[];
  };
  editorial?: string;
  solutions?: any[];
}

export interface ChallengeStats {
  totalSubmissions: number;
  averageCost: number;
  bestCost: number;
  successRate: number;
}

export interface Submission {
  challengeId: string;
  architecture: {
    nodes: any[];
    edges: any[];
  };
  provider: string;
  totalCost?: number; // Optional - backend calculates
  services?: any[]; // Optional - backend extracts
}

export interface SubmissionResponse {
  submission: {
    id: string;
    status: string;
    evaluation: {
      passed: boolean;
      score: number;
      cost: number;
      complexity: number;
      feedback: string[];
      errors: string[];
      status: string;
      phases?: {
        phase1?: any;
        phase2?: any;
        phase3?: any;
      };
    };
  };
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  totalScore: number;
  solvedCount: number;
}

export interface ChallengeLeaderboardEntry {
  rank: number;
  username: string;
  cost: number;
  score: number;
  timestamp: string;
}

export interface Service {
  name: string;
  provider: string;
  category: string;
  description: string;
  pricing: {
    unit: string;
    pricePerUnit: number;
  };
}

export interface ChallengeQueryParams {
  difficulty?: string;
  category?: string;
  limit?: number;
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData: RegisterData): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/register', userData),
  login: (credentials: LoginCredentials): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/login', credentials),
  getCurrentUser: (): Promise<AxiosResponse<User>> =>
    api.get('/auth/me')
};

// Challenges API
export const challengesAPI = {
  getAll: (params?: ChallengeQueryParams): Promise<AxiosResponse<Challenge[]>> =>
    api.get('/challenges', { params }),
  getById: (id: string): Promise<AxiosResponse<Challenge>> =>
    api.get(`/challenges/${id}`),
  getStats: (id: string): Promise<AxiosResponse<ChallengeStats>> =>
    api.get(`/challenges/${id}/stats`),
  initialize: (): Promise<AxiosResponse<{ success: boolean; message: string }>> =>
    api.post('/challenges/initialize')
};

// Submissions API
export const submissionsAPI = {
  submit: (submission: Submission): Promise<AxiosResponse<SubmissionResponse>> =>
    api.post('/submissions', submission),
  getByChallenge: (challengeId: string): Promise<AxiosResponse<any[]>> =>
    api.get(`/submissions/challenge/${challengeId}`),
  getMySubmissions: (): Promise<AxiosResponse<any[]>> =>
    api.get('/submissions/my-submissions')
};

// Leaderboard API
export const leaderboardAPI = {
  getGlobal: (limit?: number): Promise<AxiosResponse<LeaderboardEntry[]>> =>
    api.get('/leaderboard', { params: { limit } }),
  getByChallenge: (challengeId: string): Promise<AxiosResponse<ChallengeLeaderboardEntry[]>> =>
    api.get(`/leaderboard/challenge/${challengeId}`),
  getCostEfficient: (): Promise<AxiosResponse<any[]>> =>
    api.get('/leaderboard/cost-efficient')
};

// Services API
export const servicesAPI = {
  getAll: (): Promise<AxiosResponse<Service[]>> =>
    api.get('/services'),
  getByProvider: (provider: string): Promise<AxiosResponse<Service[]>> =>
    api.get(`/services/${provider}`),
  getByCategory: (provider: string, category: string): Promise<AxiosResponse<Service[]>> =>
    api.get(`/services/${provider}/${category}`)
};

export default api;
