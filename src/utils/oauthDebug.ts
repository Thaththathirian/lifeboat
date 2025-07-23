// OAuth Debug Utility
// This file helps debug OAuth token transmission issues

export const debugOAuthFlow = {
  // Log OAuth callback parameters
  logCallbackParams: () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    
    console.log('=== OAuth Callback Debug ===');
    console.log('Full URL:', window.location.href);
    console.log('Hash:', hash);
    console.log('Access Token:', params.get('access_token') ? 'PRESENT' : 'MISSING');
    console.log('Error:', params.get('error'));
    console.log('State:', params.get('state'));
    console.log('Token Type:', params.get('token_type'));
    console.log('Expires In:', params.get('expires_in'));
  },

  // Test API endpoint connectivity
  testApiConnectivity: async () => {
    console.log('=== API Connectivity Test ===');
    
    try {
      const response = await fetch('http://localhost/lifeboat/OAuth/Student', {
        method: 'OPTIONS', // Preflight request
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type, Authorization',
        },
      });
      
      console.log('CORS Preflight Response:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
      });
      
      return response.ok;
    } catch (error) {
      console.error('API connectivity test failed:', error);
      return false;
    }
  },

  // Test token transmission
  testTokenTransmission: async (token: string, userData: any) => {
    console.log('=== Token Transmission Test ===');
    console.log('Token length:', token.length);
    console.log('Token preview:', token.substring(0, 20) + '...');
    console.log('User data:', userData);
    
    try {
      const response = await fetch('http://localhost/lifeboat/OAuth/Student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userData: userData,
          tokenType: 'google_jwt',
          debug: true, // Add debug flag
        }),
      });

      console.log('Response Status:', response.status);
      console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Response Text:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Response JSON:', responseData);
      } catch (e) {
        console.log('Response is not JSON:', responseText);
      }

      return {
        success: response.ok,
        status: response.status,
        data: responseData,
        text: responseText,
      };
    } catch (error) {
      console.error('Token transmission test failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Log environment variables
  logEnvironment: () => {
    console.log('=== Environment Debug ===');
    console.log('Current URL:', window.location.href);
    console.log('Origin:', window.location.origin);
    console.log('User Agent:', navigator.userAgent);
    console.log('Environment Variables:', {
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
      VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      NODE_ENV: import.meta.env.NODE_ENV,
    });
  },

  // Run comprehensive debug
  runComprehensiveDebug: async () => {
    console.log('=== Starting Comprehensive OAuth Debug ===');
    
    debugOAuthFlow.logEnvironment();
    debugOAuthFlow.logCallbackParams();
    
    const apiConnectivity = await debugOAuthFlow.testApiConnectivity();
    console.log('API Connectivity:', apiConnectivity ? '✅ OK' : '❌ FAILED');
    
    return {
      apiConnectivity,
      hasCallbackParams: window.location.hash.includes('access_token'),
    };
  },
}; 