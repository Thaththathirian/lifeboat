import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { googleProvider } from '@/utils/googleOAuth';

interface DebugInfo {
  clientId: string;
  origin: string;
  googleLoaded: boolean;
  googleInitialized: boolean;
  testResult?: 'success' | 'error' | 'pending';
  errorMessage?: string;
}

export default function GoogleOAuthDebug() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    clientId: googleProvider.clientId,
    origin: window.location.origin,
    googleLoaded: !!window.google,
    googleInitialized: false,
  });

  const [isTesting, setIsTesting] = useState(false);

  // Test Google OAuth configuration
  const testOAuthConfig = async () => {
    setIsTesting(true);
    setDebugInfo(prev => ({ ...prev, testResult: 'pending' }));

    try {
      // Test if Google OAuth is accessible
      const response = await fetch(
        `https://accounts.google.com/gsi/status?client_id=${googleProvider.clientId}`
      );

      if (response.ok) {
        setDebugInfo(prev => ({ 
          ...prev, 
          testResult: 'success',
          googleInitialized: true 
        }));
      } else {
        setDebugInfo(prev => ({ 
          ...prev, 
          testResult: 'error',
          errorMessage: `HTTP ${response.status}: ${response.statusText}`
        }));
      }
    } catch (error) {
      setDebugInfo(prev => ({ 
        ...prev, 
        testResult: 'error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }));
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getTestResultIcon = () => {
    switch (debugInfo.testResult) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-600 animate-spin" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTestResultText = () => {
    switch (debugInfo.testResult) {
      case 'success':
        return 'OAuth configuration is working correctly';
      case 'error':
        return `OAuth configuration failed: ${debugInfo.errorMessage}`;
      case 'pending':
        return 'Testing OAuth configuration...';
      default:
        return 'Click "Test Configuration" to check OAuth setup';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Google OAuth Debug Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Configuration Status */}
        <div className="space-y-2">
          <h3 className="font-semibold">Configuration Status</h3>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">Client ID</span>
              <div className="flex items-center gap-2">
                <Badge variant={debugInfo.clientId ? "default" : "destructive"}>
                  {debugInfo.clientId ? "Set" : "Missing"}
                </Badge>
                {debugInfo.clientId && (
                  <span className="text-xs text-gray-500">
                    {debugInfo.clientId.substring(0, 20)}...
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">Current Origin</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(true)}
                <span className="text-xs">{debugInfo.origin}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">Google Script Loaded</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(debugInfo.googleLoaded)}
                <span className="text-xs">
                  {debugInfo.googleLoaded ? "Yes" : "No"}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">Google OAuth Initialized</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(debugInfo.googleInitialized)}
                <span className="text-xs">
                  {debugInfo.googleInitialized ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Test Configuration */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Test Configuration</h3>
            <Button 
              onClick={testOAuthConfig} 
              disabled={isTesting}
              size="sm"
            >
              {isTesting ? "Testing..." : "Test Configuration"}
            </Button>
          </div>
          
          <Alert>
            <div className="flex items-center gap-2">
              {getTestResultIcon()}
              <AlertDescription>
                {getTestResultText()}
              </AlertDescription>
            </div>
          </Alert>
        </div>

        {/* Troubleshooting Tips */}
        {debugInfo.testResult === 'error' && (
          <div className="space-y-2">
            <h3 className="font-semibold text-red-600">Troubleshooting</h3>
            <div className="text-sm space-y-1">
              <p>• Check that your domain is added to "Authorized JavaScript origins"</p>
              <p>• Verify your Client ID is correct in the .env file</p>
              <p>• Ensure Google+ API is enabled in Google Cloud Console</p>
              <p>• Try clearing browser cache and refreshing the page</p>
            </div>
          </div>
        )}

        {/* Environment Check */}
        <div className="space-y-2">
          <h3 className="font-semibold">Environment Variables</h3>
          <div className="text-xs space-y-1">
            <p><strong>VITE_GOOGLE_CLIENT_ID:</strong> {debugInfo.clientId || 'Not set'}</p>
            <p><strong>Current Origin:</strong> {debugInfo.origin}</p>
            <p><strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 