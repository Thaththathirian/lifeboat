# Immediate OAuth Fix

## Current Problem
Your Google OAuth client ID `546768972289-4cn2f2oaj8rvapcf3arrjl591jfttole.apps.googleusercontent.com` is not configured to allow requests from `http://localhost:8080`.

## Quick Fix Options

### Option 1: Configure Existing Client ID (Recommended)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Find Your Project**
   - Look for a project that contains this client ID: `546768972289-4cn2f2oaj8rvapcf3arrjl591jfttole.apps.googleusercontent.com`
   - If you can't find it, proceed to Option 2

3. **Update OAuth Client**
   - Go to "APIs & Services" → "Credentials"
   - Find the OAuth 2.0 Client ID: `546768972289-4cn2f2oaj8rvapcf3arrjl591jfttole.apps.googleusercontent.com`
   - Click on it to edit

4. **Add Authorized JavaScript Origins**
   ```
   http://localhost:8080
   http://localhost:3000
   http://localhost:5173
   http://localhost:4173
   ```

5. **Add Authorized Redirect URIs**
   ```
   http://localhost:8080
   http://localhost:3000
   http://localhost:5173
   http://localhost:4173
   ```

6. **Save Changes**
   - Click "Save"
   - Wait 5-10 minutes for changes to propagate

### Option 2: Create New OAuth Client ID

If you can't find or access the existing client ID:

1. **Create New Project**
   - Go to https://console.cloud.google.com/
   - Click "Select a project" → "New Project"
   - Name: "Scholarship Connect"
   - Click "Create"

2. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

3. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Configure OAuth consent screen if prompted

4. **Configure Client ID**
   - Application type: Web application
   - Name: "Scholarship Connect Web Client"
   - Authorized JavaScript origins:
     ```
     http://localhost:8080
     http://localhost:3000
     http://localhost:5173
     http://localhost:4173
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:8080
     http://localhost:3000
     http://localhost:5173
     http://localhost:4173
     ```

5. **Copy New Credentials**
   - Copy the new Client ID
   - Copy the new Client Secret

6. **Update Environment Variables**
   Create `.env` file in your project root:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_new_client_id_here
   VITE_GOOGLE_CLIENT_SECRET=your_new_client_secret_here
   ```

### Option 3: Temporary Workaround (For Testing)

If you want to test the application while fixing OAuth:

1. **Use Demo Mode**
   - The app will show a demo authentication flow
   - No real Google OAuth required
   - Good for testing UI and flow

2. **Enable Demo Mode**
   - Set environment variable: `VITE_DEMO_MODE=true`
   - Restart development server

## Testing the Fix

### 1. **Check Configuration**
After making changes, wait 5-10 minutes, then:

1. Open browser console
2. Look for: `Google OAuth initialized successfully`
3. No more 403 errors

### 2. **Test Authentication**
1. Click "Apply Now" button
2. Should see Google OAuth popup
3. Sign in with Google account
4. Should redirect to student dashboard

### 3. **Debug Information**
Check console for:
- `Using Google OAuth Client ID: your_client_id`
- `Google OAuth script loaded`
- `Google OAuth initialized successfully`

## Common Issues

### Issue: "Still getting 403 error"
**Solution**: Wait 5-10 minutes for Google's servers to update, then clear browser cache

### Issue: "Can't find the project"
**Solution**: Create a new project (Option 2)

### Issue: "Client ID not working"
**Solution**: Double-check the client ID format and ensure it ends with `.apps.googleusercontent.com`

## Verification Steps

1. **Check Current Origin**
   ```javascript
   // In browser console
   console.log('Current origin:', window.location.origin);
   ```

2. **Check Client ID**
   ```javascript
   // In browser console
   console.log('Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
   ```

3. **Test OAuth Endpoint**
   ```javascript
   // In browser console
   fetch(`https://accounts.google.com/gsi/status?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}`)
     .then(response => console.log('Status:', response.status))
     .catch(error => console.error('Error:', error));
   ```

## Next Steps

After fixing OAuth:

1. **Test the complete flow**
2. **Implement backend authentication**
3. **Add user profile management**
4. **Set up session management**

## Support

If you continue to have issues:

1. **Check Google Cloud Console** for any error messages
2. **Verify your client ID** is correct
3. **Test with a different browser**
4. **Check network tab** for failed requests
5. **Contact support** with error logs 