/**
 * Property-Based Tests for Color Palette Consistency
 * 
 * **Feature: auth-header-redesign, Property 4: Color Palette Consistency**
 * **Validates: Requirements 5.1, 5.2**
 */

import { describe, it, expect } from 'vitest';
import { 
  BRAND_COLORS, 
  BRAND_GRADIENTS, 
  getBrandGradient, 
  getBrandTextGradient,
  getBrandBorder,
  getBrandBackground,
  BUTTON_VARIANTS,
  validateBrandColor,
  hexToRgb,
  generateCSSVariables
} from './brandColors.js';

describe('Color Palette Consistency Property Tests', () => {

  /**
   * Property 4: Color Palette Consistency
   * For any UI element on the auth page, only the approved color palette 
   * (#00E5A0, #00C4CC) should be used for brand elements
   */
  it('should only use approved brand colors in the palette', () => {
    const approvedColors = ['#00E5A0', '#00C4CC', '#00B8A9', '#0D1B2A', '#F9FAFB', '#F3F4F6'];
    
    // Test that all brand colors are from approved palette
    Object.values(BRAND_COLORS).forEach((color, index) => {
      expect(color, `Brand color ${index + 1} should be from approved palette`).toMatch(/^#[0-9A-F]{6}$/i);
      
      // Primary and secondary should be the main brand colors
      if (color === BRAND_COLORS.primary) {
        expect(color, 'Primary color should be mint green').toBe('#00E5A0');
      }
      if (color === BRAND_COLORS.secondary) {
        expect(color, 'Secondary color should be teal').toBe('#00C4CC');
      }
    });
  });

  it('should generate consistent gradient classes', () => {
    const gradientTypes = ['primary', 'primaryReverse', 'primaryAccent', 'background', 'glow'];
    
    gradientTypes.forEach(type => {
      const gradient = getBrandGradient(type);
      const textGradient = getBrandTextGradient(type);
      
      // Should be valid Tailwind classes
      expect(gradient, `Gradient ${type} should start with bg-gradient-to-r`).toContain('bg-gradient-to-r');
      expect(textGradient, `Text gradient ${type} should contain bg-clip-text`).toContain('bg-clip-text text-transparent');
      
      // Should use brand colors
      if (type === 'primary') {
        expect(gradient, 'Primary gradient should use primary and secondary colors').toContain('from-primary to-secondary');
      }
    });
  });

  it('should generate valid border and background utilities', () => {
    const opacities = [10, 20, 30, 50];
    
    opacities.forEach(opacity => {
      const border = getBrandBorder(opacity);
      const background = getBrandBackground(opacity);
      
      // Should be valid Tailwind opacity classes
      expect(border, `Border with ${opacity}% opacity should be valid`).toBe(`border-primary/${opacity}`);
      expect(background, `Background with ${opacity}% opacity should be valid`).toBe(`bg-primary/${opacity}`);
    });
  });

  it('should validate brand colors correctly', () => {
    // Valid brand colors
    const validColors = Object.values(BRAND_COLORS);
    validColors.forEach(color => {
      expect(validateBrandColor(color), `${color} should be a valid brand color`).toBe(true);
    });

    // Invalid colors
    const invalidColors = ['#FF0000', '#123456', '#ABCDEF', 'red', 'blue'];
    invalidColors.forEach(color => {
      expect(validateBrandColor(color), `${color} should not be a valid brand color`).toBe(false);
    });
  });

  it('should convert hex colors to RGB correctly', () => {
    const testCases = [
      { hex: '#00E5A0', expected: { r: 0, g: 229, b: 160 } },
      { hex: '#00C4CC', expected: { r: 0, g: 196, b: 204 } },
      { hex: '#0D1B2A', expected: { r: 13, g: 27, b: 42 } },
      { hex: '#FFFFFF', expected: { r: 255, g: 255, b: 255 } },
      { hex: '#000000', expected: { r: 0, g: 0, b: 0 } }
    ];

    testCases.forEach(({ hex, expected }) => {
      const result = hexToRgb(hex);
      expect(result, `${hex} should convert to RGB`).toEqual(expected);
    });

    // Invalid hex should return null
    expect(hexToRgb('invalid')).toBe(null);
    expect(hexToRgb('#GGG')).toBe(null);
  });

  it('should generate valid CSS variables', () => {
    const cssVars = generateCSSVariables();
    
    // Should contain all brand colors
    Object.keys(BRAND_COLORS).forEach(colorName => {
      expect(cssVars, `CSS variables should contain ${colorName}`).toContain(`--color-${colorName}`);
    });

    // Should be valid CSS format
    expect(cssVars, 'CSS variables should end with semicolons').toMatch(/;$/);
    expect(cssVars, 'CSS variables should contain hex colors').toMatch(/#[0-9A-F]{6}/i);
  });

  /**
   * Property: Button variants should use consistent brand colors
   * All button variants should only use approved brand colors
   */
  it('should use brand colors in all button variants', () => {
    Object.entries(BUTTON_VARIANTS).forEach(([variant, classes]) => {
      // Should use Tailwind classes with brand colors
      if (variant === 'primary') {
        expect(classes, 'Primary button should use brand gradient').toContain('from-primary to-secondary');
      }
      if (variant === 'secondary') {
        expect(classes, 'Secondary button should use dark color').toContain('bg-dark');
        expect(classes, 'Secondary button hover should use primary').toContain('hover:bg-primary');
      }
      if (variant === 'outline') {
        expect(classes, 'Outline button should use primary border').toContain('border-primary');
        expect(classes, 'Outline button should use primary text').toContain('text-primary');
      }
      
      // Should not contain hardcoded hex colors
      expect(classes, `${variant} button should not contain hardcoded hex colors`).not.toMatch(/#[0-9A-F]{6}/i);
    });
  });

  /**
   * Property: Color consistency across different opacity levels
   * Brand colors should maintain consistency when used with different opacity levels
   */
  it('should maintain color consistency across opacity levels', () => {
    const opacityLevels = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90];
    
    opacityLevels.forEach(opacity => {
      const border = getBrandBorder(opacity);
      const background = getBrandBackground(opacity);
      
      // Should follow consistent pattern
      expect(border, `Border at ${opacity}% should follow pattern`).toBe(`border-primary/${opacity}`);
      expect(background, `Background at ${opacity}% should follow pattern`).toBe(`bg-primary/${opacity}`);
      
      // Should be valid opacity values
      expect(opacity, 'Opacity should be between 0 and 100').toBeGreaterThanOrEqual(0);
      expect(opacity, 'Opacity should be between 0 and 100').toBeLessThanOrEqual(100);
    });
  });

  /**
   * Property: Gradient combinations should use brand colors
   * All gradient combinations should only use approved brand colors
   */
  it('should use brand colors in all gradient combinations', () => {
    Object.entries(BRAND_GRADIENTS).forEach(([gradientName, gradientClasses]) => {
      // Should contain brand color references
      const brandColorNames = ['primary', 'secondary', 'accent', 'light', 'dark'];
      const containsBrandColor = brandColorNames.some(colorName => 
        gradientClasses.includes(colorName)
      );
      
      expect(containsBrandColor, `Gradient ${gradientName} should use brand colors`).toBe(true);
      
      // Should not contain hardcoded hex colors
      expect(gradientClasses, `Gradient ${gradientName} should not contain hex colors`).not.toMatch(/#[0-9A-F]{6}/i);
    });
  });

  /**
   * Property: Brand colors should be accessible
   * Brand colors should meet basic accessibility requirements
   */
  it('should have accessible brand colors', () => {
    // Test contrast between primary colors and white/dark backgrounds
    const primaryRgb = hexToRgb(BRAND_COLORS.primary);
    const secondaryRgb = hexToRgb(BRAND_COLORS.secondary);
    const darkRgb = hexToRgb(BRAND_COLORS.dark);
    
    // Basic luminance calculation (simplified)
    const getLuminance = (rgb) => {
      const { r, g, b } = rgb;
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    };
    
    const primaryLuminance = getLuminance(primaryRgb);
    const secondaryLuminance = getLuminance(secondaryRgb);
    const darkLuminance = getLuminance(darkRgb);
    
    // Primary and secondary should be bright enough for dark backgrounds
    expect(primaryLuminance, 'Primary color should be bright enough').toBeGreaterThan(0.3);
    expect(secondaryLuminance, 'Secondary color should be bright enough').toBeGreaterThan(0.3);
    
    // Dark color should be dark enough for light backgrounds
    expect(darkLuminance, 'Dark color should be dark enough').toBeLessThan(0.3);
  });

  /**
   * Property: Color palette should be complete
   * The brand color palette should contain all necessary color categories
   */
  it('should have a complete color palette', () => {
    const requiredColors = ['primary', 'secondary', 'dark', 'light', 'muted'];
    
    requiredColors.forEach(colorName => {
      expect(BRAND_COLORS, `Brand colors should include ${colorName}`).toHaveProperty(colorName);
      expect(BRAND_COLORS[colorName], `${colorName} should be a valid hex color`).toMatch(/^#[0-9A-F]{6}$/i);
    });
    
    // Should have semantic colors for UI states
    const semanticColors = ['success', 'warning', 'error', 'info'];
    semanticColors.forEach(colorName => {
      expect(BRAND_COLORS, `Brand colors should include semantic color ${colorName}`).toHaveProperty(colorName);
    });
  });
});