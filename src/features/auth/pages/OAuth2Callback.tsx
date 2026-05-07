// src/features/auth/pages/OAuth2Callback.tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../api/authApi';
import { useToast } from '../../../hooks/useToast';
import Loader from '../../../components/ui/Loader';

export const OAuth2Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { showToast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const success = searchParams.get('success');
      const error = searchParams.get('error');

      if (error) {
        showToast('Google login failed. Please try again.', 'error');
        navigate('/auth/login');
        return;
      }

      if (success === 'true') {
        try {
          // ✅ Fetch user data after successful OAuth
          const response = await authApi.getCurrentUser();
          console.log('✅ OAuth user data:', response.data.user);
          setAuth(response.data.user);
          showToast('Google login successful!', 'success');
          navigate('/dashboard');
        } catch (err) {
          console.error('Failed to fetch user after OAuth:', err);
          showToast('Login failed. Please try again.', 'error');
          navigate('/auth/login');
        }
      } else {
        navigate('/auth/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setAuth, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader size="lg" text="Completing Google login..." />
    </div>
  );
};  