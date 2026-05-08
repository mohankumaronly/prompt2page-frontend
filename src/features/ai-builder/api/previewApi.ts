import { aiBuilderApiClient } from '../../../services/apiClient';
import type { PreviewRequest, PreviewResponse } from '../types/builder.types';

const BASE_URL = '/api';

export const previewApi = {
  // Generate preview HTML from HTML/CSS/JS (backend version)
  generatePreview: async (request: PreviewRequest): Promise<PreviewResponse> => {
    const response = await aiBuilderApiClient.post<PreviewResponse>(
      `${BASE_URL}/preview`,
      request
    );
    return response.data;
  },
};

// For client-side preview (no backend call needed)
export const generateClientPreview = (html: string, css: string, js: string): string => {
  let previewHtml = html;
  
  if (css && css.trim()) {
    const styleTag = `<style>\n${css}\n</style>`;
    if (previewHtml.includes('</head>')) {
      previewHtml = previewHtml.replace('</head>', `${styleTag}\n</head>`);
    } else {
      previewHtml = `<!DOCTYPE html>\n<html>\n<head>\n${styleTag}\n</head>\n<body>\n${previewHtml}\n</body>\n</html>`;
    }
  }
  
  if (js && js.trim()) {
    const scriptTag = `<script>\n${js}\n</script>`;
    if (previewHtml.includes('</body>')) {
      previewHtml = previewHtml.replace('</body>', `${scriptTag}\n</body>`);
    } else {
      previewHtml = previewHtml + `\n${scriptTag}`;
    }
  }
  
  return previewHtml;
};