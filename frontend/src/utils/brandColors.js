/**
 * LumiAI Brand Color Utilities
 * Centralized color management for consistent branding
 */

// Brand color constants
export const BRAND_COLORS = {
  primary: '#00E5A0',      // Mint Green
  secondary: '#00C4CC',    // Teal
  accent: '#00B8A9',       // Darker Teal
  dark: '#0D1B2A',         // Dark Blue
  light: '#F9FAFB',        // Light Gray
  muted: '#F3F4F6',        // Muted Gray
  success: '#10B981',      // Emerald Green
  warning: '#F59E0B',      // Amber
  error: '#EF4444',        // Red
  info: '#3B82F6'          // Blue
};

// Gradient combinations
export const BRAND_GRADIENTS = {
  primary: 'from-primary to-secondary',
  primaryReverse: 'from-secondary to-primary',
  primaryAccent: 'from-primary to-accent',
  background: 'from-light to-green-50',
  glow: 'from-primary/20 to-secondary/10'
};

// Tailwind class utilities
export const getBrandGradient = (type = 'primary') => {
  return `bg-gradient-to-r ${BRAND_GRADIENTS[type]}`;
};

export const getBrandTextGradient = (type = 'primary') => {
  return `bg-gradient-to-r ${BRAND_GRADIENTS[type]} bg-clip-text text-transparent`;
};

export const getBrandBorder = (opacity = 30) => {
  return `border-primary/${opacity}`;
};

export const getBrandBackground = (opacity = 10) => {
  return `bg-primary/${opacity}`;
};

// Button variants using brand colors
export const BUTTON_VARIANTS = {
  primary: 'bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:shadow-lg',
  secondary: 'bg-dark text-white hover:bg-primary hover:text-dark',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  ghost: 'text-dark hover:bg-primary/10',
  danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg'
};

// Validation function to ensure color consistency
export const validateBrandColor = (colorValue) => {
  const brandValues = Object.values(BRAND_COLORS);
  return brandValues.includes(colorValue);
};

// Helper to convert hex to RGB for opacity usage
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Generate CSS custom properties for brand colors
export const generateCSSVariables = () => {
  return Object.entries(BRAND_COLORS)
    .map(([key, value]) => `--color-${key}: ${value};`)
    .join('\n  ');
};