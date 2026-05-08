// src/services/apiClient.ts
import axios from 'axios';
import { useAuthStore } from '../features/auth/stores/authStore';

// Create separate API clients for different services
const authApiClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8080',
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const aiBuilderApiClient = axios.create({
  baseURL: import.meta.env.VITE_AI_BUILDER_API_URL || 'http://localhost:8081',
  withCredentials: true,
  timeout: 60000, // 60 seconds for AI operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Default client for backward compatibility
const apiClient = authApiClient;

// Request interceptor for auth client
authApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📡 Auth API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Request interceptor for AI builder client
aiBuilderApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🤖 AI Builder API Request: ${config.method?.toUpperCase()} ${config.url} (timeout: 60s)`);
    return config;
  },
  (error) => {
    console.error('❌ AI Builder Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for auth client (with token refresh)
authApiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Auth API Response: ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      console.error('⏰ Request timeout');
      error.userMessage = 'Request took too long. Please try again.';
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.log('🔐 401 Unauthorized - Attempting token refresh');
      
      try {
        const refreshResponse = await authApiClient.post('/api/auth/refresh');
        
        if (refreshResponse.status === 200) {
          console.log('✅ Token refreshed successfully, retrying original request');
          return authApiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed - Logging out');
        localStorage.removeItem('accessToken');
        useAuthStore.getState().logout();
        
        if (!window.location.pathname.includes('/auth/login')) {
          window.location.href = '/auth/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    if (error.code === 'ERR_NETWORK') {
      console.error('❌ Network Error - Cannot connect to auth server');
      error.userMessage = 'Cannot connect to authentication server.';
    }
    
    return Promise.reject(error);
  }
);

// Response interceptor for AI builder client (simpler, no token refresh)
aiBuilderApiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ AI Builder Response: ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  async (error) => {
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      console.error('⏰ AI Builder timeout');
      error.userMessage = 'The AI took too long to respond. Please try a simpler prompt.';
    }
    
    // Handle 401 for AI builder (just log, don't refresh)
    if (error.response?.status === 401) {
      console.error('🔐 AI Builder: Unauthorized - Token may be invalid');
      error.userMessage = 'Authentication failed. Please refresh the page.';
    }
    
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      console.error('❌ Network Error - Cannot connect to AI builder server');
      error.userMessage = 'Cannot connect to AI builder. Make sure it\'s running on port 8081.';
    }
    
    return Promise.reject(error);
  }
);

// Export everything
export { authApiClient, aiBuilderApiClient };
export default apiClient;