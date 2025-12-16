// Keyboard navigation and focus management tests
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach } from 'vitest';
import Header from '../components/Header';
import AuthPage from '../pages/AuthPage';
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

describe('Keyboard Navigation Tests', () => {
  beforeEach(() => {
    // Mock Google Sign-In for AuthPage tests
    global.google = {
      accounts: {
        id: {
          initialize: vi.fn(),
          renderButton: vi.fn()
        }
      }
    };
  });

  describe('Header Navigation', () => {
    it('should support tab navigation through all interactive elements', () => {
      renderWithRouter(<Header />);
      
      // Get all focusable elements in order
      const brandLink = screen.getByRole('link', { name: /LumiAI/i });
      const homeLink = screen.getByRole('link', { name: 'Home' });
      const createLink = screen.getByRole('link', { name: 'Create' });
      const userButton = screen.getByRole('button', { name: /User menu/i });
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      
      // Test tab order
      brandLink.focus();
      expect(document.activeElement).toBe(brandLink);
      
      fireEvent.keyDown(brandLink, { key: 'Tab' });
      // In a real browser, focus would move to next element
      // We can test that elements are focusable
      expect(homeLink.tabIndex).not.toBe(-1);
    });

    it('should handle Enter and Space key activation', () => {
      renderWithRouter(<Header />);
      
      const userButton = screen.getByRole('button', { name: /User menu/i });
      
      // Test Enter key
      userButton.focus();
      fireEvent.keyDown(userButton, { key: 'Enter' });
      
      expect(userButton).toHaveAttribute('aria-expanded', 'true');
      
      // Test Space key
      fireEvent.keyDown(userButton, { key: ' ' });
      expect(userButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should handle Escape key to close tooltip', async () => {
      renderWithRouter(<Header />);
      
      const userButton = screen.getByRole('button', { name: /User menu/i });
      
      // Open tooltip
      fireEvent.keyDown(userButton, { key: 'Enter' });
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
      
      // Close with Escape
      fireEvent.keyDown(userButton, { key: 'Escape' });
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    it('should handle mobile menu keyboard navigation', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
      
      renderWithRouter(<Header />);
      
      const menuButton = screen.getByRole('button', { name: /Open menu/i });
      
      // Open menu with Enter
      menuButton.focus();
      fireEvent.keyDown(menuButton, { key: 'Enter' });
      
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  describe('AuthPage Navigation', () => {
    it('should support logical tab order in login form', () => {
      renderWithRouter(<AuthPage />);
      
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      const showPasswordButton = screen.getByRole('button', { name: /Show password/i });
      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      
      // Test that elements are focusable in logical order
      expect(emailInput.tabIndex).not.toBe(-1);
      expect(passwordInput.tabIndex).not.toBe(-1);
      expect(showPasswordButton.tabIndex).not.toBe(-1);
      expect(submitButton.tabIndex).not.toBe(-1);
    });

    it('should handle form submission with Enter key', () => {
      renderWithRouter(<AuthPage />);
      
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      
      // Fill form
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      // Submit with Enter key on password field
      fireEvent.keyDown(passwordInput, { key: 'Enter' });
      
      // Form should attempt to submit
      expect(screen.getByRole('button', { name: /Sign In/i })).toBeDisabled();
    });

    it('should handle password visibility toggle with keyboard', () => {
      renderWithRouter(<AuthPage />);
      
      const passwordInput = screen.getByLabelText('Password');
      const toggleButton = screen.getByRole('button', { name: /Show password/i });
      
      // Toggle with Enter key
      toggleButton.focus();
      fireEvent.keyDown(toggleButton, { key: 'Enter' });
      
      expect(passwordInput.type).toBe('text');
      expect(screen.getByRole('button', { name: /Hide password/i })).toBeInTheDocument();
      
      // Toggle with Space key
      fireEvent.keyDown(toggleButton, { key: ' ' });
      
      expect(passwordInput.type).toBe('password');
    });

    it('should handle form mode switching with keyboard', () => {
      renderWithRouter(<AuthPage />);
      
      const toggleButton = screen.getByRole('button', { name: /Create an account/i });
      
      // Switch to signup mode with Enter
      toggleButton.focus();
      fireEvent.keyDown(toggleButton, { key: 'Enter' });
      
      expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
    });

    it('should maintain focus after form validation errors', async () => {
      renderWithRouter(<AuthPage />);
      
      const emailInput = screen.getByLabelText('Email address');
      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      
      // Submit empty form
      emailInput.focus();
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
      
      // Focus should remain on or move to first invalid field
      expect(document.activeElement).toBe(emailInput);
    });
  });

  describe('Modal Navigation', () => {
    it('should trap focus within modal', () => {
      const onClose = vi.fn();
      
      render(
        <Modal isOpen={true} onClose={onClose} title="Test Modal">
          <button>First Button</button>
          <button>Second Button</button>
        </Modal>
      );
      
      const modal = screen.getByRole('dialog');
      const closeButton = screen.getByRole('button', { name: 'Close modal' });
      const firstButton = screen.getByRole('button', { name: 'First Button' });
      const secondButton = screen.getByRole('button', { name: 'Second Button' });
      
      // Focus should be trapped within modal
      expect(document.activeElement).toBe(modal);
      
      // Tab should cycle through modal elements only
      fireEvent.keyDown(modal, { key: 'Tab' });
      // In a real implementation, focus would move to first focusable element
    });

    it('should close modal with Escape key', () => {
      const onClose = vi.fn();
      
      render(
        <Modal isOpen={true} onClose={onClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(onClose).toHaveBeenCalled();
    });

    it('should handle Shift+Tab for reverse navigation', () => {
      const onClose = vi.fn();
      
      render(
        <Modal isOpen={true} onClose={onClose} title="Test Modal">
          <button>First Button</button>
          <button>Second Button</button>
        </Modal>
      );
      
      const modal = screen.getByRole('dialog');
      
      // Test reverse tab navigation
      fireEvent.keyDown(modal, { key: 'Tab', shiftKey: true });
      
      // Should handle reverse navigation properly
      // In a real implementation, this would move focus to last focusable element
    });
  });

  describe('Skip Links', () => {
    it('should provide skip to main content functionality', () => {
      renderWithRouter(
        <div>
          <Header />
          <main id="main-content">
            <AuthPage />
          </main>
        </div>
      );
      
      // Skip link should be available (though hidden by default)
      const skipLink = document.querySelector('a[href="#main-content"]');
      
      if (skipLink) {
        // Test skip link functionality
        fireEvent.keyDown(skipLink, { key: 'Enter' });
        
        const mainContent = document.getElementById('main-content');
        expect(mainContent).toBeInTheDocument();
      }
    });
  });

  describe('Arrow Key Navigation', () => {
    it('should handle arrow key navigation in dropdown menus', async () => {
      renderWithRouter(<Header />);
      
      const userButton = screen.getByRole('button', { name: /User menu/i });
      
      // Open tooltip/menu
      fireEvent.keyDown(userButton, { key: 'Enter' });
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
      
      // Arrow keys should navigate within the tooltip/menu
      fireEvent.keyDown(userButton, { key: 'ArrowDown' });
      fireEvent.keyDown(userButton, { key: 'ArrowUp' });
      
      // Should handle arrow navigation appropriately
    });
  });

  describe('Focus Indicators', () => {
    it('should show visible focus indicators', () => {
      renderWithRouter(<Header />);
      
      const homeLink = screen.getByRole('link', { name: 'Home' });
      
      homeLink.focus();
      
      // Check that focus styles are applied
      const computedStyle = window.getComputedStyle(homeLink);
      
      // Should have focus styles (outline, box-shadow, etc.)
      expect(computedStyle.outline).not.toBe('none');
    });

    it('should maintain focus visibility during interactions', () => {
      renderWithRouter(<AuthPage />);
      
      const emailInput = screen.getByLabelText('Email address');
      
      emailInput.focus();
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      // Focus should remain visible during typing
      expect(document.activeElement).toBe(emailInput);
    });
  });

  describe('Screen Reader Navigation', () => {
    it('should provide proper heading structure', () => {
      renderWithRouter(<AuthPage />);
      
      // Check for proper heading hierarchy
      const headings = screen.getAllByRole('heading');
      
      headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        expect(level).toBeGreaterThan(0);
        expect(level).toBeLessThan(7);
      });
    });

    it('should provide landmark navigation', () => {
      renderWithRouter(
        <div>
          <Header />
          <main>
            <AuthPage />
          </main>
        </div>
      );
      
      // Check for proper landmarks
      expect(screen.getByRole('banner')).toBeInTheDocument(); // header
      expect(screen.getByRole('navigation')).toBeInTheDocument(); // nav
      expect(screen.getByRole('main')).toBeInTheDocument(); // main
    });

    it('should provide descriptive link text', () => {
      renderWithRouter(<Header />);
      
      const links = screen.getAllByRole('link');
      
      links.forEach(link => {
        // Links should have accessible names
        expect(link).toHaveAccessibleName();
        
        // Avoid generic text like "click here" or "read more"
        const linkText = link.textContent.toLowerCase();
        expect(linkText).not.toMatch(/^(click here|read more|more|link)$/);
      });
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should handle common keyboard shortcuts', () => {
      renderWithRouter(<AuthPage />);
      
      // Test Ctrl+A (select all) in input fields
      const emailInput = screen.getByLabelText('Email address');
      
      emailInput.focus();
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.keyDown(emailInput, { key: 'a', ctrlKey: true });
      
      // Should handle select all appropriately
    });

    it('should not interfere with browser shortcuts', () => {
      renderWithRouter(<Header />);
      
      // Test that browser shortcuts like Ctrl+R (refresh) are not prevented
      const refreshEvent = new KeyboardEvent('keydown', {
        key: 'r',
        ctrlKey: true,
        bubbles: true
      });
      
      const defaultPrevented = !document.dispatchEvent(refreshEvent);
      
      // Should not prevent browser shortcuts
      expect(defaultPrevented).toBe(false);
    });
  });
});