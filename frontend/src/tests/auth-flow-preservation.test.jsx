/**
 * Property-Based Test for Authentication Flow Preservation
 * 
 * **Feature: auth-header-redesign, Property 6: Authentication Flow Preservation**
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
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

// Property-based test generators
const generateValidEmail = () => {
  const domains = ['example.com', 'test.org', 'domain.co.uk', 'site.net'];
  const usernames = ['user', 'test', 'john.doe', 'user123', 'test+tag'];
  const username = usernames[Math.floor(Math.random() * usernames.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${username}@${domain}`;
};

const generateValidPassword = () => {
  const passwords = [
    'password123',
    'SecurePass!',
    'myPassword2024',
    'Test@123',
    'LongPasswordWithNumbers123',
    'Simple123'
  ];
  return passwords[Math.floor(Math.random() * passwords.length)];
};

const generateValidUsername = () => {
  const usernames = [
    'testuser',
    'user123',
    'john_doe',
    'test-user',
    'username',
    'myuser2024'
  ];
  return usernames[Math.floor(Math.random() * usernames.length)];
};

const generateValidFullName = () => {
  const names = [
    'John Doe',
    'Jane Smith',
    'José María',
    'Test User',
    'Alice Johnson',
    'Bob Wilson',
    'María García',
    'John O\'Connor'
  ];
  return names[Math.floor(Math.random() * names.length)];
};

const generateMockApiResponse = (userData) => ({
  data: {
    data: {
      user: {
        id: Math.floor(Math.random() * 1000) + 1,
        email: userData.email,
        username: userData.username,
        fullName: userData.fullName
      },
      accessToken: `mock-token-${Math.random().toString(36).substr(2, 9)}`,
      refreshToken: `mock-refresh-${Math.random().toString(36).substr(2, 9)}`
    }
  }
});

describe('Authentication Flow Preservation Property Tests', () => {
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

  /**
   * Property 6: Authentication Flow Preservation
   * For any authentication method (email/password, Google OAuth), 
   * the existing functionality should work exactly as before
   */
  describe('Authentication Flow Preservation Property', () => {
    
    it('should preserve login functionality for any valid email/password combination', async () => {
      // Generate multiple test cases
      const testCases = Array.from({ length: 10 }, () => ({
        email: generateValidEmail(),
        password: generateValidPassword()
      }));

      for (const testCase of testCases) {
        // Reset mocks and state for each test case
        vi.clearAllMocks();
        useAuthStore.setState({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false
        });

        const mockResponse = generateMockApiResponse({
          email: testCase.email,
          username: testCase.email.split('@')[0],
          fullName: null
        });

        authAPI.login.mockResolvedValue(mockResponse);

        renderAuthPageWithContext();

        // Fill and submit login form
        const emailInput = screen.getByPlaceholderText('Enter your email');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const submitButton = screen.getByText('Sign In');

        fireEvent.change(emailInput, { target: { value: testCase.email } });
        fireEvent.change(passwordInput, { target: { value: testCase.password } });
        fireEvent.click(submitButton);

        // Verify the authentication flow works consistently
        await waitFor(() => {
          expect(authAPI.login).toHaveBeenCalledWith({
            email: testCase.email,
            password: testCase.password
          });
          expect(mockNavigate).toHaveBeenCalledWith('/create');
        });

        // Verify state is updated correctly
        const authState = useAuthStore.getState();
        expect(authState.isAuthenticated).toBe(true);
        expect(authState.user.email).toBe(testCase.email);
        expect(authState.token).toBe(mockResponse.data.data.accessToken);
        expect(authState.refreshToken).toBe(mockResponse.data.data.refreshToken);

        // Verify localStorage is updated
        expect(localStorage.getItem('token')).toBe(mockResponse.data.data.accessToken);
        expect(localStorage.getItem('refreshToken')).toBe(mockResponse.data.data.refreshToken);
      }
    });

    it('should preserve signup functionality for any valid user data combination', async () => {
      // Generate multiple test cases with different data combinations
      const testCases = Array.from({ length: 8 }, () => ({
        email: generateValidEmail(),
        password: generateValidPassword(),
        username: generateValidUsername(),
        fullName: Math.random() > 0.5 ? generateValidFullName() : undefined // Sometimes optional
      }));

      for (const testCase of testCases) {
        // Reset for each test case
        vi.clearAllMocks();
        useAuthStore.setState({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false
        });

        const mockResponse = generateMockApiResponse(testCase);
        authAPI.signup.mockResolvedValue(mockResponse);

        renderAuthPageWithContext();

        // Switch to signup mode
        const signupToggle = screen.getByText('Create an account');
        fireEvent.click(signupToggle);

        await waitFor(() => {
          expect(screen.getByPlaceholderText('Choose a username')).toBeInTheDocument();
        });

        // Fill signup form
        const usernameInput = screen.getByPlaceholderText('Choose a username');
        const emailInput = screen.getByPlaceholderText('Enter your email');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const fullNameInput = screen.getByPlaceholderText('Full name (optional)');
        const submitButton = screen.getByText('Create Account');

        fireEvent.change(usernameInput, { target: { value: testCase.username } });
        fireEvent.change(emailInput, { target: { value: testCase.email } });
        fireEvent.change(passwordInput, { target: { value: testCase.password } });
        
        if (testCase.fullName) {
          fireEvent.change(fullNameInput, { target: { value: testCase.fullName } });
        }

        fireEvent.click(submitButton);

        // Verify signup API call
        await waitFor(() => {
          expect(authAPI.signup).toHaveBeenCalledWith({
            username: testCase.username,
            email: testCase.email,
            password: testCase.password,
            fullName: testCase.fullName || undefined
          });
        });

        // Verify it switches back to login mode after successful signup
        await waitFor(() => {
          expect(screen.getByText('Sign In')).toBeInTheDocument();
        });
      }
    });

    it('should preserve Google OAuth functionality for any valid token', async () => {
      // Generate multiple Google token scenarios
      const googleTokens = Array.from({ length: 5 }, (_, i) => 
        `google-jwt-token-${i}-${Math.random().toString(36).substr(2, 20)}`
      );

      for (const token of googleTokens) {
        // Reset for each test case
        vi.clearAllMocks();
        useAuthStore.setState({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false
        });

        const mockResponse = generateMockApiResponse({
          email: `google${Math.floor(Math.random() * 1000)}@gmail.com`,
          username: `googleuser${Math.floor(Math.random() * 1000)}`,
          fullName: generateValidFullName()
        });

        authAPI.googleLogin.mockResolvedValue(mockResponse);

        renderAuthPageWithContext();

        // Simulate Google callback
        const mockCredentialResponse = { credential: token };
        const initializeCall = global.window.google.accounts.id.initialize.mock.calls[0];
        const googleCallback = initializeCall[0].callback;

        await act(async () => {
          await googleCallback(mockCredentialResponse);
        });

        // Verify Google login flow
        await waitFor(() => {
          expect(authAPI.googleLogin).toHaveBeenCalledWith(token);
          expect(mockNavigate).toHaveBeenCalledWith('/create');
        });

        // Verify state is updated correctly
        const authState = useAuthStore.getState();
        expect(authState.isAuthenticated).toBe(true);
        expect(authState.user).toEqual(mockResponse.data.data.user);
        expect(authState.token).toBe(mockResponse.data.data.accessToken);
      }
    });

    it('should preserve error handling consistency across all authentication methods', async () => {
      const errorScenarios = [
        {
          method: 'login',
          error: { response: { data: { message: 'Invalid credentials' } } },
          testData: { email: generateValidEmail(), password: 'wrongpassword' }
        },
        {
          method: 'signup',
          error: { response: { data: { message: 'Email already exists', field: 'email' } } },
          testData: { 
            email: generateValidEmail(), 
            password: generateValidPassword(),
            username: generateValidUsername()
          }
        },
        {
          method: 'googleLogin',
          error: { response: { data: { message: 'Google authentication failed' } } },
          testData: { token: 'invalid-google-token' }
        }
      ];

      for (const scenario of errorScenarios) {
        // Reset for each scenario
        vi.clearAllMocks();
        useAuthStore.setState({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false
        });

        authAPI[scenario.method].mockRejectedValue(scenario.error);

        renderAuthPageWithContext();

        if (scenario.method === 'login') {
          const emailInput = screen.getByPlaceholderText('Enter your email');
          const passwordInput = screen.getByPlaceholderText('Enter your password');
          const submitButton = screen.getByText('Sign In');

          fireEvent.change(emailInput, { target: { value: scenario.testData.email } });
          fireEvent.change(passwordInput, { target: { value: scenario.testData.password } });
          fireEvent.click(submitButton);

        } else if (scenario.method === 'signup') {
          // Switch to signup mode
          fireEvent.click(screen.getByText('Create an account'));

          await waitFor(() => {
            expect(screen.getByPlaceholderText('Choose a username')).toBeInTheDocument();
          });

          const usernameInput = screen.getByPlaceholderText('Choose a username');
          const emailInput = screen.getByPlaceholderText('Enter your email');
          const passwordInput = screen.getByPlaceholderText('Enter your password');
          const submitButton = screen.getByText('Create Account');

          fireEvent.change(usernameInput, { target: { value: scenario.testData.username } });
          fireEvent.change(emailInput, { target: { value: scenario.testData.email } });
          fireEvent.change(passwordInput, { target: { value: scenario.testData.password } });
          fireEvent.click(submitButton);

        } else if (scenario.method === 'googleLogin') {
          const mockCredentialResponse = { credential: scenario.testData.token };
          const initializeCall = global.window.google.accounts.id.initialize.mock.calls[0];
          const googleCallback = initializeCall[0].callback;

          await act(async () => {
            await googleCallback(mockCredentialResponse);
          });
        }

        // Verify error handling preserves expected behavior
        await waitFor(() => {
          expect(authAPI[scenario.method]).toHaveBeenCalled();
          expect(mockNavigate).not.toHaveBeenCalled();
        });

        // Verify state remains unauthenticated
        const authState = useAuthStore.getState();
        expect(authState.isAuthenticated).toBe(false);
        expect(authState.user).toBe(null);
        expect(authState.token).toBe(null);
      }
    });

    it('should preserve form validation behavior across all input combinations', async () => {
      // Test various invalid input combinations
      const invalidCombinations = [
        { email: '', password: '', description: 'empty inputs' },
        { email: 'invalid-email', password: '123', description: 'invalid email and short password' },
        { email: generateValidEmail(), password: '12345', description: 'valid email, short password' },
        { email: 'not-an-email', password: generateValidPassword(), description: 'invalid email, valid password' },
        { email: '   ', password: '   ', description: 'whitespace inputs' },
        { email: '@invalid.com', password: generateValidPassword(), description: 'malformed email' }
      ];

      for (const combo of invalidCombinations) {
        // Reset for each combination
        vi.clearAllMocks();

        renderAuthPageWithContext();

        const emailInput = screen.getByPlaceholderText('Enter your email');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const submitButton = screen.getByText('Sign In');

        fireEvent.change(emailInput, { target: { value: combo.email } });
        fireEvent.change(passwordInput, { target: { value: combo.password } });
        fireEvent.click(submitButton);

        // Should not call API for invalid inputs
        expect(authAPI.login).not.toHaveBeenCalled();

        // Should show appropriate validation errors
        await waitFor(() => {
          const errorElements = screen.getAllByText(/required|valid|characters/i);
          expect(errorElements.length).toBeGreaterThan(0);
        });
      }
    });

    it('should preserve state management consistency across authentication flows', async () => {
      // Test that state transitions are consistent regardless of authentication method
      const authMethods = [
        {
          name: 'email/password login',
          execute: async () => {
            const testData = {
              email: generateValidEmail(),
              password: generateValidPassword()
            };
            
            const mockResponse = generateMockApiResponse({
              email: testData.email,
              username: testData.email.split('@')[0]
            });

            authAPI.login.mockResolvedValue(mockResponse);

            const emailInput = screen.getByPlaceholderText('Enter your email');
            const passwordInput = screen.getByPlaceholderText('Enter your password');

            fireEvent.change(emailInput, { target: { value: testData.email } });
            fireEvent.change(passwordInput, { target: { value: testData.password } });
            fireEvent.click(screen.getByText('Sign In'));

            return mockResponse.data.data;
          }
        },
        {
          name: 'Google OAuth',
          execute: async () => {
            const mockResponse = generateMockApiResponse({
              email: `google${Math.floor(Math.random() * 1000)}@gmail.com`,
              username: `googleuser${Math.floor(Math.random() * 1000)}`,
              fullName: generateValidFullName()
            });

            authAPI.googleLogin.mockResolvedValue(mockResponse);

            const mockCredentialResponse = {
              credential: `google-token-${Math.random().toString(36).substr(2, 20)}`
            };

            const initializeCall = global.window.google.accounts.id.initialize.mock.calls[0];
            const googleCallback = initializeCall[0].callback;

            await act(async () => {
              await googleCallback(mockCredentialResponse);
            });

            return mockResponse.data.data;
          }
        }
      ];

      for (const method of authMethods) {
        // Reset for each method
        vi.clearAllMocks();
        localStorage.clear();
        useAuthStore.setState({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false
        });

        renderAuthPageWithContext();

        const expectedData = await method.execute();

        // Verify consistent state management regardless of auth method
        await waitFor(() => {
          const authState = useAuthStore.getState();
          expect(authState.isAuthenticated).toBe(true);
          expect(authState.user).toEqual(expectedData.user);
          expect(authState.token).toBe(expectedData.accessToken);
          expect(authState.refreshToken).toBe(expectedData.refreshToken);
        });

        // Verify localStorage consistency
        expect(localStorage.getItem('token')).toBe(expectedData.accessToken);
        expect(localStorage.getItem('refreshToken')).toBe(expectedData.refreshToken);

        // Verify navigation consistency
        expect(mockNavigate).toHaveBeenCalledWith('/create');
      }
    });

    it('should preserve logout functionality regardless of how user was authenticated', async () => {
      // Test logout after different authentication methods
      const authScenarios = [
        {
          name: 'after email/password login',
          userData: {
            email: generateValidEmail(),
            username: generateValidUsername(),
            fullName: generateValidFullName()
          }
        },
        {
          name: 'after Google OAuth',
          userData: {
            email: `google${Math.floor(Math.random() * 1000)}@gmail.com`,
            username: `googleuser${Math.floor(Math.random() * 1000)}`,
            fullName: generateValidFullName()
          }
        },
        {
          name: 'after signup',
          userData: {
            email: generateValidEmail(),
            username: generateValidUsername(),
            fullName: null
          }
        }
      ];

      for (const scenario of authScenarios) {
        // Set up authenticated state
        const mockToken = `token-${Math.random().toString(36).substr(2, 9)}`;
        const mockRefresh = `refresh-${Math.random().toString(36).substr(2, 9)}`;

        useAuthStore.setState({
          user: { id: Math.floor(Math.random() * 1000), ...scenario.userData },
          token: mockToken,
          refreshToken: mockRefresh,
          isAuthenticated: true,
          isLoading: false
        });

        localStorage.setItem('token', mockToken);
        localStorage.setItem('refreshToken', mockRefresh);

        authAPI.logout.mockResolvedValue({});

        // Execute logout
        const { logout } = useAuthStore.getState();
        await act(async () => {
          await logout();
        });

        // Verify consistent logout behavior
        const authState = useAuthStore.getState();
        expect(authState.user).toBe(null);
        expect(authState.token).toBe(null);
        expect(authState.refreshToken).toBe(null);
        expect(authState.isAuthenticated).toBe(false);

        // Verify localStorage is cleared
        expect(localStorage.getItem('token')).toBe(null);
        expect(localStorage.getItem('refreshToken')).toBe(null);

        // Reset for next scenario
        vi.clearAllMocks();
        localStorage.clear();
      }
    });
  });
});