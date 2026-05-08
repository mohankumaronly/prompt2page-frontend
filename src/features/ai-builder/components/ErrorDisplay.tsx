import React from 'react';

interface ErrorDisplayProps {
  error: string | null;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  onDismiss, 
  onRetry 
}) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        {/* Error icon */}
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        {/* Error content */}
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-red-800 mb-1">
            Something went wrong
          </h4>
          <p className="text-sm text-red-700 break-words">
            {error}
          </p>
          
          {/* Suggestions based on error type */}
          {error.includes('API') && (
            <p className="text-xs text-red-600 mt-2">
              💡 Make sure your backend server is running on port 8080
            </p>
          )}
          {error.includes('network') && (
            <p className="text-xs text-red-600 mt-2">
              💡 Check your internet connection and try again
          </p>
          )}
          {error.includes('timeout') && (
            <p className="text-xs text-red-600 mt-2">
              💡 The request took too long. Try a simpler prompt
            </p>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex-shrink-0 flex gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-sm text-red-700 hover:text-red-900 font-medium"
            >
              Retry
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
};