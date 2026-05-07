// src/features/auth/hooks/useCurrentUser.ts
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import { useEffect } from 'react';

export const useCurrentUser = () => {
  const { setAuth, setLoading, logout, isAuthenticated } = useAuthStore();

  const query = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      console.log('🔍 Fetching current user...');
      
      // Check for token first
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('❌ No access token found - skipping API call');
        throw new Error('No token found');
      }
      
      try {
        const response = await authApi.getCurrentUser();
        console.log('✅ Current user response:', response.data);
        return response;
      } catch (error: any) {
        console.error('❌ Failed to fetch current user:', error.message);
        // If 401, clear token
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    // Only run query if NOT already authenticated AND there's a token
    enabled: !isAuthenticated && !!localStorage.getItem('accessToken'),
  });

  useEffect(() => {
    console.log('📊 Query status:', { 
      isLoading: query.isLoading, 
      isSuccess: query.isSuccess, 
      isError: query.isError,
      status: query.status
    });
    
    if (query.isLoading) {
      console.log('⏳ Setting loading to true');
      setLoading(true);
    } 
    
    if (query.isSuccess) {
      console.log('✅ Setting auth with user data');
      setAuth(query.data.data.user);
      setLoading(false);
    } 
    
    if (query.isError) {
      console.log('❌ Query error - logging out');
      logout();
      setLoading(false);
    }
    
    // If query is not enabled (no token), we need to stop loading
    if (!query.isEnabled) {
      console.log('ℹ️ Query not enabled (no token) - stopping loading');
      setLoading(false);
    }
  }, [query.isLoading, query.isSuccess, query.isError, query.isEnabled, setAuth, logout, setLoading]);

  return query;
};