// src/hooks/useCredits.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useUserCredits = () => {
  const { user, isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['user-credits', user?.id],
    queryFn: async () => {
      const response = await authAPI.getUserCredits();
      return response.data.data;
    },
    enabled: isAuthenticated && !!user,
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Don't cache the data
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useRefreshCredits = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return async () => {
    // Invalidate and refetch credits
    await queryClient.invalidateQueries(['user-credits', user?.id]);
    await queryClient.refetchQueries(['user-credits', user?.id]);
    
    console.log('Credits refreshed via hook');
  };
};