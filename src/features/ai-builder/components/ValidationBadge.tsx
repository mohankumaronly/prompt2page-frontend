import React from 'react';
import type { GeneratedFile } from '../types/builder.types';

interface ValidationBadgeProps {
  file: GeneratedFile;
  showErrors?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ValidationBadge: React.FC<ValidationBadgeProps> = ({ 
  file, 
  showErrors = false,
  size = 'md'
}) => {
  const { isValid, errors, warnings, fileName } = file;
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const getStatusIcon = () => {
    if (isValid) {
      return (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  };

  const getStatusText = () => {
    if (isValid) return 'Valid';
    return `${errors.length} Error${errors.length !== 1 ? 's' : ''}`;
  };

  const getStatusColor = () => {
    if (isValid) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="space-y-2">
      <div className={`inline-flex items-center gap-1.5 rounded-full border ${getStatusColor()} ${sizeClasses[size]}`}>
        {getStatusIcon()}
        <span className="font-medium">{getStatusText()}</span>
      </div>
      
      {showErrors && !isValid && errors.length > 0 && (
        <div className="mt-2 text-sm text-red-600 space-y-1">
          {errors.slice(0, 3).map((error, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-red-400">•</span>
              <span className="break-words">{error}</span>
            </div>
          ))}
          {errors.length > 3 && (
            <div className="text-red-400 text-xs">
              +{errors.length - 3} more errors
            </div>
          )}
        </div>
      )}
      
      {showErrors && isValid && warnings.length > 0 && (
        <div className="mt-2 text-sm text-yellow-600 space-y-1">
          {warnings.slice(0, 2).map((warning, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-yellow-400">⚠</span>
              <span className="break-words">{warning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};