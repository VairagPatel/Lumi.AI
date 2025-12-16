// Accessibility utilities for better screen reader support and keyboard navigation

/**
 * Announces text to screen readers
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Manages focus trap for modals and dropdowns
 */
export class FocusTrap {
  constructor(element) {
    this.element = element;
    this.focusableElements = this.getFocusableElements();
    this.firstFocusableElement = this.focusableElements[0];
    this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];
  }

  getFocusableElements() {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    return Array.from(this.element.querySelectorAll(focusableSelectors));
  }

  activate() {
    this.element.addEventListener('keydown', this.handleKeyDown.bind(this));
    if (this.firstFocusableElement) {
      this.firstFocusableElement.focus();
    }
  }

  deactivate() {
    this.element.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === this.firstFocusableElement) {
          e.preventDefault();
          this.lastFocusableElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === this.lastFocusableElement) {
          e.preventDefault();
          this.firstFocusableElement.focus();
        }
      }
    }
  }
}

/**
 * Checks if an element meets WCAG color contrast requirements
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - Whether the contrast is sufficient
 */
export const checkColorContrast = (element) => {
  const style = window.getComputedStyle(element);
  const backgroundColor = style.backgroundColor;
  const color = style.color;
  
  // This is a simplified check - in production, you'd use a proper contrast calculation library
  const bgLuminance = getLuminance(backgroundColor);
  const textLuminance = getLuminance(color);
  
  const contrast = (Math.max(bgLuminance, textLuminance) + 0.05) / 
                  (Math.min(bgLuminance, textLuminance) + 0.05);
  
  // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
  return contrast >= 4.5;
};

/**
 * Simple luminance calculation (simplified for demo)
 * @param {string} color - CSS color value
 * @returns {number} - Luminance value
 */
const getLuminance = (color) => {
  // This is a very simplified implementation
  // In production, use a proper color library like chroma.js
  if (color === 'rgb(255, 255, 255)' || color === '#ffffff' || color === 'white') {
    return 1;
  }
  if (color === 'rgb(0, 0, 0)' || color === '#000000' || color === 'black') {
    return 0;
  }
  return 0.5; // Default middle value for demo
};

/**
 * Adds skip links for keyboard navigation
 */
export const addSkipLinks = () => {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded';
  
  document.body.insertBefore(skipLink, document.body.firstChild);
};

/**
 * Validates form accessibility
 * @param {HTMLFormElement} form - The form to validate
 * @returns {Array} - Array of accessibility issues
 */
export const validateFormAccessibility = (form) => {
  const issues = [];
  
  // Check for labels
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const label = form.querySelector(`label[for="${input.id}"]`);
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');
    
    if (!label && !ariaLabel && !ariaLabelledBy) {
      issues.push(`Input ${input.name || input.type} is missing a label`);
    }
  });
  
  // Check for required field indicators
  const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  requiredInputs.forEach(input => {
    const ariaRequired = input.getAttribute('aria-required');
    if (ariaRequired !== 'true') {
      issues.push(`Required input ${input.name || input.type} should have aria-required="true"`);
    }
  });
  
  return issues;
};

/**
 * Screen reader only text utility
 */
export const ScreenReaderOnly = ({ children }) => (
  <span className="sr-only">{children}</span>
);

/**
 * Keyboard navigation helpers
 */
export const keyboardNavigation = {
  isNavigationKey: (key) => {
    return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(key);
  },
  
  isActivationKey: (key) => {
    return ['Enter', ' '].includes(key);
  },
  
  handleMenuNavigation: (e, items, currentIndex, onSelect) => {
    let newIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        newIndex = (currentIndex + 1) % items.length;
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect(currentIndex);
        return currentIndex;
    }
    
    if (newIndex !== currentIndex && items[newIndex]) {
      items[newIndex].focus();
    }
    
    return newIndex;
  }
};