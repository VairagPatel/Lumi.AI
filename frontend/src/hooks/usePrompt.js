// src/hooks/usePrompt.js
import { useQuery } from '@tanstack/react-query';
import { promptAPI } from '../services/api';

export const usePromptSuggestion = () => {
  return useQuery({
    queryKey: ['prompt-suggestion'],
    queryFn: async () => {
      try {
        const response = await promptAPI.getSuggestion();
        return response.data.data;
      } catch (error) {
        console.error('Prompt suggestion error:', error);
        // Return a fallback prompt instead of throwing
        const fallbacks = [
          "A serene Japanese garden with cherry blossoms",
          "A magical forest with glowing mushrooms",
          "A cozy cottage on a hillside at sunset",
          "A floating castle in the clouds",
          "A peaceful village with traditional lanterns"
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once
  });
};
