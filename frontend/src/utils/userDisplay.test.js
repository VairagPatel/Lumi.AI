/**
 * Property-Based Tests for User Display Logic
 * 
 * **Feature: auth-header-redesign, Property 1: User Display Name Resolution**
 * **Validates: Requirements 2.1, 2.2, 2.3**
 */

import { describe, it, expect } from 'vitest';
import { getUserDisplayName, getUserInitials, createUserDisplay, isValidUser } from './userDisplay.js';

// Simple property-based testing without external library for now
// We'll generate various user objects and test the display logic

describe('User Display Logic Property Tests', () => {
  
  /**
   * Property 1: User Display Name Resolution
   * For any user object with available data, the header should display the most appropriate name 
   * following the priority: firstName > username > email username part
   */
  it('should always return a valid display name for any user input', () => {
    const testCases = [
      // Test with full name priority
      { 
        user: { email: 'test@example.com', username: 'testuser', fullName: 'John Doe' },
        expected: 'John'
      },
      // Test with username fallback
      { 
        user: { email: 'test@example.com', username: 'testuser' },
        expected: 'testuser'
      },
      // Test with email fallback
      { 
        user: { email: 'johndoe@example.com' },
        expected: 'johndoe'
      },
      // Test with special characters in full name
      { 
        user: { email: 'test@example.com', fullName: 'José María' },
        expected: 'José'
      },
      // Test with empty/whitespace full name
      { 
        user: { email: 'test@example.com', fullName: '   ', username: 'testuser' },
        expected: 'testuser'
      },
      // Test with special characters in username
      { 
        user: { email: 'test@example.com', username: 'test_user-123' },
        expected: 'test_user-123'
      },
      // Test with complex email
      { 
        user: { email: 'john.doe+test@example.com' },
        expected: 'john.doe+test'
      },
      // Test with invalid inputs
      { 
        user: null,
        expected: 'User'
      },
      { 
        user: {},
        expected: 'User'
      },
      { 
        user: { email: '' },
        expected: 'User'
      }
    ];

    testCases.forEach(({ user, expected }, index) => {
      const result = getUserDisplayName(user);
      expect(result, `Test case ${index + 1} failed`).toBe(expected);
      expect(typeof result, `Result should be string for case ${index + 1}`).toBe('string');
      expect(result.length, `Result should not be empty for case ${index + 1}`).toBeGreaterThan(0);
    });
  });

  it('should generate valid initials for any user input', () => {
    const testCases = [
      // Test with full name
      { 
        user: { email: 'test@example.com', fullName: 'John Doe' },
        expected: 'JD'
      },
      // Test with single name
      { 
        user: { email: 'test@example.com', fullName: 'John' },
        expected: 'J'
      },
      // Test with username fallback
      { 
        user: { email: 'test@example.com', username: 'testuser' },
        expected: 'T'
      },
      // Test with email fallback
      { 
        user: { email: 'johndoe@example.com' },
        expected: 'J'
      },
      // Test with special characters
      { 
        user: { email: 'test@example.com', fullName: 'José María' },
        expected: 'JM'
      },
      // Test with invalid inputs
      { 
        user: null,
        expected: 'U'
      },
      { 
        user: {},
        expected: 'U'
      }
    ];

    testCases.forEach(({ user, expected }, index) => {
      const result = getUserInitials(user);
      expect(result, `Initials test case ${index + 1} failed`).toBe(expected);
      expect(typeof result, `Initials should be string for case ${index + 1}`).toBe('string');
      expect(result.length, `Initials should not be empty for case ${index + 1}`).toBeGreaterThan(0);
      expect(result.length, `Initials should be 1-2 characters for case ${index + 1}`).toBeLessThanOrEqual(2);
      expect(result, `Initials should be uppercase for case ${index + 1}`).toBe(result.toUpperCase());
    });
  });

  it('should create consistent user display objects', () => {
    const testUsers = [
      { email: 'test@example.com', username: 'testuser', fullName: 'John Doe' },
      { email: 'jane@example.com', fullName: 'Jane Smith' },
      { email: 'bob@example.com', username: 'bobuser' },
      { email: 'alice@example.com' },
      null,
      {}
    ];

    testUsers.forEach((user, index) => {
      const userDisplay = createUserDisplay(user);
      
      // Verify structure
      expect(userDisplay, `User display object should exist for case ${index + 1}`).toBeDefined();
      expect(typeof userDisplay.displayName, `displayName should be string for case ${index + 1}`).toBe('string');
      expect(typeof userDisplay.initials, `initials should be string for case ${index + 1}`).toBe('string');
      expect(typeof userDisplay.hasFullName, `hasFullName should be boolean for case ${index + 1}`).toBe('boolean');
      expect(typeof userDisplay.hasUsername, `hasUsername should be boolean for case ${index + 1}`).toBe('boolean');
      
      // Verify consistency
      expect(userDisplay.displayName, `displayName should match getUserDisplayName for case ${index + 1}`)
        .toBe(getUserDisplayName(user));
      expect(userDisplay.initials, `initials should match getUserInitials for case ${index + 1}`)
        .toBe(getUserInitials(user));
    });
  });

  it('should validate user objects correctly', () => {
    const validUsers = [
      { email: 'test@example.com' },
      { email: 'test@example.com', username: 'testuser' },
      { email: 'test@example.com', fullName: 'John Doe' }
    ];

    const invalidUsers = [
      null,
      undefined,
      {},
      { username: 'testuser' }, // no email
      { email: '' }, // empty email
      { email: '   ' }, // whitespace email
      'not an object'
    ];

    validUsers.forEach((user, index) => {
      expect(isValidUser(user), `Valid user case ${index + 1} should pass validation`).toBe(true);
    });

    invalidUsers.forEach((user, index) => {
      expect(isValidUser(user), `Invalid user case ${index + 1} should fail validation`).toBe(false);
    });
  });

  /**
   * Property: Display name priority is always respected
   * For any user with multiple name sources, the priority should be: fullName > username > email
   */
  it('should respect display name priority consistently', () => {
    // Test priority: fullName beats username and email
    const userWithAll = {
      email: 'email@example.com',
      username: 'username',
      fullName: 'Full Name'
    };
    expect(getUserDisplayName(userWithAll)).toBe('Full');

    // Test priority: username beats email
    const userWithUsernameAndEmail = {
      email: 'email@example.com',
      username: 'username'
    };
    expect(getUserDisplayName(userWithUsernameAndEmail)).toBe('username');

    // Test fallback to email
    const userWithEmailOnly = {
      email: 'email@example.com'
    };
    expect(getUserDisplayName(userWithEmailOnly)).toBe('email');
  });

  /**
   * Property: Display names should be safe for UI display
   * All display names should be non-empty strings without dangerous characters
   */
  it('should produce UI-safe display names', () => {
    const testUsers = [
      { email: 'test@example.com', fullName: '<script>alert("xss")</script>' },
      { email: 'test@example.com', username: 'user<>&"' },
      { email: 'test@example.com', fullName: '   ' },
      { email: 'test@example.com', username: '' },
      { email: '' }
    ];

    testUsers.forEach((user, index) => {
      const displayName = getUserDisplayName(user);
      
      // Should be non-empty string
      expect(typeof displayName, `Display name should be string for case ${index + 1}`).toBe('string');
      expect(displayName.length, `Display name should not be empty for case ${index + 1}`).toBeGreaterThan(0);
      
      // Should not contain dangerous HTML characters in raw form
      expect(displayName, `Display name should not contain script tags for case ${index + 1}`)
        .not.toContain('<script>');
    });
  });
});