// Frontend API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  
  // Timeout configurations
  TIMEOUT: {
    DEFAULT: 10000, // 10 seconds
    GENERATION: 60000, // 60 seconds for image generation
    UPLOAD: 30000, // 30 seconds for file uploads
  },
  
  // Retry configurations
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // 1 second
  },
  
  // File upload limits
  UPLOAD: {
    MAX_SIZE: 20 * 1024 * 1024, // 20MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  },
  
  // Endpoints that don't require authentication
  PUBLIC_ENDPOINTS: [
    '/auth/signup',
    '/auth/login',
    '/auth/google',
    '/auth/refresh',
    '/health',
    '/prompt/suggest',
    '/generation/text-to-image',
    '/generation/image-to-image',
    '/analytics/popular/prompts',
    '/analytics/popular/styles',
    '/analytics/trending',
    '/payment/test-credentials',
  ],
  
  // Endpoints that work for both authenticated and guest users
  GUEST_FRIENDLY_ENDPOINTS: [
    '/generation/text-to-image',
    '/generation/image-to-image',
  ],
};

export default API_CONFIG;