/**
 * User Display Utilities
 * 
 * Provides functions for displaying user information in the UI with proper
 * fallback logic and privacy-conscious display options.
 */

/**
 * Resolves the best display name for a user based on available data
 * Priority: firstName (from fullName) > username > email username part
 * 
 * @param {Object} user - User object
 * @param {string} user.email - User's email address (required)
 * @param {string} [user.username] - User's username (optional)
 * @param {string} [user.fullName] - User's full name (optional)
 * @returns {string} The best display name for the user
 */
export const getUserDisplayName = (user) => {
  // Validate input
  if (!user || typeof user !== 'object') {
    return 'User';
  }

  // Priority 1: First name from fullName
  if (user.fullName && typeof user.fullName === 'string') {
    const trimmedFullName = user.fullName.trim();
    if (trimmedFullName) {
      // Extract first name, handle special characters and multiple spaces
      const firstName = trimmedFullName.split(/\s+/)[0];
      if (firstName && firstName.length > 0) {
        // Clean up special characters but preserve international characters
        const cleanFirstName = firstName.replace(/[^\p{L}\p{N}\-']/gu, '');
        if (cleanFirstName.length > 0) {
          return cleanFirstName;
        }
      }
    }
  }

  // Priority 2: Username
  if (user.username && typeof user.username === 'string') {
    const trimmedUsername = user.username.trim();
    if (trimmedUsername) {
      // Clean username of special characters except common ones
      const cleanUsername = trimmedUsername.replace(/[^\p{L}\p{N}\-_.]/gu, '');
      if (cleanUsername.length > 0) {
        return cleanUsername;
      }
    }
  }

  // Priority 3: Username part of email
  if (user.email && typeof user.email === 'string') {
    const trimmedEmail = user.email.trim();
    if (trimmedEmail && trimmedEmail.includes('@')) {
      const emailUsername = trimmedEmail.split('@')[0];
      if (emailUsername && emailUsername.length > 0) {
        // Clean email username of special characters
        const cleanEmailUsername = emailUsername.replace(/[^\p{L}\p{N}\-_.]/gu, '');
        if (cleanEmailUsername.length > 0) {
          return cleanEmailUsername;
        }
      }
    }
  }

  // Final fallback
  return 'User';
};

/**
 * Generates user initials for avatar display
 * Uses fullName if available, otherwise falls back to username or email
 * 
 * @param {Object} user - User object
 * @param {string} user.email - User's email address (required)
 * @param {string} [user.username] - User's username (optional)
 * @param {string} [user.fullName] - User's full name (optional)
 * @returns {string} User initials (1-2 characters, uppercase)
 */
export const getUserInitials = (user) => {
  // Validate input
  if (!user || typeof user !== 'object') {
    return 'U';
  }

  // Priority 1: Initials from fullName
  if (user.fullName && typeof user.fullName === 'string') {
    const trimmedFullName = user.fullName.trim();
    if (trimmedFullName) {
      const nameParts = trimmedFullName.split(/\s+/).filter(part => part.length > 0);
      if (nameParts.length >= 2) {
        // First and last name initials
        const firstInitial = getFirstValidChar(nameParts[0]);
        const lastInitial = getFirstValidChar(nameParts[nameParts.length - 1]);
        if (firstInitial && lastInitial) {
          return (firstInitial + lastInitial).toUpperCase();
        }
      } else if (nameParts.length === 1) {
        // Single name - take first character
        const initial = getFirstValidChar(nameParts[0]);
        if (initial) {
          return initial.toUpperCase();
        }
      }
    }
  }

  // Priority 2: First character of username
  if (user.username && typeof user.username === 'string') {
    const trimmedUsername = user.username.trim();
    if (trimmedUsername) {
      const initial = getFirstValidChar(trimmedUsername);
      if (initial) {
        return initial.toUpperCase();
      }
    }
  }

  // Priority 3: First character of email username
  if (user.email && typeof user.email === 'string') {
    const trimmedEmail = user.email.trim();
    if (trimmedEmail && trimmedEmail.includes('@')) {
      const emailUsername = trimmedEmail.split('@')[0];
      if (emailUsername && emailUsername.length > 0) {
        const initial = getFirstValidChar(emailUsername);
        if (initial) {
          return initial.toUpperCase();
        }
      }
    }
  }

  // Final fallback
  return 'U';
};

/**
 * Gets the first valid character from a string (letter or number)
 * 
 * @param {string} str - Input string
 * @returns {string|null} First valid character or null if none found
 */
const getFirstValidChar = (str) => {
  if (!str || typeof str !== 'string') {
    return null;
  }

  // Find first letter or number (supports international characters)
  const match = str.match(/[\p{L}\p{N}]/u);
  return match ? match[0] : null;
};

/**
 * Creates a complete user display object with all computed properties
 * 
 * @param {Object} user - User object
 * @param {string} user.email - User's email address (required)
 * @param {string} [user.username] - User's username (optional)
 * @param {string} [user.fullName] - User's full name (optional)
 * @returns {Object} Complete user display object
 */
export const createUserDisplay = (user) => {
  return {
    displayName: getUserDisplayName(user),
    initials: getUserInitials(user),
    fullName: user?.fullName || null,
    username: user?.username || null,
    email: user?.email || null,
    hasFullName: Boolean(user?.fullName?.trim()),
    hasUsername: Boolean(user?.username?.trim())
  };
};

/**
 * Validates if a user object has the minimum required data
 * 
 * @param {Object} user - User object to validate
 * @returns {boolean} True if user has minimum required data
 */
export const isValidUser = (user) => {
  return user && 
         typeof user === 'object' && 
         user.email && 
         typeof user.email === 'string' && 
         user.email.trim().length > 0;
};