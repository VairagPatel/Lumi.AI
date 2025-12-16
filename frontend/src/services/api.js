// src/services/api.js
import axios from 'axios';
import { API_CONFIG } from '../config/api.config.js';

const API_BASE_URL = API_CONFIG.BASE_URL;

// Helper function to check if endpoint is public
const isPublicEndpoint = (url) => {
  return API_CONFIG.PUBLIC_ENDPOINTS.some(endpoint => url?.includes(endpoint));
};

// Helper function to check if endpoint is guest-friendly
const isGuestFriendlyEndpoint = (url) => {
  return API_CONFIG.GUEST_FRIENDLY_ENDPOINTS.some(endpoint => url?.includes(endpoint));
};

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      // If we have tokens, try to refresh
      if (token && refreshToken && !originalRequest.url?.includes('/auth/refresh')) {
        originalRequest._retry = true;
        
        try {
          const response = await api.post('/auth/refresh', { refreshToken });
          const newToken = response.data.data.accessToken;
          
          localStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          
          // Only redirect if not on a public endpoint
          if (!isPublicEndpoint(originalRequest.url)) {
            window.location.href = '/auth';
          }
        }
      } else {
        // No tokens or refresh endpoint failed
        if (token && !isPublicEndpoint(originalRequest.url)) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/auth';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (token) => api.post('/auth/google', { token }),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  getUserCredits: () => api.get('/auth/credits'),
};

// Generation APIs
export const generationAPI = {
  textToImage: (data) => 
    api.post('/generation/text-to-image', data, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  imageToImage: (formData) =>
    api.post('/generation/image-to-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob',
    }),
  getHistory: (params) => api.get('/generation/history', { params }),
  getStats: () => api.get('/generation/stats'),
};

// Prompt APIs
export const promptAPI = {
  getSuggestion: () => api.get('/prompt/suggest'),
};

// Payment APIs
export const paymentAPI = {
  createOrder: (data) => api.post('/payment/create-order', data),
  verifyPayment: (data) => api.post('/payment/verify', data),
  handleFailure: (orderId, reason) => api.post('/payment/failure', null, {
    params: { orderId, reason }
  }),
  getHistory: (params) => api.get('/payment/history', { params }),
  getPaymentById: (paymentId) => api.get(`/payment/${paymentId}`),
  testCredentials: () => api.get('/payment/test-credentials'),
};

// Health API
export const healthAPI = {
  check: () => api.get('/health'),
};

// Analytics API
export const analyticsAPI = {
  getPopularPrompts: (limit = 10) => api.get('/analytics/popular/prompts', { params: { limit } }),
  getPopularStyles: (limit = 10) => api.get('/analytics/popular/styles', { params: { limit } }),
  getTrending: () => api.get('/analytics/trending'),
  getRateLimitInfo: () => api.get('/analytics/rate-limit'),
};

export default api;
