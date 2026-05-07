// src/features/auth/stores/authStore.ts
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
}

type AuthStoreType = AuthState & AuthActions;

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,  // Start as true while checking
      isInitialized: false,

      setAuth: (user) => {
        console.log('🔐 setAuth called with user:', user.email);
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
      },

      logout: () => {
        console.log('🚪 logout called');
        localStorage.removeItem('accessToken');
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        });
      },

      updateUser: (user) => {
        console.log('📝 updateUser called');
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