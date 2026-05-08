import { useCallback } from 'react';
import { useBuilderStore } from '../stores/builderStore';
import type { GeneratedFile } from '../types/builder.types';

export const useFileSelection = () => {
  const {
    generatedFiles,
    selectedFile,
    selectedFileContent,
    selectedFileName,
    setSelectedFile,
  } = useBuilderStore();

  const selectFile = useCallback((file: GeneratedFile) => {
    setSelectedFile(file);
  }, [setSelectedFile]);

  const selectFileByName = useCallback((fileName: string) => {
    const file = generatedFiles.find(f => f.fileName === fileName);
    if (file) {
      setSelectedFile(file);
    }
  }, [generatedFiles, setSelectedFile]);

  const selectNextFile = useCallback(() => {
    if (generatedFiles.length === 0) return;
    
    const currentIndex = generatedFiles.findIndex(f => f.fileName === selectedFileName);
    const nextIndex = (currentIndex + 1) % generatedFiles.length;
    setSelectedFile(generatedFiles[nextIndex]);
  }, [generatedFiles, selectedFileName, setSelectedFile]);

  const selectPreviousFile = useCallback(() => {
    if (generatedFiles.length === 0) return;
    
    const currentIndex = generatedFiles.findIndex(f => f.fileName === selectedFileName);
    const prevIndex = (currentIndex - 1 + generatedFiles.length) % generatedFiles.length;
    setSelectedFile(generatedFiles[prevIndex]);
  }, [generatedFiles, selectedFileName, setSelectedFile]);

  const hasFiles = generatedFiles.length > 0;
  const currentFileIndex = generatedFiles.findIndex(f => f.fileName === selectedFileName);

  return {
    files: generatedFiles,
    selectedFile,
    selectedFileContent,
    selectedFileName,
    currentFileIndex,
    totalFiles: generatedFiles.length,
    hasFiles,
    selectFile,
    selectFileByName,
    selectNextFile,
    selectPreviousFile,
  };
};