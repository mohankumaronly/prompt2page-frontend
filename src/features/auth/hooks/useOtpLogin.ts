// src/features/auth/hooks/useOtpLogin.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import { useToast } from '../../../hooks/useToast';

export const useOtpLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { showToast } = useToast();

  // Step 1: Initiate OTP
  const initiateOtp = useMutation({
    mutationFn: async (data: { email: string }) => {
      console.log('📧 Initiating OTP for:', data.email);
      const response = await authApi.initiateOtp(data);
      return response;
    },
    onSuccess: (response) => {
      console.log('✅ OTP Initiate Response:', response.data);
      const { message, otpSentTo, expiresIn } = response.data;
      showToast(message || `OTP sent to ${otpSentTo}`, 'success');
      console.log(`⏰ OTP expires in ${expiresIn} seconds`);
    },
    onError: (error: any) => {
      console.error('❌ Initiate OTP error:', error);
      let errorMessage = 'Failed to send OTP. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server.';
      }
      showToast(errorMessage, 'error');
    },
  });

  // Step 2: Verify OTP
  const verifyOtp = useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      console.log('🔐 Verifying OTP for:', data.email);
      const response = await authApi.verifyOtp(data);
      return response;
    },
    onSuccess: (response) => {
      console.log('✅ OTP Verify Response:', response.data);
      
      if (response.data.user) {
        setAuth(response.data.user);
        showToast('Login successful! Welcome back.', 'success');
        navigate('/dashboard');
      }
    },
    onError: (error: any) => {
      console.error('❌ Verify OTP error:', error);
      let errorMessage = 'Invalid OTP. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showToast(errorMessage, 'error');
    },
  });

  return { initiateOtp, verifyOtp };
};