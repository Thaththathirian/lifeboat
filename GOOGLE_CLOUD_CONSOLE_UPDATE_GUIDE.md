# Google Cloud Console Update Guide

## Overview
This guide explains how to update your Google Cloud Console OAuth configuration for the new application paths.

## Updated Configuration

### **Development Environment**
- **Base URL**: `http://localhost:8080`
- **API Endpoint**: `http://localhost:8080/google_auth`

### **Production Environment**
- **Base URL**: `http://localhost/google-firebase-auth/`
- **API Endpoint**: `http://localhost/google-firebase-auth/google_auth`

## Google Cloud Console Updates Required

### **Step 1: Access Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID and click **Edit**

### **Step 2: Update Authorized JavaScript Origins**

**Add these origins:**
```
http://localhost:8080
http://localhost/google-firebase-auth
```

### **Step 3: Update Authorized Redirect URIs**

**Add these redirect URIs:**
```
http://localhost:8080/student/google-login
http://localhost/google-firebase-auth/student/google-login
```

### **Step 4: Save Changes**
1. Click **Save**
2. Wait a few minutes for changes to propagate

## Firebase Console Updates (if using Firebase)

### **Step 1: Access Firebase Console**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Settings** → **Authorized domains**

### **Step 2: Add Authorized Domains**
**Add these domains:**
```
localhost
```

## Backend API Configuration

### **Development Backend**
Your backend should listen on:
```
http://localhost:8080/google_auth
```

### **Production Backend**
Your backend should listen on:
```
http://localhost/google-firebase-auth/google_auth
```

## Environment Variables

### **Development (.env.development)**
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_GOOGLE_CLIENT_SECRET=your_client_secret
```

### **Production (.env.production)**
```env
VITE_API_BASE_URL=http://localhost/google-firebase-auth
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_GOOGLE_CLIENT_SECRET=your_client_secret
```

## Testing the Configuration

### **Development Testing**
1. **Start dev server**: `npm run dev`
2. **Access**: `http://localhost:8080/`
3. **Test OAuth**: Should work with Google sign-in
4. **Test API**: Should call `http://localhost:8080/google_auth`

### **Production Testing**
1. **Build**: `npm run build`
2. **Serve**: Copy dist folder to your web server
3. **Access**: `http://localhost/google-firebase-auth/`
4. **Test OAuth**: Should work with Google sign-in
5. **Test API**: Should call `http://localhost/google-firebase-auth/google_auth`

## Common Issues and Solutions

### **Issue: "Origin not allowed" error**
**Solution**:
- Check that `http://localhost:8080` is in Authorized JavaScript origins
- Check that `http://localhost/google-firebase-auth` is in Authorized JavaScript origins
- Wait 5-10 minutes after saving changes

### **Issue: "Redirect URI mismatch" error**
**Solution**:
- Check that redirect URIs are exactly as specified above
- Make sure there are no trailing slashes in the wrong places
- Verify the paths match your application routes

### **Issue: API calls failing**
**Solution**:
- Verify your backend is running on the correct endpoints
- Check that CORS is configured properly
- Ensure the API endpoints match the frontend configuration

### **Issue: Build not working**
**Solution**:
- Run `npm run build` to create production build
- Check that the `dist` folder contains the built files
- Verify the base path is correctly set in `vite.config.ts`

## Security Considerations

### **Development**
- ✅ Use `localhost` for testing
- ✅ No HTTPS required for localhost
- ✅ Google OAuth works with localhost

### **Production**
- ⚠️ Use HTTPS in production
- ⚠️ Update origins to use HTTPS
- ⚠️ Use proper domain names instead of localhost

## Example Backend Configuration (Node.js/Express)

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://localhost/google-firebase-auth'
  ],
  credentials: true
}));

// Google OAuth endpoint
app.post('/google_auth', async (req, res) => {
  // Your Google OAuth verification logic here
  console.log('Google OAuth request received');
  
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  
  // Verify token and respond
  res.json({
    success: true,
    user: { /* user data */ },
    token: 'backend_session_token'
  });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Google OAuth endpoint: http://localhost:${PORT}/google_auth`);
});
```

## Verification Checklist

- [ ] Google Cloud Console origins updated
- [ ] Google Cloud Console redirect URIs updated
- [ ] Firebase Console domains updated (if using Firebase)
- [ ] Backend API endpoints configured
- [ ] Environment variables set
- [ ] Development testing completed
- [ ] Production build tested
- [ ] OAuth flow working in both environments
- [ ] API calls working in both environments

## Next Steps

1. **Update Google Cloud Console** with the new origins and redirect URIs
2. **Configure your backend** to handle the new API endpoints
3. **Test the development environment** first
4. **Build and test the production environment**
5. **Deploy to your production server**

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all URLs are exactly as specified
3. Wait for Google Cloud Console changes to propagate
4. Clear browser cache and try again 