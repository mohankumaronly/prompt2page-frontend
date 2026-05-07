// src/features/auth/pages/OAuth2Callback.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../api/authApi';
import { useToast } from '../../../hooks/useToast';
import Loader from '../../../components/ui/Loader';

export const OAuth2Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth, setLoading } = useAuthStore();
  const { showToast } = useToast();
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...');

  useEffect(() => {
    const handleCallback = async () => {
      const success = searchParams.get('success');
      const error = searchParams.get('error');
      const code = searchParams.get('code');
      const scope = searchParams.get('scope');

      // ✅ Log everything for debugging
      console.log('=========================================');
      console.log('🔐 OAuth2 Callback - Full URL:', window.location.href);
      console.log('🔐 OAuth2 Callback - Search Params:', {
        success,
        error,
        code: code ? `${code.substring(0, 20)}...` : 'null',
        scope,
        allParams: Object.fromEntries(searchParams.entries())
      });
      console.log('🔐 Document Cookies:', document.cookie);
      console.log('🔐 LocalStorage:', {
        accessToken: localStorage.getItem('accessToken') ? 'Present' : 'Missing',
        hasLoggedInBefore: localStorage.getItem('hasLoggedInBefore')
      });
      console.log('=========================================');

      setDebugInfo('Checking callback parameters...');

      if (error) {
        console.error('❌ OAuth error parameter present:', error);
        setDebugInfo(`Error: ${error}`);
        showToast('Google login failed. Please try again.', 'error');
        setTimeout(() => navigate('/auth/login'), 2000);
        return;
      }

      if (success === 'true' || code) {
        setDebugInfo('Success parameter detected, fetching user...');
        console.log('✅ Success parameter detected, fetching user data...');
        
        try {
          console.log('📡 Calling /api/auth/me...');
          const response = await authApi.getCurrentUser();
          console.log('✅ Full response:', response);
          console.log('✅ User data received:', response.data.user);
          
          setDebugInfo(`User found: ${response.data.user.email}`);
          setAuth(response.data.user);
          showToast('Google login successful!', 'success');
          
          console.log('🚀 Navigating to dashboard...');
          setDebugInfo('Redirecting to dashboard...');
          setTimeout(() => navigate('/dashboard'), 500);
        } catch (err: any) {
          console.error('❌ Failed to fetch user after OAuth:', err);
          console.error('❌ Error response:', err.response?.data);
          console.error('❌ Error status:', err.response?.status);
          console.error('❌ Error message:', err.message);
          
          setDebugInfo(`API Error: ${err.response?.status} - ${err.response?.data?.message || err.message}`);
          showToast('Login failed. Please try again.', 'error');
          setTimeout(() => navigate('/auth/login'), 2000);
        }
      } else {
        console.warn('⚠️ No success parameter or code found');
        setDebugInfo('No success parameter, redirecting to login');
        showToast('Google login incomplete. Please try again.', 'warning');
        setTimeout(() => navigate('/auth/login'), 2000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, setAuth, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader size="lg" text="Completing Google login..." />
        <p className="mt-4 text-sm text-gray-500">{debugInfo}</p>
      </div>
    </div>
  );
};