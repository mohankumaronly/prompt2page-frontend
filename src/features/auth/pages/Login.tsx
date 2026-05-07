// src/features/auth/pages/Login.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '../hooks/useLogin';
import AuthLayout from '../components/AuthLayout';
import AuthCard from '../components/AuthCard';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { SocialAuth } from '../components/SocialAuth';
import type { LoginRequest } from '../types/auth.types';

// Validation schema
const loginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address'),
  password: z.string()
    .min(1, 'Password is required'),
});

type LoginFormData = LoginRequest;

export const Login = () => {

  const { mutate: login, isPending, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log('🔐 Login attempt for:', data.email);
    login(data);
  };

  // ✅ CORRECT Google OAuth URL - Spring Security's OAuth2 endpoint
  const handleGoogleAuth = () => {
    // Use the correct OAuth2 endpoint, not /api/auth/google
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    window.location.href = `${backendUrl}/oauth2/authorization/google`;
  };

  const fillDemoCredentials = () => {
    setValue('email', 'demo@example.com');
    setValue('password', 'Demo@123456');
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to your account"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            error={errors.email?.message}
            autoComplete="email"
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            {...register('password')}
            error={errors.password?.message}
            autoComplete="current-password"
            showPasswordToggle
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <div className="flex justify-between items-center">
            <div className="text-left">
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-xs text-gray-500 hover:text-brand-600"
              >
                Fill Demo Credentials
              </button>
            </div>
            <div className="text-right">
              <Link 
                to="/auth/forgot-password" 
                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                {error.response?.data?.message || error.message || 'Login failed. Please check your credentials.'}
              </p>
            </div>
          )}

          <Button
            type="submit"
            isLoading={isPending}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <SocialAuth
            onGoogleClick={handleGoogleAuth}
            isLoading={isPending}
          />

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-brand-600 hover:text-brand-700 font-medium">
              Create an account
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};