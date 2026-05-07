import { Routes, Route } from 'react-router-dom';
import ForgotPassword from '../features/auth/pages/ForgotPassword';
import ResetPassword from '../features/auth/pages/ResetPassword';
import { VerifyEmailPending } from '../features/auth/pages/VerifyEmailPending';
import { Register } from '../features/auth/pages/Register';
import { VerifyEmail } from '../features/auth/pages/VerifyEmail';
import { Login } from '../features/auth/pages/Login';
import { LoginOtp } from '../features/auth/pages/LoginOtp';
import { OAuth2Callback } from '../features/auth/pages/OAuth2Callback';

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="login-otp" element={<LoginOtp />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="verify-email" element={<VerifyEmail />} />
      <Route path="verify-email-pending" element={<VerifyEmailPending />} />
       <Route path="oauth2/callback" element={<OAuth2Callback />} />
    </Routes>
  );
};