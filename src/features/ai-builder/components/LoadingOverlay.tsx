import React from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = "Generating your website..." 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center">
        {/* Animated spinner */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        
        {/* Message */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {message}
        </h3>
        
        {/* Progress steps */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-5 h-5 border-2 border-blue-500 rounded-full animate-pulse"></div>
            <span>Sending request to AI...</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
            <span>Generating code...</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
            <span>Validating files...</span>
          </div>
        </div>
        
        {/* Tip */}
        <div className="mt-6 pt-4 border-t text-xs text-gray-400">
          💡 This may take 10-30 seconds depending on complexity
        </div>
      </div>
    </div>
  );
};