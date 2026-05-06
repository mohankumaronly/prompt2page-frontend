// src/features/auth/components/AuthCard.tsx
import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthCard: React.FC<AuthCardProps> = ({ children, title, subtitle }) => {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Mobile logo */}
        <div className="text-center mb-8 lg:hidden">
          <h2 className="text-3xl font-bold text-brand-600">Prompt2Page</h2>
          <p className="mt-2 text-gray-600">{subtitle}</p>
        </div>

        {/* Desktop title */}
        <div className="hidden lg:block text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mt-2 text-gray-600">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthCard;