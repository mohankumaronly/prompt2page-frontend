// src/features/auth/hooks/useRegister.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useToast } from '../../../hooks/useToast';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const useRegister = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      console.log('📝 Registering user:', data.email);
      const response = await authApi.register(data);
      return response;
    },
    onSuccess: (response, variables) => {
      console.log('✅ Registration successful:', response.data);
      showToast(response.data.message || 'Registration successful! Please verify your email.', 'success');
      
      // Store tokens if returned
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      
      // Navigate to verification pending page
      navigate('/auth/verify-email-pending', {
        state: { email: variables.email }
      });
    },
    onError: (error: any) => {
      console.error('❌ Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please check your connection.';
      }
      
      showToast(errorMessage, 'error');
    },
  });
};