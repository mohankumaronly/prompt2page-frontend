import React from 'react';
import { useFileSelection } from '../hooks/useFileSelection';
import type { GeneratedFile } from '../types/builder.types';

interface FileExplorerProps {
  onFileSelect?: (file: GeneratedFile) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect }) => {
  const { files, selectedFileName, selectFileByName, hasFiles } = useFileSelection();

  if (!hasFiles) {
    return (
      <div className="p-4 text-center text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <p className="text-sm">No files generated yet</p>
        <p className="text-xs mt-1">Enter a prompt and click Generate</p>
      </div>
    );
  }

  const getFileIcon = (fileName: string) => {
    if (fileName.includes('html')) return '🌐';
    if (fileName.includes('css')) return '🎨';
    if (fileName.includes('js')) return '📜';
    return '📄';
  };

  const getFileSize = (content: string) => {
    const bytes = new Blob([content]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileClick = (file: GeneratedFile) => {
    selectFileByName(file.fileName);
    onFileSelect?.(file);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="bg-gray-50 px-4 py-2 border-b">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          Generated Files
        </h3>
      </div>
      <div className="divide-y">
        {files.map((file) => (
          <button
            key={file.fileName}
            onClick={() => handleFileClick(file)}
            className={`
              w-full text-left px-4 py-3 transition-all duration-150
              hover:bg-gray-50 focus:outline-none focus:bg-gray-50
              ${selectedFileName === file.fileName ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{getFileIcon(file.fileName)}</span>
                <div>
                  <p className={`text-sm font-medium ${selectedFileName === file.fileName ? 'text-blue-700' : 'text-gray-900'}`}>
                    {file.fileName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getFileSize(file.content)} • {file.fileType.toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!file.isValid && (
                  <span className="text-xs text-red-500 font-medium">
                    {file.errors.length} error{file.errors.length !== 1 ? 's' : ''}
                  </span>
                )}
                <div className={`w-2 h-2 rounded-full ${file.isValid ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
            </div>
            
            {!file.isValid && file.errors.length > 0 && selectedFileName === file.fileName && (
              <div className="mt-2 text-xs text-red-600 bg-red-50 rounded p-2">
                {file.errors.slice(0, 2).map((error, idx) => (
                  <div key={idx} className="truncate">• {error}</div>
                ))}
                {file.errors.length > 2 && (
                  <div className="text-red-400 mt-1">+{file.errors.length - 2} more</div>
                )}
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Summary footer */}
      <div className="bg-gray-50 px-4 py-2 border-t text-xs text-gray-600">
        <div className="flex justify-between">
          <span>Total: {files.length} files</span>
          <span className="flex gap-3">
            <span className="text-green-600">✓ {files.filter(f => f.isValid).length} valid</span>
            <span className="text-red-600">✗ {files.filter(f => !f.isValid).length} invalid</span>
          </span>
        </div>
      </div>
    </div>
  );
};