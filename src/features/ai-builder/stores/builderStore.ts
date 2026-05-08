import { create } from 'zustand';
import type { BuilderState, GeneratedFile } from '../types/builder.types';

const initialState = {
  prompt: '',
  isGenerating: false,
  isRepairing: false,
  generatedFiles: [],
  selectedFile: null,
  selectedFileContent: '',
  selectedFileName: '',
  responseId: null,
  lastGenerationTime: null,
  tokensUsed: null,
  allFilesValid: false,
  // NEW UI states
  isCodeVisible: true,      // Code panel visibility (default: visible)
  isChatVisible: true,      // Chat panel visibility (default: visible)
  conversationHistory: [],  // Store chat history
};

export const useBuilderStore = create<BuilderState>((set, get) => ({
  ...initialState,

  setPrompt: (prompt: string) => set({ prompt }),

  setGeneratedFiles: (files: GeneratedFile[]) => {
    const selectedFile = files.length > 0 ? files[0] : null;
    
    set({
      generatedFiles: files,
      selectedFile: selectedFile,
      selectedFileContent: selectedFile?.content || '',
      selectedFileName: selectedFile?.fileName || '',
      allFilesValid: files.every(f => f.isValid),
    });
  },

  setSelectedFile: (file: GeneratedFile | null) => {
    set({
      selectedFile: file,
      selectedFileContent: file?.content || '',
      selectedFileName: file?.fileName || '',
    });
  },

  setIsGenerating: (isGenerating: boolean) => set({ isGenerating }),

  setIsRepairing: (isRepairing: boolean) => set({ isRepairing }),

  setResponseMetadata: (responseId: string, tokensUsed: number, processingTime: number) => {
    set({
      responseId,
      tokensUsed,
      lastGenerationTime: processingTime,
    });
  },

  reset: () => set(initialState),

  updateFileContent: (fileName: string, newContent: string) => {
    const { generatedFiles, selectedFile } = get();
    
    const updatedFiles = generatedFiles.map(file =>
      file.fileName === fileName
        ? { ...file, content: newContent }
        : file
    );
    
    set({ generatedFiles: updatedFiles });
    
    if (selectedFile?.fileName === fileName) {
      set({
        selectedFileContent: newContent,
        selectedFile: { ...selectedFile, content: newContent },
      });
    }
  },

  updateFileValidation: (fileName: string, isValid: boolean, errors: string[]) => {
    const { generatedFiles } = get();
    
    const updatedFiles = generatedFiles.map(file =>
      file.fileName === fileName
        ? { ...file, isValid, errors }
        : file
    );
    
    set({
      generatedFiles: updatedFiles,
      allFilesValid: updatedFiles.every(f => f.isValid),
    });
  },

  // NEW UI actions
  toggleCodeVisibility: () => set((state) => ({ isCodeVisible: !state.isCodeVisible })),
  
  toggleChatVisibility: () => set((state) => ({ isChatVisible: !state.isChatVisible })),
  
  setCodeVisible: (visible: boolean) => set({ isCodeVisible: visible }),
  
  setChatVisible: (visible: boolean) => set({ isChatVisible: visible }),
  
  addToConversation: (message: { role: 'user' | 'assistant', content: string }) => {
    set((state) => ({
      conversationHistory: [...state.conversationHistory, { ...message, timestamp: new Date().toISOString() }]
    }));
  },
  
  clearConversation: () => set({ conversationHistory: [] }),
}));