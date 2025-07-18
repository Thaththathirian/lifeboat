// Google OAuth configuration for authentication
// This file handles Google OAuth without Firebase

// Environment variables for browser (using import.meta.env for Vite)
const getEnvVar = (key: string, fallback: string) => {
  // Try different ways to access environment variables
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || fallback;
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || fallback;
  }
  return fallback;
};

// Google OAuth Configuration
export const googleProvider = {
  clientId: getEnvVar('VITE_GOOGLE_CLIENT_ID', "546768972289-4cn2f2oaj8rvapcf3arrjl591jfttole.apps.googleusercontent.com"),
  clientSecret: getEnvVar('VITE_GOOGLE_CLIENT_SECRET', ""),
};

// API Base URL from environment
export const getApiBaseUrl = () => {
  return getEnvVar('VITE_API_BASE_URL', 'http://localhost/google-firebase-auth');
};

// Fallback Google OAuth URL (for when FedCM is disabled)
export const getGoogleOAuthUrl = (redirectUri?: string) => {
  // Use environment variable for base URL
  const baseUrl = getApiBaseUrl();
  
  const defaultRedirectUri = `${baseUrl}/student/google-login`;
  const finalRedirectUri = redirectUri || defaultRedirectUri;
  
  const params = new URLSearchParams({
    client_id: googleProvider.clientId,
    redirect_uri: finalRedirectUri,
    response_type: 'token',
    scope: 'openid email profile',
    state: Math.random().toString(36).substring(7), // Random state for security
  });
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

// Handle OAuth callback from URL fragment
export const handleOAuthCallback = async () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  
  const accessToken = params.get('access_token');
  const error = params.get('error');
  
  if (error) {
    console.error('OAuth error:', error);
    return { success: false, error };
  }
  
  if (accessToken) {
    // Use the access token to get user info
    return await fetchUserInfo(accessToken);
  }
  
  return { success: false, error: 'No access token received' };
};

// Fetch user info using access token (no client ID in request)
const fetchUserInfo = async (accessToken: string) => {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Token in header only
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.status}`);
    }
    
    const userData = await response.json();
    
    return {
      success: true,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
      },
      accessToken,
    };
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user info',
    };
  }
};

// Google Sign-In function
export const signInWithGoogle = async () => {
  try {
    console.log('Using Google OAuth Client ID:', googleProvider.clientId);
    
    // This will be handled by the Google Identity Services script
    // The actual sign-in happens in the StudentLandingPage component
    return {
      success: true,
      message: "Google OAuth initialized"
    };
  } catch (error) {
    console.error('Google Sign-In failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Environment variables template (only for Google OAuth)
export const requiredEnvVars = {
  GOOGLE_CLIENT_ID: "Google OAuth Client ID",
  GOOGLE_CLIENT_SECRET: "Google OAuth Client Secret",
};

// Check if required environment variables are set
export const checkEnvironmentVariables = () => {
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([key]) => !getEnvVar(`VITE_${key}`, ''))
    .map(([key, description]) => `${key}: ${description}`);
  
  if (missingVars.length > 0) {
    console.warn('Missing environment variables for Google OAuth:');
    missingVars.forEach(varName => console.warn(`- ${varName}`));
    return false;
  }
  
  return true;
};

// Verify OAuth configuration
export const verifyOAuthConfiguration = () => {
  console.log('=== Google OAuth Configuration Check ===');
  console.log('Client ID:', googleProvider.clientId);
  console.log('Current Origin:', window.location.origin);
  console.log('Current URL:', window.location.href);
  console.log('Environment Variables:', {
    VITE_GOOGLE_CLIENT_ID: getEnvVar('VITE_GOOGLE_CLIENT_ID', 'NOT_SET'),
    VITE_GOOGLE_CLIENT_SECRET: getEnvVar('VITE_GOOGLE_CLIENT_SECRET', 'NOT_SET') ? 'SET' : 'NOT_SET'
  });
  
  // Check if we're on localhost
  if (!window.location.origin.includes('localhost')) {
    console.warn('⚠️ Not running on localhost. OAuth may not work.');
  }
  
  // Check if client ID looks valid
  if (!googleProvider.clientId.includes('apps.googleusercontent.com')) {
    console.error('❌ Invalid Google Client ID format');
    return false;
  }
  
  console.log('✅ Basic configuration looks correct');
  return true;
}; 