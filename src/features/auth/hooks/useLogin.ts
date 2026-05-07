
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import { useToast } from '../../../hooks/useToast';

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth, setLoading } = useAuthStore();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      console.log('🔐 Login attempt for:', data.email);
      setLoading(true);
      const response = await authApi.login(data);
      return response;
    },
    
    onSuccess: async (response, variables) => {
      console.log('✅ Login response:', response.data);
      
      const { accessToken, message, requiresOtp } = response.data;
      
      // ✅ Check if backend requires OTP for this user
      if (requiresOtp === true) {
        console.log('🔐 OTP required for user:', variables.email);
        // ✅ Changed from "OTP sent" to just redirect message
        showToast(message || 'Please verify your identity', 'info');
        navigate('/auth/login-otp', { 
          state: { 
            email: variables.email,
            password: variables.password
          } 
        });
        setLoading(false);
        return;
      }
      
      // ✅ First time login - has accessToken
      if (accessToken) {
        console.log('✅ First time login - access token received');
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('hasLoggedInBefore', 'true');
        
        try {
          const userResponse = await authApi.getCurrentUser();
          setAuth(userResponse.data.user);
          showToast(message || 'Login successful! Welcome!', 'success');
        } catch (error) {
          const fallbackUser = {
            id: Date.now().toString(),
            firstName: variables.email.split('@')[0],
            lastName: '',
            email: variables.email,
            emailVerified: true,
            createdAt: new Date().toISOString(),
          };
          setAuth(fallbackUser);
          showToast(message || 'Login successful!', 'success');
        }
        
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
      }
      
      showToast(errorMessage, 'error');
    },
  });
};