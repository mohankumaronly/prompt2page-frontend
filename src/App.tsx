// src/App.tsx
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './hooks/useToast';
import { AppRoutes } from './routes/AppRoutes';
import { useCurrentUser } from './features/auth/hooks/useCurrentUser';
import  Loader  from './components/ui/Loader';
import { useAuthStore } from './features/auth/stores/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const AuthInitializer = () => {
  const { isLoading, isAuthenticated, user } = useAuthStore();
  const query = useCurrentUser();

  console.log('🚀 AuthInitializer Render:', { isLoading, isAuthenticated, user, queryStatus: query.status });

  if (isLoading) {
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