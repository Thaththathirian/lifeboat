# Google Cloud Console Fix - Updated for New Base Path

## Current Issue
Your Google OAuth client needs to be updated to match our new implementation with the student landing page as the base path.

**Current Configuration:**
- ✅ Authorized JavaScript origins: `http://localhost:8080`
- ❌ Authorized redirect URIs: `http://localhost:8080/student/google-login` (needs update)

**New Required Configuration:**
- ✅ Authorized JavaScript origins: `http://localhost:8080`
- ✅ Authorized redirect URIs: `http://localhost:8080/student/google-login`

## Fix: Update Google Cloud Console

### Step 1: Update Redirect URIs
1. Go to your Google Cloud Console: https://console.cloud.google.com/
2. Navigate to "APIs & Services" → "Credentials"
3. Click on your OAuth 2.0 Client ID: `546768972289-4cn2f2oaj8rvapcf3arrjl591jfttole.apps.googleusercontent.com`
4. In the "Authorized redirect URIs" section, ensure you have:
   ```
   http://localhost:8080/student/google-login
   ```
5. Click "Save"

### Step 2: Verify JavaScript Origins
Make sure your "Authorized JavaScript origins" includes:
```
http://localhost:8080
```

### Step 3: Test the Fix
1. Wait 2-3 minutes for changes to propagate
2. Clear your browser cache
3. Refresh the page
4. Click "Apply Now" button
5. Should now work without 403 errors

## How It Works Now

### 1. **User visits `http://localhost:8080`**
- Shows the student landing page with "Apply Now" button

### 2. **User clicks "Apply Now"**
- Triggers Google OAuth popup or redirect

### 3. **Google OAuth redirects to callback**
- URL: `http://localhost:8080/student/google-login#access_token=...`
- Our callback page processes the token

### 4. **Callback page processes authentication**
- Extracts access token from URL hash
- Fetches user info from Google
- Sends to backend for authentication
- Redirects to student dashboard

## Verification Steps

### 1. Check Current Configuration
After making changes, verify in Google Cloud Console:
- **Authorized JavaScript origins:** `http://localhost:8080`
- **Authorized redirect URIs:** `http://localhost:8080/student/google-login`

### 2. Test OAuth Flow
1. Clear browser cache
2. Refresh the page
3. Open browser console
4. Click "Apply Now"
5. Should see: `Google OAuth initialized successfully`
6. No more 403 errors

### 3. Debug Information
Check console for:
- ✅ `Using Google OAuth Client ID: 546768972289-4cn2f2oaj8rvapcf3arrjl591jfttole.apps.googleusercontent.com`
- ✅ `Google OAuth script loaded`
- ✅ `Google OAuth initialized successfully`
- ❌ No more `403 (Forbidden)` errors
- ❌ No more `origin is not allowed` errors

## Expected Result

After fixing the configuration:
- Google OAuth popup should open
- User can sign in with Google
- Should redirect to callback page
- Should process authentication and redirect to student dashboard
- No console errors

## Troubleshooting

### Still getting 403 errors?
1. Wait 5-10 minutes for Google's servers to update
2. Clear browser cache completely
3. Try incognito/private mode
4. Check that the redirect URI exactly matches: `http://localhost:8080/student/google-login`

### Can't find the OAuth client?
1. Make sure you're in the correct Google Cloud project
2. Check "APIs & Services" → "Credentials"
3. Look for client ID: `546768972289-4cn2f2oaj8rvapcf3arrjl591jfttole.apps.googleusercontent.com`

### Configuration not saving?
1. Make sure you have edit permissions on the project
2. Try refreshing the Google Cloud Console page
3. Check if there are any validation errors

## New Route Structure

```
/                    → StudentLandingPage (Apply Now page)
/home               → LandingPage (Original landing page with role selection)
/login              → LoginPage
/donate             → DonatePage
/student/google-login → GoogleLoginPage
/student            → StudentDashboard (after login)
/admin              → AdminDashboard
/donor              → DonorDashboard
/college            → CollegeDashboard
```

## Next Steps

After fixing the OAuth configuration:

1. **Test the complete authentication flow**
2. **Implement backend authentication**
3. **Add user profile management**
4. **Set up session management**
5. **Add logout functionality** 