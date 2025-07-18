# Firebase Test Phone Numbers Guide

## Overview
This guide explains how to set up test phone numbers in Firebase for OTP testing without sending real SMS.

## Firebase Test Phone Numbers

### Default Test Numbers
Firebase provides these default test numbers that work without real SMS:

```
+1 650-555-1234
+1 650-555-1235
+1 650-555-1236
+1 650-555-1237
+1 650-555-1238
+1 650-555-1239
```

### Default Test OTP Codes
For the above numbers, use these OTP codes:
```
123456
```

## Setting Up Test Numbers in Firebase Console

### Step 1: Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Phone** provider

### Step 2: Add Test Phone Numbers
1. Scroll down to **Phone numbers for testing**
2. Click **Add phone number**
3. Add your test numbers:
   ```
   +91 9991234567
   +91 9991234568
   +91 9991234569
   ```
4. Click **Save**

### Step 3: Set Test OTP Codes
1. In the same section, set the test OTP code:
   ```
   Test code: 123456
   ```
2. Click **Save**

## Testing in Your Application

### Method 1: Use Test Mode (Recommended)
1. **Enable Test Mode**: Click the "Test Mode" button in the OTP verification screen
2. **Enter Test Number**: Use any number starting with `999` (e.g., `999-123-4567`)
3. **Use Test OTP**: Enter `123456` when prompted
4. **No Real SMS**: No actual SMS will be sent

### Method 2: Use Firebase Test Numbers
1. **Enter Firebase Test Number**: Use one of the Firebase test numbers
2. **Use Default OTP**: Enter `123456`
3. **Real Firebase**: This uses Firebase's test infrastructure

### Method 3: Use Your Own Test Numbers
1. **Add to Firebase Console**: Add your test numbers in Firebase Console
2. **Set Custom OTP**: Set your own test OTP codes
3. **Test with Real Firebase**: Uses Firebase's test environment

## Test Phone Number Examples

### For Indian Numbers (+91):
```
Test Numbers:
999-123-4567
999-123-4568
999-123-4569
999-987-6543
999-555-1234

Test OTP: 123456
```

### For US Numbers (+1):
```
Test Numbers:
650-555-1234
650-555-1235
650-555-1236

Test OTP: 123456
```

## Firebase Console Configuration

### Authentication Settings
```json
{
  "phone": {
    "enabled": true,
    "testPhoneNumbers": [
      "+91 9991234567",
      "+91 9991234568",
      "+91 9991234569"
    ],
    "testCode": "123456"
  }
}
```

### Security Rules
```javascript
// In Firebase Console → Authentication → Settings
{
  "testPhoneNumbers": {
    "read": "auth != null",
    "write": "auth != null && auth.token.admin === true"
  }
}
```

## Testing Scenarios

### 1. Basic OTP Flow
1. Enter test phone number: `999-123-4567`
2. Click "Send OTP"
3. Enter test OTP: `123456`
4. Verify success

### 2. Invalid OTP Test
1. Enter test phone number: `999-123-4567`
2. Click "Send OTP"
3. Enter wrong OTP: `000000`
4. Verify error message

### 3. Resend OTP Test
1. Enter test phone number: `999-123-4567`
2. Click "Send OTP"
3. Wait for countdown
4. Click "Resend OTP"
5. Verify new OTP is sent

### 4. Real Phone Number Test
1. Enter real phone number: `987-654-3210`
2. Click "Send OTP"
3. Check actual SMS received
4. Enter received OTP
5. Verify success

## Debugging Tips

### Check Firebase Console
1. Go to **Authentication** → **Users**
2. Look for test phone numbers
3. Check verification status

### Check Console Logs
```javascript
// In browser console
console.log('Firebase Auth State:', firebase.auth().currentUser);
console.log('Phone Number:', firebase.auth().currentUser?.phoneNumber);
```

### Common Issues

#### Issue: "Invalid phone number"
**Solution**: 
- Use proper format: `+91 9991234567`
- Add country code: `+91` for India
- Check Firebase Console test numbers

#### Issue: "OTP not received"
**Solution**:
- Use test mode for immediate testing
- Check Firebase Console test numbers
- Verify phone number format

#### Issue: "reCAPTCHA error"
**Solution**:
- Use test mode (bypasses reCAPTCHA)
- Check reCAPTCHA site key configuration
- Clear browser cache

## Production vs Testing

### Development/Testing
- ✅ Use test phone numbers
- ✅ Use test OTP codes
- ✅ No real SMS charges
- ✅ Immediate testing

### Production
- ✅ Use real phone numbers
- ✅ Real SMS delivery
- ✅ Actual OTP codes
- ✅ Real user verification

## Security Considerations

### Test Environment
- ✅ Test numbers are safe to use
- ✅ No real SMS charges
- ✅ No user data exposure
- ✅ Safe for development

### Production Environment
- ⚠️ Use real phone verification
- ⚠️ Implement rate limiting
- ⚠️ Add fraud detection
- ⚠️ Monitor for abuse

## Cost Optimization

### Testing Phase
- Use test phone numbers: **$0**
- No real SMS sent: **$0**
- Firebase test environment: **Free**

### Production Phase
- Real SMS costs: **~$0.01-0.05 per SMS**
- Firebase usage: **Free tier available**
- reCAPTCHA Enterprise: **Pay per use**

## Best Practices

1. **Always test with test numbers first**
2. **Use test mode for development**
3. **Keep test numbers separate from production**
4. **Monitor Firebase usage**
5. **Implement proper error handling**
6. **Add rate limiting for production**
7. **Use reCAPTCHA for security**
8. **Test all scenarios before production** 