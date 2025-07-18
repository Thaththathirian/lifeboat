# Google OAuth Flow Documentation

## Overview
This document explains the complete Google OAuth authentication flow implemented in the Scholarship Connect platform.

## Flow Summary
1. **Single "Apply Now" Button** → Directly triggers Google OAuth
2. **Google Sign-In** → User authenticates with Google
3. **Token Processing** → JWT token is decoded and sent to backend
4. **Backend Authentication** → Backend verifies token and creates/updates user
5. **Dashboard Redirect** → User is redirected to student dashboard

## Frontend Implementation

### 1. Student Landing Page (`src/pages/StudentLandingPage.tsx`)

The landing page now has a single "Apply Now" button that directly triggers Google OAuth:

```typescript
// Initialize Google OAuth on page load
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  script.onload = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: googleProvider.clientId,
        callback: handleGoogleSignIn,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    }
  };
}, []);

// Handle Google Sign-In
const handleGoogleSignIn = async (response: any) => {
  // Decode JWT token
  const payload = JSON.parse(atob(response.credential.split('.')[1]));
  
  const googleUserData = {
    id: payload.sub,
    name: payload.name,
    email: payload.email,
    picture: payload.picture,
  };
  
  // Send token to backend
  const backendResponse = await authenticateWithBackend(response.credential, googleUserData);
  
  if (backendResponse.success) {
    // Store backend token
    localStorage.setItem('authToken', backendResponse.token);
    
    // Set user profile and navigate
    setProfile({...googleUserData, ...backendResponse.user});
    navigate('/student');
  }
};
```

### 2. Backend Service (`src/utils/backendService.ts`)

The backend service handles token transmission:

```typescript
export const authenticateWithBackend = async (
  googleToken: string, 
  userData: GoogleUser
): Promise<BackendAuthResponse> => {
  const response = await fetch('/api/auth/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      token: googleToken,
      userData: userData
    }),
  });

  const data = await response.json();
  return {
    success: true,
    user: data.user,
    token: data.token
  };
};
```

## Backend API Endpoints

### 1. Google Authentication Endpoint

**POST** `/api/auth/google`

**Request Body:**
```json
{
  "token": "google_jwt_token_here",
  "userData": {
    "id": "google_user_id",
    "name": "User Name", 
    "email": "user@example.com",
    "picture": "profile_picture_url"
  }
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "backend_user_id",
    "googleId": "google_user_id",
    "name": "User Name",
    "email": "user@example.com", 
    "picture": "profile_picture_url",
    "status": "Profile Pending",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "backend_jwt_token"
}
```

### 2. Session Verification Endpoint

**GET** `/api/auth/verify`

**Headers:**
```
Authorization: Bearer backend_jwt_token
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "backend_user_id",
    "googleId": "google_user_id", 
    "name": "User Name",
    "email": "user@example.com",
    "picture": "profile_picture_url",
    "status": "Profile Pending"
  }
}
```

### 3. Logout Endpoint

**POST** `/api/auth/logout`

**Headers:**
```
Authorization: Bearer backend_jwt_token
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Token Flow Explanation

### 1. Google OAuth Token
- User clicks "Apply Now" button
- Google OAuth popup opens
- User signs in with Google
- Google returns a JWT token (`response.credential`)

### 2. Token Decoding
```typescript
// Decode the JWT token to get user information
const payload = JSON.parse(atob(response.credential.split('.')[1]));

const googleUserData = {
  id: payload.sub,        // Google user ID
  name: payload.name,     // User's name
  email: payload.email,   // User's email
  picture: payload.picture // Profile picture URL
};
```

### 3. Backend Token Transmission
```typescript
// Send both the original Google token and decoded user data
const response = await fetch('/api/auth/google', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    token: response.credential,  // Original Google JWT token
    userData: googleUserData     // Decoded user information
  }),
});
```

### 4. Backend Processing
The backend should:
1. **Verify Google Token** - Use Google's public keys to verify the JWT token
2. **Check User Exists** - Look up user by Google ID or email
3. **Create/Update User** - Create new user or update existing user
4. **Generate Backend Token** - Create a session token for the user
5. **Return User Data** - Send back user information and session token

### 5. Frontend Storage
```typescript
// Store backend session token
if (backendResponse.token) {
  localStorage.setItem('authToken', backendResponse.token);
}

// Set user profile in context
setProfile({
  ...googleUserData,
  ...backendResponse.user
});
```

## Security Considerations

### 1. Token Verification
- Backend must verify Google JWT tokens using Google's public keys
- Never trust client-side decoded data without verification

### 2. Session Management
- Use secure HTTP-only cookies for session tokens
- Implement token expiration and refresh mechanisms
- Clear tokens on logout

### 3. CORS Configuration
- Configure CORS to allow requests from your frontend domain
- Use proper credentials handling for cross-origin requests

## Environment Variables

Create a `.env` file with:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## Testing

### Frontend Testing
1. Click "Apply Now" button
2. Google OAuth popup should open
3. Sign in with Google account
4. Should redirect to student dashboard

### Backend Testing
1. Check network tab for `/api/auth/google` request
2. Verify token is being sent correctly
3. Check backend logs for token verification
4. Verify user creation/update in database

## Troubleshooting

### Common Issues:
1. **Google OAuth not loading** - Check client ID and domain configuration
2. **Backend connection failed** - Verify API endpoint and CORS settings
3. **Token verification failed** - Check Google public keys and token format
4. **User not created** - Check database connection and user creation logic

### Debug Logging:
- Frontend logs Google OAuth initialization
- Backend service logs token transmission
- Console shows detailed error messages 