import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, AlertCircle, Chrome } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useStudent } from "@/contexts/StudentContext";
import { authenticateWithBackend } from "@/utils/backendService";
import { googleProvider, handleOAuthCallback } from "@/utils/googleOAuth";
import { debugOAuthFlow } from "@/utils/oauthDebug";

interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export default function GoogleLoginPage() {
  const navigate = useNavigate();
  const { setStatus, setProfile } = useStudent();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for OAuth callback on page load
  useEffect(() => {
    // Run debug first
    debugOAuthFlow.runComprehensiveDebug();
    
    // Check if we're returning from Google OAuth
    if (window.location.hash.includes('access_token')) {
      console.log('Detected OAuth callback, processing...');
      processOAuthCallback();
    } else {
      // If no OAuth callback, redirect to Google OAuth
      console.log('No OAuth callback detected, redirecting to Google OAuth...');
      redirectToGoogleOAuth();
    }
  }, []);

  const processOAuthCallback = async () => {
    setIsProcessing(true);
    
    try {
      console.log('Processing OAuth callback...');
      const oauthResult = await handleOAuthCallback();
      
      if (oauthResult.success) {
        // Type guard to ensure we have the success case
        if ('user' in oauthResult && 'accessToken' in oauthResult) {
          console.log('OAuth successful, user data:', oauthResult.user);
        
          // Debug token transmission
          await debugOAuthFlow.testTokenTransmission(oauthResult.accessToken, oauthResult.user);
          
          // Send access token to backend
          const backendResponse = await authenticateWithBackend(
            oauthResult.accessToken, 
            oauthResult.user
          );
            
          if (backendResponse.success) {
            // Store backend token
            if (backendResponse.token) {
              localStorage.setItem('authToken', backendResponse.token);
            }
            
            // Set user profile and navigate
            setProfile({
              ...oauthResult.user,
              ...backendResponse.user
            });
            setStatus('Profile Pending');
            
            toast({
              title: "Login Successful",
              description: `Welcome, ${oauthResult.user.name}! Redirecting to home...`,
            });
            
            // Clear URL hash and navigate
            window.location.hash = '';
            navigate('/student');
          } else {
            throw new Error(backendResponse.error || 'Backend authentication failed');
          }
        } else {
          throw new Error('Invalid OAuth result structure');
        }
      } else {
        throw new Error('error' in oauthResult ? oauthResult.error : 'OAuth callback failed');
      }
    } catch (error) {
      console.error('OAuth callback processing failed:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      
      toast({
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "Failed to authenticate with Google",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const redirectToGoogleOAuth = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleProvider.clientId}&redirect_uri=${encodeURIComponent(window.location.href)}&response_type=token&scope=openid%20email%20profile`;
    window.location.href = googleAuthUrl;
  };

  const handleRetry = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              {isProcessing ? (
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              ) : error ? (
                <XCircle className="h-12 w-12 text-red-600" />
              ) : (
                <Chrome className="h-12 w-12 text-blue-600" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {isProcessing ? 'Processing Authentication...' : error ? 'Authentication Failed' : 'Google OAuth'}
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              {isProcessing 
                ? 'Please wait while we complete your sign-in...'
                : error 
                  ? 'There was an issue with your authentication'
                  : 'Redirecting to Google OAuth...'
              }
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {isProcessing ? (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-600">Processing OAuth callback...</span>
                </div>
              </div>
            ) : error ? (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-red-800">Authentication Error</h4>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleRetry} className="flex-1">
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={handleGoBack} className="flex-1">
                    Go Back
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Chrome className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600">Redirecting to Google...</span>
                </div>
                <div className="text-xs text-gray-500">
                  Please wait while we redirect you to Google OAuth...
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 