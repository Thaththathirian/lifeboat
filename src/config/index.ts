// Main configuration exports
export { 
  GOOGLE_OAUTH_CONFIG, 
  getGoogleOAuthConfig, 
  validateOAuthConfig,
  getCurrentOrigin,
  isOriginAuthorized 
} from './oauth';

// App configuration
export const APP_CONFIG = {
  name: 'Scholarship Connect Platform',
  version: '1.0.0',
  description: 'A platform connecting students with scholarship opportunities'
};

// Development configuration
export const DEV_CONFIG = {
  port: 8080,
  host: 'localhost',
  protocol: 'http'
};

// Production configuration
export const PROD_CONFIG = {
  port: 443,
  protocol: 'https'
}; 