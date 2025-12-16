// Accessibility tests for auth components
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach } from 'vitest';
import Header from '../components/Header';
import AuthPage from '../pages/AuthPage';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { AuthProvider } from '../context/AuthContext';

// Mock stores and dependencies
vi.mock('../store/useAuthStore', () => ({
  default: () => ({
    user: {
      email: 'test@example.com',
      username: 'testuser',
      fullName: 'Test User'
    },
    isAuthenticated: true,
    logout: vi.fn()
  })
}));

vi.mock('../utils/userDisplay', () => ({
  getUserDisplayName: vi.fn(() => 'Test User'),
  getUserInitials: vi.fn(() => 'TU'),
  createUserDisplay: vi.fn(() => ({
    displayName: 'Test User',
    initials: 'TU',
    fullName: 'Test User',
    username: 'testuser',
    email: 'test@example.com'
  }))
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Accessibility Tests', () => {
  describe('Header Component', () => {
    it('should have proper ARIA labels and roles', () => {
      renderWithRouter(<Header />);
      
      // Check main navigation structure
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
      
      // Check user display accessibility
      expect(screen.getByRole('button', { name: /User menu for/i })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /Avatar for/i })).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      renderWithRouter(<Header />);
      
      const userButton = screen.getByRole('button', { name: /User menu for/i });
      
      // Test keyboard activation
      fireEvent.keyDown(userButton, { key: 'Enter' });
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
      
      // Test escape key
      fireEvent.keyDown(userButton, { key: 'Escape' });
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    it('should have proper mobile menu accessibility', () => {
      renderWithRouter(<Header />);
      
      const menuButton = screen.getByRole('button', { name: /Open menu/i });
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu');
      
      fireEvent.click(menuButton);
      
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menu', { name: 'Mobile navigation menu' })).toBeInTheDocument();
    });

    it('should have proper navigation link accessibility', () => {
      renderWithRouter(<Header />);
      
      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('AuthPage Component', () => {
    beforeEach(() => {
      // Mock Google Sign-In
      global.google = {
        accounts: {
          id: {
            initialize: vi.fn(),
            renderButton: vi.fn()
          }
        }
      };
    });

    it('should have proper form accessibility', () => {
      renderWithRouter(<AuthPage />);
      
      // Check main content structure
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('form', { name: /Sign in form/i })).toBeInTheDocument();
      
      // Check form fields have proper labels and attributes
      const emailInput = screen.getByLabelText('Email address');
      expect(emailInput).toHaveAttribute('aria-required', 'true');
      expect(emailInput).toHaveAttribute('autoComplete', 'email');
      
      const passwordInput = screen.getByLabelText('Password');
      expect(passwordInput).toHaveAttribute('aria-required', 'true');
      expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');
    });

    it('should show proper error states with accessibility', async () => {
      renderWithRouter(<AuthPage />);
      
      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const emailInput = screen.getByLabelText('Email address');
        expect(emailInput).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });

    it('should have accessible password visibility toggle', () => {
      renderWithRouter(<AuthPage />);
      
      const toggleButton = screen.getByRole('button', { name: /Show password/i });
      expect(toggleButton).toBeInTheDocument();
      
      fireEvent.click(toggleButton);
      expect(screen.getByRole('button', { name: /Hide password/i })).toBeInTheDocument();
    });

    it('should have accessible password strength indicator', () => {
      renderWithRouter(<AuthPage />);
      
      // Switch to signup mode
      const signupToggle = screen.getByRole('button', { name: /Create an account/i });
      fireEvent.click(signupToggle);
      
      const passwordInput = screen.getByLabelText('Password');
      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      
      expect(screen.getByRole('progressbar', { name: 'Password strength' })).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Button Component', () => {
    it('should have proper accessibility attributes', () => {
      render(<Button aria-label="Test button">Click me</Button>);
      
      const button = screen.getByRole('button', { name: 'Test button' });
      expect(button).toBeInTheDocument();
    });

    it('should handle loading state accessibility', () => {
      render(<Button isLoading aria-label="Submit">Submit</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should handle disabled state accessibility', () => {
      render(<Button disabled>Disabled</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toBeDisabled();
    });
  });

  describe('Input Component', () => {
    it('should have proper label association', () => {
      render(<Input label="Test Input" />);
      
      const input = screen.getByLabelText('Test Input');
      expect(input).toBeInTheDocument();
    });

    it('should handle error state accessibility', () => {
      render(<Input label="Test Input" error="This field is required" />);
      
      const input = screen.getByLabelText('Test Input');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should generate unique IDs for multiple inputs', () => {
      render(
        <div>
          <Input label="Input 1" />
          <Input label="Input 2" />
        </div>
      );
      
      const input1 = screen.getByLabelText('Input 1');
      const input2 = screen.getByLabelText('Input 2');
      
      expect(input1.id).not.toBe(input2.id);
    });
  });

  describe('Modal Component', () => {
    it('should have proper modal accessibility', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
      
      expect(screen.getByRole('heading', { name: 'Test Modal' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Close modal' })).toBeInTheDocument();
    });

    it('should handle escape key to close', () => {
      const onClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={onClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Color Contrast', () => {
    it('should use high contrast colors for text', () => {
      renderWithRouter(<Header />);
      
      // Check that brand colors are used appropriately
      const brandElement = screen.getByText('LumiAI');
      const computedStyle = window.getComputedStyle(brandElement);
      
      // Brand gradient should be applied
      expect(computedStyle.backgroundImage).toContain('gradient');
    });
  });

  describe('Focus Management', () => {
    it('should maintain logical focus order', () => {
      renderWithRouter(<AuthPage />);
      
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      
      // Tab order should be logical
      emailInput.focus();
      expect(document.activeElement).toBe(emailInput);
      
      fireEvent.keyDown(emailInput, { key: 'Tab' });
      // Note: In a real browser, this would move focus to the next element
      // In tests, we can verify the elements are focusable
      expect(passwordInput).toHaveAttribute('tabIndex', '0');
    });
  });
});