import React, { useRef, useEffect } from 'react';
import { useBuilderStore } from '../stores/builderStore';
import { useGenerateProject } from '../hooks/useGenerateProject';

export const ChatPanel: React.FC = () => {
  const { prompt, setPrompt, isGenerating, conversationHistory, addToConversation, clearConversation } = useBuilderStore();
  const { generateProject } = useGenerateProject();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [prompt]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    // Add user message to conversation
    addToConversation({ role: 'user', content: prompt });
    
    try {
      const response = await generateProject();
      
      // Add AI response to conversation
      if (response && response.files && response.files.length > 0) {
        const fileNames = response.files.map((f: { fileName: string }) => f.fileName).join(', ');
        const aiMessage = `I've generated a complete website with ${response.fileCount} files: ${fileNames}. ${response.allFilesValid ? 'All files are valid!' : `${response.invalidFileCount} file(s) need repair.`}`;
        addToConversation({ role: 'assistant', content: aiMessage });
      }
    } catch (error) {
      console.error('Generation error:', error);
      addToConversation({ role: 'assistant', content: 'Sorry, I encountered an error while generating your website. Please try again.' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900">AI Assistant</h3>
        </div>
        <button
          onClick={clearConversation}
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          title="Clear conversation"
        >
          Clear
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {conversationHistory.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 mb-2">Start a conversation</p>
            <p className="text-xs text-gray-400">Describe what you want to build</p>
          </div>
        ) : (
          conversationHistory.map((msg: { role: string; content: string; timestamp: string }, idx: number) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap break-words">
                  {msg.content}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4 bg-gray-50">
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to build..."
            disabled={isGenerating}
            rows={1}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
              ${!prompt.trim() || isGenerating
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Send
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};