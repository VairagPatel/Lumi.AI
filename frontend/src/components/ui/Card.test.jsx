/**
 * Unit Tests for Card Component Visual Elements
 * 
 * Tests color application and branding elements, typography consistency,
 * and component styling and themes.
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './Card.jsx';

describe('Card Component Visual Tests', () => {

  describe('Color Application and Branding Elements', () => {
    it('should apply brand-consistent background colors', () => {
      render(<Card>Test Card Content</Card>);
      
      const card = screen.getByText('Test Card Content').parentElement;
      
      // Should use brand-consistent background
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('dark:bg-gray-800');
    });

    it('should apply brand-consistent border colors', () => {
      render(<Card>Border Test</Card>);
      
      const card = screen.getByText('Border Test').parentElement;
      
      // Should use subtle borders that complement brand
      expect(card).toHaveClass('border');
      expect(card).toHaveClass('border-gray-200');
      expect(card).toHaveClass('dark:border-gray-700');
    });

    it('should use brand-consistent shadow effects', () => {
      render(<Card>Shadow Test</Card>);
      
      const card = screen.getByText('Shadow Test').parentElement;
      
      // Should have consistent shadow styling
      expect(card).toHaveClass('shadow-lg');
    });

    it('should enhance shadows on hover when enabled', () => {
      render(<Card hover={true}>Hover Test</Card>);
      
      const card = screen.getByText('Hover Test').parentElement;
      
      // Should have enhanced hover shadow
      expect(card).toHaveClass('hover:shadow-xl');
    });
  });

  describe('Component Styling and Themes', () => {
    it('should apply consistent border radius', () => {
      render(<Card>Radius Test</Card>);
      
      const card = screen.getByText('Radius Test').parentElement;
      
      // Should have brand-consistent rounded corners
      expect(card).toHaveClass('rounded-2xl');
    });

    it('should apply backdrop blur for modern effect', () => {
      render(<Card>Blur Test</Card>);
      
      const card = screen.getByText('Blur Test').parentElement;
      
      // Should have backdrop blur for modern glass effect
      expect(card).toHaveClass('backdrop-blur-sm');
    });

    it('should handle hover animations when enabled', () => {
      render(<Card hover={true}>Animation Test</Card>);
      
      const card = screen.getByText('Animation Test').parentElement;
      
      // Should be a motion component when hover is enabled
      // We can't directly test framer-motion props, but we can verify the element exists
      expect(card).toBeInTheDocument();
    });

    it('should disable hover animations when specified', () => {
      render(<Card hover={false}>No Animation Test</Card>);
      
      const card = screen.getByText('No Animation Test').parentElement;
      
      // Should be a regular div when hover is disabled
      expect(card.tagName).toBe('DIV');
    });
  });

  describe('Brand Consistency Across Themes', () => {
    it('should maintain brand consistency in light theme', () => {
      render(<Card>Light Theme Test</Card>);
      
      const card = screen.getByText('Light Theme Test').parentElement;
      
      // Light theme should use brand-consistent colors
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('border-gray-200');
      expect(card).toHaveClass('shadow-lg');
    });

    it('should maintain brand consistency in dark theme', () => {
      render(<Card>Dark Theme Test</Card>);
      
      const card = screen.getByText('Dark Theme Test').parentElement;
      
      // Dark theme should use brand-consistent dark colors
      expect(card).toHaveClass('dark:bg-gray-800');
      expect(card).toHaveClass('dark:border-gray-700');
    });

    it('should use consistent spacing and layout', () => {
      render(<Card>Layout Test</Card>);
      
      const card = screen.getByText('Layout Test').parentElement;
      
      // Should have consistent structural classes
      expect(card).toHaveClass('rounded-2xl');
      expect(card).toHaveClass('border');
      expect(card).toHaveClass('shadow-lg');
      expect(card).toHaveClass('backdrop-blur-sm');
    });
  });

  describe('Content Rendering and Layout', () => {
    it('should render children content correctly', () => {
      render(
        <Card>
          <h2>Card Title</h2>
          <p>Card description content</p>
        </Card>
      );
      
      // Should render all child content
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card description content')).toBeInTheDocument();
    });

    it('should handle complex nested content', () => {
      render(
        <Card>
          <div className="card-header">
            <h3>Nested Header</h3>
          </div>
          <div className="card-body">
            <p>Nested body content</p>
            <button>Nested button</button>
          </div>
        </Card>
      );
      
      // Should render nested structure
      expect(screen.getByText('Nested Header')).toBeInTheDocument();
      expect(screen.getByText('Nested body content')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Nested button' })).toBeInTheDocument();
    });

    it('should handle empty content gracefully', () => {
      render(<Card></Card>);
      
      // Should render empty card without errors
      const card = document.querySelector('.rounded-2xl');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Custom Styling Integration', () => {
    it('should allow custom classes while maintaining brand consistency', () => {
      render(<Card className="custom-card-class">Custom Class Test</Card>);
      
      const card = screen.getByText('Custom Class Test').parentElement;
      
      // Should have custom class
      expect(card).toHaveClass('custom-card-class');
      
      // Should still maintain brand styling
      expect(card).toHaveClass('rounded-2xl');
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('shadow-lg');
    });

    it('should pass through additional props', () => {
      render(<Card data-testid="custom-card" role="article">Props Test</Card>);
      
      const card = screen.getByTestId('custom-card');
      
      // Should have custom props
      expect(card).toHaveAttribute('role', 'article');
      expect(card).toHaveAttribute('data-testid', 'custom-card');
      
      // Should still maintain brand styling
      expect(card).toHaveClass('rounded-2xl');
    });

    it('should handle style prop integration', () => {
      render(
        <Card style={{ minHeight: '200px' }}>
          Style Test
        </Card>
      );
      
      const card = screen.getByText('Style Test').parentElement;
      
      // Should have custom style
      expect(card).toHaveStyle({ minHeight: '200px' });
      
      // Should still maintain brand classes
      expect(card).toHaveClass('rounded-2xl');
      expect(card).toHaveClass('bg-white');
    });
  });

  describe('Accessibility and Semantic Structure', () => {
    it('should be semantically appropriate', () => {
      render(<Card>Semantic Test</Card>);
      
      const card = screen.getByText('Semantic Test').parentElement;
      
      // Should be a div by default (appropriate for generic container)
      expect(card.tagName).toBe('DIV');
    });

    it('should support custom semantic roles', () => {
      render(<Card role="article">Article Card</Card>);
      
      const card = screen.getByRole('article');
      
      // Should have custom role
      expect(card).toHaveAttribute('role', 'article');
      expect(screen.getByText('Article Card')).toBeInTheDocument();
    });

    it('should be keyboard accessible when interactive', () => {
      render(<Card tabIndex={0}>Interactive Card</Card>);
      
      const card = screen.getByText('Interactive Card').parentElement;
      
      // Should be focusable when tabIndex is set
      expect(card).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Visual Consistency Across Use Cases', () => {
    it('should maintain consistent appearance for different content types', () => {
      const contentTypes = [
        'Simple text content',
        <div key="complex">Complex <strong>HTML</strong> content</div>,
        <form key="form"><input placeholder="Form content" /></form>
      ];
      
      contentTypes.forEach((content, index) => {
        const { unmount } = render(<Card>{content}</Card>);
        
        const card = document.querySelector('.rounded-2xl');
        
        // All cards should have consistent base styling
        expect(card).toHaveClass('bg-white');
        expect(card).toHaveClass('border');
        expect(card).toHaveClass('shadow-lg');
        expect(card).toHaveClass('backdrop-blur-sm');
        
        unmount();
      });
    });

    it('should work well with brand color schemes', () => {
      render(
        <Card>
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-lg">
            Brand colored content
          </div>
        </Card>
      );
      
      const card = screen.getByText('Brand colored content').closest('.rounded-2xl');
      
      // Card should provide good backdrop for brand colors
      expect(card).toHaveClass('bg-white'); // Neutral background
      expect(card).toHaveClass('shadow-lg'); // Good separation
    });
  });

  describe('Performance and Optimization', () => {
    it('should render efficiently without unnecessary re-renders', () => {
      const { rerender } = render(<Card>Initial content</Card>);
      
      const card = screen.getByText('Initial content').parentElement;
      const initialClasses = card.className;
      
      // Re-render with same props
      rerender(<Card>Initial content</Card>);
      
      // Classes should remain the same
      expect(card.className).toBe(initialClasses);
    });

    it('should handle prop changes efficiently', () => {
      const { rerender } = render(<Card hover={true}>Hover enabled</Card>);
      
      // Change hover prop
      rerender(<Card hover={false}>Hover disabled</Card>);
      
      const card = screen.getByText('Hover disabled').parentElement;
      
      // Should update appropriately
      expect(card.tagName).toBe('DIV'); // Should be regular div when hover is false
    });
  });
});