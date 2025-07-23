# Firebase OTP Testing Guide

## Overview
This document explains how to test Firebase OTP functionality in the Scholarship Connect Platform.

## Prerequisites

### 1. Firebase Configuration
Ensure your Firebase configuration is properly set up in `.env.local`:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 2. Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Enable Phone Authentication in Authentication > Sign-in methods
4. Add your test phone numbers to authorized numbers

## Testing OTP Functionality

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Navigate to Mobile Verification
1. Go to `http://localhost:8080/`
2. Click "Apply Now" to start Google OAuth
3. Complete Google authentication
4. You'll be redirected to mobile verification

### 3. Test OTP Sending
1. Enter a valid phone number (e.g., `+1234567890`)
2. Click "Send OTP"
3. Check console for Firebase initialization logs
4. Verify reCAPTCHA is working

### 4. Test OTP Verification
1. Check your phone for SMS with OTP
2. Enter the OTP code
3. Click "Verify OTP"
4. Verify successful authentication

## Real OTP Testing

### Using Real Phone Numbers
- **Real SMS**: Firebase sends actual SMS messages
- **Real OTP**: No test codes, only real SMS codes
- **Real Authentication**: Full Firebase authentication flow

### Test Phone Numbers
Add these to Firebase Console for testing:
```
+1234567890
+9876543210
+5551234567
```

## Debugging

### 1. Check Firebase Initialization
```javascript
import { testFirebase } from '@/utils/firebase-test';

// Test Firebase config
const result = testFirebase();
console.log('Firebase test result:', result);
```

### 2. Check reCAPTCHA Loading
```javascript
import { testRecaptcha } from '@/utils/firebase-test';

// Test reCAPTCHA
testRecaptcha()
  .then(() => console.log('reCAPTCHA loaded'))
  .catch(error => console.error('reCAPTCHA error:', error));
```

### 3. Check Environment Variables
```javascript
console.log('Firebase API Key:', import.meta.env.VITE_FIREBASE_API_KEY);
console.log('Firebase Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
```

## Common Issues

### 1. "Firebase not initialized" Error
- Check Firebase configuration in `.env.local`
- Verify all Firebase environment variables are set
- Restart development server after changes

### 2. "reCAPTCHA not found" Error
- Ensure reCAPTCHA container exists in DOM
- Check reCAPTCHA script loading
- Verify reCAPTCHA site key configuration

### 3. "Phone number format invalid" Error
- Use international format: `+1234567890`
- Include country code
- Remove spaces and special characters

### 4. "OTP verification failed" Error
- Check if phone number is authorized in Firebase
- Verify OTP code is correct
- Check Firebase console for error logs

## Production Testing

### 1. Environment Variables
Set production Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_production_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_production_auth_domain
VITE_FIREBASE_PROJECT_ID=your_production_project_id
```

### 2. Authorized Phone Numbers
Add production phone numbers to Firebase Console:
1. Go to Authentication > Settings > Authorized domains
2. Add your production domain
3. Test with real phone numbers

### 3. reCAPTCHA Configuration
1. Go to Firebase Console > Authentication > Settings
2. Configure reCAPTCHA Enterprise
3. Add your production domain

## Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use different Firebase projects** for development and production
3. **Limit authorized phone numbers** in development
4. **Monitor Firebase usage** in console
5. **Rotate API keys** regularly

## Troubleshooting

### Firebase Console Logs
1. Go to Firebase Console > Authentication > Users
2. Check for failed authentication attempts
3. Review error logs and timestamps

### Browser Console
1. Open browser developer tools
2. Check Console tab for errors
3. Look for Firebase initialization logs

### Network Tab
1. Check Network tab in developer tools
2. Look for Firebase API calls
3. Verify reCAPTCHA script loading

## Testing Checklist

- [ ] Firebase configuration loaded
- [ ] reCAPTCHA script loaded
- [ ] Phone number format valid
- [ ] OTP sent successfully
- [ ] OTP verification successful
- [ ] User authenticated in Firebase
- [ ] No console errors
- [ ] Network requests successful 