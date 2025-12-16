# User Display Utilities

This module provides utilities for displaying user information in the UI with proper fallback logic and privacy-conscious display options.

## Functions

### `getUserDisplayName(user)`

Resolves the best display name for a user based on available data.

**Priority Order:**
1. First name (extracted from `fullName`)
2. Username
3. Username part of email (before @)
4. Fallback to "User"

**Parameters:**
- `user` (Object): User object with email, username, and/or fullName

**Returns:**
- `string`: The best display name for the user

**Example:**
```javascript
import { getUserDisplayName } from './userDisplay';

const user = {
  email: 'john.doe@example.com',
  username: 'johndoe',
  fullName: 'John Doe'
};

console.log(getUserDisplayName(user)); // "John"
```

### `getUserInitials(user)`

Generates user initials for avatar display.

**Priority Order:**
1. First and last name initials from `fullName`
2. First character of username
3. First character of email username part
4. Fallback to "U"

**Parameters:**
- `user` (Object): User object with email, username, and/or fullName

**Returns:**
- `string`: User initials (1-2 characters, uppercase)

**Example:**
```javascript
import { getUserInitials } from './userDisplay';

const user = {
  email: 'john.doe@example.com',
  fullName: 'John Doe'
};

console.log(getUserInitials(user)); // "JD"
```

### `createUserDisplay(user)`

Creates a complete user display object with all computed properties.

**Parameters:**
- `user` (Object): User object with email, username, and/or fullName

**Returns:**
- `Object`: Complete user display object with computed properties

**Example:**
```javascript
import { createUserDisplay } from './userDisplay';

const user = {
  email: 'john.doe@example.com',
  username: 'johndoe',
  fullName: 'John Doe'
};

const display = createUserDisplay(user);
// {
//   displayName: 'John',
//   initials: 'JD',
//   fullName: 'John Doe',
//   username: 'johndoe',
//   email: 'john.doe@example.com',
//   hasFullName: true,
//   hasUsername: true
// }
```

### `isValidUser(user)`

Validates if a user object has the minimum required data.

**Parameters:**
- `user` (Object): User object to validate

**Returns:**
- `boolean`: True if user has minimum required data (valid email)

## Features

- **Privacy-conscious**: Shows first name or username instead of full email
- **International support**: Handles international characters properly
- **Special character handling**: Cleans up invalid characters while preserving valid ones
- **Robust fallbacks**: Always returns a valid display value
- **Edge case handling**: Handles null, undefined, empty, and malformed data gracefully

## Usage in Components

```javascript
import { getUserDisplayName, getUserInitials } from '../utils/userDisplay';

const UserProfile = ({ user }) => {
  return (
    <div>
      <div className="avatar">
        {getUserInitials(user)}
      </div>
      <span>Welcome, {getUserDisplayName(user)}!</span>
    </div>
  );
};
```