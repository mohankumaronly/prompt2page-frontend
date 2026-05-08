// Generated file from AI response
export interface GeneratedFile {
  fileName: string;      // e.g., "index.html", "style.css", "script.js"
  content: string;       // Actual file content
  fileType: string;      // "html", "css", "js"
  isValid: boolean;      // Passed validation?
  repairable: boolean;   // Can be repaired by AI?
  errors: string[];      // List of validation errors
  warnings: string[];    // List of warnings (non-critical)
}

// Request to generate a new project
export interface GenerateRequest {
  prompt: string;
  model?: string;        // Optional, defaults to qwen/qwen3-32b
  maxTokens?: number;    // Optional, defaults to 4096
  temperature?: number;  // Optional, defaults to 0.7
}

// Response from generate endpoint
export interface GenerateResponse {
  files: GeneratedFile[];
  responseId: string;
  model: string;
  totalTokensUsed: number;
  generatedAt: string;    // ISO datetime string
  processingTimeMs: number;
  fileCount: number;
  allFilesValid: boolean;
  validFileCount: number;
  invalidFileCount: number;
  repairableFileCount: number;
}

// Request to repair a single file
export interface RepairRequest {
  fileName: string;
  content: string;
  fileType: string;
  errors: string[];
  model?: string;
}

// Response from repair endpoint
export interface RepairResponse {
  fileName: string;
  originalContent: string;
  repairedContent: string;
  fileType: string;
  isRepaired: boolean;
  remainingErrors: string[];
  responseId: string;
  processingTimeMs: number;
  repairedAt: string;
}

// Preview request (merge HTML/CSS/JS)
export interface PreviewRequest {
  html: string;
  css: string;
  js: string;
}

// Preview response
export interface PreviewResponse {
  previewHtml: string;
}

// Builder state for Zustand store
export interface BuilderState {
  // State
  prompt: string;
  isGenerating: boolean;
  isRepairing: boolean;
  generatedFiles: GeneratedFile[];
  selectedFile: GeneratedFile | null;
  selectedFileContent: string;
  selectedFileName: string;
  responseId: string | null;
  lastGenerationTime: number | null;
  tokensUsed: number | null;
  allFilesValid: boolean;
  
  // Actions
  setPrompt: (prompt: string) => void;
  setGeneratedFiles: (files: GeneratedFile[]) => void;
  setSelectedFile: (file: GeneratedFile | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setIsRepairing: (isRepairing: boolean) => void;
  setResponseMetadata: (responseId: string, tokensUsed: number, processingTime: number) => void;
  reset: () => void;
  updateFileContent: (fileName: string, newContent: string) => void;
  updateFileValidation: (fileName: string, isValid: boolean, errors: string[]) => void;

  // NEW UI state fields
  isCodeVisible: boolean;
  isChatVisible: boolean;
  conversationHistory: ConversationMessage[];
  
  // NEW UI actions
  toggleCodeVisibility: () => void;
  toggleChatVisibility: () => void;
  setCodeVisible: (visible: boolean) => void;
  setChatVisible: (visible: boolean) => void;
  addToConversation: (message: { role: 'user' | 'assistant'; content: string }) => void;
  clearConversation: () => void;
}

// NEW type for conversation messages
export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Preview state for iframe
export interface PreviewState {
  html: string;
  css: string;
  js: string;
  isPreviewVisible: boolean;
  previewError: string | null;
  
  setHtml: (html: string) => void;
  setCss: (css: string) => void;
  setJs: (js: string) => void;
  setPreviewVisible: (visible: boolean) => void;
  setPreviewError: (error: string | null) => void;
  reset: () => void;
}

// Loading states
export type LoadingState = 'idle' | 'generating' | 'repairing' | 'downloading';

// File tabs for code viewer
export interface FileTab {
  fileName: string;
  fileType: string;
  isValid: boolean;
  content: string;
}