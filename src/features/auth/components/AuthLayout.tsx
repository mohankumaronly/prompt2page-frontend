// src/features/auth/components/AuthLayout.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Left side - Illustration/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <Link to="/">
              <h1 className="text-5xl font-bold mb-4 hover:text-brand-100 transition-colors">
                Prompt2Page
              </h1>
            </Link>
            <p className="text-xl text-brand-50">
              Turn your prompts into beautiful web pages
            </p>
          </div>
          
          <div className="space-y-6 text-white/90">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>AI-powered page generation</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Customizable templates</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>One-click deployment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;