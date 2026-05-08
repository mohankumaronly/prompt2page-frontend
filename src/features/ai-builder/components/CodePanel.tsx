import React, { useState } from 'react';
import { useBuilderStore } from '../stores/builderStore';
import { useFileSelection } from '../hooks/useFileSelection';
import { CodeTabs } from './CodeTabs';
import { ValidationBadge } from './ValidationBadge';

interface CodePanelProps {
  onToggle?: () => void;
}

export const CodePanel: React.FC<CodePanelProps> = ({ onToggle }) => {
  const { isCodeVisible, toggleCodeVisibility } = useBuilderStore();
  const { selectedFile, hasFiles } = useFileSelection();
  const [showValidationDetails, setShowValidationDetails] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (selectedFile) {
      await navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggle = () => {
    toggleCodeVisibility();
    if (onToggle) onToggle();
  };

  if (!isCodeVisible) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <button
          onClick={handleToggle}
          className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between border-b"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Show Code</span>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900">Code Editor</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Validation toggle */}
          <button
            onClick={() => setShowValidationDetails(!showValidationDetails)}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors text-xs"
            title={showValidationDetails ? 'Hide validation' : 'Show validation'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          {/* Copy button */}
          {selectedFile && (
            <button
              onClick={handleCopy}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Copy code"
            >
              {copied ? (
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              )}
            </button>
          )}
          
          {/* Toggle visibility button */}
          <button
            onClick={handleToggle}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Hide code panel"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* File Tabs */}
      <CodeTabs />

      {/* Validation Details */}
      {selectedFile && showValidationDetails && (
        <div className="px-4 py-3 border-b bg-gray-50">
          <ValidationBadge file={selectedFile} showErrors={true} size="sm" />
        </div>
      )}

      {/* Code Content */}
      <div className="flex-1 min-h-0 overflow-auto">
        {!hasFiles ? (
          <div className="flex items-center justify-center h-full bg-gray-900">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <p className="text-sm text-gray-500">No code to display</p>
              <p className="text-xs text-gray-600 mt-1">Generate a project to see the code</p>
            </div>
          </div>
        ) : (
          <pre className="p-4 text-sm font-mono bg-gray-900 text-gray-100 min-h-full">
            <code className="block whitespace-pre-wrap break-words">
              {selectedFile?.content || '// Select a file to view code'}
            </code>
          </pre>
        )}
      </div>

      {/* Footer - File info */}
      {selectedFile && (
        <div className="px-4 py-2 border-t bg-gray-900 text-xs text-gray-500 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{selectedFile.fileName}</span>
            </span>
            <span className="w-px h-3 bg-gray-700"></span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              <span>{new Blob([selectedFile.content]).size} bytes</span>
            </span>
            <span className="w-px h-3 bg-gray-700"></span>
            <span className="flex items-center gap-1">
              {selectedFile.isValid ? (
                <>
                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-400">Valid</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-red-400">{selectedFile.errors.length} errors</span>
                </>
              )}
            </span>
          </div>
          <div>
            {selectedFile.fileType.toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
};