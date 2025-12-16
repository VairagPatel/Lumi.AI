/**
 * Property-Based Tests for AuthPage Responsive Design
 * 
 * **Feature: auth-header-redesign, Property 3: Responsive Design Integrity**
 * **Validates: Requirements 1.4**
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

// Helper to set viewport size
const setViewportSize = (width, height) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

describe('AuthPage Responsive Design Property Tests', () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

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

  afterEach(() => {
    // Restore original viewport size
    setViewportSize(originalInnerWidth, originalInnerHeight);
  });

  /**
   * Property 3: Responsive Design Integrity
   * For any screen size, the auth page should maintain usability and visual hierarchy 
   * without breaking layouts
   */
  describe('Responsive Design Integrity Property', () => {
    
    const viewportSizes = [
      // Mobile devices
      { width: 320, height: 568, name: 'iPhone SE' },
      { width: 375, height: 667, name: 'iPhone 8' },
      { width: 414, height: 896, name: 'iPhone 11 Pro Max' },
      { width: 360, height: 640, name: 'Android Small' },
      { width: 412, height: 915, name: 'Android Large' },
      
      // Tablet devices
      { width: 768, height: 1024, name: 'iPad Portrait' },
      { width: 1024, height: 768, name: 'iPad Landscape' },
      { width: 820, height: 1180, name: 'iPad Air' },
      
      // Desktop sizes
      { width: 1280, height: 720, name: 'Desktop Small' },
      { width: 1366, height: 768, name: 'Desktop Medium' },
      { width: 1920, height: 1080, name: 'Desktop Large' },
      { width: 2560, height: 1440, name: 'Desktop XL' },
      
      // Edge cases
      { width: 280, height: 653, name: 'Very Narrow' },
      { width: 3840, height: 2160, name: 'Ultra Wide' }
    ];

    it('should maintain form usability across all viewport sizes', async () => {
      for (const viewport of viewportSizes) {
        setViewportSize(viewport.width, viewport.height);
        
        const { unmount } = renderAuthPage();

        // Essential form elements should always be present and accessible
        expect(screen.getByPlaceholderText('Enter your email'), 
          `Email input missing on ${viewport.name} (${viewport.width}x${viewport.height})`
        ).toBeInTheDocument();
        
        expect(screen.getByPlaceholderText('Enter your password'),
          `Password input missing on ${viewport.name} (${viewport.width}x${viewport.height})`
        ).toBeInTheDocument();
        
        expect(screen.getByText('Sign In'),
          `Submit button missing on ${viewport.name} (${viewport.width}x${viewport.height})`
        ).toBeInTheDocument();

        // Form should be functional
        const emailInput = screen.getByPlaceholderText('Enter your email');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        
        expect(emailInput.value, `Email input not functional on ${viewport.name}`).toBe('test@example.com');
        expect(passwordInput.value, `Password input not functional on ${viewport.name}`).toBe('password123');

        unmount();
      }
    });

    it('should maintain visual hierarchy across different screen sizes', async () => {
      for (const viewport of viewportSizes) {
        setViewportSize(viewport.width, viewport.height);
        
        const { unmount } = renderAuthPage();

        // Title should always be visible and prominent
        const title = screen.getByText('Welcome Back');
        expect(title, `Title missing on ${viewport.name}`).toBeInTheDocument();
        
        // Brand element should be visible
        const brandElement = screen.getByText('Welcome to LumiAI');
        expect(brandElement, `Brand element missing on ${viewport.name}`).toBeInTheDocument();

        // Mode toggle should be accessible
        const modeToggle = screen.getByText('Create an account');
        expect(modeToggle, `Mode toggle missing on ${viewport.name}`).toBeInTheDocument();

        unmount();
      }
    });

    it('should handle form mode switching responsively', async () => {
      for (const viewport of viewportSizes) {
        setViewportSize(viewport.width, viewport.height);
        
        const { unmount } = renderAuthPage();

        // Switch to signup mode
        const signupButton = screen.getByText('Create an account');
        fireEvent.click(signupButton);

        await waitFor(() => {
          expect(screen.getByText('Join LumiAI'),
            `Signup title missing on ${viewport.name}`
          ).toBeInTheDocument();
          
          expect(screen.getByPlaceholderText('Choose a username'),
            `Username field missing on ${viewport.name}`
          ).toBeInTheDocument();
        });

        // Switch back to login
        const loginButton = screen.getByText('Sign in instead');
        fireEvent.click(loginButton);

        await waitFor(() => {
          expect(screen.getByText('Welcome Back'),
            `Login title missing after mode switch on ${viewport.name}`
          ).toBeInTheDocument();
        });

        unmount();
      }
    });

    it('should maintain touch-friendly interactions on mobile devices', async () => {
      const mobileViewports = viewportSizes.filter(v => v.width <= 768);
      
      for (const viewport of mobileViewports) {
        setViewportSize(viewport.width, viewport.height);
        
        const { unmount } = renderAuthPage();

        // All interactive elements should be present and clickable
        const interactiveElements = [
          screen.getByPlaceholderText('Enter your email'),
          screen.getByPlaceholderText('Enter your password'),
          screen.getByText('Sign In'),
          screen.getByText('Create an account'),
          screen.getByRole('button', { name: '' }) // Password toggle
        ];

        interactiveElements.forEach((element, index) => {
          expect(element, 
            `Interactive element ${index} not accessible on ${viewport.name}`
          ).toBeInTheDocument();
          
          // Element should be large enough for touch (minimum 44px recommended)
          const rect = element.getBoundingClientRect();
          const minTouchSize = 44;
          
          expect(Math.max(rect.width, rect.height),
            `Element ${index} too small for touch on ${viewport.name} (${rect.width}x${rect.height})`
          ).toBeGreaterThanOrEqual(minTouchSize * 0.8); // Allow some tolerance
        });

        unmount();
      }
    });

    it('should prevent horizontal scrolling on narrow screens', async () => {
      const narrowViewports = viewportSizes.filter(v => v.width <= 414);
      
      for (const viewport of narrowViewports) {
        setViewportSize(viewport.width, viewport.height);
        
        const { container, unmount } = renderAuthPage();

        // Check that no elements cause horizontal overflow
        const bodyWidth = document.body.scrollWidth;
        const viewportWidth = viewport.width;
        
        expect(bodyWidth,
          `Horizontal overflow detected on ${viewport.name} (body: ${bodyWidth}px, viewport: ${viewportWidth}px)`
        ).toBeLessThanOrEqual(viewportWidth + 20); // Allow small tolerance for scrollbars

        // Test with form content
        const emailInput = screen.getByPlaceholderText('Enter your email');
        fireEvent.change(emailInput, { target: { value: 'very.long.email.address@example.com' } });

        // Long content should not cause overflow
        const newBodyWidth = document.body.scrollWidth;
        expect(newBodyWidth,
          `Long content caused overflow on ${viewport.name}`
        ).toBeLessThanOrEqual(viewportWidth + 20);

        unmount();
      }
    });

    it('should maintain form field proportions across screen sizes', async () => {
      for (const viewport of viewportSizes) {
        setViewportSize(viewport.width, viewport.height);
        
        const { unmount } = renderAuthPage();

        const emailInput = screen.getByPlaceholderText('Enter your email');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const submitButton = screen.getByText('Sign In');

        // Form fields should maintain reasonable proportions
        const emailRect = emailInput.getBoundingClientRect();
        const passwordRect = passwordInput.getBoundingClientRect();
        const buttonRect = submitButton.getBoundingClientRect();

        // Fields should be similar width (within 10px)
        expect(Math.abs(emailRect.width - passwordRect.width),
          `Form field width mismatch on ${viewport.name}`
        ).toBeLessThan(10);

        // Button should span similar width as inputs
        expect(Math.abs(buttonRect.width - emailRect.width),
          `Button width mismatch on ${viewport.name}`
        ).toBeLessThan(10);

        // Fields should have reasonable height (not too cramped or too spacious)
        expect(emailRect.height,
          `Email field too small on ${viewport.name}`
        ).toBeGreaterThan(40);
        
        expect(emailRect.height,
          `Email field too large on ${viewport.name}`
        ).toBeLessThan(80);

        unmount();
      }
    });

    it('should handle password strength indicator responsively', async () => {
      for (const viewport of viewportSizes) {
        setViewportSize(viewport.width, viewport.height);
        
        const { unmount } = renderAuthPage();

        // Switch to signup mode
        const signupButton = screen.getByText('Create an account');
        fireEvent.click(signupButton);

        await waitFor(() => {
          expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
        });

        const passwordInput = screen.getByPlaceholderText('Enter your password');
        fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

        // Password strength indicator should appear and be properly sized
        await waitFor(() => {
          expect(screen.getByText('Strong')).toBeInTheDocument();
        });

        // Strength indicator should not cause layout issues
        const strengthElement = screen.getByText('Strong');
        const strengthRect = strengthElement.getBoundingClientRect();
        
        expect(strengthRect.width,
          `Strength indicator width issue on ${viewport.name}`
        ).toBeGreaterThan(0);

        unmount();
      }
    });

    it('should maintain accessibility across all viewport sizes', async () => {
      for (const viewport of viewportSizes) {
        setViewportSize(viewport.width, viewport.height);
        
        const { unmount } = renderAuthPage();

        // All form elements should maintain proper labels and accessibility
        const emailInput = screen.getByPlaceholderText('Enter your email');
        const passwordInput = screen.getByPlaceholderText('Enter your password');

        // Inputs should be focusable
        emailInput.focus();
        expect(document.activeElement,
          `Email input not focusable on ${viewport.name}`
        ).toBe(emailInput);

        passwordInput.focus();
        expect(document.activeElement,
          `Password input not focusable on ${viewport.name}`
        ).toBe(passwordInput);

        // Tab navigation should work
        emailInput.focus();
        fireEvent.keyDown(emailInput, { key: 'Tab' });
        
        // Focus should move to next interactive element
        expect(document.activeElement,
          `Tab navigation broken on ${viewport.name}`
        ).not.toBe(emailInput);

        unmount();
      }
    });

    it('should handle error messages responsively', async () => {
      for (const viewport of viewportSizes) {
        setViewportSize(viewport.width, viewport.height);
        
        const { unmount } = renderAuthPage();

        const emailInput = screen.getByPlaceholderText('Enter your email');
        
        // Trigger validation error
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        fireEvent.blur(emailInput);

        await waitFor(() => {
          expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
        });

        // Error message should be visible and not cause layout issues
        const errorElement = screen.getByText('Please enter a valid email address');
        const errorRect = errorElement.getBoundingClientRect();
        
        expect(errorRect.width,
          `Error message width issue on ${viewport.name}`
        ).toBeGreaterThan(0);
        
        expect(errorRect.height,
          `Error message height issue on ${viewport.name}`
        ).toBeGreaterThan(0);

        // Error should not cause horizontal overflow
        expect(errorRect.right,
          `Error message causes overflow on ${viewport.name}`
        ).toBeLessThanOrEqual(viewport.width + 20);

        unmount();
      }
    });

    it('should maintain consistent spacing and layout proportions', async () => {
      const testViewports = [
        { width: 320, height: 568, name: 'Mobile Small' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 1920, height: 1080, name: 'Desktop' }
      ];

      const layoutMeasurements = [];

      for (const viewport of testViewports) {
        setViewportSize(viewport.width, viewport.height);
        
        const { unmount } = renderAuthPage();

        const emailInput = screen.getByPlaceholderText('Enter your email');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        
        const emailRect = emailInput.getBoundingClientRect();
        const passwordRect = passwordInput.getBoundingClientRect();
        
        // Measure spacing between form elements
        const spacing = passwordRect.top - emailRect.bottom;
        
        layoutMeasurements.push({
          viewport: viewport.name,
          spacing: spacing,
          fieldHeight: emailRect.height
        });

        unmount();
      }

      // Spacing should be proportional across different screen sizes
      // Larger screens should have proportionally larger spacing
      const mobileSpacing = layoutMeasurements.find(m => m.viewport === 'Mobile Small').spacing;
      const desktopSpacing = layoutMeasurements.find(m => m.viewport === 'Desktop').spacing;
      
      // Desktop spacing should be at least as much as mobile (responsive scaling)
      expect(desktopSpacing,
        'Desktop spacing should be at least as much as mobile spacing'
      ).toBeGreaterThanOrEqual(mobileSpacing * 0.8);
    });
  });

  describe('Responsive Interaction Property', () => {
    it('should handle orientation changes gracefully', async () => {
      // Portrait mobile
      setViewportSize(375, 667);
      const { unmount } = renderAuthPage();

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      
      // Switch to landscape
      setViewportSize(667, 375);
      
      // Content should still be accessible
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();

      unmount();
    });

    it('should maintain form functionality during viewport changes', async () => {
      setViewportSize(320, 568);
      const { unmount } = renderAuthPage();

      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      // Change viewport size
      setViewportSize(1920, 1080);

      // Form state should be preserved
      expect(emailInput.value).toBe('test@example.com');
      
      // Form should still be functional
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      expect(passwordInput.value).toBe('password123');

      unmount();
    });
  });
});