import React, { useState } from 'react';
import { useBuilderStore } from '../stores/builderStore';
import { ChatPanel } from '../components/ChatPanel';
import { PreviewPanel } from '../components/PreviewPanel';
import { CodePanel } from '../components/CodePanel';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ErrorDisplay } from '../components/ErrorDisplay';

export const BuilderPage: React.FC = () => {
  const { isGenerating, generatedFiles, allFilesValid, isCodeVisible, isChatVisible, toggleChatVisibility } = useBuilderStore();
  const [error, setError] = useState<string | null>(null);

  const hasFiles = generatedFiles.length > 0;

  const handleRetry = () => {
    setError(null);
  };

  const handleDismissError = () => {
    setError(null);
  };

  // Calculate grid columns based on visible panels
  const getGridCols = () => {
    const cols = [];
    if (isChatVisible) cols.push('1fr');
    cols.push('1.5fr');
    if (isCodeVisible) cols.push('1fr');
    
    if (cols.length === 2) return 'grid-cols-2';
    if (cols.length === 3) return 'grid-cols-3';
    return 'grid-cols-1';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isGenerating} />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Prompt2Page</h1>
                <p className="text-xs text-gray-500">AI Website Builder</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Toggle Chat Button */}
              <button
                onClick={toggleChatVisibility}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title={isChatVisible ? 'Hide chat' : 'Show chat'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="hidden sm:inline">{isChatVisible ? 'Hide Chat' : 'Show Chat'}</span>
              </button>
              
              {/* Status Badge */}
              {hasFiles && (
                <div className="flex items-center gap-2">
                  {allFilesValid ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      All Valid
                    </span>
                  ) : (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Needs Repair
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="h-[calc(100vh-64px)]">
        {/* Error Display */}
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <ErrorDisplay 
            error={error} 
            onDismiss={handleDismissError}
            onRetry={handleRetry}
          />
        </div>

        {/* 3-Column Layout */}
        <div className={`h-full grid ${getGridCols()} gap-0 p-4`}>
          {/* Chat Panel - Left */}
          {isChatVisible && (
            <div className="min-w-0 pr-2">
              <ChatPanel />
            </div>
          )}

          {/* Preview Panel - Center */}
          <div className="min-w-0 px-2">
            <PreviewPanel />
          </div>

          {/* Code Panel - Right */}
          {isCodeVisible && (
            <div className="min-w-0 pl-2">
              <CodePanel />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};