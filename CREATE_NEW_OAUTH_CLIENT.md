# Create New Google OAuth Client

## If Current Client is Having Issues

If you're still getting 403 errors after updating the existing client, let's create a new OAuth client.

## Step-by-Step Process

### 1. Go to Google Cloud Console
1. Open: https://console.cloud.google.com/
2. Make sure you're in the correct project
3. Navigate to **APIs & Services** → **Credentials**

### 2. Create New OAuth Client
1. Click **"+ CREATE CREDENTIALS"**
2. Select **"OAuth client ID"**
3. Choose **"Web application"**
4. Give it a name: **"Scholarship Connect Web Client"**

### 3. Configure Authorized JavaScript Origins
Add these origins:
```
http://localhost:8080
http://localhost:3000
http://localhost:5173
```

### 4. Configure Authorized Redirect URIs
Add these redirect URIs:
```
http://localhost:8080/student/google-login
http://localhost:3000/student/google-login
http://localhost:5173/student/google-login
```

### 5. Create the Client
1. Click **"Create"**
2. Copy the new **Client ID** and **Client Secret**

### 6. Update Environment Variables
Update your `.env` file with the new credentials:

```env
VITE_GOOGLE_CLIENT_ID=your_new_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_new_client_secret_here
```

### 7. Restart Development Server
```bash
npm run dev
```

## Verification

After creating the new client:
1. Clear browser cache
2. Refresh the page
3. Click "Apply Now"
4. Should work without 403 errors

## Troubleshooting

### Still getting 403 errors?
1. Make sure you're in the correct Google Cloud project
2. Verify the client ID matches exactly
3. Check that the OAuth client is enabled
4. Wait 5-10 minutes for changes to propagate

### Can't create OAuth client?
1. Make sure you have edit permissions on the project
2. Check that the Google+ API is enabled
3. Verify your Google account has the necessary permissions 