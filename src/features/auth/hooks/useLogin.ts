// src/features/auth/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import { useToast } from '../../../hooks/useToast';

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) => 
      authApi.login(data),
    
    onSuccess: (response) => {
      console.log('Login response:', response.data);
      
      const { accessToken, message } = response.data;
      
      if (accessToken) {
        // First login after registration - has accessToken
        console.log('First time login - has accessToken');
        
        // Store access token if needed
        localStorage.setItem('accessToken', accessToken);
        
        // Fetch user data
        authApi.getCurrentUser()
          .then((userResponse) => {
            console.log('User data fetched:', userResponse.data.user);
            setAuth(userResponse.data.user);
            showToast(message || 'Login successful! Welcome!', 'success');
            navigate('/dashboard');
          })
          .catch((error) => {
            console.error('Failed to fetch user:', error);
            showToast('Login successful!', 'success');
            navigate('/dashboard');
          });
      } else {
        // No accessToken - this shouldn't happen for your backend
        // But handle gracefully
        showToast(message || 'Login successful!', 'success');
        navigate('/dashboard');
      }
    },
    
    onError: (error: any) => {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(errorMessage, 'error');
    },
  });
};