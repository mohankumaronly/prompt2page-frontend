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
      console.log('🔍 Checking current user...');
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        console.log('No token found, skipping user fetch');
        throw new Error('No token');
      }
      
      const response = await authApi.getCurrentUser();
      return response;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !isAuthenticated, // Only fetch if not authenticated
  });

  useEffect(() => {
    if (query.isLoading) {
      setLoading(true);
    } else if (query.isSuccess) {
      console.log('✅ User authenticated:', query.data.data.user.email);
      setAuth(query.data.data.user);
      setLoading(false);
    } else if (query.isError) {
      console.log('❌ No authenticated user found');
      logout();
      setLoading(false);
    }
  }, [query.isLoading, query.isSuccess, query.isError, query.data, setAuth, logout, setLoading]);

  return query;
};