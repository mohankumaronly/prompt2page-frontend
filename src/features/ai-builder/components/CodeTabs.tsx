import React from 'react';
import { useFileSelection } from '../hooks/useFileSelection';
import type { GeneratedFile } from '../types/builder.types';

interface CodeTabsProps {
  onTabChange?: (file: GeneratedFile) => void;
}

export const CodeTabs: React.FC<CodeTabsProps> = ({ onTabChange }) => {
  const { files, selectedFileName, selectFileByName, hasFiles } = useFileSelection();

  if (!hasFiles) {
    return null;
  }

  const getFileIcon = (fileName: string) => {
    if (fileName.includes('html')) return '🌐';
    if (fileName.includes('css')) return '🎨';
    if (fileName.includes('js')) return '📜';
    return '📄';
  };

  const getFileColor = (fileName: string, isValid: boolean) => {
    if (!isValid) return 'border-red-300 bg-red-50 text-red-700';
    if (selectedFileName === fileName) return 'border-blue-500 bg-blue-50 text-blue-700';
    return 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100';
  };

  const handleTabClick = (file: GeneratedFile) => {
    selectFileByName(file.fileName);
    onTabChange?.(file);
  };

  return (
    <div className="border-b border-gray-200">
      <nav className="flex gap-1 overflow-x-auto" aria-label="File tabs">
        {files.map((file) => (
          <button
            key={file.fileName}
            onClick={() => handleTabClick(file)}
            className={`
              flex items-center gap-2 px-4 py-2.5 text-sm font-medium
              border-b-2 transition-all whitespace-nowrap
              ${selectedFileName === file.fileName
                ? 'border-blue-500 text-blue-700 bg-blue-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
              }
            `}
          >
            <span>{getFileIcon(file.fileName)}</span>
            <span>{file.fileName}</span>
            {!file.isValid && (
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
            {file.isValid && (
              <span className="w-2 h-2 bg-green-500 rounded-full" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};