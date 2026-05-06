// src/features/auth/hooks/useResendVerification.ts
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useToast } from '../../../hooks/useToast';

interface ResendVerificationParams {
  email: string;
}

export const useResendVerification = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async ({ email }: ResendVerificationParams) => {
      console.log('📧 Resending verification email to:', email);
      
      if (!email || email === '') {
        throw new Error('Email address is required');
      }
      
      const response = await authApi.resendVerification(email);
      console.log('✅ Resend verification response:', response);
      return response;
    },
    onSuccess: (response, variables) => {
      console.log('🎉 Verification email resent successfully!', response);
      showToast(
        `Verification email sent to ${variables.email}. Please check your inbox.`,
        'success'
      );
    },
    onError: (error: any) => {
      console.error('❌ Failed to resend verification email:', error);
      
      let message = 'Failed to resend verification email. Please try again.';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.message) {
        message = error.message;
      }
      
      // Handle specific error cases
      if (message.includes('already verified')) {
        message = 'Your email is already verified. Please login.';
      } else if (message.includes('not found')) {
        message = 'No account found with this email address.';
      }
      
      showToast(message, 'error');
    },
  });
};