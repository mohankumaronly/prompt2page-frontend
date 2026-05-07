// src/App.tsx
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './hooks/useToast';
import { AppRoutes } from './routes/AppRoutes';
import { useCurrentUser } from './features/auth/hooks/useCurrentUser';
import Loader from './components/ui/Loader';
import { useAuthStore } from './features/auth/stores/authStore';
import { useEffect, useState } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const AuthInitializer = () => {
  const { isLoading, isAuthenticated, user, setLoading, setInitialized } = useAuthStore();
  const query = useCurrentUser();
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Force timeout after 3 seconds to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ Loading timeout reached - forcing render');
        setTimeoutReached(true);
        setLoading(false);
        setInitialized(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isLoading, setLoading, setInitialized]);

  console.log('🚀 AuthInitializer Render:', { 
    isLoading, 
    isAuthenticated, 
    user, 
    queryStatus: query.status,
    timeoutReached 
  });

  // Show loader while checking auth (with timeout fallback)
  if (isLoading && !timeoutReached) {
    console.log('⏳ Showing loader because isLoading = true');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading..." />
      </div>
    );
  }

  console.log('✅ Rendering AppRoutes');
  return <AppRoutes />;
};

function App() {
  console.log('📱 App component rendering');
  
  // Clear any stale state on app start
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log('🔑 Access token on app start:', token ? 'Present' : 'Not present');
    
    // If no token, immediately set initialized to true
    if (!token) {
      useAuthStore.getState().setInitialized(true);
      useAuthStore.getState().setLoading(false);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          <AuthInitializer />
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;