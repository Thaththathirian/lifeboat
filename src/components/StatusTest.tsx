import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentStatus } from '@/utils/backendService';
import { StudentStatus, getStatusDescription } from '@/types/student';

export function StatusTest() {
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testStatusAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Testing status API...');
      const response = await getCurrentStatus();
      
      if (response) {
        setStatus(response.status);
        console.log('Status API response:', response);
      } else {
        setError('No status response');
      }
    } catch (err) {
      console.error('Error testing status API:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Status API Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testStatusAPI} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test Status API'}
        </Button>
        
        {status !== null && (
          <div className="space-y-2">
            <p><strong>Status Code:</strong> {status}</p>
            <p><strong>Description:</strong> {getStatusDescription(status)}</p>
          </div>
        )}
        
        {error && (
          <div className="text-red-600">
            <strong>Error:</strong> {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 