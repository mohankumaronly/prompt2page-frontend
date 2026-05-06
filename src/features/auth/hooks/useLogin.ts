// src/features/auth/hooks/useLogin.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import { useToast } from '../../../hooks/useToast';

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth, setLoading } = useAuthStore();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      console.log('🔐 Attempting login for:', data.email);
      setLoading(true);
      const response = await authApi.login(data);
      return response;
    },
    
    onSuccess: async (response, variables) => {
      console.log('✅ Login API response:', response.data);
      
      const { accessToken, message } = response.data;
      
      // Store access token
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        console.log('🔑 Access token stored');
      }
      
      // Fetch user data with retry logic
      let retries = 3;
      let userData = null;
      let lastError = null;
      
      while (retries > 0 && !userData) {
        try {
          console.log(`📡 Fetching user data (attempts left: ${retries})`);
          const userResponse = await authApi.getCurrentUser();
          userData = userResponse.data.user;
          console.log('✅ User data fetched successfully:', userData.email);
        } catch (error: any) {
          lastError = error;
          console.error(`❌ Failed to fetch user data (attempts left: ${retries - 1}):`, error.message);
          retries--;
          if (retries > 0) {
            // Wait 1 second before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      if (userData) {
        setAuth(userData);
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        showToast(message || 'Login successful! Welcome back!', 'success');
        navigate('/dashboard');
      } else {
        // Fallback - create basic user from email
        console.warn('⚠️ Could not fetch user data, using fallback');
        const fallbackUser = {
          id: Date.now().toString(),
          firstName: variables.email.split('@')[0],
          lastName: '',
          email: variables.email,
          emailVerified: true,
          createdAt: new Date().toISOString(),
        };
        setAuth(fallbackUser);
        showToast('Login successful!', 'success');
        navigate('/dashboard');
      }
      
      setLoading(false);
    },
    
    onError: (error: any) => {
      console.error('❌ Login error:', error);
      setLoading(false);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please check your connection.';
      } else if (error.userMessage) {
        errorMessage = error.userMessage;
      }
      
      showToast(errorMessage, 'error');
    },
  });
};