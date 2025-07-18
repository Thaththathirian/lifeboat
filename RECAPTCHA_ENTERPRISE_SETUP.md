# reCAPTCHA Enterprise Integration Guide

## Overview

Your reCAPTCHA Enterprise key is now integrated with Firebase OTP authentication. This provides enhanced security and bot protection for your OTP verification flow.

## Your reCAPTCHA Configuration

### Site Key
```
6LcNOYcrAAAAACohTUXyMG1kPT06KDLrvMXh8ArS
```

### Integration Points

1. **Firebase OTP Authentication** - Protects OTP sending
2. **Backend Verification** - Validates reCAPTCHA tokens
3. **User Experience** - Invisible reCAPTCHA (no user interaction required)

## Implementation Details

### 1. reCAPTCHA Script Loading
```javascript
// Automatically loads reCAPTCHA Enterprise script
const script = document.createElement('script');
script.src = `https://www.google.com/recaptcha/enterprise.js?render=${RECAPTCHA_SITE_KEY}`;
```

### 2. Token Generation
```javascript
// Get reCAPTCHA token for OTP sending
const token = await grecaptcha.enterprise.execute('6LcNOYcrAAAAACohTUXyMG1kPT06KDLrvMXh8ArS', {
  action: 'SEND_OTP'
});
```

### 3. Backend Verification
```javascript
// Send token to backend for verification
{
  "userData": { /* user data */ },
  "recaptchaToken": "RECAPTCHA_TOKEN_HERE"
}
```

## Authentication Flow

### Step 1: Google OAuth
1. User clicks "Apply Now"
2. Google OAuth popup opens
3. User signs in with Google
4. Google user data captured

### Step 2: Phone Number Input
1. OTP verification screen appears
2. User enters phone number
3. reCAPTCHA token generated invisibly

### Step 3: OTP Sending
1. reCAPTCHA token sent to Firebase
2. Firebase validates token
3. OTP sent to phone number
4. Token stored for backend verification

### Step 4: OTP Verification
1. User enters 6-digit OTP
2. Firebase verifies OTP
3. Combined data sent to backend
4. Backend verifies reCAPTCHA token

### Step 5: Authentication Complete
1. Backend validates all tokens
2. User session created
3. Redirect to dashboard

## Backend API Endpoint

### POST /api/auth/google
```javascript
// Request Headers
{
  "Content-Type": "application/json",
  "Authorization": "Bearer GOOGLE_JWT_TOKEN"
}

// Request Body
{
  "userData": {
    "id": "google_user_id",
    "name": "User Name",
    "email": "user@example.com",
    "picture": "profile_url",
    "phoneNumber": "1234567890",
    "firebaseUid": "firebase_user_uid",
    "verified": true
  },
  "recaptchaToken": "RECAPTCHA_ENTERPRISE_TOKEN"
}

// Response
{
  "success": true,
  "user": { /* user data */ },
  "token": "BACKEND_JWT_TOKEN"
}
```

## Security Features

### 1. reCAPTCHA Enterprise Benefits
- ✅ **Invisible Protection** - No user interaction required
- ✅ **Advanced Bot Detection** - Enterprise-grade protection
- ✅ **Score-based Assessment** - Risk-based verification
- ✅ **Real-time Analysis** - Continuous threat monitoring

### 2. Token Validation
- ✅ **Frontend Generation** - reCAPTCHA token created
- ✅ **Backend Verification** - Token validated server-side
- ✅ **Firebase Integration** - OTP protected by reCAPTCHA
- ✅ **Session Security** - Tokens cleared after use

### 3. Multi-layer Security
- ✅ **Google OAuth** - First factor authentication
- ✅ **Phone Verification** - Second factor authentication
- ✅ **reCAPTCHA Protection** - Bot protection
- ✅ **Backend Validation** - Server-side verification

## Testing

### 1. Test the Complete Flow
```bash
# Start development server
npm run dev

# Test flow:
# 1. Click "Apply Now"
# 2. Sign in with Google
# 3. Enter phone number
# 4. Enter OTP
# 5. Verify backend receives reCAPTCHA token
```

### 2. Check Console Logs
```javascript
// Look for these logs:
"reCAPTCHA Enterprise script loaded"
"reCAPTCHA token obtained: [TOKEN]"
"Backend authentication successful"
```

### 3. Verify Backend Integration
```javascript
// Backend should receive:
{
  "userData": { /* user data */ },
  "recaptchaToken": "RECAPTCHA_TOKEN"
}
```

## Production Setup

### 1. Environment Variables
```env
VITE_RECAPTCHA_SITE_KEY=6LcNOYcrAAAAACohTUXyMG1kPT06KDLrvMXh8ArS
```

### 2. Backend Verification
```javascript
// Backend should verify reCAPTCHA token
const recaptchaResponse = await fetch('https://recaptchaenterprise.googleapis.com/v1/projects/PROJECT_ID/assessments', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    event: {
      token: recaptchaToken,
      siteKey: '6LcNOYcrAAAAACohTUXyMG1kPT06KDLrvMXh8ArS',
      expectedAction: 'SEND_OTP'
    }
  })
});
```

### 3. Monitoring
- Monitor reCAPTCHA scores
- Track authentication success rates
- Alert on suspicious activity
- Review security logs

## Troubleshooting

### Common Issues

1. **reCAPTCHA not loading**
   - Check site key configuration
   - Verify domain is authorized
   - Clear browser cache

2. **Token generation failing**
   - Check reCAPTCHA Enterprise setup
   - Verify billing is enabled
   - Check console for errors

3. **Backend verification failing**
   - Verify reCAPTCHA API access
   - Check token format
   - Validate site key

### Debug Steps

1. **Check reCAPTCHA Console**
   - Verify key configuration
   - Check domain settings
   - Review usage metrics

2. **Browser Console**
   - Look for script loading errors
   - Check token generation logs
   - Verify API calls

3. **Backend Logs**
   - Check token validation
   - Verify API responses
   - Monitor error rates

## Next Steps

1. **Test the complete flow** with reCAPTCHA Enterprise
2. **Configure backend verification** of reCAPTCHA tokens
3. **Set up monitoring** for security metrics
4. **Implement rate limiting** based on reCAPTCHA scores
5. **Add analytics** for security insights

## Security Best Practices

1. **Never expose reCAPTCHA secret** in client code
2. **Always verify tokens** on the backend
3. **Monitor reCAPTCHA scores** for suspicious activity
4. **Implement proper error handling** for failed verifications
5. **Regular security audits** of the authentication flow
6. **Keep reCAPTCHA keys** secure and rotate regularly 