// src/store/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Set auth data
      setAuth: (data) => {
        const decoded = data.accessToken ? jwtDecode(data.accessToken) : null;
        set({
          user: data.user || decoded,
          token: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        });
        if (data.accessToken) {
          localStorage.setItem('token', data.accessToken);
        }
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
      },

      // Login
      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.login(credentials);
          const data = response.data.data;
          get().setAuth(data);
          toast.success('Login successful!');
          return data;
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed';
          toast.error(message);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Signup
      signup: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.signup(credentials);
          const data = response.data.data;
          get().setAuth(data);
          toast.success('Account created successfully!');
          return data;
        } catch (error) {
          const message = error.response?.data?.message || 'Signup failed';
          toast.error(message);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Google Login
      googleLogin: async (googleToken) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.googleLogin(googleToken);
          const data = response.data.data;
          get().setAuth(data);
          toast.success('Google login successful!');
          return data;
        } catch (error) {
          const message = error.response?.data?.message || 'Google login failed';
          toast.error(message);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Logout
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          toast.success('Logged out successfully');
        }
      },

      // Refresh token
      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return false;

        try {
          const response = await authAPI.refreshToken(refreshToken);
          const data = response.data.data;
          get().setAuth(data);
          return true;
        } catch (error) {
          get().logout();
          return false;
        }
      },

      // Load user from token
      loadUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000;
          
          if (decoded.exp < now) {
            // Token expired, try refresh
            const refreshed = await get().refreshAccessToken();
            if (!refreshed) {
              set({ isAuthenticated: false, user: null });
              return;
            }
          }

          // Fetch full user details from backend
          const response = await authAPI.getCurrentUser();
          set({
            user: response.data.data,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Load user error:', error);
          // Don't logout on error, just mark as not authenticated
          set({ isAuthenticated: false, user: null });
          localStorage.removeItem('token');
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
