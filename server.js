import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80; // Use port 80 for localhost without port number

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost',
    'http://localhost/google-firebase-auth',
    'http://localhost:8080'
  ],
  credentials: true
}));

// Serve static files from the dist folder
app.use('/google-firebase-auth', express.static(path.join(__dirname, 'dist')));

// Health check endpoint (must come before SPA catch-all)
app.get('/google-firebase-auth/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      frontend: 'http://localhost/google-firebase-auth/',
      api: 'http://localhost/google-firebase-auth/google_auth'
    }
  });
});

// Google OAuth API endpoint
app.post('/google-firebase-auth/google_auth', express.json(), async (req, res) => {
  try {
    console.log('Google OAuth API called');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
    // Extract the Google JWT token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Missing or invalid authorization header'
      });
    }
    
    const googleToken = authHeader.substring(7);
    console.log('Google token received (length):', googleToken.length);
    
    // For now, just return a success response
    // You can add actual Google token verification here
    res.json({
      success: true,
      user: {
        id: 'backend_user_123',
        googleId: 'google_user_123',
        name: req.body.userData?.name || 'Test User',
        email: req.body.userData?.email || 'test@example.com',
        picture: req.body.userData?.picture || 'https://via.placeholder.com/150',
        status: 'Profile Pending',
        createdAt: new Date().toISOString()
      },
      token: 'backend_session_token_' + Date.now()
    });
    
  } catch (error) {
    console.error('Google OAuth API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Handle the root path for the application
app.get('/google-firebase-auth', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Handle all routes for the SPA (Single Page Application) - must be last
app.get('/google-firebase-auth/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost/google-firebase-auth/`);
  console.log(`🔗 API: http://localhost/google-firebase-auth/google_auth`);
  console.log(`❤️  Health: http://localhost/google-firebase-auth/health`);
  console.log('');
  console.log('📋 Available endpoints:');
  console.log('   GET  /google-firebase-auth/          - Frontend application');
  console.log('   POST /google-firebase-auth/google_auth - Google OAuth API');
  console.log('   GET  /google-firebase-auth/health     - Health check');
  console.log('');
  console.log('🔧 For development, you can also access:');
  console.log('   http://localhost:8080/ (Vite dev server)');
}); 