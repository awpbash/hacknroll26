import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me')
};

// Challenges API
export const challengesAPI = {
  getAll: (params) => api.get('/challenges', { params }),
  getById: (id) => api.get(`/challenges/${id}`),
  getStats: (id) => api.get(`/challenges/${id}/stats`),
  initialize: () => api.post('/challenges/initialize')
};

// Submissions API
export const submissionsAPI = {
  submit: (submission) => api.post('/submissions', submission),
  getByChallenge: (challengeId) => api.get(`/submissions/challenge/${challengeId}`),
  getMySubmissions: () => api.get('/submissions/my-submissions')
};

// Leaderboard API
export const leaderboardAPI = {
  getGlobal: (limit) => api.get('/leaderboard', { params: { limit } }),
  getByChallenge: (challengeId) => api.get(`/leaderboard/challenge/${challengeId}`),
  getCostEfficient: () => api.get('/leaderboard/cost-efficient')
};

// Services API
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getByProvider: (provider) => api.get(`/services/${provider}`),
  getByCategory: (provider, category) => api.get(`/services/${provider}/${category}`)
};

export default api;
