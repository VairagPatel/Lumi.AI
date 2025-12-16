// src/hooks/useGeneration.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generationAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useTextToImage = () => {
  return useMutation({
    mutationFn: generationAPI.textToImage,
    onSuccess: () => {
      toast.success('Image generated successfully!');
    },
    onError: async (error) => {
      let message = 'Generation failed';
      
      // Try to extract error message from blob response
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const json = JSON.parse(text);
          message = json.message || message;
        } catch (e) {
          // If parsing fails, use default message
        }
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
    },
  });
};

export const useImageToImage = () => {
  return useMutation({
    mutationFn: generationAPI.imageToImage,
    onSuccess: () => {
      toast.success('Image transformed successfully!');
    },
    onError: async (error) => {
      let message = 'Transformation failed';
      
      // Try to extract error message from blob response
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const json = JSON.parse(text);
          message = json.message || message;
        } catch (e) {
          // If parsing fails, use default message
        }
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
    },
  });
};

export const useGenerationHistory = (params) => {
  return useQuery({
    queryKey: ['generation-history', params],
    queryFn: () => generationAPI.getHistory(params),
    select: (response) => response.data.data,
  });
};

export const useGenerationStats = () => {
  return useQuery({
    queryKey: ['generation-stats'],
    queryFn: () => generationAPI.getStats(),
    select: (response) => response.data.data,
  });
};
