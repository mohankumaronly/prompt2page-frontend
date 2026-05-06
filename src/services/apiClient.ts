// src/services/apiClient.ts
import axios from 'axios';
import { authApi } from '../features/auth/api/authApi';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://prompt2page.onrender.com',
  timeout: 10000,
  withCredentials: true, // ✅ CRITICAL: Send/receive cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // No need to add token manually - cookie is sent automatically
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Call refresh token endpoint
        await authApi.refreshToken();
        
        // Refresh successful - process queued requests
        processQueue(null);
        
        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear auth and redirect to login
        processQueue(refreshError);
        
        // Clear auth store
        const { useAuthStore } = await import('../features/auth/stores/authStore');
        useAuthStore.getState().logout();
        
        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;