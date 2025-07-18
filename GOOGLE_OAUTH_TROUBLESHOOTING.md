# Google OAuth Troubleshooting Guide

## Current Issue: 403 Forbidden Error

You're experiencing a `403 (Forbidden)` error when trying to use Google OAuth. This is a configuration issue in your Google Cloud Console.

## Error Details

```
GET https://accounts.google.com/gsi/status?client_id=546768972289-4cn2f2oaj8rvapcf3arrjl591jfttole.apps.googleusercontent.com&cas=...&has_opted_out_fedcm=true 403 (Forbidden)
[GSI_LOGGER]: The given origin is not allowed for the given client ID.
```

## Root Cause

The origin `http://localhost:8080` is not properly configured in your Google Cloud Console OAuth client.

## Step-by-Step Fix

### 1. Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Make sure you're in the correct project
3. Navigate to **APIs & Services** → **Credentials**

### 2. Find Your OAuth Client
1. Look for the client with ID: `546768972289-4cn2f2oaj8rvapcf3arrjl591jfttole.apps.googleusercontent.com`
2. Click on the client name to edit it

### 3. Update Authorized JavaScript Origins
1. In the **Authorized JavaScript origins** section:
2. Make sure you have: `http://localhost:8080`
3. If it's not there, click **+ Add URI** and add it
4. **Important**: Don't include any path, just the origin

### 4. Update Authorized Redirect URIs
1. In the **Authorized redirect URIs** section:
2. Make sure you have: `http://localhost:8080/student/google-login`
3. If it's not there, click **+ Add URI** and add it

### 5. Save Changes
1. Click **Save** at the bottom of the page
2. Wait 2-3 minutes for changes to propagate

## Verification Steps

### 1. Check Current Configuration
After saving, verify these settings:

**Authorized JavaScript origins:**
```
http://localhost:8080
```

**Authorized redirect URIs:**
```
http://localhost:8080/student/google-login
```

### 2. Test the Fix
1. Clear your browser cache completely
2. Close and reopen your browser
3. Navigate to `http://localhost:8080`
4. Open browser console (F12)
5. Click "Apply Now" button
6. Check for these console messages:
   - ✅ `Google OAuth script loaded`
   - ✅ `Google OAuth initialized successfully`
   - ❌ No more `403 (Forbidden)` errors

### 3. Debug Information
On the student landing page, you should see debug info showing:
- **Client ID**: `546768972289-4cn2f2oaj8rvapcf3arrjl591jfttole...`
- **Origin**: `http://localhost:8080`
- **Google OAuth**: `Loaded`

## Common Issues and Solutions

### Issue 1: "Origin is not allowed"
**Solution**: Make sure `http://localhost:8080` is in **Authorized JavaScript origins**

### Issue 2: "Redirect URI mismatch"
**Solution**: Make sure `http://localhost:8080/student/google-login` is in **Authorized redirect URIs**

### Issue 3: Changes not taking effect
**Solution**: 
1. Wait 5-10 minutes for Google's servers to update
2. Clear browser cache completely
3. Try incognito/private mode

### Issue 4: Still getting 403 errors
**Solution**:
1. Double-check the client ID matches exactly
2. Verify you're in the correct Google Cloud project
3. Make sure the OAuth client is enabled
4. Check that you have edit permissions on the project

## Alternative: Use Demo Mode

If you're still having issues, you can use demo mode for testing:

1. Open browser console (F12)
2. Run: `localStorage.setItem('demoMode', 'true')`
3. Refresh the page
4. Click "Apply Now" - it will use demo authentication

## Testing Without Google OAuth

For development/testing purposes, you can bypass Google OAuth:

1. Open browser console (F12)
2. Run: `localStorage.setItem('demoMode', 'true')`
3. Refresh the page
4. The "Apply Now" button will use demo authentication

## Expected Success Flow

After fixing the configuration:

1. **Visit** `http://localhost:8080`
2. **Click** "Apply Now"
3. **See** Google OAuth popup
4. **Sign in** with Google account
5. **Redirect** to student dashboard
6. **No errors** in console

## Contact Support

If you're still experiencing issues after following these steps:

1. Check the console for specific error messages
2. Verify your Google Cloud Console configuration
3. Make sure you're using the correct client ID
4. Try a different browser or incognito mode

## Environment Variables

Make sure these environment variables are set in your `.env` file:

```env
VITE_GOOGLE_CLIENT_ID=546768972289-4cn2f2oaj8rvapcf3arrjl591jfttole.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=GOCSPX-YourSecretHere
```

## Next Steps

Once Google OAuth is working:

1. Test the complete authentication flow
2. Implement backend token verification
3. Add user profile management
4. Set up session management
5. Add logout functionality 