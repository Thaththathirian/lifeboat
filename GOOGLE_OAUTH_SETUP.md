# Google OAuth Configuration

## Overview
This document explains the Google OAuth configuration for the Scholarship Connect Platform.

## Current Configuration

### Client Credentials
- **Client ID**: `your_client_id_here`
- **Client Secret**: `your_client_secret_here`

> **⚠️ Security Note**: These credentials are now stored in environment variables and not hardcoded in the source code.

### Authorized Origins
- `http://localhost:8080`
- `http://localhost:5173`
- `http://localhost:3000`

### Redirect URIs
- `http://localhost:8080/student/google-login`
- `http://localhost:8080/`
- `http://localhost:5173/student/google-login`
- `http://localhost:5173/`

## Configuration Files

### Primary Configuration
- **File**: `src/config/oauth.ts`
- **Purpose**: Centralized OAuth configuration
- **Usage**: Import and use throughout the application

### Main Export
- **File**: `src/config/index.ts`
- **Purpose**: Easy access to all configurations
- **Usage**: `import { getOAuthConfig } from '@/config'`

### OAuth Utilities
- **File**: `src/utils/googleOAuth.ts`
- **Purpose**: OAuth utility functions
- **Usage**: Import OAuth functions and helpers

## How to Update Configuration

### 1. Update Client Credentials
Create or update `.env.local` file:
```env
VITE_GOOGLE_CLIENT_ID=YOUR_NEW_CLIENT_ID
VITE_GOOGLE_CLIENT_SECRET=YOUR_NEW_CLIENT_SECRET
```

Or edit `src/config/oauth.ts` for fallback values:
```typescript
export const GOOGLE_OAUTH_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "your_client_id_here",
  clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || "your_client_secret_here",
  // ... other settings
};
```

### 2. Update Authorized Origins
Add your domains to the `authorizedOrigins` array:
```typescript
authorizedOrigins: [
  "http://localhost:8080",
  "http://localhost:5173",
  "https://yourdomain.com"  // Add production domain
],
```

### 3. Update Redirect URIs
Add your redirect URIs to the `redirectUris` array:
```typescript
redirectUris: [
  "http://localhost:8080/student/google-login",
  "https://yourdomain.com/student/google-login"  // Add production URI
],
```

## Environment Variables (Optional)

You can override the configuration using environment variables:

### Development (.env.local)
```env
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_GOOGLE_CLIENT_SECRET=your_client_secret
```

### Production (.env.production)
```env
VITE_GOOGLE_CLIENT_ID=your_production_client_id
VITE_GOOGLE_CLIENT_SECRET=your_production_client_secret
```

## Validation

The application automatically validates the OAuth configuration:

- ✅ **Client ID**: Must be valid and not empty
- ✅ **Client Secret**: Must be provided
- ✅ **Authorized Origins**: Current origin must be in the list
- ✅ **Redirect URIs**: Must be properly configured

## Usage Examples

### Basic Usage
```typescript
import { getOAuthConfig } from '@/config';

const config = getOAuthConfig();
console.log('Client ID:', config.clientId);
```

### Validation
```typescript
import { validateOAuthConfig } from '@/config';

const validation = validateOAuthConfig();
if (!validation.isValid) {
  console.error('OAuth configuration errors:', validation.errors);
}
```

## Google Cloud Console Setup

### 1. Create OAuth 2.0 Client
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"

### 2. Find Your OAuth Client
- Look for client ID: `your_client_id_here`
- Click on the client to edit

### 3. Configure Authorized Origins
Add these to "Authorized JavaScript origins":
```
http://localhost:8080
http://localhost:5173
http://localhost:3000
```

### 4. Configure Redirect URIs
Add these to "Authorized redirect URIs":
```
http://localhost:8080/student/google-login
http://localhost:8080/
http://localhost:5173/student/google-login
http://localhost:5173/
```

## Troubleshooting

### Common Issues

#### 1. "Origin not allowed" Error
- Check that your current origin is in the authorized origins list
- Ensure the origin matches exactly (including protocol and port)

#### 2. "Redirect URI mismatch" Error
- Verify the redirect URI is in the authorized redirect URIs list
- Check for trailing slashes and exact matching

#### 3. "Client ID not found" Error
- Verify the client ID is correct
- Check that the OAuth client is properly configured

#### 4. Environment Variables Not Loading
- Ensure `.env.local` file exists
- Check that variable names start with `VITE_`
- Restart the development server after changes

### Debug Steps

1. **Check Environment Variables**:
```javascript
console.log('Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
```

2. **Validate Configuration**:
```javascript
import { validateOAuthConfig } from '@/config';
console.log('Validation:', validateOAuthConfig());
```

3. **Check Current Origin**:
```javascript
import { getCurrentOrigin, isOriginAuthorized } from '@/config';
console.log('Current origin:', getCurrentOrigin());
console.log('Is authorized:', isOriginAuthorized());
```

## Security Best Practices

1. **Never commit secrets to version control**
2. **Use environment variables for all sensitive data**
3. **Rotate credentials regularly**
4. **Use different credentials for development and production**
5. **Monitor OAuth usage in Google Cloud Console**

## Production Deployment

### Environment Variables
Set these environment variables on your hosting platform:

```env
VITE_GOOGLE_CLIENT_ID=your_production_client_id
VITE_GOOGLE_CLIENT_SECRET=your_production_client_secret
```

### Authorized Origins
Add your production domain to the authorized origins in Google Cloud Console.

### Redirect URIs
Add your production redirect URIs to the authorized redirect URIs in Google Cloud Console. 