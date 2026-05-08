import { useCallback } from 'react';
import { useBuilderStore } from '../stores/builderStore';
import { builderApi } from '../api/builderApi';
import type { GenerateRequest } from '../types/builder.types';

export const useGenerateProject = () => {
  const {
    prompt,
    setIsGenerating,
    setGeneratedFiles,
    setResponseMetadata,
    isGenerating,
  } = useBuilderStore();

  const generateProject = useCallback(async () => {
    if (!prompt.trim()) {
      console.warn('Prompt is empty');
      return;
    }

    setIsGenerating(true);

    try {
      const request: GenerateRequest = {
        prompt: prompt.trim(),
        // Optional: add custom parameters if needed
        // model: "qwen/qwen3-32b",
        // maxTokens: 4096,
        // temperature: 0.7,
      };

      const response = await builderApi.generateProject(request);

      // Update store with generated files
      setGeneratedFiles(response.files);
      
      // Store metadata
      setResponseMetadata(
        response.responseId,
        response.totalTokensUsed,
        response.processingTimeMs
      );

      console.log('Generation complete:', {
        fileCount: response.fileCount,
        validCount: response.validFileCount,
        invalidCount: response.invalidFileCount,
        repairableCount: response.repairableFileCount,
        timeMs: response.processingTimeMs,
      });

      return response;
    } catch (error) {
      console.error('Failed to generate project:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, setIsGenerating, setGeneratedFiles, setResponseMetadata]);

  return {
    generateProject,
    isGenerating,
    hasPrompt: prompt.trim().length > 0,
  };
};