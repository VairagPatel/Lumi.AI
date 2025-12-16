/**
 * Unit Tests for Input Component Visual Elements
 * 
 * Tests color application and branding elements, typography consistency,
 * and component styling and themes.
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Input from './Input.jsx';

describe('Input Component Visual Tests', () => {

  describe('Color Application and Branding Elements', () => {
    it('should apply brand colors for focus state', () => {
      render(<Input placeholder="Test input" />);
      
      const input = screen.getByRole('textbox');
      
      // Should use brand color for focus shadow
      expect(input).toHaveClass('focus:shadow-[0_0_0_3px_rgba(0,229,160,0.35)]');
      expect(input).toHaveClass('focus:border-transparent');
    });

    it('should apply brand colors for error state', () => {
      render(<Input error="Test error" placeholder="Error input" />);
      
      const input = screen.getByRole('textbox');
      
      // Should use red for error but maintain brand focus when corrected
      expect(input).toHaveClass('border-red-500');
      expect(input).toHaveClass('focus:shadow-[0_0_0_3px_rgba(239,68,68,0.35)]');
    });

    it('should use consistent border colors', () => {
      render(<Input placeholder="Border test" />);
      
      const input = screen.getByRole('textbox');
      
      // Should use neutral border colors that work with brand
      expect(input).toHaveClass('border-gray-300');
      expect(input).toHaveClass('dark:border-gray-600');
    });

    it('should apply brand-consistent background colors', () => {
      render(<Input placeholder="Background test" />);
      
      const input = screen.getByRole('textbox');
      
      // Should use clean backgrounds that complement brand
      expect(input).toHaveClass('bg-white');
      expect(input).toHaveClass('dark:bg-gray-800');
    });
  });

  describe('Typography Consistency', () => {
    it('should apply consistent text colors', () => {
      render(<Input placeholder="Text color test" />);
      
      const input = screen.getByRole('textbox');
      
      // Should have consistent text colors
      expect(input).toHaveClass('text-gray-900');
      expect(input).toHaveClass('dark:text-white');
    });

    it('should apply consistent placeholder styling', () => {
      render(<Input placeholder="Placeholder test" />);
      
      const input = screen.getByRole('textbox');
      
      // Should have consistent placeholder colors
      expect(input).toHaveClass('placeholder:text-gray-400');
      expect(input).toHaveClass('dark:placeholder:text-gray-500');
    });

    it('should render label with consistent typography', () => {
      render(<Input label="Test Label" placeholder="Label test" />);
      
      const label = screen.getByText('Test Label');
      
      // Should have consistent label styling
      expect(label).toHaveClass('text-sm');
      expect(label).toHaveClass('font-medium');
      expect(label).toHaveClass('text-gray-700');
      expect(label).toHaveClass('dark:text-gray-300');
    });

    it('should render error text with consistent typography', () => {
      render(<Input error="Error message" placeholder="Error test" />);
      
      const errorText = screen.getByText('Error message');
      
      // Should have consistent error text styling
      expect(errorText).toHaveClass('text-sm');
      expect(errorText).toHaveClass('text-red-500');
    });
  });

  describe('Component Styling and Themes', () => {
    it('should apply consistent border radius', () => {
      render(<Input placeholder="Border radius test" />);
      
      const input = screen.getByRole('textbox');
      
      // Should have consistent rounded corners matching brand
      expect(input).toHaveClass('rounded-xl');
    });

    it('should apply consistent padding', () => {
      render(<Input placeholder="Padding test" />);
      
      const input = screen.getByRole('textbox');
      
      // Should have consistent padding
      expect(input).toHaveClass('px-4');
      expect(input).toHaveClass('py-3');
    });

    it('should apply consistent transition effects', () => {
      render(<Input placeholder="Transition test" />);
      
      const input = screen.getByRole('textbox');
      
      // Should have smooth transitions
      expect(input).toHaveClass('transition-all');
      expect(input).toHaveClass('duration-200');
    });

    it('should handle dark mode styling', () => {
      render(<Input placeholder="Dark mode test" />);
      
      const input = screen.getByRole('textbox');
      
      // Should have dark mode classes
      expect(input).toHaveClass('dark:bg-gray-800');
      expect(input).toHaveClass('dark:border-gray-600');
      expect(input).toHaveClass('dark:text-white');
    });

    it('should apply full width styling', () => {
      render(<Input placeholder="Width test" />);
      
      const input = screen.getByRole('textbox');
      const container = input.parentElement;
      
      // Container should be full width
      expect(container).toHaveClass('w-full');
      // Input should be full width
      expect(input).toHaveClass('w-full');
    });
  });

  describe('Brand Consistency Across States', () => {
    it('should maintain brand consistency in normal state', () => {
      render(<Input placeholder="Normal state" />);
      
      const input = screen.getByRole('textbox');
      
      // Should have brand-consistent styling
      expect(input).toHaveClass('outline-none');
      expect(input).toHaveClass('ring-0');
      expect(input).toHaveClass('focus:border-transparent');
    });

    it('should maintain brand consistency in error state', () => {
      render(<Input error="Error state" placeholder="Error state" />);
      
      const input = screen.getByRole('textbox');
      
      // Error state should still use brand-consistent patterns
      expect(input).toHaveClass('border-red-500');
      expect(input).toHaveClass('rounded-xl'); // Still brand border radius
      expect(input).toHaveClass('px-4'); // Still brand padding
    });

    it('should use brand colors for focus enhancement', () => {
      render(<Input placeholder="Focus test" />);
      
      const input = screen.getByRole('textbox');
      
      // Focus should use brand primary color
      const focusClasses = input.className;
      expect(focusClasses).toMatch(/rgba\(0,229,160,0\.35\)/); // Brand primary with opacity
    });
  });

  describe('Label and Error Integration', () => {
    it('should properly associate label with input', () => {
      render(<Input label="Associated Label" placeholder="Label association test" />);
      
      const label = screen.getByText('Associated Label');
      const input = screen.getByRole('textbox');
      
      // Label should be properly associated
      expect(label.tagName).toBe('LABEL');
      expect(input).toHaveAccessibleName('Associated Label');
    });

    it('should display error message with proper spacing', () => {
      render(<Input error="Spacing error" placeholder="Error spacing test" />);
      
      const errorText = screen.getByText('Spacing error');
      
      // Error should have proper margin
      expect(errorText).toHaveClass('mt-1.5');
    });

    it('should handle label spacing consistently', () => {
      render(<Input label="Spaced Label" placeholder="Label spacing test" />);
      
      const label = screen.getByText('Spaced Label');
      
      // Label should have consistent bottom margin
      expect(label).toHaveClass('mb-1.5');
    });
  });

  describe('Accessibility and Visual Feedback', () => {
    it('should provide clear visual feedback for different states', () => {
      const { rerender } = render(<Input placeholder="State feedback test" />);
      let input = screen.getByRole('textbox');
      
      // Normal state
      expect(input).toHaveClass('border-gray-300');
      
      // Error state
      rerender(<Input error="Error feedback" placeholder="State feedback test" />);
      input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
    });

    it('should maintain readability with brand colors', () => {
      render(<Input placeholder="Readability test" />);
      
      const input = screen.getByRole('textbox');
      
      // Should have good contrast
      expect(input).toHaveClass('text-gray-900'); // Dark text on light background
      expect(input).toHaveClass('bg-white'); // Light background
    });

    it('should be keyboard accessible', () => {
      render(<Input placeholder="Keyboard test" />);
      
      const input = screen.getByRole('textbox');
      
      // Should be focusable and accessible
      expect(input).not.toHaveAttribute('tabindex', '-1');
      expect(input.tagName).toBe('INPUT');
    });
  });

  describe('Custom Styling Integration', () => {
    it('should allow custom classes while maintaining brand consistency', () => {
      render(<Input className="custom-input-class" placeholder="Custom class test" />);
      
      const input = screen.getByRole('textbox');
      
      // Should have custom class
      expect(input).toHaveClass('custom-input-class');
      
      // Should still maintain brand styling
      expect(input).toHaveClass('rounded-xl');
      expect(input).toHaveClass('px-4');
      expect(input).toHaveClass('py-3');
    });

    it('should handle different input types consistently', () => {
      const { rerender } = render(<Input type="email" placeholder="Email test" />);
      let input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveClass('rounded-xl'); // Brand consistency

      rerender(<Input type="password" placeholder="Password test" />);
      input = screen.getByPlaceholderText('Password test');
      expect(input).toHaveAttribute('type', 'password');
      expect(input).toHaveClass('rounded-xl'); // Brand consistency
    });
  });
});