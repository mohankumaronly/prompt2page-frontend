// src/features/auth/pages/VerifyEmailPending.tsx
import { useLocation, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import AuthCard from '../components/AuthCard';
import { Button } from '../../../components/ui/Button';
import { useResendVerification } from '../hooks/useResendVerification';
import { useState, useEffect } from 'react';

export const VerifyEmailPending = () => {
  const location = useLocation();
  const email = location.state?.email || '';
  
  console.log('📍 VerifyEmailPending - Location state:', location.state);
  console.log('📧 Email from state:', email);

  const { mutate: resendEmail, isPending } = useResendVerification();
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    // Debug: Check if email is missing
    if (!email) {
      console.warn('⚠️ No email found in location state! User may have accessed this page directly.');
    } else {
      console.log('✅ Email found:', email);
    }
  }, [email]);

  const handleResend = () => {
    console.log('🔄 Resend button clicked for email:', email);
    if (email) {
      resendEmail({ email }, {
        onSuccess: () => {
          console.log('✅ Resend successful');
          setResendSuccess(true);
          setTimeout(() => setResendSuccess(false), 5000);
        },
        onError: (error) => {
          console.error('❌ Resend failed:', error);
        }
      });
    } else {
      console.error('❌ Cannot resend - no email available');
    }
  };

  return (
    <AuthLayout>
      <AuthCard 
        title="Check Your Email" 
        subtitle="We've sent you a verification link"
      >
        <div className="text-center py-4">
          <div className="mb-4 text-brand-500">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Email Sent!</h2>
          
          <p className="text-gray-600 mt-2">
            We've sent a verification link to:
          </p>
          <p className="font-medium text-gray-900 mt-1">
            {email || 'your email address'}
          </p>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              📧 Please check your inbox and click the verification link to activate your account.
            </p>
            <p className="text-xs text-blue-600 mt-2">
              ⏰ The link will expire in 24 hours.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <Link to="/auth/login">
              <Button variant="outline" className="w-full">
                Back to Login
              </Button>
            </Link>
            
            <div className="text-center">
              {resendSuccess && (
                <p className="text-green-600 text-sm mb-2">
                  ✓ Verification email resent successfully!
                </p>
              )}
              <button
                onClick={handleResend}
                disabled={isPending}
                className="text-sm text-brand-600 hover:text-brand-700 disabled:opacity-50"
              >
                {isPending ? 'Sending...' : "Didn't receive the email? Click here to resend"}
              </button>
            </div>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};