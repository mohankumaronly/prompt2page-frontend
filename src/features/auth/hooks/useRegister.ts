// src/features/auth/hooks/useRegister.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import { useToast } from '../../../hooks/useToast';
import type { RegisterRequest } from '../types/auth.types';

export const useRegister = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      const { accessToken, refreshToken, message } = response.data;
      
      // Store tokens if your backend uses them
      // For cookie-based auth, you might not need to store tokens
      if (accessToken && refreshToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      showToast(message || 'Registration successful! Please verify your email.', 'success');
      
      // Option 1: Redirect to verification pending page
      navigate('/verify-email-pending');
      
      // Option 2: Auto-login and redirect to dashboard
      // setAuth(user);
      // navigate('/dashboard');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      showToast(errorMessage, 'error');
    },
  });
};