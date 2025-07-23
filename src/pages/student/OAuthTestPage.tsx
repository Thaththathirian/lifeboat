import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { debugOAuthFlow } from "@/utils/oauthDebug";

export default function OAuthTestPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTests = async () => {
    setIsLoading(true);
    try {
      const results = await debugOAuthFlow.runComprehensiveDebug();
      setTestResults(results);
    } catch (error) {
      console.error('Test failed:', error);
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
    }
  };

  const testTokenTransmission = async () => {
    setIsLoading(true);
    try {
      const mockToken = "mock_google_jwt_token_for_testing";
      const mockUserData = {
        id: "test_user_id",
        name: "Test User",
        email: "test@example.com",
        picture: "https://example.com/picture.jpg"
      };

      const results = await debugOAuthFlow.testTokenTransmission(mockToken, mockUserData);
      setTestResults(results);
    } catch (error) {
      console.error('Token transmission test failed:', error);
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">OAuth API Test</CardTitle>
          <p className="text-muted-foreground">
            Test the OAuth token verification API endpoint
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <Button onClick={runTests} disabled={isLoading}>
              {isLoading ? 'Running Tests...' : 'Run Comprehensive Tests'}
            </Button>
            <Button onClick={testTokenTransmission} disabled={isLoading} variant="outline">
              Test Token Transmission
            </Button>
          </div>

          {testResults && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Results:</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          )}

          <div className="text-sm text-gray-600">
            <h4 className="font-semibold mb-2">What this tests:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>API endpoint connectivity (CORS preflight)</li>
              <li>OAuth callback parameter parsing</li>
              <li>Token transmission to backend</li>
              <li>Environment variable configuration</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 