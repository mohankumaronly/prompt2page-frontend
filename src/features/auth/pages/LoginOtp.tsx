// src/features/auth/pages/LoginOtp.tsx
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useOtpLogin } from '../hooks/useOtpLogin';
import AuthLayout from '../components/AuthLayout';
import AuthCard from '../components/AuthCard';
import { OTPInput } from '../components/OTPInput';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../hooks/useToast';

export const LoginOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const password = location.state?.password || '';
  const { initiateOtp, verifyOtp } = useOtpLogin();
  const [otp, setOtp] = useState('');
  const { showToast } = useToast();
  const hasInitiated = useRef(false);

  useEffect(() => {
    if (!email || !password) {
      showToast('Session expired. Please login again.', 'error');
      navigate('/auth/login');
      return;
    }
    
    // ✅ REMOVE sessionStorage check - let backend handle rate limiting
    if (!hasInitiated.current && !initiateOtp.isPending && !initiateOtp.isSuccess) {
      hasInitiated.current = true;
      console.log('📧 Initiating OTP for user:', email);
      initiateOtp.mutate({ email, password });
    }
  }, []); // Empty dependency array - runs only once

  const handleVerifyOtp = () => {
    if (otp.length === 6) {
      console.log('🔐 Verifying OTP:', otp);
      verifyOtp.mutate({ otp });
    }
  };

  const handleResendOtp = () => {
    console.log('📧 Resending OTP for:', email);
    initiateOtp.mutate({ email, password });
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Verify Your Identity"
        subtitle="Enter the 6-digit code sent to your email"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              We've sent a verification code to:
            </p>
            <p className="font-medium text-gray-900 mt-1">{email}</p>
            <p className="text-gray-500 text-xs mt-2">
              Code expires in 5 minutes
            </p>
          </div>

          <OTPInput
            length={6}
            value={otp}
            onChange={setOtp}
            onComplete={handleVerifyOtp}
            isLoading={verifyOtp.isPending}
          />
          
          <Button
            onClick={handleVerifyOtp}
            isLoading={verifyOtp.isPending}
            disabled={otp.length !== 6}
            className="w-full"
          >
            {verifyOtp.isPending ? 'Verifying...' : 'Verify & Login'}
          </Button>
          
          <div className="text-center">
            <button
              onClick={handleResendOtp}
              disabled={initiateOtp.isPending}
              className="text-sm text-brand-600 hover:text-brand-700 disabled:opacity-50"
            >
              {initiateOtp.isPending ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>

          <div className="text-center text-sm">
            <Link to="/auth/login" className="text-gray-500 hover:text-gray-700">
              ← Back to Login
            </Link>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};