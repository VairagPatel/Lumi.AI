/**
 * Integration Tests for Authentication Functionality
 * 
 * Tests complete authentication workflows, error handling, edge cases,
 * and state management integration.
 * 
 * Requirements: All authentication-related requirements
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthPage from '../pages/AuthPage.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import useAuthStore from '../store/useAuthStore.js';
import { authAPI } from '../services/api.js';

// Mock the API
vi.mock('../services/api.js', () => ({
  authAPI: {
    login: vi.fn(),
    signup: vi.fn(),
    googleLogin: vi.fn(),
    getCurrentUser: vi.fn(),
    logout: vi.fn()
  }
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }) => children
}));

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Helper to render AuthPage with full context
const renderAuthPageWithContext = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Mock Google Sign-In
    global.window.google = {
      accounts: {
        id: {
          initialize: vi.fn(),
          renderButton: vi.fn()
        }
      }
    };

    // Reset auth store
    useAuthStore.setState({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Email/Password Authentication Flow', () => {
    it('should complete successful login flow', async () => {
      const mockLoginResponse = {
        data: {
          data: {
            user: { id: 1, email: 'test@example.com', fullName: 'Test User' },
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token'
          }
        }
      };

      authAPI.login.mockResolvedValue(mockLoginResponse);

      renderAuthPageWithContext();

      // Fill in login form
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByText('Sign In');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      // Submit form
      fireEvent.click(submitButton);

      // Wait for API call and navigation
      await waitFor(() => {
        expect(authAPI.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        });
        expect(mockNavigate).toHaveBeenCalledWith('/create');
      });

      // Check that auth state is updated
      const authState = useAuthStore.getState();
      expect(authState.isAuthenticated).toBe(true);
      expect(authState.user).toEqual(mockLoginResponse.data.data.user);
      expect(authState.token).toBe('mock-access-token');
    });

    it('should handle login errors gracefully', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Invalid credentials',
            field: 'email'
          }
        }
      };

      authAPI.login.mockRejectedValue(mockError);

      renderAuthPageWithContext();

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByText('Sign In');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(authAPI.login).toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
      });

      // Should remain unauthenticated
      const authState = useAuthStore.getState();
      expect(authState.isAuthenticated).toBe(false);
      expect(authState.user).toBe(null);
    });

    it('should complete successful signup flow', async () => {
      const mockSignupResponse = {
        data: {
          data: {
            user: { id: 1, email: 'newuser@example.com', username: 'newuser' },
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token'
          }
        }
      };

      authAPI.signup.mockResolvedValue(mockSignupResponse);

      renderAuthPageWithContext();

      // Switch to signup mode
      const signupToggle = screen.getByText('Create an account');
      fireEvent.click(signupToggle);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Choose a username')).toBeInTheDocument();
      });

      // Fill in signup form
      const usernameInput = screen.getByPlaceholderText('Choose a username');
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const fullNameInput = screen.getByPlaceholderText('Full name (optional)');
      const submitButton = screen.getByText('Create Account');

      fireEvent.change(usernameInput, { target: { value: 'newuser' } });
      fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(fullNameInput, { target: { value: 'New User' } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(authAPI.signup).toHaveBeenCalledWith({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'password123',
          fullName: 'New User'
        });
      });

      // Should switch back to login mode after successful signup
      await waitFor(() => {
        expect(screen.getByText('Sign In')).toBeInTheDocument();
      });
    });

    it('should handle signup errors with field-specific feedback', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Email already exists',
            field: 'email'
          }
        }
      };

      authAPI.signup.mockRejectedValue(mockError);

      renderAuthPageWithContext();

      // Switch to signup mode
      const signupToggle = screen.getByText('Create an account');
      fireEvent.click(signupToggle);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Choose a username')).toBeInTheDocument();
      });

      const usernameInput = screen.getByPlaceholderText('Choose a username');
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByText('Create Account');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(authAPI.signup).toHaveBeenCalled();
      });

      // Should remain in signup mode and show error
      expect(screen.getByText('Create Account')).toBeInTheDocument();
    });
  });

  describe('Google OAuth Integration', () => {
    it('should handle successful Google login', async () => {
      const mockGoogleResponse = {
        data: {
          data: {
            user: { id: 1, email: 'google@example.com', fullName: 'Google User' },
            accessToken: 'google-access-token',
            refreshToken: 'google-refresh-token'
          }
        }
      };

      authAPI.googleLogin.mockResolvedValue(mockGoogleResponse);

      renderAuthPageWithContext();

      // Simulate Google callback
      const mockCredentialResponse = {
        credential: 'mock-google-id-token'
      };

      // Get the callback function that was passed to Google
      const initializeCall = global.window.google.accounts.id.initialize.mock.calls[0];
      const googleCallback = initializeCall[0].callback;

      // Call the callback with mock response
      await act(async () => {
        await googleCallback(mockCredentialResponse);
      });

      await waitFor(() => {
        expect(authAPI.googleLogin).toHaveBeenCalledWith('mock-google-id-token');
        expect(mockNavigate).toHaveBeenCalledWith('/create');
      });

      // Check auth state
      const authState = useAuthStore.getState();
      expect(authState.isAuthenticated).toBe(true);
      expect(authState.user).toEqual(mockGoogleResponse.data.data.user);
    });

    it('should handle Google login errors', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Google authentication failed'
          }
        }
      };

      authAPI.googleLogin.mockRejectedValue(mockError);

      renderAuthPageWithContext();

      const mockCredentialResponse = {
        credential: 'invalid-google-token'
      };

      const initializeCall = global.window.google.accounts.id.initialize.mock.calls[0];
      const googleCallback = initializeCall[0].callback;

      await act(async () => {
        await googleCallback(mockCredentialResponse);
      });

      await waitFor(() => {
        expect(authAPI.googleLogin).toHaveBeenCalledWith('invalid-google-token');
        expect(mockNavigate).not.toHaveBeenCalled();
      });

      // Should remain unauthenticated
      const authState = useAuthStore.getState();
      expect(authState.isAuthenticated).toBe(false);
    });

    it('should handle missing Google SDK gracefully', () => {
      // Remove Google SDK
      delete global.window.google;

      renderAuthPageWithContext();

      // Should still render the page without errors
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
  });

  describe('User Registration and Login Processes', () => {
    it('should validate all required fields before submission', async () => {
      renderAuthPageWithContext();

      // Try to submit empty login form
      const submitButton = screen.getByText('Sign In');
      fireEvent.click(submitButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });

      // Should not call API
      expect(authAPI.login).not.toHaveBeenCalled();
    });

    it('should validate signup form with all required fields', async () => {
      renderAuthPageWithContext();

      // Switch to signup mode
      const signupToggle = screen.getByText('Create an account');
      fireEvent.click(signupToggle);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Choose a username')).toBeInTheDocument();
      });

      // Try to submit empty signup form
      const submitButton = screen.getByText('Create Account');
      fireEvent.click(submitButton);

      // Should show validation errors for all required fields
      await waitFor(() => {
        expect(screen.getByText('Username is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });

      expect(authAPI.signup).not.toHaveBeenCalled();
    });

    it('should handle username fallback in signup', async () => {
      const mockSignupResponse = {
        data: {
          data: {
            user: { id: 1, email: 'test@example.com', username: 'test' },
            accessToken: 'mock-token',
            refreshToken: 'mock-refresh'
          }
        }
      };

      authAPI.signup.mockResolvedValue(mockSignupResponse);

      renderAuthPageWithContext();

      // Switch to signup mode
      const signupToggle = screen.getByText('Create an account');
      fireEvent.click(signupToggle);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Choose a username')).toBeInTheDocument();
      });

      // Fill form without username (should use email prefix)
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByText('Create Account');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(authAPI.signup).toHaveBeenCalledWith({
          username: 'test', // Should use email prefix
          email: 'test@example.com',
          password: 'password123',
          fullName: undefined
        });
      });
    });
  });

  describe('Backend API Compatibility', () => {
    it('should maintain expected API request format for login', async () => {
      authAPI.login.mockResolvedValue({
        data: { data: { user: {}, accessToken: 'token', refreshToken: 'refresh' } }
      });

      renderAuthPageWithContext();

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByText('Sign In');

      fireEvent.change(emailInput, { target: { value: 'api@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'apitest123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(authAPI.login).toHaveBeenCalledWith({
          email: 'api@test.com',
          password: 'apitest123'
        });
      });
    });

    it('should maintain expected API request format for signup', async () => {
      authAPI.signup.mockResolvedValue({
        data: { data: { user: {}, accessToken: 'token', refreshToken: 'refresh' } }
      });

      renderAuthPageWithContext();

      // Switch to signup
      fireEvent.click(screen.getByText('Create an account'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Choose a username')).toBeInTheDocument();
      });

      const usernameInput = screen.getByPlaceholderText('Choose a username');
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const fullNameInput = screen.getByPlaceholderText('Full name (optional)');

      fireEvent.change(usernameInput, { target: { value: 'apiuser' } });
      fireEvent.change(emailInput, { target: { value: 'api@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'apitest123' } });
      fireEvent.change(fullNameInput, { target: { value: 'API Test User' } });

      fireEvent.click(screen.getByText('Create Account'));

      await waitFor(() => {
        expect(authAPI.signup).toHaveBeenCalledWith({
          username: 'apiuser',
          email: 'api@test.com',
          password: 'apitest123',
          fullName: 'API Test User'
        });
      });
    });

    it('should maintain expected API request format for Google login', async () => {
      authAPI.googleLogin.mockResolvedValue({
        data: { data: { user: {}, accessToken: 'token', refreshToken: 'refresh' } }
      });

      renderAuthPageWithContext();

      const mockCredentialResponse = {
        credential: 'google-jwt-token-12345'
      };

      const initializeCall = global.window.google.accounts.id.initialize.mock.calls[0];
      const googleCallback = initializeCall[0].callback;

      await act(async () => {
        await googleCallback(mockCredentialResponse);
      });

      await waitFor(() => {
        expect(authAPI.googleLogin).toHaveBeenCalledWith('google-jwt-token-12345');
      });
    });

    it('should handle API response format correctly', async () => {
      const mockApiResponse = {
        data: {
          data: {
            user: {
              id: 123,
              email: 'response@test.com',
              username: 'responseuser',
              fullName: 'Response Test User'
            },
            accessToken: 'jwt-access-token-abc123',
            refreshToken: 'jwt-refresh-token-xyz789'
          }
        }
      };

      authAPI.login.mockResolvedValue(mockApiResponse);

      renderAuthPageWithContext();

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      fireEvent.change(emailInput, { target: { value: 'response@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(screen.getByText('Sign In'));

      await waitFor(() => {
        const authState = useAuthStore.getState();
        expect(authState.user).toEqual(mockApiResponse.data.data.user);
        expect(authState.token).toBe('jwt-access-token-abc123');
        expect(authState.refreshToken).toBe('jwt-refresh-token-xyz789');
        expect(authState.isAuthenticated).toBe(true);
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network Error');
      networkError.code = 'NETWORK_ERROR';
      
      authAPI.login.mockRejectedValue(networkError);

      renderAuthPageWithContext();

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(screen.getByText('Sign In'));

      await waitFor(() => {
        expect(authAPI.login).toHaveBeenCalled();
        // Should remain unauthenticated
        const authState = useAuthStore.getState();
        expect(authState.isAuthenticated).toBe(false);
      });
    });

    it('should handle malformed API responses', async () => {
      // Response missing required fields
      const malformedResponse = {
        data: {
          // Missing 'data' wrapper
          user: { id: 1 },
          token: 'some-token'
        }
      };

      authAPI.login.mockResolvedValue(malformedResponse);

      renderAuthPageWithContext();

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(screen.getByText('Sign In'));

      // Should handle gracefully without crashing
      await waitFor(() => {
        expect(authAPI.login).toHaveBeenCalled();
      });
    });

    it('should handle empty or null user data', async () => {
      const emptyUserResponse = {
        data: {
          data: {
            user: null,
            accessToken: 'token',
            refreshToken: 'refresh'
          }
        }
      };

      authAPI.login.mockResolvedValue(emptyUserResponse);

      renderAuthPageWithContext();

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(screen.getByText('Sign In'));

      await waitFor(() => {
        expect(authAPI.login).toHaveBeenCalled();
        // Should handle null user gracefully
        const authState = useAuthStore.getState();
        expect(authState.token).toBe('token');
      });
    });

    it('should handle special characters in form inputs', async () => {
      authAPI.login.mockResolvedValue({
        data: { data: { user: {}, accessToken: 'token', refreshToken: 'refresh' } }
      });

      renderAuthPageWithContext();

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      // Test with special characters
      fireEvent.change(emailInput, { target: { value: 'test+tag@example-domain.co.uk' } });
      fireEvent.change(passwordInput, { target: { value: 'P@ssw0rd!#$%' } });
      fireEvent.click(screen.getByText('Sign In'));

      await waitFor(() => {
        expect(authAPI.login).toHaveBeenCalledWith({
          email: 'test+tag@example-domain.co.uk',
          password: 'P@ssw0rd!#$%'
        });
      });
    });
  });

  describe('State Management Integration', () => {
    it('should persist authentication state in localStorage', async () => {
      const mockResponse = {
        data: {
          data: {
            user: { id: 1, email: 'persist@test.com' },
            accessToken: 'persist-token',
            refreshToken: 'persist-refresh'
          }
        }
      };

      authAPI.login.mockResolvedValue(mockResponse);

      renderAuthPageWithContext();

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      fireEvent.change(emailInput, { target: { value: 'persist@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(screen.getByText('Sign In'));

      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('persist-token');
        expect(localStorage.getItem('refreshToken')).toBe('persist-refresh');
      });
    });

    it('should clear state on logout', async () => {
      // Set initial authenticated state
      useAuthStore.setState({
        user: { id: 1, email: 'test@example.com' },
        token: 'test-token',
        refreshToken: 'test-refresh',
        isAuthenticated: true
      });

      localStorage.setItem('token', 'test-token');
      localStorage.setItem('refreshToken', 'test-refresh');

      authAPI.logout.mockResolvedValue({});

      // Trigger logout
      const { logout } = useAuthStore.getState();
      await act(async () => {
        await logout();
      });

      // Check state is cleared
      const authState = useAuthStore.getState();
      expect(authState.user).toBe(null);
      expect(authState.token).toBe(null);
      expect(authState.refreshToken).toBe(null);
      expect(authState.isAuthenticated).toBe(false);

      // Check localStorage is cleared
      expect(localStorage.getItem('token')).toBe(null);
      expect(localStorage.getItem('refreshToken')).toBe(null);
    });

    it('should handle concurrent authentication attempts', async () => {
      let resolveLogin;
      const loginPromise = new Promise(resolve => {
        resolveLogin = resolve;
      });

      authAPI.login.mockReturnValue(loginPromise);

      renderAuthPageWithContext();

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByText('Sign In');

      fireEvent.change(emailInput, { target: { value: 'concurrent@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      // Submit multiple times quickly
      fireEvent.click(submitButton);
      fireEvent.click(submitButton);
      fireEvent.click(submitButton);

      // Should only make one API call
      expect(authAPI.login).toHaveBeenCalledTimes(1);

      // Button should be disabled during loading
      expect(submitButton).toBeDisabled();

      // Resolve the promise
      resolveLogin({
        data: { data: { user: {}, accessToken: 'token', refreshToken: 'refresh' } }
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/create');
      });
    });
  });
});