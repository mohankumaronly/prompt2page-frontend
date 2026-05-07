// src/features/auth/types/auth.types.ts

// ============ Request Types ============

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface InitiateOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  // Empty - cookie handles everything
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

// ============ Response Types ============

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  message: string;
}

export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string | null;
  message: string;
  requiresOtp?: boolean;  
  email?: string;
}

export interface InitiateOtpResponse {
  sessionId: string;
  otpRequired: boolean;
  message: string;
  otpSentTo: string;
  expiresIn: number;
}

export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken?: string | null;
  message: string;
}

export interface RefreshTokenResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface GetCurrentUserResponse {
  user: User;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface ResendVerificationResponse {
  message: string;
}

export interface GoogleAuthUrlResponse {
  url: string;
}

// ============ User Types ============

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
  profilePicture?: string;
  role?: 'user' | 'admin';
}

// ============ Error Types ============

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  timestamp?: string;
  path?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiValidationError extends ApiError {
  validationErrors?: ValidationError[];
}

// ============ State Types for Store ============

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  setAuth: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;

// ============ Hook Return Types ============

export interface UseLoginReturn {
  mutate: (data: LoginRequest) => void;
  isPending: boolean;
  isError: boolean;
  error: ApiError | null;
}

export interface UseRegisterReturn {
  mutate: (data: RegisterRequest) => void;
  isPending: boolean;
  isError: boolean;
  error: ApiError | null;
}

export interface UseOtpLoginReturn {
  initiateOtp: {
    mutate: (data: InitiateOtpRequest) => void;
    isPending: boolean;
  };
  verifyOtp: {
    mutate: (data: VerifyOtpRequest) => void;
    isPending: boolean;
  };
}

export interface UseForgotPasswordReturn {
  mutate: (data: ForgotPasswordRequest) => void;
  isPending: boolean;
  isSuccess: boolean;
}

export interface UseResetPasswordReturn {
  mutate: (data: ResetPasswordRequest) => void;
  isPending: boolean;
  isSuccess: boolean;
}

// ============ Component Props Types ============

export interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  illustration?: React.ReactNode;
}

export interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  maxWidth?: 'sm' | 'md' | 'lg';
}

export interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  isLoading?: boolean;
  autoFocus?: boolean;
}

export interface PasswordStrengthProps {
  password: string;
}

export interface SocialAuthProps {
  onGoogleClick?: () => void;
  isLoading?: boolean;
  showDivider?: boolean;
}

export interface VerificationSentProps {
  email: string;
  onResend?: () => void;
  isResending?: boolean;
  onBackToLogin?: () => void;
}