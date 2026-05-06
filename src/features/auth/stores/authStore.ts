// src/features/auth/stores/authStore.ts - Add logging
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

interface AuthActions {
  setAuth: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  clearAuth: () => void;
}

type AuthStoreType = AuthState & AuthActions;

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,  // Start with loading true
      isInitialized: false,

      setAuth: (user) => {
        console.log('🔐 setAuth called with user:', user);
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
      },

      logout: () => {
        console.log('🚪 logout called');
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        });
      },

      updateUser: (user) => {
        console.log('📝 updateUser called with:', user);
        set((state) => ({
          user: { ...state.user, ...user },
          isAuthenticated: true,
        }));
      },

      setLoading: (loading) => {
        console.log('⏳ setLoading called with:', loading);
        set({ isLoading: loading });
      },

      setInitialized: (initialized) => {
        console.log('✅ setInitialized called with:', initialized);
        set({ isInitialized: initialized });
      },

      clearAuth: () => {
        console.log('🧹 clearAuth called');
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useIsInitialized = () => useAuthStore((state) => state.isInitialized);

export const useAuthActions = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setInitialized = useAuthStore((state) => state.setInitialized);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return {
    setAuth,
    logout,
    updateUser,
    setLoading,
    setInitialized,
    clearAuth,
  };
};