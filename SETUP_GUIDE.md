# Setup Guide: Running Build Files with Backend

## Overview
This guide explains how to run your built frontend files with a backend server at `http://localhost/google-firebase-auth/`.

## 🚀 Quick Start

### **Step 1: Build the Frontend**
```bash
npm run build
```

### **Step 2: Start the Server**
```bash
node server.js
```

### **Step 3: Access the Application**
- **Frontend**: http://localhost/google-firebase-auth/
- **API**: http://localhost/google-firebase-auth/google_auth
- **Health Check**: http://localhost/google-firebase-auth/health

## 📁 File Structure

```
scholarship-connect-platform/
├── dist/                    # Built frontend files
├── src/                     # Source code
├── server.js               # Express server
├── package.json            # Dependencies
└── vite.config.ts         # Build configuration
```

## 🔧 Server Configuration

### **Server Features:**
- ✅ **Serves built files** from `/dist` folder
- ✅ **Handles SPA routing** (all routes serve index.html)
- ✅ **Google OAuth API** endpoint at `/google_auth`
- ✅ **CORS enabled** for cross-origin requests
- ✅ **Health check** endpoint for monitoring

### **API Endpoints:**
```
GET  /google-firebase-auth/          - Frontend application
POST /google-firebase-auth/google_auth - Google OAuth API
GET  /google-firebase-auth/health     - Health check
```

## 🛠️ Development Workflow

### **Option 1: Development Mode (Recommended for development)**
```bash
npm run dev
# Access: http://localhost:8080/
```

### **Option 2: Production Build with Server (Recommended for backend development)**
```bash
npm run build
node server.js
# Access: http://localhost/google-firebase-auth/
```

### **Option 3: One-command Start**
```bash
npm start
# This builds and starts the server automatically
```

## 🔍 Testing the Setup

### **1. Check if Server is Running**
```bash
# Check if port 80 is in use
netstat -ano | findstr :80
```

### **2. Test Health Endpoint**
Open in browser: `http://localhost/google-firebase-auth/health`

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "endpoints": {
    "frontend": "http://localhost/google-firebase-auth/",
    "api": "http://localhost/google-firebase-auth/google_auth"
  }
}
```

### **3. Test Frontend**
Open in browser: `http://localhost/google-firebase-auth/`

You should see the Scholarship Connect application.

## 🔧 Google Cloud Console Configuration

### **Authorized JavaScript Origins:**
```
http://localhost:8080
http://localhost/google-firebase-auth
```

### **Authorized Redirect URIs:**
```
http://localhost:8080/student/google-login
http://localhost/google-firebase-auth/student/google-login
```

## 🐛 Troubleshooting

### **Issue: "Port 80 already in use"**
**Solution:**
```bash
# Kill process on port 80 (requires admin privileges)
netstat -ano | findstr :80
taskkill /PID <PID> /F
```

### **Issue: "Cannot find module 'express'"**
**Solution:**
```bash
npm install express cors
```

### **Issue: "Build files not found"**
**Solution:**
```bash
npm run build
# Check that dist/ folder exists and contains files
```

### **Issue: "Google OAuth not working"**
**Solution:**
1. Update Google Cloud Console with new origins
2. Wait 5-10 minutes for changes to propagate
3. Clear browser cache
4. Check browser console for errors

### **Issue: "API calls failing"**
**Solution:**
1. Check that server is running: `node server.js`
2. Verify API endpoint: `http://localhost/google-firebase-auth/google_auth`
3. Check browser console for CORS errors
4. Verify the API endpoint in `src/utils/backendService.ts`

## 📋 Environment Variables

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

## 🔄 Development vs Production

### **Development Mode:**
- ✅ **Hot reload** with Vite
- ✅ **Fast development** cycle
- ✅ **Access**: `http://localhost:8080/`
- ✅ **API**: `http://localhost:8080/google_auth`

### **Production Build with Server:**
- ✅ **Real production** environment
- ✅ **Backend integration** testing
- ✅ **Access**: `http://localhost/google-firebase-auth/`
- ✅ **API**: `http://localhost/google-firebase-auth/google_auth`

## 🎯 Next Steps

1. **Start the server**: `node server.js`
2. **Access the application**: http://localhost/google-firebase-auth/
3. **Test Google OAuth**: Click "Apply Now" button
4. **Test API calls**: Check browser console for API requests
5. **Update Google Cloud Console**: Add the new origins and redirect URIs

## 📞 Support

If you encounter issues:
1. Check the server console for errors
2. Verify all URLs are exactly as specified
3. Ensure Google Cloud Console is updated
4. Clear browser cache and try again
5. Check that all dependencies are installed: `npm install` 