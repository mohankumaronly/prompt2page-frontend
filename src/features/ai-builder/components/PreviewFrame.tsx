import React, { useRef, useEffect, useState } from 'react';
import { useBuilderStore } from '../stores/builderStore';
import { generateClientPreview } from '../api/previewApi';

interface PreviewFrameProps {
  className?: string;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ className = '' }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { generatedFiles } = useBuilderStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract files from generated files
  const htmlFile = generatedFiles.find(f => f.fileType === 'html');
  const cssFile = generatedFiles.find(f => f.fileType === 'css');
  const jsFile = generatedFiles.find(f => f.fileType === 'js');

  const hasContent = htmlFile && htmlFile.content.trim().length > 0;

  useEffect(() => {
    if (!hasContent) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate preview HTML by injecting CSS and JS
      const previewHtml = generateClientPreview(
        htmlFile?.content || '',
        cssFile?.content || '',
        jsFile?.content || ''
      );

      // Update iframe content
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        
        if (doc) {
          doc.open();
          doc.write(previewHtml);
          doc.close();
          
          // Wait for iframe to load
          iframe.onload = () => {
            setIsLoading(false);
          };
          
          // Handle errors
          iframe.onerror = () => {
            setError('Failed to load preview');
            setIsLoading(false);
          };
        } else {
          setError('Cannot access iframe document');
          setIsLoading(false);
        }
      }
    } catch (err) {
      console.error('Preview generation error:', err);
      setError('Failed to generate preview');
      setIsLoading(false);
    }
  }, [htmlFile?.content, cssFile?.content, jsFile?.content, hasContent]);

  if (!hasContent) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium">No preview available</p>
          <p className="text-sm mt-1">Generate a project to see live preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm text-gray-600">Loading preview...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
          <div className="text-center text-red-600 p-4">
            <svg className="w-12 h-12 mx-auto mb-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{error}</p>
            <p className="text-sm mt-1">Check console for details</p>
          </div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        title="Live Preview"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
        className="w-full h-full border-0 rounded-lg bg-white"
        srcDoc="<!DOCTYPE html><html><body style='display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif'>Loading preview...</body></html>"
      />
    </div>
  );
};