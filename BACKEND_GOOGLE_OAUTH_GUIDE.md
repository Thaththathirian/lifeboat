# Google OAuth Backend Implementation Guide

## Overview
This guide explains how to implement backend verification for Google OAuth tokens in your scholarship platform.

## Backend API Endpoint

### POST /api/auth/google

**Purpose**: Verify Google JWT token and create/update user profile

**Headers**:
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer {google_jwt_token}
```

**Request Body**:
```json
{
  "userData": {
    "id": "google_user_id",
    "name": "User Name", 
    "email": "user@example.com",
    "picture": "profile_picture_url"
  },
  "recaptchaToken": "recaptcha_enterprise_token",
  "tokenType": "google_jwt"
}
```

**Backend Verification Process**:

1. **Extract JWT Token**: Get token from Authorization header
2. **Verify with Google**: Use Google's public keys to verify JWT signature
3. **Check Token Claims**: Verify issuer, audience, expiration
4. **Create/Update User**: Store user data in database
5. **Generate Session Token**: Create backend JWT for session management

## Backend Implementation (Node.js/Express)

```javascript
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Google OAuth verification endpoint
app.post('/api/auth/google', async (req, res) => {
  try {
    // 1. Extract Google JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'Missing or invalid authorization header' 
      });
    }
    
    const googleToken = authHeader.substring(7);
    
    // 2. Verify Google JWT token
    const verifiedToken = await verifyGoogleToken(googleToken);
    
    // 3. Extract user data from request body
    const { userData, recaptchaToken } = req.body;
    
    // 4. Verify reCAPTCHA token (optional)
    if (recaptchaToken) {
      const recaptchaValid = await verifyRecaptchaToken(recaptchaToken);
      if (!recaptchaValid) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid reCAPTCHA token' 
        });
      }
    }
    
    // 5. Create or update user in database
    const user = await createOrUpdateUser(verifiedToken, userData);
    
    // 6. Generate backend session token
    const sessionToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // 7. Return success response
    res.json({
      success: true,
      user: {
        id: user.id,
        googleId: user.googleId,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
        createdAt: user.createdAt
      },
      token: sessionToken
    });
    
  } catch (error) {
    console.error('Google OAuth verification failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Authentication failed' 
    });
  }
});

// Verify Google JWT token
async function verifyGoogleToken(token) {
  try {
    // Decode token header to get key ID
    const decoded = jwt.decode(token, { complete: true });
    const kid = decoded.header.kid;
    
    // Fetch Google's public keys
    const response = await axios.get('https://www.googleapis.com/oauth2/v1/certs');
    const keys = response.data;
    
    // Find the correct public key
    const publicKey = keys[kid];
    if (!publicKey) {
      throw new Error('Invalid key ID');
    }
    
    // Verify token
    const verified = jwt.verify(token, publicKey, {
      audience: process.env.GOOGLE_CLIENT_ID,
      issuer: 'https://accounts.google.com'
    });
    
    return verified;
  } catch (error) {
    throw new Error('Invalid Google token');
  }
}

// Create or update user in database
async function createOrUpdateUser(verifiedToken, userData) {
  // Check if user exists
  let user = await User.findOne({ googleId: verifiedToken.sub });
  
  if (!user) {
    // Create new user
    user = new User({
      googleId: verifiedToken.sub,
      name: userData.name,
      email: userData.email,
      picture: userData.picture,
      status: 'Profile Pending',
      createdAt: new Date()
    });
  } else {
    // Update existing user
    user.name = userData.name;
    user.email = userData.email;
    user.picture = userData.picture;
    user.updatedAt = new Date();
  }
  
  await user.save();
  return user;
}

// Verify reCAPTCHA Enterprise token
async function verifyRecaptchaToken(token) {
  try {
    const response = await axios.post(
      `https://recaptchaenterprise.googleapis.com/v1/projects/${process.env.GOOGLE_PROJECT_ID}/assessments`,
      {
        event: {
          token: token,
          siteKey: process.env.RECAPTCHA_SITE_KEY,
          expectedAction: 'LOGIN'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GOOGLE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.riskAnalysis.score > 0.5;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
}
```

## Environment Variables Required

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Google Cloud Project
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_ACCESS_TOKEN=your_service_account_token

# reCAPTCHA Enterprise
RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

## Security Considerations

1. **Token Verification**: Always verify Google JWT tokens server-side
2. **HTTPS Only**: Use HTTPS in production
3. **Token Expiration**: Check token expiration times
4. **Rate Limiting**: Implement rate limiting on auth endpoints
5. **CORS**: Configure CORS properly for your domain
6. **reCAPTCHA**: Use reCAPTCHA Enterprise for additional security

## Testing

### Test with curl:
```bash
curl -X POST http://localhost:3000/api/auth/google \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_GOOGLE_JWT_TOKEN" \
  -d '{
    "userData": {
      "id": "test_user_id",
      "name": "Test User",
      "email": "test@example.com"
    },
    "recaptchaToken": "test_recaptcha_token"
  }'
```

## Error Handling

Common errors and solutions:

- **401 Unauthorized**: Invalid or missing Google token
- **400 Bad Request**: Invalid reCAPTCHA token or user data
- **500 Internal Server Error**: Backend verification failure

## Integration with Frontend

The frontend sends the Google JWT token to this endpoint, and the backend:
1. Verifies the token with Google
2. Creates/updates user profile
3. Returns a session token for future requests
4. Handles reCAPTCHA verification for additional security 