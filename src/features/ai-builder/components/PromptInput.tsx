import React from 'react';
import { useBuilderStore } from '../stores/builderStore';

interface PromptInputProps {
  placeholder?: string;
  disabled?: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ 
  placeholder = "Describe the website or app you want to create...",
  disabled = false 
}) => {
  const { prompt, setPrompt, isGenerating } = useBuilderStore();
  const isDisabled = disabled || isGenerating;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        What do you want to build?
      </label>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={placeholder}
        disabled={isDisabled}
        rows={4}
        className={`
          w-full px-4 py-3 rounded-lg border 
          focus:outline-none focus:ring-2 focus:ring-blue-500 
          transition-colors resize-none
          ${isDisabled 
            ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-white border-gray-300 focus:border-blue-500'
          }
        `}
      />
      <div className="mt-2 text-sm text-gray-500 flex justify-between">
        <span>Example: "Create a calculator app" or "Build a todo list with local storage"</span>
        <span className={`${prompt.length > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
          {prompt.length} characters
        </span>
      </div>
    </div>
  );
};