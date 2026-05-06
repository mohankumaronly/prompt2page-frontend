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

  // Step 1: Initiate OTP (call /api/auth/login/initiate)
  const initiateOtp = useMutation({
    mutationFn: (data: { email: string }) => 
      authApi.initiateOtp(data),
    onSuccess: (response) => {
      console.log('OTP Initiate Response:', response.data);
      const { message, otpSentTo, expiresIn } = response.data;
      showToast(message || `OTP sent to ${otpSentTo}`, 'success');
      console.log(`OTP expires in ${expiresIn} seconds`);
    },
    onError: (error: any) => {
      console.error('Initiate OTP error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      showToast(errorMessage, 'error');
    },
  });

  // Step 2: Verify OTP (call /api/auth/login/verify)
  const verifyOtp = useMutation({
    mutationFn: (data: { email: string; otp: string }) => 
      authApi.verifyOtp(data),
    onSuccess: (response) => {
      console.log('OTP Verify Response:', response.data);
      
      if (response.data.user) {
        setAuth(response.data.user);
        showToast('Login successful! Welcome back.', 'success');
        navigate('/dashboard');
      }
    },
    onError: (error: any) => {
      console.error('Verify OTP error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid OTP. Please try again.';
      showToast(errorMessage, 'error');
    },
  });

  return { initiateOtp, verifyOtp };
};