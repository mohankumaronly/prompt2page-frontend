// src/features/auth/api/authApi.ts
import apiClient from '../../../services/apiClient';
import type {
    RegisterRequest,
    LoginRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
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
  
  // Login (email + password) - first time login
  login: (data: LoginRequest) => 
    apiClient.post<LoginResponse>('/api/auth/login', data),
  
  // ✅ Initiate OTP - Backend expects email and password
  initiateOtp: (data: { email: string; password: string }) => 
    apiClient.post<InitiateOtpResponse>('/api/auth/login/initiate', data),
  
  // ✅ Verify OTP - Backend expects sessionId and otpCode
  verifyOtp: (data: { sessionId: string; otpCode: string }) => 
    apiClient.post<VerifyOtpResponse>('/api/auth/login/verify', data),
  
  // Refresh access token
  refreshToken: () => 
    apiClient.post<{ message: string }>('/api/auth/refresh'),
  
  // Logout
  logout: () => 
    apiClient.post<{ message: string }>('/api/auth/logout'),
  
  // Forgot password
  forgotPassword: (data: ForgotPasswordRequest) => 
    apiClient.post<{ message: string }>('/api/auth/forgot-password', data),
  
  // Reset password
  resetPassword: (data: ResetPasswordRequest) => 
    apiClient.post<{ message: string }>('/api/auth/reset-password', data),
  
  // Get current user
  getCurrentUser: () => 
    apiClient.get<GetCurrentUserResponse>('/api/auth/me'),
  
  // Verify email
  verifyEmail: (token: string) => 
    apiClient.post<{ message: string }>(`/api/auth/verify-email?token=${token}`),
  
  // Resend verification
  resendVerification: (email: string) => 
    apiClient.post<{ message: string }>('/api/auth/resend-verification', { email }),
  
  // Google OAuth URL
  getGoogleAuthUrl: () => 
    apiClient.get<{ url: string }>('/api/auth/google/url'),
};