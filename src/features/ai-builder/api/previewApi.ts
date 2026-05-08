import apiClient from '../../../services/apiClient';
import type { PreviewRequest, PreviewResponse } from '../types/builder.types';

const BASE_URL = '/api';

export const previewApi = {
  // Generate preview HTML from HTML/CSS/JS
  generatePreview: async (request: PreviewRequest): Promise<PreviewResponse> => {
    const response = await apiClient.post<PreviewResponse>(
      `${BASE_URL}/preview`,
      request
    );
    return response.data;
  },
};

// For client-side preview (no backend call needed)
export const generateClientPreview = (html: string, css: string, js: string): string => {
  // Inject CSS and JS into HTML
  let previewHtml = html;
  
  // Inject CSS if style.css content is provided
  if (css && css.trim()) {
    const styleTag = `<style>\n${css}\n</style>`;
    
    // Insert before closing </head> tag
    if (previewHtml.includes('</head>')) {
      previewHtml = previewHtml.replace('</head>', `${styleTag}\n</head>`);
    } else {
      // If no head tag, add at the beginning
      previewHtml = `<!DOCTYPE html>\n<html>\n<head>\n${styleTag}\n</head>\n<body>\n${previewHtml}\n</body>\n</html>`;
    }
  }
  
  // Inject JS if script.js content is provided
  if (js && js.trim()) {
    const scriptTag = `<script>\n${js}\n</script>`;
    
    // Insert before closing </body> tag
    if (previewHtml.includes('</body>')) {
      previewHtml = previewHtml.replace('</body>', `${scriptTag}\n</body>`);
    } else {
      previewHtml = previewHtml + `\n${scriptTag}`;
    }
  }
  
  return previewHtml;
};