// src/services/apiClient.ts
import axios from 'axios';
import { useAuthStore } from '../features/auth/stores/authStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.log('🔐 401 Unauthorized - Attempting token refresh');
      
      try {
        // Try to refresh the token
        const refreshResponse = await apiClient.post('/api/auth/refresh');
        
        if (refreshResponse.status === 200) {
          console.log('✅ Token refreshed successfully, retrying original request');
          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed - Logging out');
        // Clear token and logout
        localStorage.removeItem('accessToken');
        useAuthStore.getState().logout();
        
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/auth/login')) {
          window.location.href = '/auth/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      console.error('❌ Network Error - Cannot connect to server');
      error.userMessage = 'Cannot connect to server. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;