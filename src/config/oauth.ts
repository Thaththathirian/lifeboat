// Centralized OAuth Configuration
// This file contains all OAuth-related settings for the application

// Google OAuth Configuration
export const GOOGLE_OAUTH_CONFIG = {
  // Client Credentials (from environment variables)
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "your_client_id_here",
  clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || "your_client_secret_here",
  
  // Authorized Origins (JavaScript origins)
  authorizedOrigins: [
    "http://localhost:8080",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  
  // Redirect URIs
  redirectUris: [
    "http://localhost:8080/student/google-login",
    "http://localhost:8080/",
    "http://localhost:5173/student/google-login",
    "http://localhost:5173/"
  ],
  
  // OAuth Scopes
  scopes: [
    "openid",
    "email", 
    "profile"
  ],
  
  // Response Type
  responseType: "token",
  
  // OAuth Endpoints
  endpoints: {
    auth: "https://accounts.google.com/o/oauth2/v2/auth",
    userInfo: "https://www.googleapis.com/oauth2/v2/userinfo",
    tokenInfo: "https://oauth2.googleapis.com/tokeninfo"
  }
};

// Environment variable support
const getEnvVar = (key: string, fallback: string) => {
  return import.meta.env[key] || fallback;
};

// Production configuration (can be overridden by environment variables)
export const getGoogleOAuthConfig = () => {
  return {
    clientId: getEnvVar('VITE_GOOGLE_CLIENT_ID', GOOGLE_OAUTH_CONFIG.clientId),
    clientSecret: getEnvVar('VITE_GOOGLE_CLIENT_SECRET', GOOGLE_OAUTH_CONFIG.clientSecret),
    authorizedOrigins: GOOGLE_OAUTH_CONFIG.authorizedOrigins,
    redirectUris: GOOGLE_OAUTH_CONFIG.redirectUris,
    scopes: GOOGLE_OAUTH_CONFIG.scopes,
    responseType: GOOGLE_OAUTH_CONFIG.responseType,
    endpoints: GOOGLE_OAUTH_CONFIG.endpoints
  };
};

// Validation functions
export const validateOAuthConfig = () => {
  const config = getGoogleOAuthConfig();
  
  const errors = [];
  
  if (!config.clientId || config.clientId === "your_client_id_here") {
    errors.push("Google OAuth Client ID is not configured");
  }
  
  if (!config.clientSecret || config.clientSecret === "your_client_secret_here") {
    errors.push("Google OAuth Client Secret is not configured");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Get current origin for validation
export const getCurrentOrigin = () => {
  return window.location.origin;
};

// Check if current origin is authorized
export const isOriginAuthorized = () => {
  const currentOrigin = getCurrentOrigin();
  const config = getGoogleOAuthConfig();
  return config.authorizedOrigins.includes(currentOrigin);
}; 