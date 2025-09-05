# Authentication Frontend

A production-ready React authentication frontend with JWT token management, phone-based authentication, and OAuth integration.

## Features

- 📱 Phone-based authentication with OTP verification
- 🔐 JWT access and refresh token management
- 🔄 Automatic token refresh with secure storage
- 🌐 OAuth integration (Google, Facebook, GitHub)
- 🛡️ Protected routes and authentication guards
- 📱 Mobile-first responsive design
- ⚡ Real-time form validation
- 🎨 Beautiful UI with smooth animations

## Architecture

### Authentication Flow

1. **Login**: Phone → OTP → Dashboard
2. **Signup**: Phone → OTP → Registration → Dashboard
3. **OAuth**: Provider selection → Callback handling → Dashboard

### Security Features

- HTTP-only cookies for token storage
- Automatic token refresh before expiry
- CSRF protection with SameSite cookies
- Request/response interceptors for seamless auth
- Secure token validation and error handling

### Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── ui/             # Reusable UI components
│   ├── dashboard/      # Protected dashboard
│   └── common/         # Shared components
├── contexts/           # React Context providers
├── services/           # API service layer
├── types/              # TypeScript definitions
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

## Setup

1. Copy `.env.example` to `.env` and configure your API endpoints
2. Update the `API_BASE_URL` in `src/services/api.ts`
3. Configure OAuth provider credentials if using OAuth
4. Start the development server with `npm run dev`

## Backend API Requirements

The frontend expects the following API endpoints:

### Authentication Endpoints

- `POST /auth/login/send-otp` - Send login OTP
- `POST /auth/login/verify-otp` - Verify login OTP
- `POST /auth/signup` - Send signup OTP
- `POST /auth/signup/verify-otp` - Verify signup OTP
- `POST /auth/signup/complete` - Complete registration
- `POST /auth/refresh` - Refresh tokens
- `POST /auth/logout` - Logout user
- `GET /auth/profile` - Get user profile

### OAuth Endpoints

- `GET /auth/oauth/{provider}` - Initiate OAuth flow
- `POST /auth/oauth/{provider}/callback` - Handle OAuth callback

### Response Format

All API responses should follow this format:

```json
{
  "success": boolean,
  "message": string,
  "data": any
}
```

### Token Headers

JWT tokens should be returned in response headers:
- `x-access-token`: JWT access token
- `x-refresh-token`: JWT refresh token

## Usage

The application automatically handles:
- Token storage and retrieval
- Token refresh before expiry
- Route protection based on authentication status
- Error handling and user feedback
- Loading states during API calls

## Production Deployment

Before deploying to production:

1. Update `VITE_API_BASE_URL` to your production API
2. Ensure HTTPS is enabled for secure cookie transmission
3. Configure proper CORS settings on your backend
4. Set up proper error monitoring and logging
5. Review and test all authentication flows thoroughly