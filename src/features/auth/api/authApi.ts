// src/features/auth/api/authApi.ts
import apiClient from '../../../services/apiClient';
import type {
    RegisterRequest,
    LoginRequest,
    InitiateOtpRequest,
    VerifyOtpRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    User,
    RegisterResponse,
    LoginResponse,
    InitiateOtpResponse,
    VerifyOtpResponse,
    GetCurrentUserResponse,
} from '../types/auth.types';

export const authApi = {
  // Register new user
  register: (data: RegisterRequest) => 
    apiClient.post<RegisterResponse>('/api/auth/register', data),
  
  // Login (email + password) - returns accessToken for first login
  login: (data: LoginRequest) => 
    apiClient.post<LoginResponse>('/api/auth/login', data),
  
  // Initiate OTP for existing users (sends code to email)
  initiateOtp: (data: InitiateOtpRequest) => 
    apiClient.post<InitiateOtpResponse>('/api/auth/login/initiate', data),
  
  // Verify OTP and complete login
  verifyOtp: (data: VerifyOtpRequest) => 
    apiClient.post<VerifyOtpResponse>('/api/auth/login/verify', data),
  
  // Refresh access token (silent refresh)
  refreshToken: () => 
    apiClient.post<{ message: string }>('/api/auth/refresh'),
  
  // Logout (clears cookie)
  logout: () => 
    apiClient.post<{ message: string }>('/api/auth/logout'),
  
  // Forgot password - send reset email
  forgotPassword: (data: ForgotPasswordRequest) => 
    apiClient.post<{ message: string }>('/api/auth/forgot-password', data),
  
  // Reset password with token
  resetPassword: (data: ResetPasswordRequest) => 
    apiClient.post<{ message: string }>('/api/auth/reset-password', data),
  
  // Get current logged-in user (checks cookie)
  getCurrentUser: () => 
    apiClient.get<GetCurrentUserResponse>('/api/auth/me'),
  
  // Verify email with token
  verifyEmail: (token: string) => 
    apiClient.post<{ message: string }>(`/api/auth/verify-email?token=${token}`),
  
  // Resend verification email
  resendVerification: (email: string) => 
    apiClient.post<{ message: string }>('/api/auth/resend-verification', { email }),
  
  // Google OAuth URL
  getGoogleAuthUrl: () => 
    apiClient.get<{ url: string }>('/api/auth/google/url'),
};