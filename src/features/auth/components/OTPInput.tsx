// src/features/auth/components/OTPInput.tsx
import React, { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  isLoading?: boolean;
  autoFocus?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  isLoading = false,
  autoFocus = true,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split the value into an array of characters
  const otpArray = value.split('').slice(0, length);
  const paddedArray = [...otpArray, ...Array(length - otpArray.length).fill('')];

  // Set ref callback function
  const setRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, newValue: string) => {
    if (isLoading) return;
    
    // Only allow digits
    if (newValue && !/^\d*$/.test(newValue)) return;
    
    const newOtpArray = [...otpArray];
    
    if (newValue.length > 0) {
      // Take only the last character (prevent multiple characters)
      newOtpArray[index] = newValue.slice(-1);
      onChange(newOtpArray.join(''));
      
      // Move to next input if available
      if (index < length - 1 && newValue.length > 0) {
        inputRefs.current[index + 1]?.focus();
        setActiveIndex(index + 1);
      }
      
      // Call onComplete if all digits are filled
      if (newOtpArray.join('').length === length - 1 && newValue.length > 0) {
        const completedValue = [...newOtpArray.slice(0, index), newValue.slice(-1)].join('');
        if (completedValue.length === length && onComplete) {
          onComplete(completedValue);
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isLoading) return;
    
    if (e.key === 'Backspace') {
      if (!otpArray[index] && index > 0) {
        // Move to previous input on backspace when current is empty
        inputRefs.current[index - 1]?.focus();
        setActiveIndex(index - 1);
      } else if (otpArray[index]) {
        // Clear current digit
        const newOtpArray = [...otpArray];
        newOtpArray[index] = '';
        onChange(newOtpArray.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (isLoading) return;
    
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted data contains only digits
    if (/^\d+$/.test(pastedData)) {
      const pastedOtp = pastedData.slice(0, length);
      onChange(pastedOtp);
      
      // Focus the last filled input or the next empty one
      const focusIndex = Math.min(pastedOtp.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
      setActiveIndex(focusIndex);
      
      // Auto submit if complete
      if (pastedOtp.length === length && onComplete) {
        onComplete(pastedOtp);
      }
    }
  };

  const handleFocus = (index: number) => {
    setActiveIndex(index);
  };

  const handleClick = (index: number) => {
    inputRefs.current[index]?.focus();
    setActiveIndex(index);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-3 justify-center">
        {paddedArray.map((digit, index) => (
          <input
            key={index}
            ref={setRef(index)}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            onClick={() => handleClick(index)}
            disabled={isLoading}
            className={`
              w-12 h-12 sm:w-14 sm:h-14 
              text-center text-xl sm:text-2xl font-semibold
              border-2 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
              transition-all duration-200
              ${activeIndex === index ? 'border-brand-500 ring-2 ring-brand-100' : 'border-gray-300'}
              ${isLoading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-900'}
            `}
          />
        ))}
      </div>
      
      {isLoading && (
        <div className="text-center text-gray-500 text-sm">
          <svg className="inline animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Verifying...
        </div>
      )}
      
      <p className="text-xs text-gray-500 text-center">
        Enter the 6-digit code sent to your email
      </p>
    </div>
  );
};