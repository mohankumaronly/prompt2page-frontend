// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthRoutes } from './AuthRoutes';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { Dashboard } from '../features/auth/pages/Dashboard';

// Temporary placeholder components
const Profile = () => (
  <div className="min-h-screen bg-gray-100 p-8">
    <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
    <p className="mt-4 text-gray-600">Manage your profile settings.</p>
  </div>
);

const Settings = () => (
  <div className="min-h-screen bg-gray-100 p-8">
    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
    <p className="mt-4 text-gray-600">Configure your application settings.</p>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-xl text-gray-600">Page not found</p>
      <a href="/auth/login" className="mt-6 inline-block text-brand-600 hover:text-brand-700">
        Go back home →
      </a>
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes - accessible to everyone */}
      <Route element={<PublicRoute />}>
        <Route path="/auth/*" element={<AuthRoutes />} />
      </Route>

      {/* Protected routes - require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Redirect root to dashboard if authenticated, else to login */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 - Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};