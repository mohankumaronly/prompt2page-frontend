// src/features/auth/pages/VerifyEmail.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useVerifyEmail } from '../hooks/useVerifyEmail';
import AuthLayout from '../components/AuthLayout';
import AuthCard from '../components/AuthCard';
import { Button } from '../../../components/ui/Button';
import  Loader  from '../../../components/ui/Loader';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { mutate: verifyEmail, isPending, isSuccess, isError, error } = useVerifyEmail();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (token) {
      verifyEmail({ token });
    }
  }, [token, verifyEmail]);

  useEffect(() => {
    if (isSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/auth/login');
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isSuccess, navigate]);

  if (!token) {
    return (
      <AuthLayout>
        <AuthCard title="Invalid Verification Link" subtitle="No verification token provided">
          <div className="text-center">
            <p className="text-red-600 mb-4">This verification link is invalid or expired.</p>
            <Link to="/auth/login">
              <Button>Go to Login</Button>
            </Link>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard 
        title="Email Verification" 
        subtitle="Please wait while we verify your email address"
      >
        {isPending && (
          <div className="text-center py-8">
            <Loader size="lg" text="Verifying your email..." />
          </div>
        )}

        {isSuccess && (
          <div className="text-center py-8">
            <div className="mb-4 text-green-500">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-4">
              Your email has been successfully verified.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Redirecting to login in {countdown} seconds...
            </p>
            <Link to="/auth/login">
              <Button>Login Now</Button>
            </Link>
          </div>
        )}

        {isError && (
          <div className="text-center py-8">
            <div className="mb-4 text-red-500">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-red-600 mb-4">
              {error?.message || 'This verification link is invalid or has expired.'}
            </p>
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">
                You can still log in after verifying your email through the resend option.
              </p>
              <Link to="/auth/login">
                <Button>Go to Login</Button>
              </Link>
            </div>
          </div>
        )}
      </AuthCard>
    </AuthLayout>
  );
};