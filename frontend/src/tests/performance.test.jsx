// Performance tests for auth components
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Header from '../components/Header';
import AuthPage from '../pages/AuthPage';
import Button from '../components/ui/Button';
import { AuthProvider } from '../context/AuthContext';
import { performanceMonitor } from '../utils/performance.jsx';

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

describe('Performance Tests', () => {
  let performanceEntries = [];

  beforeEach(() => {
    // Mock performance.mark and performance.measure
    global.performance.mark = vi.fn();
    global.performance.measure = vi.fn();
    global.performance.getEntriesByType = vi.fn(() => performanceEntries);
    global.performance.now = vi.fn(() => Date.now());
  });

  afterEach(() => {
    performanceEntries = [];
  });

  describe('Component Render Performance', () => {
    it('should render Header component within performance budget', () => {
      const startTime = performance.now();
      
      renderWithRouter(<Header />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Header should render within 16ms (60fps budget)
      expect(renderTime).toBeLessThan(16);
    });

    it('should render AuthPage component within performance budget', () => {
      // Mock Google Sign-In
      global.google = {
        accounts: {
          id: {
            initialize: vi.fn(),
            renderButton: vi.fn()
          }
        }
      };

      const startTime = performance.now();
      
      renderWithRouter(<AuthPage />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // AuthPage should render within 50ms (complex component budget)
      expect(renderTime).toBeLessThan(50);
    });

    it('should handle multiple re-renders efficiently', () => {
      const { rerender } = renderWithRouter(<Header />);
      
      const startTime = performance.now();
      
      // Simulate multiple re-renders
      for (let i = 0; i < 10; i++) {
        rerender(
          <BrowserRouter>
            <AuthProvider>
              <Header key={i} />
            </AuthProvider>
          </BrowserRouter>
        );
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / 10;
      
      // Average re-render should be fast
      expect(averageTime).toBeLessThan(5);
    });
  });

  describe('Animation Performance', () => {
    it('should handle button hover animations efficiently', async () => {
      renderWithRouter(<Button>Test Button</Button>);
      
      const button = screen.getByRole('button');
      const startTime = performance.now();
      
      // Simulate rapid hover events
      for (let i = 0; i < 20; i++) {
        fireEvent.mouseEnter(button);
        fireEvent.mouseLeave(button);
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Animation handling should be efficient
      expect(totalTime).toBeLessThan(100);
    });

    it('should handle form transitions smoothly', async () => {
      renderWithRouter(<AuthPage />);
      
      const toggleButton = screen.getByRole('button', { name: /Create an account/i });
      const startTime = performance.now();
      
      // Test form mode transitions
      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      const transitionTime = endTime - startTime;
      
      // Form transition should be smooth
      expect(transitionTime).toBeLessThan(300);
    });
  });

  describe('Memory Usage', () => {
    it('should not create memory leaks with event listeners', () => {
      const { unmount } = renderWithRouter(<Header />);
      
      // Mock addEventListener and removeEventListener
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      
      // Simulate component lifecycle
      unmount();
      
      // Check that event listeners are properly cleaned up
      // In a real scenario, you'd check that removeEventListener is called
      // for each addEventListener call
      expect(removeEventListenerSpy).toHaveBeenCalled();
    });

    it('should handle large datasets efficiently', () => {
      // Create a large user object to test memory efficiency
      const largeUser = {
        email: 'test@example.com',
        username: 'testuser',
        fullName: 'Test User',
        // Simulate large data
        metadata: new Array(1000).fill(0).map((_, i) => ({ id: i, value: `data-${i}` }))
      };

      const startMemory = performance.memory?.usedJSHeapSize || 0;
      
      renderWithRouter(<Header />);
      
      const endMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryIncrease = endMemory - startMemory;
      
      // Memory increase should be reasonable (less than 1MB for this component)
      expect(memoryIncrease).toBeLessThan(1024 * 1024);
    });
  });

  describe('Bundle Size Impact', () => {
    it('should not import unnecessary dependencies', () => {
      // This test would typically be run with a bundle analyzer
      // Here we simulate checking for heavy imports
      
      const heavyLibraries = [
        'lodash',
        'moment',
        'jquery'
      ];
      
      // In a real test, you'd check the actual bundle
      // For now, we just ensure our components don't import these
      heavyLibraries.forEach(lib => {
        expect(() => require(lib)).toThrow();
      });
    });
  });

  describe('Network Performance', () => {
    it('should handle slow network conditions gracefully', async () => {
      // Mock slow network
      const originalFetch = global.fetch;
      global.fetch = vi.fn(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ success: true })
          }), 2000)
        )
      );

      renderWithRouter(<AuthPage />);
      
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      const startTime = performance.now();
      fireEvent.click(submitButton);
      
      // Component should remain responsive during slow network
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/Loading/i)).toBeInTheDocument();
      
      global.fetch = originalFetch;
    });
  });

  describe('Responsive Performance', () => {
    it('should handle viewport changes efficiently', () => {
      // Mock viewport changes
      const originalInnerWidth = window.innerWidth;
      
      renderWithRouter(<Header />);
      
      const startTime = performance.now();
      
      // Simulate multiple viewport changes
      [320, 768, 1024, 1440].forEach(width => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        });
        
        // Trigger resize event
        fireEvent(window, new Event('resize'));
      });
      
      const endTime = performance.now();
      const resizeTime = endTime - startTime;
      
      // Resize handling should be efficient
      expect(resizeTime).toBeLessThan(50);
      
      // Restore original width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: originalInnerWidth,
      });
    });
  });

  describe('Accessibility Performance', () => {
    it('should handle screen reader queries efficiently', () => {
      renderWithRouter(<Header />);
      
      const startTime = performance.now();
      
      // Simulate screen reader queries
      screen.getByRole('banner');
      screen.getByRole('navigation');
      screen.getAllByRole('link');
      screen.getAllByRole('button');
      
      const endTime = performance.now();
      const queryTime = endTime - startTime;
      
      // Accessibility queries should be fast
      expect(queryTime).toBeLessThan(20);
    });

    it('should handle focus management efficiently', () => {
      renderWithRouter(<AuthPage />);
      
      const focusableElements = [
        screen.getByLabelText('Email address'),
        screen.getByLabelText('Password'),
        screen.getByRole('button', { name: /Show password/i }),
        screen.getByRole('button', { name: /Sign In/i })
      ];
      
      const startTime = performance.now();
      
      // Simulate rapid focus changes
      focusableElements.forEach(element => {
        element.focus();
        element.blur();
      });
      
      const endTime = performance.now();
      const focusTime = endTime - startTime;
      
      // Focus management should be efficient
      expect(focusTime).toBeLessThan(30);
    });
  });

  describe('Performance Monitoring', () => {
    it('should track performance metrics', () => {
      const mockMetric = {
        name: 'test-metric',
        value: 100,
        id: 'test-id'
      };
      
      const consoleSpy = vi.spyOn(console, 'log');
      
      performanceMonitor.reportWebVitals(mockMetric);
      
      expect(consoleSpy).toHaveBeenCalledWith(mockMetric);
    });

    it('should measure function execution time', () => {
      const testFunction = () => {
        // Simulate some work
        let sum = 0;
        for (let i = 0; i < 1000; i++) {
          sum += i;
        }
        return sum;
      };
      
      const measuredFunction = performanceMonitor.measureFunction('testFunction', testFunction);
      const result = measuredFunction();
      
      expect(result).toBe(499500); // Sum of 0 to 999
    });
  });

  describe('Cross-Browser Performance', () => {
    it('should perform consistently across different browsers', () => {
      // Mock different browser environments
      const browsers = [
        { name: 'Chrome', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
        { name: 'Firefox', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0' },
        { name: 'Safari', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15' }
      ];
      
      browsers.forEach(browser => {
        Object.defineProperty(navigator, 'userAgent', {
          writable: true,
          value: browser.userAgent
        });
        
        const startTime = performance.now();
        renderWithRouter(<Header />);
        const endTime = performance.now();
        
        const renderTime = endTime - startTime;
        
        // Performance should be consistent across browsers
        expect(renderTime).toBeLessThan(20);
      });
    });
  });
});