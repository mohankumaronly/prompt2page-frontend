// src/features/auth/hooks/useVerifyEmail.ts
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useToast } from '../../../hooks/useToast';

interface VerifyEmailParams {
  token: string;
}

export const useVerifyEmail = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async ({ token }: VerifyEmailParams) => {
      console.log('📧 Verifying email with token:', token);
      const response = await authApi.verifyEmail(token);
      console.log('✅ Verification response:', response);
      return response;
    },
    onSuccess: (response) => {
      console.log('🎉 Email verified successfully!', response);
      showToast('Email verified successfully! You can now log in.', 'success');
    },
    onError: (error: any) => {
      console.error('❌ Email verification failed:', error);
      const message = error.response?.data?.message 
        || error.response?.data?.error 
        || 'Failed to verify email. The link may have expired or is invalid.';
      showToast(message, 'error');
    },
  });
};