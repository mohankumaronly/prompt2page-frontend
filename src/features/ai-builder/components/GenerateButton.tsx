import React from 'react';
import { useGenerateProject } from '../hooks/useGenerateProject';
import { useBuilderStore } from '../stores/builderStore';

interface GenerateButtonProps {
  className?: string;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({ className = '' }) => {
  const { generateProject, isGenerating } = useGenerateProject();
  const { prompt, isRepairing } = useBuilderStore();
  
  const isValidPrompt = prompt.trim().length >= 3;
  const isLoading = isGenerating || isRepairing;

  const handleGenerate = async () => {
    if (!isValidPrompt || isLoading) return;
    
    try {
      await generateProject();
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={!isValidPrompt || isLoading}
      className={`
        w-full py-3 px-6 rounded-lg font-semibold
        transition-all duration-200
        flex items-center justify-center gap-2
        ${isValidPrompt && !isLoading
          ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-md hover:shadow-lg'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }
        ${className}
      `}
    >
      {isGenerating ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Generate Website
        </>
      )}
    </button>
  );
};