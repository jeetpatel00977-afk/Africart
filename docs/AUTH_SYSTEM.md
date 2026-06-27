# Authentication System

## Overview
Secure authentication system with JWT tokens, phone verification, and encrypted password storage.

## Features
- User registration with email/phone
- Phone OTP verification
- Login with email/phone
- Password reset flow
- JWT token management
- Secure token storage
- Session management
- Biometric authentication support

## API Endpoints

### Register
```
POST /api/auth/register
{
  "email": "user@example.com",
  "phone": "+254712345678",
  "password": "secure_password",
  "first_name": "John",
  "last_name": "Doe"
}

Response:
{
  "success": true,
  "message": "Registration successful. Please verify your phone.",
  "user_id": 1
}
```

### Send OTP
```
POST /api/auth/send-otp
{
  "phone": "+254712345678"
}

Response:
{
  "success": true,
  "message": "OTP sent to your phone"
}
```

### Verify OTP
```
POST /api/auth/verify-otp
{
  "phone": "+254712345678",
  "otp": "123456"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "phone": "+254712345678",
    "first_name": "John"
  }
}
```

### Login
```
POST /api/auth/login
{
  "email_or_phone": "user@example.com",
  "password": "secure_password"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {...}
}
```

### Logout
```
POST /api/auth/logout
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Database Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url VARCHAR(500),
  role VARCHAR(50) DEFAULT 'customer',
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE otp_tokens (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```
