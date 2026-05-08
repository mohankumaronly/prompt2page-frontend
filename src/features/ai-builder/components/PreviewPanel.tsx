import React, { useState } from 'react';
import { PreviewFrame } from './PreviewFrame';
import { useBuilderStore } from '../stores/builderStore';

interface PreviewPanelProps {
  onFullscreen?: () => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ onFullscreen }) => {
  const { generatedFiles, isGenerating } = useBuilderStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const hasFiles = generatedFiles.length > 0;
  const htmlFile = generatedFiles.find(f => f.fileType === 'html');
  const hasContent = hasFiles && htmlFile && htmlFile.content.trim().length > 0;

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Force refresh the iframe by toggling key
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (onFullscreen) {
      onFullscreen();
    }
  };

  return (
    <div className={`flex flex-col bg-white rounded-lg shadow-sm overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-full'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900">Live Preview</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Device size indicator */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <button className="p-1 hover:bg-gray-200 rounded" title="Desktop">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="p-1 hover:bg-gray-200 rounded" title="Tablet">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="p-1 hover:bg-gray-200 rounded" title="Mobile">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          
          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Refresh preview"
          >
            <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          {/* Fullscreen button */}
          <button
            onClick={handleFullscreen}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 min-h-0">
        {isGenerating ? (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center">
              <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm text-gray-500">Generating preview...</p>
            </div>
          </div>
        ) : !hasContent ? (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-500">No preview available</p>
              <p className="text-xs text-gray-400 mt-1">Generate a project to see live preview</p>
            </div>
          </div>
        ) : (
          <PreviewFrame key={isRefreshing ? 'refresh' : 'preview'} />
        )}
      </div>

      {/* Status Bar */}
      {hasContent && (
        <div className="px-4 py-2 border-t bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Live preview</span>
            </span>
            <span className="w-px h-3 bg-gray-300"></span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>Responsive</span>
            </span>
          </div>
          <div>
            {generatedFiles.length} files generated
          </div>
        </div>
      )}
    </div>
  );
};