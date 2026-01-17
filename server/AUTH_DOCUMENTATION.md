# Authentication System Documentation

## Overview

The CloudArch LeetCode platform uses a comprehensive JWT-based authentication system with the following features:

- User registration and login
- Token-based authentication with JWT
- Token refresh mechanism
- Logout with token blacklist
- Password reset flow
- Password change (authenticated)
- Rate limiting for security
- Centralized auth middleware

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Middleware](#middleware)
3. [Security Features](#security-features)
4. [Environment Variables](#environment-variables)
5. [Usage Examples](#usage-examples)
6. [Error Codes](#error-codes)

---

## Authentication Endpoints

### 1. Register

**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "username": "string (min 3 characters)",
  "email": "string (valid email)",
  "password": "string (min 6 characters)"
}
```

**Response (201):**
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "user@example.com"
  }
}
```

**Rate Limit:** 10 requests per 15 minutes per IP

---

### 2. Login

**POST** `/api/auth/login`

Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "string (valid email)",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "user@example.com",
    "totalScore": 0,
    "solvedChallenges": 0
  }
}
```

**Rate Limit:** 5 attempts per 15 minutes per IP (only failed attempts count)

---

### 3. Get Current User

**GET** `/api/auth/me`

Get the currently authenticated user's profile.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "id": "user_id",
  "username": "username",
  "email": "user@example.com",
  "totalScore": 1250,
  "solvedChallenges": [
    {
      "challengeId": "challenge_id",
      "cost": 45.5,
      "complexity": 3,
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ],
  "rank": 5,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 4. Logout

**POST** `/api/auth/logout`

Invalidate the current JWT token.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

**Note:** The token is added to a blacklist and will no longer be valid for authentication.

---

### 5. Refresh Token

**POST** `/api/auth/refresh`

Get a new JWT token before the current one expires.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "token": "new_jwt_token_string",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "user@example.com",
    "totalScore": 1250,
    "solvedChallenges": 5
  }
}
```

**Note:** The old token is automatically blacklisted.

---

### 6. Forgot Password

**POST** `/api/auth/forgot-password`

Request a password reset token.

**Request Body:**
```json
{
  "email": "string (valid email)"
}
```

**Response (200):**
```json
{
  "message": "If an account with that email exists, a password reset link has been sent.",
  "resetToken": "token_string" // Only in development mode
}
```

**Rate Limit:** 3 requests per hour per IP

**Note:** For security, the response is the same whether the email exists or not.

---

### 7. Reset Password

**POST** `/api/auth/reset-password`

Reset password using a reset token.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "password": "string (min 6 characters)"
}
```

**Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

**Token Validity:** 1 hour from generation

---

### 8. Change Password

**POST** `/api/auth/change-password`

Change password for authenticated users.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string (min 6 characters)"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

---

## Middleware

### authenticateToken

Verifies JWT token and adds `userId` to request object.

**Usage:**
```javascript
const { authenticateToken } = require('../middleware/auth');

router.get('/protected', authenticateToken, (req, res) => {
  // req.userId is available
  res.json({ userId: req.userId });
});
```

**Error Responses:**
- `401` - No token provided
- `401` - Invalid token
- `401` - Token expired (code: `TOKEN_EXPIRED`)
- `401` - Token revoked (logged out)

---

### optionalAuth

Same as `authenticateToken` but doesn't fail if no token is provided.

**Usage:**
```javascript
const { optionalAuth } = require('../middleware/auth');

router.get('/public', optionalAuth, (req, res) => {
  // req.userId may or may not be present
  if (req.userId) {
    // User is authenticated
  } else {
    // Anonymous user
  }
});
```

---

### includeUser

Chain with `authenticateToken` to include full user object in request.

**Usage:**
```javascript
const { authenticateToken, includeUser } = require('../middleware/auth');

router.get('/profile', authenticateToken, includeUser, (req, res) => {
  // req.user contains full user object
  res.json(req.user);
});
```

---

## Security Features

### 1. Rate Limiting

- **Auth endpoints:** 10 requests per 15 minutes
- **Login:** 5 attempts per 15 minutes (failed only)
- **Password reset:** 3 requests per hour
- **General API:** 100 requests per 15 minutes

**Disable in development:**
```env
DISABLE_RATE_LIMIT=true
```

### 2. Token Blacklist

- Logged out tokens are blacklisted
- Blacklist is memory-based (use Redis in production)
- Tokens auto-expire from blacklist after 7 days

### 3. Password Security

- Passwords hashed with bcrypt (10 salt rounds)
- Minimum 6 characters required
- Password reset tokens hashed with SHA-256
- Reset tokens expire after 1 hour

### 4. Input Validation

- Email validation and normalization
- Username minimum 3 characters
- Trim whitespace from inputs
- Prevent duplicate usernames/emails

---

## Environment Variables

```env
# Required
JWT_SECRET=your_jwt_secret_key_here

# Optional
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Rate Limiting
DISABLE_RATE_LIMIT=false
ENABLE_RATE_LIMIT=true

# LLM Evaluation (optional)
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
```

**Production Notes:**
- Always set `JWT_SECRET` to a strong random string
- Never commit `.env` file to version control
- Use environment-specific `.env` files

---

## Usage Examples

### Frontend: Registration

```javascript
const register = async (username, email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });

  const data = await response.json();

  if (response.ok) {
    // Save token
    localStorage.setItem('token', data.token);
    return data.user;
  } else {
    throw new Error(data.message);
  }
};
```

---

### Frontend: Login

```javascript
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem('token', data.token);
    return data.user;
  } else {
    throw new Error(data.message);
  }
};
```

---

### Frontend: Authenticated Request

```javascript
const submitSolution = async (challengeId, architecture, provider) => {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:5000/api/submissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ challengeId, architecture, provider })
  });

  if (response.status === 401) {
    // Token expired or invalid
    const data = await response.json();

    if (data.code === 'TOKEN_EXPIRED') {
      // Try to refresh token
      await refreshToken();
      // Retry request
      return submitSolution(challengeId, architecture, provider);
    } else {
      // Invalid token - redirect to login
      window.location.href = '/login';
    }
  }

  return response.json();
};
```

---

### Frontend: Token Refresh

```javascript
const refreshToken = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:5000/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data.token;
  } else {
    // Refresh failed - redirect to login
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Session expired');
  }
};
```

---

### Frontend: Logout

```javascript
const logout = async () => {
  const token = localStorage.getItem('token');

  await fetch('http://localhost:5000/api/auth/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  localStorage.removeItem('token');
  window.location.href = '/login';
};
```

---

### Frontend: Password Reset Flow

```javascript
// Step 1: Request reset
const requestPasswordReset = async (email) => {
  const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  return response.json();
};

// Step 2: Reset with token (from email link)
const resetPassword = async (token, password) => {
  const response = await fetch('http://localhost:5000/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password })
  });

  if (response.ok) {
    window.location.href = '/login';
  } else {
    const data = await response.json();
    throw new Error(data.message);
  }
};
```

---

## Error Codes

| Code | Description | Action |
|------|-------------|--------|
| `TOKEN_EXPIRED` | JWT token has expired | Refresh token or re-login |
| `INVALID_TOKEN` | JWT token is malformed | Clear token and redirect to login |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Wait and retry |
| `LOGIN_RATE_LIMIT_EXCEEDED` | Too many login attempts | Wait 15 minutes |
| `PASSWORD_RESET_RATE_LIMIT_EXCEEDED` | Too many reset requests | Wait 1 hour |
| `API_RATE_LIMIT_EXCEEDED` | Too many API calls | Slow down requests |

---

## Production Deployment Checklist

- [ ] Set strong `JWT_SECRET` (32+ random characters)
- [ ] Enable rate limiting (`ENABLE_RATE_LIMIT=true`)
- [ ] Set up Redis for token blacklist (replace in-memory Set)
- [ ] Configure email service for password reset
- [ ] Set up HTTPS/TLS for all endpoints
- [ ] Configure CORS for production domain
- [ ] Set up monitoring for failed auth attempts
- [ ] Implement refresh token rotation
- [ ] Add 2FA/MFA support (optional)
- [ ] Set up logging for security events
- [ ] Regular security audits

---

## Architecture Diagram

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ HTTP(S) + JWT
       │
       ▼
┌──────────────────────────────────┐
│       Express Server             │
│                                  │
│  ┌────────────────────────────┐ │
│  │  Rate Limiter Middleware   │ │
│  └────────────┬───────────────┘ │
│               │                  │
│  ┌────────────▼───────────────┐ │
│  │   Auth Middleware          │ │
│  │   - Verify JWT             │ │
│  │   - Check Blacklist        │ │
│  │   - Attach userId          │ │
│  └────────────┬───────────────┘ │
│               │                  │
│  ┌────────────▼───────────────┐ │
│  │     Auth Routes            │ │
│  │  /register                 │ │
│  │  /login                    │ │
│  │  /logout                   │ │
│  │  /refresh                  │ │
│  │  /forgot-password          │ │
│  │  /reset-password           │ │
│  │  /change-password          │ │
│  │  /me                       │ │
│  └────────────┬───────────────┘ │
│               │                  │
└───────────────┼──────────────────┘
                │
                ▼
       ┌────────────────┐
       │  Firebase/     │
       │  Firestore DB  │
       └────────────────┘
```

---

## Support

For issues or questions:
- Check error codes above
- Review environment variables
- Enable debug logging
- Check rate limit status in response headers

---

*Last Updated: 2024*
