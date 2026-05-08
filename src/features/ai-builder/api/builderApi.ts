import { aiBuilderApiClient } from '../../../services/apiClient';
import type { GenerateRequest, GenerateResponse, RepairRequest, RepairResponse } from '../types/builder.types';

const BASE_URL = '/api';

export const builderApi = {
  // Generate project from prompt
  generateProject: async (request: GenerateRequest): Promise<GenerateResponse> => {
    const response = await aiBuilderApiClient.post<GenerateResponse>(
      `${BASE_URL}/generate`,
      request
    );
    return response.data;
  },

  // Repair a broken file
  repairFile: async (request: RepairRequest): Promise<RepairResponse> => {
    const response = await aiBuilderApiClient.post<RepairResponse>(
      `${BASE_URL}/repair`,
      request
    );
    return response.data;
  },

  // Health check for AI builder
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await aiBuilderApiClient.get(`${BASE_URL}/health`);
    return response.data;
  },
};