/**
 * Unit Tests for Button Component Visual Elements
 * 
 * Tests color application and branding elements, typography consistency,
 * and component styling and themes.
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from './Button.jsx';

describe('Button Component Visual Tests', () => {

  describe('Color Application and Branding Elements', () => {
    it('should apply primary brand colors correctly', () => {
      render(<Button variant="primary">Test Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Test Button' });
      
      // Should have primary gradient classes
      expect(button).toHaveClass('bg-gradient-to-r');
      expect(button).toHaveClass('from-[#00E5A0]');
      expect(button).toHaveClass('to-[#00C4CC]');
      expect(button).toHaveClass('text-white');
    });

    it('should apply secondary brand colors correctly', () => {
      render(<Button variant="secondary">Secondary Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Secondary Button' });
      
      // Should use brand colors for secondary variant
      expect(button).toHaveClass('bg-white');
      expect(button).toHaveClass('text-gray-900');
      expect(button).toHaveClass('border-2');
      expect(button).toHaveClass('hover:border-[#00E5A0]');
    });

    it('should apply outline brand colors correctly', () => {
      render(<Button variant="outline">Outline Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Outline Button' });
      
      // Should use primary color for outline
      expect(button).toHaveClass('border-2');
      expect(button).toHaveClass('border-[#00E5A0]');
      expect(button).toHaveClass('text-[#00E5A0]');
      expect(button).toHaveClass('hover:bg-[#00E5A0]');
      expect(button).toHaveClass('hover:text-white');
    });

    it('should not use non-brand colors', () => {
      render(<Button variant="primary">Brand Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Brand Button' });
      
      // Should not contain non-brand colors
      expect(button.className).not.toMatch(/#FF0000|#0000FF|#FFFF00/); // No red, blue, yellow
      expect(button.className).not.toMatch(/bg-red|bg-blue|bg-yellow/); // No non-brand Tailwind colors
    });
  });

  describe('Typography Consistency', () => {
    it('should apply consistent font weight', () => {
      render(<Button>Typography Test</Button>);
      
      const button = screen.getByRole('button', { name: 'Typography Test' });
      
      // Should have consistent font weight
      expect(button).toHaveClass('font-semibold');
    });

    it('should apply correct text size for different button sizes', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      let button = screen.getByRole('button', { name: 'Small' });
      expect(button).toHaveClass('text-sm');

      rerender(<Button size="md">Medium</Button>);
      button = screen.getByRole('button', { name: 'Medium' });
      expect(button).toHaveClass('text-base');

      rerender(<Button size="lg">Large</Button>);
      button = screen.getByRole('button', { name: 'Large' });
      expect(button).toHaveClass('text-lg');
    });

    it('should maintain text alignment', () => {
      render(<Button>Aligned Text</Button>);
      
      const button = screen.getByRole('button', { name: 'Aligned Text' });
      
      // Should center content
      expect(button).toHaveClass('inline-flex');
      expect(button).toHaveClass('items-center');
      expect(button).toHaveClass('justify-center');
    });
  });

  describe('Component Styling and Themes', () => {
    it('should apply consistent border radius', () => {
      render(<Button>Rounded Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Rounded Button' });
      
      // Should have consistent rounded corners
      expect(button).toHaveClass('rounded-xl');
    });

    it('should apply consistent padding for different sizes', () => {
      const { rerender } = render(<Button size="sm">Small Padding</Button>);
      let button = screen.getByRole('button', { name: 'Small Padding' });
      expect(button).toHaveClass('px-3', 'py-1.5');

      rerender(<Button size="md">Medium Padding</Button>);
      button = screen.getByRole('button', { name: 'Medium Padding' });
      expect(button).toHaveClass('px-5', 'py-2.5');

      rerender(<Button size="lg">Large Padding</Button>);
      button = screen.getByRole('button', { name: 'Large Padding' });
      expect(button).toHaveClass('px-7', 'py-3.5');
    });

    it('should apply consistent shadow effects', () => {
      render(<Button variant="primary">Shadow Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Shadow Button' });
      
      // Should have shadow for depth
      expect(button).toHaveClass('shadow-md');
      expect(button).toHaveClass('hover:shadow-lg');
    });

    it('should apply consistent transition effects', () => {
      render(<Button>Transition Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Transition Button' });
      
      // Should have smooth transitions
      expect(button).toHaveClass('transition-all');
      expect(button).toHaveClass('duration-200');
    });

    it('should handle disabled state styling', () => {
      render(<Button disabled>Disabled Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Disabled Button' });
      
      // Should have disabled styling
      expect(button).toHaveClass('disabled:opacity-50');
      expect(button).toHaveClass('disabled:cursor-not-allowed');
      expect(button).toBeDisabled();
    });

    it('should handle loading state styling', () => {
      render(<Button isLoading>Loading Button</Button>);
      
      const button = screen.getByRole('button');
      
      // Should show loading spinner
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(button).toBeDisabled();
      
      // Should have spinner element
      const spinner = button.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Brand Consistency Across Variants', () => {
    it('should maintain brand identity across all variants', () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger'];
      
      variants.forEach(variant => {
        const { unmount } = render(<Button variant={variant}>{variant} Button</Button>);
        const button = screen.getByRole('button', { name: `${variant} Button` });
        
        // All buttons should have consistent base styling
        expect(button).toHaveClass('inline-flex');
        expect(button).toHaveClass('items-center');
        expect(button).toHaveClass('justify-center');
        expect(button).toHaveClass('rounded-xl');
        expect(button).toHaveClass('font-semibold');
        expect(button).toHaveClass('transition-all');
        
        unmount();
      });
    });

    it('should use brand colors appropriately for each variant', () => {
      // Primary should use brand gradient
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      let button = screen.getByRole('button', { name: 'Primary' });
      expect(button.className).toMatch(/from-\[#00E5A0\].*to-\[#00C4CC\]/);

      // Outline should use brand border
      rerender(<Button variant="outline">Outline</Button>);
      button = screen.getByRole('button', { name: 'Outline' });
      expect(button).toHaveClass('border-[#00E5A0]');
      expect(button).toHaveClass('text-[#00E5A0]');
    });
  });

  describe('Accessibility and Visual Feedback', () => {
    it('should provide visual feedback on interaction', () => {
      render(<Button>Interactive Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Interactive Button' });
      
      // Should have hover and active states
      expect(button).toHaveClass('active:scale-[0.98]');
    });

    it('should maintain readability with brand colors', () => {
      render(<Button variant="primary">Readable Text</Button>);
      
      const button = screen.getByRole('button', { name: 'Readable Text' });
      
      // Primary button should have white text on brand background for contrast
      expect(button).toHaveClass('text-white');
      expect(button.className).toMatch(/bg-gradient-to-r/);
    });

    it('should handle focus states appropriately', () => {
      render(<Button>Focusable Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Focusable Button' });
      
      // Should be focusable
      expect(button).not.toHaveAttribute('tabindex', '-1');
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('Custom Styling Integration', () => {
    it('should allow custom classes while maintaining brand consistency', () => {
      render(<Button className="custom-class">Custom Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Custom Button' });
      
      // Should have custom class
      expect(button).toHaveClass('custom-class');
      
      // Should still maintain base brand styling
      expect(button).toHaveClass('rounded-xl');
      expect(button).toHaveClass('font-semibold');
    });

    it('should not override critical brand styling with custom classes', () => {
      render(<Button variant="primary" className="bg-red-500">Brand Override Test</Button>);
      
      const button = screen.getByRole('button', { name: 'Brand Override Test' });
      
      // Should still maintain brand gradient (CSS specificity should favor brand colors)
      expect(button.className).toMatch(/from-\[#00E5A0\].*to-\[#00C4CC\]/);
    });
  });
});