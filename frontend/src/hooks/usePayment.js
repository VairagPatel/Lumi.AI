// src/hooks/usePayment.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: paymentAPI.createOrder,
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to create order';
      toast.error(message);
    },
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: paymentAPI.verifyPayment,
    onSuccess: () => {
      toast.success('Payment successful! Credits added to your account.');
      // Invalidate credits query to refresh balance
      queryClient.invalidateQueries(['user-credits']);
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Payment verification failed';
      toast.error(message);
    },
  });
};

export const usePaymentHistory = (params) => {
  return useQuery({
    queryKey: ['payment-history', params],
    queryFn: () => paymentAPI.getHistory(params),
    select: (response) => response.data.data,
  });
};
