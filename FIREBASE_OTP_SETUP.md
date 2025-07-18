# Firebase OTP Authentication Setup

## Overview

This implementation adds Firebase OTP (One-Time Password) authentication after Google OAuth. The flow is:

1. **User clicks "Apply Now"** → Google OAuth popup opens
2. **User signs in with Google** → Google user data captured
3. **OTP verification screen appears** → User enters phone number
4. **Firebase sends OTP** → User receives SMS
5. **User enters OTP** → Verification completes
6. **Combined data sent to backend** → User redirected to dashboard

## Firebase Configuration

### Current Setup
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCi7QqGACe1eUcdrobs-_2iGzfc2PgMtyY",
  authDomain: "lifeboat-94da5.firebaseapp.com",
  projectId: "lifeboat-94da5",
  storageBucket: "lifeboat-94da5.firebasestorage.app",
  messagingSenderId: "644249374099",
  appId: "1:644249374099:web:5f1c141461277a78f56c66",
  measurementId: "G-BTXPWCM79E"
};
```

## Firebase Console Setup

### 1. Enable Phone Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `lifeboat-94da5`
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Phone** provider
5. Add your test phone numbers (for development)

### 2. Configure reCAPTCHA
1. In **Authentication** → **Settings** → **Advanced**
2. Enable **reCAPTCHA Enterprise** or use **reCAPTCHA v3**
3. Add your domain: `localhost:8080`

### 3. Set up SMS Templates (Optional)
1. In **Authentication** → **Templates**
2. Customize the SMS message for OTP

## Implementation Details

### Files Created/Modified

1. **`src/utils/firebase.ts`** - Firebase configuration and OTP functions
2. **`src/components/OTPVerification.tsx`** - OTP verification UI
3. **`src/pages/StudentLandingPage.tsx`** - Integrated OTP flow

### Key Features

#### Phone Number Formatting
- Automatic formatting: `XXX-XXX-XXXX`
- Country code: `+91` (India)
- Validation: 10-digit numbers only

#### OTP Verification
- 6-digit OTP codes
- 30-second resend cooldown
- Invisible reCAPTCHA
- Error handling and retry logic

#### User Data Flow
```javascript
// Google OAuth data
{
  id: "google_user_id",
  name: "User Name",
  email: "user@example.com",
  picture: "profile_url"
}

// After OTP verification
{
  id: "google_user_id",
  name: "User Name", 
  email: "user@example.com",
  picture: "profile_url",
  phoneNumber: "1234567890",
  firebaseUid: "firebase_user_uid",
  verified: true
}
```

## Testing

### Test Phone Numbers
For development, add these test numbers in Firebase Console:
- `+91 1234567890`
- `+91 9876543210`

### Test OTP Codes
Firebase will send real SMS in production, but for testing:
- Use any 6-digit code
- Firebase will validate against the sent OTP

## Production Considerations

### 1. Phone Number Validation
- Implement proper phone number validation
- Add country code selection
- Handle international numbers

### 2. Rate Limiting
- Implement rate limiting for OTP requests
- Add cooldown periods
- Monitor for abuse

### 3. Security
- Use Firebase App Check
- Implement proper session management
- Add CSRF protection

### 4. Error Handling
- Handle network failures
- Provide fallback options
- Clear error messages

## Environment Variables

Add to your `.env` file:
```env
VITE_FIREBASE_API_KEY=AIzaSyCi7QqGACe1eUcdrobs-_2iGzfc2PgMtyY
VITE_FIREBASE_AUTH_DOMAIN=lifeboat-94da5.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=lifeboat-94da5
VITE_FIREBASE_STORAGE_BUCKET=lifeboat-94da5.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=644249374099
VITE_FIREBASE_APP_ID=1:644249374099:web:5f1c141461277a78f56c66
VITE_FIREBASE_MEASUREMENT_ID=G-BTXPWCM79E
```

## Troubleshooting

### Common Issues

1. **reCAPTCHA not loading**
   - Check domain configuration
   - Verify reCAPTCHA settings
   - Clear browser cache

2. **OTP not sending**
   - Check Firebase Console settings
   - Verify phone number format
   - Check SMS quotas

3. **Verification failing**
   - Check OTP code format
   - Verify Firebase UID
   - Check network connectivity

### Debug Steps

1. **Check Firebase Console**
   - Authentication logs
   - Phone provider status
   - reCAPTCHA configuration

2. **Browser Console**
   - Firebase initialization errors
   - reCAPTCHA errors
   - Network request failures

3. **Network Tab**
   - Firebase API calls
   - reCAPTCHA requests
   - SMS delivery status

## Next Steps

1. **Test the complete flow**
2. **Configure production settings**
3. **Add analytics tracking**
4. **Implement user management**
5. **Add phone number updates**

## Security Best Practices

1. **Never expose Firebase config in client**
2. **Use environment variables**
3. **Implement proper validation**
4. **Add rate limiting**
5. **Monitor for abuse**
6. **Regular security audits** 