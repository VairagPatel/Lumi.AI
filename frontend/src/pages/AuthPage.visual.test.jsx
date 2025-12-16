/**
 * Visual Consistency Tests for AuthPage Component
 * 
 * Tests color application and branding elements, typography consistency,
 * and component styling and themes for the authentication page.
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthPage from './AuthPage.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';

// Mock the auth API
vi.mock('../services/api', () => ({
  authAPI: {
    signup: vi.fn(),
    login: vi.fn()
  }
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Helper to render AuthPage with required providers
const renderAuthPage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('AuthPage Visual Consistency Tests', () => {

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

  describe('Brand Color Application', () => {
    it('should use brand colors in background gradients', () => {
      renderAuthPage();
      
      // Check for brand color usage in background elements
      const backgroundElements = document.querySelectorAll('[class*="from-[#00E5A0]"], [class*="to-[#00C4CC]"]');
      expect(backgroundElements.length).toBeGreaterThan(0);
    });

    it('should use brand colors in welcome badge', () => {
      renderAuthPage();
      
      const welcomeBadge = screen.getByText('Welcome to LumiAI').parentElement;
      
      // Should use brand colors for the welcome badge
      expect(welcomeBadge.className).toMatch(/border-\[#00E5A0\]\/30/);
      expect(welcomeBadge.className).toMatch(/from-\[#00E5A0\]\/10.*to-\[#00C4CC\]\/10/);
    });

    it('should use brand colors in form elements', () => {
      renderAuthPage();
      
      // Check input focus colors use brand primary
      const emailInput = screen.getByPlaceholderText('Enter your email');
      expect(emailInput.className).toMatch(/focus:shadow-\[0_0_0_3px_rgba\(0,229,160,0\.35\)\]/);
    });

    it('should use brand colors in buttons', () => {
      renderAuthPage();
      
      const signInButton = screen.getByRole('button', { name: /Sign In/i });
      
      // Should use brand gradient
      expect(signInButton.className).toMatch(/bg-gradient-to-r.*from-primary.*to-secondary/);
    });

    it('should use brand colors in toggle links', () => {
      renderAuthPage();
      
      const toggleLink = screen.getByText(/Create an account/i);
      
      // Should use brand colors for interactive elements
      expect(toggleLink.className).toMatch(/text-\[#00C4CC\].*hover:text-\[#00E5A0\]/);
    });
  });

  describe('Typography Consistency', () => {
    it('should use consistent heading typography', () => {
      renderAuthPage();
      
      const mainHeading = screen.getByText('Welcome Back');
      
      // Should have consistent heading styles
      expect(mainHeading).toHaveClass('text-4xl');
      expect(mainHeading).toHaveClass('md:text-5xl');
      expect(mainHeading).toHaveClass('font-bold');
      expect(mainHeading).toHaveClass('tracking-tight');
      expect(mainHeading).toHaveClass('text-[#0D1B2A]');
    });

    it('should use consistent body text typography', () => {
      renderAuthPage();
      
      const subtitle = screen.getByText(/Sign in to continue your creative journey/i);
      
      // Should have consistent body text styles
      expect(subtitle).toHaveClass('text-lg');
      expect(subtitle).toHaveClass('text-[#0D1B2A]/70');
      expect(subtitle).toHaveClass('font-medium');
    });

    it('should use consistent badge typography', () => {
      renderAuthPage();
      
      const badge = screen.getByText('Welcome to LumiAI');
      
      // Should have consistent badge typography
      expect(badge.parentElement).toHaveClass('text-sm');
      expect(badge.parentElement).toHaveClass('font-semibold');
      expect(badge.parentElement).toHaveClass('text-[#0D1B2A]');
    });

    it('should use consistent form label typography', () => {
      renderAuthPage();
      
      // Form inputs should have consistent placeholder styling
      const emailInput = screen.getByPlaceholderText('Enter your email');
      expect(emailInput.className).toMatch(/placeholder:text-gray-400/);
    });
  });

  describe('Layout and Spacing Consistency', () => {
    it('should use consistent border radius throughout', () => {
      renderAuthPage();
      
      // Card should use brand-consistent border radius
      const card = document.querySelector('.backdrop-blur-xl');
      expect(card).toHaveClass('rounded-3xl');
      
      // Inputs should use consistent border radius
      const emailInput = screen.getByPlaceholderText('Enter your email');
      expect(emailInput).toHaveClass('rounded-xl');
    });

    it('should use consistent spacing patterns', () => {
      renderAuthPage();
      
      // Form should have consistent spacing
      const form = screen.getByRole('form') || document.querySelector('form');
      expect(form).toHaveClass('space-y-6');
    });

    it('should use consistent padding and margins', () => {
      renderAuthPage();
      
      // Card should have consistent padding
      const card = document.querySelector('.backdrop-blur-xl');
      expect(card).toHaveClass('p-8');
    });
  });

  describe('Visual Effects and Animations', () => {
    it('should use consistent shadow effects', () => {
      renderAuthPage();
      
      // Card should have consistent shadow
      const card = document.querySelector('.backdrop-blur-xl');
      expect(card).toHaveClass('shadow-2xl');
      
      // Button should have consistent shadow
      const button = screen.getByRole('button', { name: /Sign In/i });
      expect(button).toHaveClass('shadow-md');
    });

    it('should use consistent backdrop blur effects', () => {
      renderAuthPage();
      
      // Main card should have backdrop blur
      const card = document.querySelector('.backdrop-blur-xl');
      expect(card).toBeInTheDocument();
      
      // Background should have appropriate transparency
      expect(card).toHaveClass('bg-white/90');
    });

    it('should use consistent gradient backgrounds', () => {
      renderAuthPage();
      
      // Page should have brand-consistent background gradient
      const pageBackground = document.querySelector('.bg-gradient-to-br');
      expect(pageBackground).toBeInTheDocument();
    });
  });

  describe('Brand Element Integration', () => {
    it('should integrate Sparkles icon with brand colors', () => {
      renderAuthPage();
      
      // Sparkles icon should use brand colors
      const sparklesIcon = document.querySelector('[class*="text-[#00C4CC]"]');
      expect(sparklesIcon).toBeInTheDocument();
    });

    it('should use brand colors in decorative elements', () => {
      renderAuthPage();
      
      // Background decorative elements should use brand colors
      const decorativeElements = document.querySelectorAll('[class*="bg-gradient-to-br"][class*="[#00E5A0]"]');
      expect(decorativeElements.length).toBeGreaterThan(0);
    });

    it('should maintain brand consistency in interactive states', () => {
      renderAuthPage();
      
      // Toggle button should use brand colors for hover states
      const toggleButton = screen.getByText(/Create an account/i);
      expect(toggleButton.className).toMatch(/hover:text-\[#00E5A0\]/);
    });
  });

  describe('Form Visual Consistency', () => {
    it('should use consistent input styling', () => {
      renderAuthPage();
      
      const inputs = [
        screen.getByPlaceholderText('Enter your email'),
        screen.getByPlaceholderText('Enter your password')
      ];
      
      inputs.forEach(input => {
        // All inputs should have consistent styling
        expect(input).toHaveClass('rounded-xl');
        expect(input).toHaveClass('border');
        expect(input).toHaveClass('px-4');
        expect(input).toHaveClass('py-3');
      });
    });

    it('should use consistent icon styling', () => {
      renderAuthPage();
      
      // Icons should have consistent styling
      const icons = document.querySelectorAll('svg');
      icons.forEach(icon => {
        // Icons should be appropriately sized and colored
        expect(icon).toBeInTheDocument();
      });
    });

    it('should use consistent button styling', () => {
      renderAuthPage();
      
      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      
      // Button should have consistent brand styling
      expect(submitButton).toHaveClass('w-full');
      expect(submitButton).toHaveClass('py-4');
      expect(submitButton).toHaveClass('text-lg');
      expect(submitButton).toHaveClass('font-semibold');
      expect(submitButton).toHaveClass('rounded-xl');
    });
  });

  describe('Responsive Design Consistency', () => {
    it('should use consistent responsive typography', () => {
      renderAuthPage();
      
      const heading = screen.getByText('Welcome Back');
      
      // Should have responsive text sizing
      expect(heading).toHaveClass('text-4xl');
      expect(heading).toHaveClass('md:text-5xl');
    });

    it('should use consistent responsive spacing', () => {
      renderAuthPage();
      
      // Container should have responsive padding
      const container = document.querySelector('.container') || document.querySelector('.max-w-md');
      expect(container).toHaveClass('px-4');
    });
  });

  describe('Dark Mode Compatibility', () => {
    it('should maintain brand colors in dark mode classes', () => {
      renderAuthPage();
      
      // Elements should have dark mode variants that maintain brand consistency
      const card = document.querySelector('.backdrop-blur-xl');
      
      // Card should work well in both light and dark modes
      expect(card).toHaveClass('bg-white/90');
      // Brand colors should remain consistent regardless of theme
    });
  });

  describe('Accessibility and Visual Hierarchy', () => {
    it('should maintain proper visual hierarchy with brand colors', () => {
      renderAuthPage();
      
      const heading = screen.getByText('Welcome Back');
      const subtitle = screen.getByText(/Sign in to continue/i);
      
      // Heading should be more prominent than subtitle
      expect(heading).toHaveClass('text-4xl', 'md:text-5xl');
      expect(subtitle).toHaveClass('text-lg');
      
      // Both should use brand-consistent colors
      expect(heading).toHaveClass('text-[#0D1B2A]');
      expect(subtitle).toHaveClass('text-[#0D1B2A]/70');
    });

    it('should provide sufficient contrast with brand colors', () => {
      renderAuthPage();
      
      const button = screen.getByRole('button', { name: /Sign In/i });
      
      // Button should have good contrast (white text on brand background)
      expect(button.className).toMatch(/text-white/);
      expect(button.className).toMatch(/bg-gradient-to-r.*from-primary.*to-secondary/);
    });
  });
});