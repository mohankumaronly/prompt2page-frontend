import React, { useState } from 'react';
import { useBuilderStore } from '../stores/builderStore';
import { PromptInput } from '../components/PromptInput';
import { GenerateButton } from '../components/GenerateButton';
import { PreviewFrame } from '../components/PreviewFrame';
import { CodeTabs } from '../components/CodeTabs';
import { FileExplorer } from '../components/FileExplorer';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { ValidationBadge } from '../components/ValidationBadge';
import { useFileSelection } from '../hooks/useFileSelection';

export const BuilderPage: React.FC = () => {
  const { isGenerating, generatedFiles, allFilesValid } = useBuilderStore();
  const { selectedFile } = useFileSelection();
  const [error, setError] = useState<string | null>(null);
  const [showValidationDetails, setShowValidationDetails] = useState(false);

  const handleRetry = () => {
    setError(null);
    // Trigger generation again via the generate button
  };

  const handleDismissError = () => {
    setError(null);
  };

  const hasFiles = generatedFiles.length > 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isGenerating} />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Prompt2Page</h1>
                <p className="text-xs text-gray-500">AI Website Builder</p>
              </div>
            </div>
            
            {hasFiles && (
              <div className="flex items-center gap-3">
                {allFilesValid ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    ✓ All files valid
                  </span>
                ) : (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                    ⚠ Some files need repair
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Display */}
        <ErrorDisplay 
          error={error} 
          onDismiss={handleDismissError}
          onRetry={handleRetry}
        />

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="max-w-3xl mx-auto">
            <PromptInput />
            <div className="mt-4">
              <GenerateButton />
            </div>
          </div>
        </div>

        {/* Results Section - Only show when files exist */}
        {hasFiles && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - File Explorer */}
            <div className="lg:col-span-1">
              <FileExplorer />
            </div>

            {/* Right Content - Preview and Code */}
            <div className="lg:col-span-3 space-y-6">
              {/* Preview Section */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <h3 className="text-sm font-medium text-gray-700">Live Preview</h3>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => window.location.reload()}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Refresh
                    </button>
                    <button 
                      onClick={() => setShowValidationDetails(!showValidationDetails)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      {showValidationDetails ? 'Hide' : 'Show'} Validations
                    </button>
                  </div>
                </div>
                <div className="h-96">
                  <PreviewFrame />
                </div>
              </div>

              {/* Code Section */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <CodeTabs />
                
                {selectedFile && showValidationDetails && (
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <ValidationBadge 
                      file={selectedFile} 
                      showErrors={true}
                      size="sm"
                    />
                  </div>
                )}
                
                <div className="relative">
                  <pre className="p-4 overflow-x-auto text-sm font-mono bg-gray-900 text-gray-100">
                    <code className="block whitespace-pre-wrap break-words">
                      {selectedFile?.content || '// Select a file to view code'}
                    </code>
                  </pre>
                  
                  {/* Copy button */}
                  {selectedFile && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedFile.content);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                      title="Copy to clipboard"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasFiles && !isGenerating && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No project generated yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Describe what you want to build in the prompt above and click Generate to see your AI-powered website come to life.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};