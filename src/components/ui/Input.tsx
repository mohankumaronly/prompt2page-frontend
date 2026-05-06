// src/components/ui/Input.tsx
import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', showPasswordToggle, onTogglePassword, type = 'text', ...props }, ref) => {
    const [localShowPassword, setLocalShowPassword] = useState(false);
    
    // Determine if password should be visible
    const isPasswordVisible = showPasswordToggle 
      ? (onTogglePassword ? false : localShowPassword) 
      : false;
    
    const actualType = showPasswordToggle 
      ? (isPasswordVisible ? 'text' : 'password')
      : type;

    const handleToggle = () => {
      if (onTogglePassword) {
        onTogglePassword();
      } else {
        setLocalShowPassword(!localShowPassword);
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={actualType}
            className={`
              w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent
              transition-all duration-200 outline-none
              ${error ? 'border-red-500' : 'border-gray-300'}
              ${showPasswordToggle ? 'pr-10' : ''}
              ${className}
            `}
            {...props}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={handleToggle}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {actualType === 'password' ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';