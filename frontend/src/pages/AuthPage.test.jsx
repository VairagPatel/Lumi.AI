/**
 * Property-Based Tests for AuthPage Form Validation
 * 
 * **Feature: auth-header-redesign, Property 2: Form Validation Consistency**
 * **Validates: Requirements 3.1, 3.2**
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthPage from './AuthPage.jsx';

// Mock the auth context
const mockLogin = vi.fn();
const mockGoogleLogin = vi.fn();

vi.mock('../context/AuthContext.jsx', () => ({
  useAuth: () => ({
    login: mockLogin,
    googleLogin: mockGoogleLogin
  })
}));

// Mock the API
vi.mock('../services/api', () => ({
  authAPI: {
    signup: vi.fn()
  }
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }) => children
}));

// Helper to render AuthPage with router context
const renderAuthPage = () => {
  return render(
    <BrowserRouter>
      <AuthPage />
    </BrowserRouter>
  );
};

describe('AuthPage Form Validation Property Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock Google Sign-In
    global.window.google = {
      accounts: {
        id: {
          initialize: vi.fn(),
          renderButton: vi.fn()
        }
      }
    };
  });

  /**
   * Property 2: Form Validation Consistency
   * For any form input state, validation errors should be displayed consistently 
   * and cleared when the input becomes valid
   */
  describe('Form Validation Consistency Property', () => {
    
    it('should validate email consistently across all input scenarios', async () => {
      renderAuthPage();

      const emailInput = screen.getByPlaceholderText('Enter your email');

      // Test cases for email validation
      const emailTestCases = [
        // Invalid emails should show errors
        { input: '', shouldHaveError: true, errorText: 'Email is required' },
        { input: '   ', shouldHaveError: true, errorText: 'Email is required' },
        { input: 'invalid', shouldHaveError: true, errorText: 'Please enter a valid email address' },
        { input: 'invalid@', shouldHaveError: true, errorText: 'Please enter a valid email address' },
        { input: '@invalid.com', shouldHaveError: true, errorText: 'Please enter a valid email address' },
        { input: 'invalid@.com', shouldHaveError: true, errorText: 'Please enter a valid email address' },
        { input: 'invalid.com', shouldHaveError: true, errorText: 'Please enter a valid email address' },
        
        // Valid emails should not show errors
        { input: 'test@example.com', shouldHaveError: false },
        { input: 'user.name@domain.co.uk', shouldHaveError: false },
        { input: 'test+tag@example.org', shouldHaveError: false },
        { input: 'user123@test-domain.com', shouldHaveError: false },
        { input: 'a@b.co', shouldHaveError: false }
      ];

      for (const testCase of emailTestCases) {
        // Clear and enter new value
        fireEvent.change(emailInput, { target: { value: '' } });
        fireEvent.change(emailInput, { target: { value: testCase.input } });
        fireEvent.blur(emailInput);

        await waitFor(() => {
          if (testCase.shouldHaveError) {
            expect(screen.getByText(testCase.errorText)).toBeInTheDocument();
          } else {
            expect(screen.queryByText(/Email/)).not.toBeInTheDocument();
          }
        });
      }
    });

    it('should validate password consistently across all input scenarios', async () => {
      renderAuthPage();

      const passwordInput = screen.getByPlaceholderText('Enter your password');

      // Test cases for password validation
      const passwordTestCases = [
        // Invalid passwords should show errors
        { input: '', shouldHaveError: true, errorText: 'Password is required' },
        { input: '   ', shouldHaveError: true, errorText: 'Password is required' },
        { input: '12345', shouldHaveError: true, errorText: 'Password must be at least 6 characters' },
        { input: 'short', shouldHaveError: true, errorText: 'Password must be at least 6 characters' },
        
        // Valid passwords should not show errors
        { input: '123456', shouldHaveError: false },
        { input: 'password', shouldHaveError: false },
        { input: 'mySecurePassword123!', shouldHaveError: false },
        { input: 'simple123', shouldHaveError: false }
      ];

      for (const testCase of passwordTestCases) {
        // Clear and enter new value
        fireEvent.change(passwordInput, { target: { value: '' } });
        fireEvent.change(passwordInput, { target: { value: testCase.input } });
        fireEvent.blur(passwordInput);

        await waitFor(() => {
          if (testCase.shouldHaveError) {
            expect(screen.getByText(testCase.errorText)).toBeInTheDocument();
          } else {
            expect(screen.queryByText(/Password/)).not.toBeInTheDocument();
          }
        });
      }
    });

    it('should validate username consistently in signup mode', async () => {
      renderAuthPage();

      // Switch to signup mode
      const signupButton = screen.getByText('Create an account');
      fireEvent.click(signupButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Choose a username')).toBeInTheDocument();
      });

      const usernameInput = screen.getByPlaceholderText('Choose a username');

      // Test cases for username validation in signup mode
      const usernameTestCases = [
        // Invalid usernames should show errors
        { input: '', shouldHaveError: true, errorText: 'Username is required' },
        { input: '   ', shouldHaveError: true, errorText: 'Username is required' },
        { input: 'ab', shouldHaveError: true, errorText: 'Username must be at least 3 characters' },
        { input: 'x', shouldHaveError: true, errorText: 'Username must be at least 3 characters' },
        
        // Valid usernames should not show errors
        { input: 'abc', shouldHaveError: false },
        { input: 'testuser', shouldHaveError: false },
        { input: 'user123', shouldHaveError: false },
        { input: 'test_user-name', shouldHaveError: false }
      ];

      for (const testCase of usernameTestCases) {
        // Clear and enter new value
        fireEvent.change(usernameInput, { target: { value: '' } });
        fireEvent.change(usernameInput, { target: { value: testCase.input } });
        fireEvent.blur(usernameInput);

        await waitFor(() => {
          if (testCase.shouldHaveError) {
            expect(screen.getByText(testCase.errorText)).toBeInTheDocument();
          } else {
            expect(screen.queryByText(/Username/)).not.toBeInTheDocument();
          }
        });
      }
    });

    it('should clear validation errors when input becomes valid', async () => {
      renderAuthPage();

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      // Enter invalid values to trigger errors
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);
      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.blur(passwordInput);

      // Wait for errors to appear
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
        expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
      });

      // Fix the email
      fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
      fireEvent.blur(emailInput);

      // Email error should be cleared
      await waitFor(() => {
        expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
        // Password error should still be there
        expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
      });

      // Fix the password
      fireEvent.change(passwordInput, { target: { value: 'validpassword' } });
      fireEvent.blur(passwordInput);

      // Password error should be cleared
      await waitFor(() => {
        expect(screen.queryByText('Password must be at least 6 characters')).not.toBeInTheDocument();
      });
    });

    it('should show password strength indicator consistently in signup mode', async () => {
      renderAuthPage();

      // Switch to signup mode
      const signupButton = screen.getByText('Create an account');
      fireEvent.click(signupButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
      });

      const passwordInput = screen.getByPlaceholderText('Enter your password');

      // Test password strength scenarios
      const strengthTestCases = [
        { password: '', expectedStrength: '' }, // No indicator for empty
        { password: '123', expectedStrength: 'Very Weak' },
        { password: '123456', expectedStrength: 'Weak' },
        { password: 'password', expectedStrength: 'Weak' },
        { password: 'Password1', expectedStrength: 'Fair' },
        { password: 'Password123', expectedStrength: 'Good' },
        { password: 'Password123!', expectedStrength: 'Strong' }
      ];

      for (const testCase of strengthTestCases) {
        fireEvent.change(passwordInput, { target: { value: testCase.password } });

        if (testCase.expectedStrength) {
          await waitFor(() => {
            expect(screen.getByText(testCase.expectedStrength)).toBeInTheDocument();
          });
        } else {
          // No strength indicator should be shown for empty password
          expect(screen.queryByText(/Weak|Fair|Good|Strong/)).not.toBeInTheDocument();
        }
      }
    });

    it('should prevent form submission with invalid data consistently', async () => {
      renderAuthPage();

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByText('Sign In');

      // Test various invalid combinations
      const invalidCombinations = [
        { email: '', password: '', description: 'empty fields' },
        { email: 'invalid', password: '123', description: 'invalid email and short password' },
        { email: 'valid@example.com', password: '123', description: 'valid email but short password' },
        { email: 'invalid', password: 'validpassword', description: 'invalid email but valid password' }
      ];

      for (const combo of invalidCombinations) {
        // Clear form
        fireEvent.change(emailInput, { target: { value: '' } });
        fireEvent.change(passwordInput, { target: { value: '' } });

        // Enter test values
        fireEvent.change(emailInput, { target: { value: combo.email } });
        fireEvent.change(passwordInput, { target: { value: combo.password } });

        // Try to submit
        fireEvent.click(submitButton);

        // Should not call login function for invalid data
        expect(mockLogin).not.toHaveBeenCalled();

        // Should show validation errors
        await waitFor(() => {
          const errorElements = screen.getAllByText(/required|valid|characters/i);
          expect(errorElements.length).toBeGreaterThan(0);
        });

        // Clear mocks for next iteration
        mockLogin.mockClear();
      }
    });

    it('should allow form submission only with valid data', async () => {
      renderAuthPage();

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByText('Sign In');

      // Enter valid data
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'validpassword' } });

      // Submit form
      fireEvent.click(submitButton);

      // Should call login function with valid data
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'validpassword');
      });
    });

    it('should handle mode switching without losing validation state consistency', async () => {
      renderAuthPage();

      // Start in login mode, enter invalid email
      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });

      // Switch to signup mode
      const signupButton = screen.getByText('Create an account');
      fireEvent.click(signupButton);

      // Errors should be cleared when switching modes
      await waitFor(() => {
        expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
      });

      // Switch back to login mode
      const loginButton = screen.getByText('Sign in instead');
      fireEvent.click(loginButton);

      // Should be back in login mode without errors
      await waitFor(() => {
        expect(screen.getByText('Sign In')).toBeInTheDocument();
        expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
      });
    });

    it('should maintain validation consistency across field interactions', async () => {
      renderAuthPage();

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      // Test that validation only triggers after user interaction (blur)
      fireEvent.change(emailInput, { target: { value: 'invalid' } });
      // Should not show error immediately on change, only after blur
      expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();

      fireEvent.blur(emailInput);
      // Now should show error after blur
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });

      // Test that subsequent changes update validation immediately after first blur
      fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
      });
    });
  });

  describe('Password Visibility Toggle Property', () => {
    it('should consistently toggle password visibility', async () => {
      renderAuthPage();

      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const toggleButton = screen.getByRole('button', { name: '' }); // Eye icon button

      // Initially should be password type
      expect(passwordInput).toHaveAttribute('type', 'password');

      // Click to show password
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');

      // Click to hide password
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');

      // Should work consistently multiple times
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form State Management Property', () => {
    it('should maintain form state consistency during loading states', async () => {
      renderAuthPage();

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByText('Sign In');

      // Enter valid data
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'validpassword' } });

      // Mock login to be pending
      mockLogin.mockImplementation(() => new Promise(() => {})); // Never resolves

      // Submit form
      fireEvent.click(submitButton);

      // Form should be in loading state
      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });

      // Form inputs should still contain the values
      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('validpassword');
    });
  });
});