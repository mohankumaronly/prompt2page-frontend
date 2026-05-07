// src/features/auth/hooks/useOtpLogin.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import { useToast } from '../../../hooks/useToast';
import { useRef } from 'react';

export const useOtpLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { showToast } = useToast();
  const sessionIdRef = useRef<string>('');
  const isMutatingRef = useRef<boolean>(false);

  // Step 1: Initiate OTP
  const initiateOtp = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      console.log('📧 Initiating OTP with:', { 
        email: data.email, 
        passwordLength: data.password?.length 
      });
      
      // ✅ Prevent duplicate API calls
      if (isMutatingRef.current) {
        console.log('⚠️ OTP mutation already in progress, skipping');
        throw new Error('OTP request already in progress');
      }
      
      isMutatingRef.current = true;
      
      try {
        const response = await authApi.initiateOtp({ 
          email: data.email,
          password: data.password
        });
        return response;
      } finally {
        isMutatingRef.current = false;
      }
    },
    onSuccess: (response) => {
      console.log('✅ OTP Initiate Response:', response.data);
      const { message, otpSentTo, expiresIn, sessionId: sid } = response.data;
      
      sessionIdRef.current = sid;
      console.log(`✅ Session ID stored: ${sessionIdRef.current}`);
      console.log(`⏰ OTP expires in ${expiresIn} seconds`);
      
      showToast(message || `OTP sent to ${otpSentTo}`, 'success');
    },
    onError: (error: any) => {
      console.error('❌ Initiate OTP error:', error);
      isMutatingRef.current = false;
      
      let errorMessage = 'Failed to send OTP. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showToast(errorMessage, 'error');
    },
  });

  // Step 2: Verify OTP
  const verifyOtp = useMutation({
    mutationFn: async (data: { otp: string }) => {
      console.log('🔐 Verifying OTP with sessionId:', sessionIdRef.current);
      
      if (!sessionIdRef.current) {
        console.error('❌ No session ID found');
        throw new Error('No session ID found. Please request OTP again.');
      }
      
      const response = await authApi.verifyOtp({
        sessionId: sessionIdRef.current,
        otpCode: data.otp
      });
      return response;
    },
    onSuccess: (response) => {
      console.log('✅ OTP Verify Response:', response.data);
      
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        
        authApi.getCurrentUser()
          .then((userResponse) => {
            console.log('✅ User data fetched:', userResponse.data.user);
            setAuth(userResponse.data.user);
            showToast('Login successful! Welcome back.', 'success');
            navigate('/dashboard');
          })
          .catch((error) => {
            console.error('Failed to fetch user:', error);
            navigate('/dashboard');
          });
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