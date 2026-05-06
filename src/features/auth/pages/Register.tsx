// src/features/auth/pages/Register.tsx
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '../hooks/useRegister';
import AuthLayout from '../components/AuthLayout';
import AuthCard from '../components/AuthCard';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { SocialAuth } from '../components/SocialAuth';
import { PasswordStrength } from '../components/PasswordStrength';
import type { RegisterRequest } from '../types/auth.types';

// Validation schema
const registerSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name is too long'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name is too long'),
  email: z.string()
    .email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = RegisterRequest & { confirmPassword: string };

export const Register = () => {
  const navigate = useNavigate();
  const { mutate: register, isPending, error } = useRegister();

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password');

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    register(registerData, {
      onSuccess: () => {
        navigate('/auth/verify-email-pending', {
          state: { email: data.email }
        });
      },
    });
  };

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`;
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Create an account"
        subtitle="Join Prompt2Page and start building amazing projects"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              placeholder="John"
              {...registerField('firstName')}
              error={errors.firstName?.message}
              autoComplete="given-name"
            />
            <Input
              label="Last Name"
              type="text"
              placeholder="Doe"
              {...registerField('lastName')}
              error={errors.lastName?.message}
              autoComplete="family-name"
            />
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            {...registerField('email')}
            error={errors.email?.message}
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            {...registerField('password')}
            error={errors.password?.message}
            autoComplete="new-password"
            showPasswordToggle
          />

          {passwordValue && (
            <PasswordStrength password={passwordValue} />
          )}

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            {...registerField('confirmPassword')}
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
            showPasswordToggle
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error.message}</p>
            </div>
          )}

          <Button
            type="submit"
            isLoading={isPending}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? 'Creating account...' : 'Sign Up'}
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
            Already have an account?{' '}
            <Link to="/auth/login" className="text-brand-600 hover:text-brand-700 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};