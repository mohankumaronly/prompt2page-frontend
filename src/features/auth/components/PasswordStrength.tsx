// src/features/auth/components/PasswordStrength.tsx
import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const calculateStrength = (pass: string): { score: number; label: string; color: string } => {
    let score = 0;
    
    if (!pass) return { score: 0, label: '', color: 'bg-gray-200' };
    
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;
    
    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Medium', color: 'bg-yellow-500' };
    return { score: 5, label: 'Strong', color: 'bg-green-500' };
  };
  
  const { score, label, color } = calculateStrength(password);
  
  if (!password) return null;
  
  const widthPercentage = (score / 5) * 100;
  
  return (
    <div className="mt-1 space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-600">Password strength:</span>
        <span className={`font-medium ${color === 'bg-red-500' ? 'text-red-600' : color === 'bg-yellow-500' ? 'text-yellow-600' : 'text-green-600'}`}>
          {label}
        </span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300 rounded-full`}
          style={{ width: `${widthPercentage}%` }}
        />
      </div>
      {score <= 2 && (
        <p className="text-xs text-gray-500 mt-1">
          Use 8+ characters, numbers, uppercase & lowercase letters
        </p>
      )}
    </div>
  );
};