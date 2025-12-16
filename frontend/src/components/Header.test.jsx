/**
 * Unit Tests for Header Component
 * 
 * Tests user display with various user data combinations, tooltip functionality,
 * accessibility, and responsive behavior.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header.jsx';
import useAuthStore from '../store/useAuthStore.js';

// Mock the auth store
vi.mock('../store/useAuthStore.js', () => ({
  default: vi.fn()
}));

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Helper to render Header with router context
const renderHeader = () => {
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
};

describe('Header Component Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('User Display with Various Data Combinations', () => {
    it('should display user with full name correctly', () => {
      const mockUser = {
        email: 'john.doe@example.com',
        username: 'johndoe',
        fullName: 'John Doe'
      };

      useAuthStore.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        logout: vi.fn()
      });

      renderHeader();

      // Should show first name from full name
      expect(screen.getByText('👋 John')).toBeInTheDocument();
      
      // Should show user avatar with initials
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should display user with username fallback', () => {
      const mockUser = {
        email: 'testuser@example.com',
        username: 'testuser'
      };

      useAuthStore.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        logout: vi.fn()
      });

      renderHeader();

      // Should show username when no full name
      expect(screen.getByText('👋 testuser')).toBeInTheDocument();
      
      // Should show user avatar with initial from username
      expect(screen.getByText('T')).toBeInTheDocument();
    });

    it('should display user with email fallback', () => {
      const mockUser = {
        email: 'johndoe@example.com'
      };

      useAuthStore.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        logout: vi.fn()
      });

      renderHeader();

      // Should show email username part when no full name or username
      expect(screen.getByText('👋 johndoe')).toBeInTheDocument();
      
      // Should show user avatar with initial from email
      expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('should handle special characters in names', () => {
      const mockUser = {
        email: 'jose@example.com',
        fullName: 'José María González'
      };

      useAuthStore.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        logout: vi.fn()
      });

      renderHeader();

      // Should handle international characters correctly
      expect(screen.getByText('👋 José')).toBeInTheDocument();
      expect(screen.getByText('JM')).toBeInTheDocument();
    });

    it('should show login button when not authenticated', () => {
      useAuthStore.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: vi.fn()
      });

      renderHeader();

      // Should show login button instead of user info
      expect(screen.getByText('Login / Sign Up')).toBeInTheDocument();
      expect(screen.queryByText(/👋/)).not.toBeInTheDocument();
    });
  });

  describe('Tooltip Functionality', () => {
    it('should show tooltip on hover with full user information', async () => {
      const mockUser = {
        email: 'john.doe@example.com',
        username: 'johndoe',
        fullName: 'John Doe'
      };

      useAuthStore.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        logout: vi.fn()
      });

      renderHeader();

      // Find the user display element
      const userDisplay = screen.getByRole('button', { name: /User: John/ });
      
      // Hover over user display
      fireEvent.mouseEnter(userDisplay);

      // Wait for tooltip to appear
      await waitFor(() => {
        expect(screen.getByText('Name:')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Username:')).toBeInTheDocument();
        expect(screen.getByText('johndoe')).toBeInTheDocument();
        expect(screen.getByText('Email:')).toBeInTheDocument();
        expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      });

      // Mouse leave should hide tooltip
      fireEvent.mouseLeave(userDisplay);
      
      await waitFor(() => {
        expect(screen.queryByText('Name:')).not.toBeInTheDocument();
      });
    });

    it('should show tooltip on keyboard focus', async () => {
      const mockUser = {
        email: 'john.doe@example.com',
        fullName: 'John Doe'
      };

      useAuthStore.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        logout: vi.fn()
      });

      renderHeader();

      const userDisplay = screen.getByRole('button', { name: /User: John/ });
      
      // Focus should show tooltip
      fireEvent.focus(userDisplay);

      await waitFor(() => {
        expect(screen.getByText('Email:')).toBeInTheDocument();
      });

      // Blur should hide tooltip
      fireEvent.blur(userDisplay);
      
      await waitFor(() => {
        expect(screen.queryByText('Email:')).not.toBeInTheDocument();
      });
    });

    it('should handle tooltip with partial user data', async () => {
      const mockUser = {
        email: 'test@example.com'
        // No username or fullName
      };

      useAuthStore.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        logout: vi.fn()
      });

      renderHeader();

      const userDisplay = screen.getByRole('button', { name: /User: test/ });
      fireEvent.mouseEnter(userDisplay);

      await waitFor(() => {
        // Should only show email, not name or username sections
        expect(screen.getByText('Email:')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        expect(screen.queryByText('Name:')).not.toBeInTheDocument();
        expect(screen.queryByText('Username:')).not.toBeInTheDocument();
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('should show mobile menu when burger button is clicked', () => {
      useAuthStore.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: vi.fn()
      });

      renderHeader();

      // Find and click burger menu button
      const burgerButton = screen.getByRole('button', { name: /Toggle menu/ });
      fireEvent.click(burgerButton);

      // Mobile menu should be visible
      expect(screen.getAllByText('Home')).toHaveLength(2); // Desktop + mobile
      expect(screen.getAllByText('Create')).toHaveLength(2);
    });

    it('should show user info in mobile menu when authenticated', () => {
      const mockUser = {
        email: 'mobile@example.com',
        fullName: 'Mobile User'
      };

      useAuthStore.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        logout: vi.fn()
      });

      renderHeader();

      // Open mobile menu
      const burgerButton = screen.getByRole('button', { name: /Toggle menu/ });
      fireEvent.click(burgerButton);

      // Should show user info in mobile format
      expect(screen.getByText('Mobile')).toBeInTheDocument();
      expect(screen.getByText('mobile@example.com')).toBeInTheDocument();
      expect(screen.getByText('MU')).toBeInTheDocument(); // Initials
    });

    it('should close mobile menu when navigation item is clicked', () => {
      useAuthStore.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: vi.fn()
      });

      renderHeader();

      // Open mobile menu
      const burgerButton = screen.getByRole('button', { name: /Toggle menu/ });
      fireEvent.click(burgerButton);

      // Click a navigation item
      const mobileHomeLink = screen.getAllByText('Home')[1]; // Mobile version
      fireEvent.click(mobileHomeLink);

      // Menu should close (only desktop nav items visible)
      expect(screen.getAllByText('Home')).toHaveLength(1);
    });
  });

  describe('Authentication Actions', () => {
    it('should call logout function when logout button is clicked', () => {
      const mockLogout = vi.fn();
      const mockUser = {
        email: 'test@example.com',
        fullName: 'Test User'
      };

      useAuthStore.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        logout: mockLogout
      });

      renderHeader();

      // Click logout button
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      expect(mockLogout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/auth');
    });

    it('should navigate to auth page when login button is clicked', () => {
      useAuthStore.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: vi.fn()
      });

      renderHeader();

      // Click login button
      const loginButton = screen.getByText('Login / Sign Up');
      fireEvent.click(loginButton);

      // Should navigate to auth page (handled by Link component)
      expect(loginButton.closest('a')).toHaveAttribute('href', '/auth');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      const mockUser = {
        email: 'test@example.com',
        fullName: 'Test User'
      };

      useAuthStore.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        logout: vi.fn()
      });

      renderHeader();

      // User display should have proper accessibility attributes
      const userDisplay = screen.getByRole('button', { name: /User: Test/ });
      expect(userDisplay).toHaveAttribute('tabIndex', '0');
      expect(userDisplay).toHaveAttribute('role', 'button');

      // Burger menu should have proper label
      const burgerButton = screen.getByRole('button', { name: /Toggle menu/ });
      expect(burgerButton).toHaveAttribute('aria-label', 'Toggle menu');
    });

    it('should be keyboard navigable', () => {
      const mockUser = {
        email: 'test@example.com',
        fullName: 'Test User'
      };

      useAuthStore.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        logout: vi.fn()
      });

      renderHeader();

      // User display should be focusable
      const userDisplay = screen.getByRole('button', { name: /User: Test/ });
      userDisplay.focus();
      expect(document.activeElement).toBe(userDisplay);
    });
  });

  describe('Brand and Navigation', () => {
    it('should render LumiAI brand correctly', () => {
      useAuthStore.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: vi.fn()
      });

      renderHeader();

      // Should show brand logo and text
      expect(screen.getByText('L')).toBeInTheDocument(); // Logo
      expect(screen.getByText('LumiAI')).toBeInTheDocument(); // Brand name
    });

    it('should render all navigation items', () => {
      useAuthStore.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: vi.fn()
      });

      renderHeader();

      // Should show all main navigation items
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Create')).toBeInTheDocument();
      expect(screen.getByText('Features')).toBeInTheDocument();
      expect(screen.getByText('Gallery')).toBeInTheDocument();
      expect(screen.getByText('FAQ')).toBeInTheDocument();
    });

    it('should show Profile link when authenticated', () => {
      const mockUser = {
        email: 'test@example.com',
        fullName: 'Test User'
      };

      useAuthStore.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        logout: vi.fn()
      });

      renderHeader();

      // Profile link should be visible when authenticated
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });
  });
});