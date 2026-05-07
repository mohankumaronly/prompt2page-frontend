// src/features/auth/hooks/useLogout.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import { useToast } from '../../../hooks/useToast';

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear();
      showToast('Logged out successfully', 'success');
      navigate('/auth/login');
    },
    onError: () => {
      // Still logout locally even if API fails
      logout();
      queryClient.clear();
      showToast('Logged out', 'info');
      navigate('/auth/login');
    },
  });
};