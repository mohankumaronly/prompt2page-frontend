// src/features/auth/hooks/useCurrentUser.ts
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import { useEffect } from 'react';

export const useCurrentUser = () => {
  const { setAuth, setLoading, logout, isAuthenticated, isInitialized } = useAuthStore();

  console.log('🔍 useCurrentUser - Auth State:', { isAuthenticated, isInitialized });

  const query = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      console.log('📡 Fetching current user from API...');
      try {
        const response = await authApi.getCurrentUser();
        console.log('✅ API Response:', response);
        return response;
      } catch (error) {
        console.error('❌ API Error:', error);
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: !isAuthenticated && !isInitialized,
  });

  console.log('📊 Query Status:', { 
    isLoading: query.isLoading, 
    isSuccess: query.isSuccess, 
    isError: query.isError,
    status: query.status 
  });

  useEffect(() => {
    console.log('🎯 useEffect triggered with:', { 
      isLoading: query.isLoading, 
      isSuccess: query.isSuccess, 
      isError: query.isError 
    });
    
    if (query.isLoading) {
      console.log('⏳ Setting loading state to true');
      setLoading(true);
    } else if (query.isSuccess) {
      console.log('✅ Setting auth with user data');
      setAuth(query.data.data.user);
      setLoading(false);
    } else if (query.isError) {
      console.log('❌ Error - logging out');
      logout();
      setLoading(false);
    }
  }, [query.isLoading, query.isSuccess, query.isError, query.data, setAuth, logout, setLoading]);

  return query;
};