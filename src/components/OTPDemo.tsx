import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Shield, Clock, CheckCircle, XCircle } from "lucide-react";

export default function OTPDemo() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Student Login with Mobile OTP
        </h1>
        <p className="text-lg text-gray-600">
          Secure authentication using mobile number and OTP verification
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Security Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Indian mobile number validation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>6-digit OTP with individual input slots</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>30-second resend timer</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Rate limiting and attempt tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>OTP expiration (5 minutes)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Real-time validation and error handling</span>
            </div>
          </CardContent>
        </Card>

        {/* How to Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-600" />
              How to Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Badge variant="outline" className="w-fit">
                Step 1: Enter Mobile Number
              </Badge>
              <p className="text-sm text-gray-600">
                Enter any valid 10-digit Indian mobile number (starting with 6-9)
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline" className="w-fit">
                Step 2: Send OTP
              </Badge>
              <p className="text-sm text-gray-600">
                Click "Send OTP" to receive a 6-digit verification code
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline" className="w-fit">
                Step 3: Enter OTP
              </Badge>
              <p className="text-sm text-gray-600">
                Use the displayed OTP or enter "123456" for testing
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline" className="w-fit">
                Step 4: Verify & Login
              </Badge>
              <p className="text-sm text-gray-600">
                Click "Verify & Login" to complete authentication
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Technical Implementation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Frontend Components</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• React Hook Form with Zod validation</li>
                <li>• Custom useOTP hook for state management</li>
                <li>• InputOTP component for 6-digit input</li>
                <li>• Toast notifications for user feedback</li>
                <li>• Loading states and error handling</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Backend Services</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• OTPService singleton for OTP operations</li>
                <li>• Mobile number validation (Indian format)</li>
                <li>• OTP generation and storage</li>
                <li>• Rate limiting and security measures</li>
                <li>• Mock SMS integration ready</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Security Features</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Input sanitization and validation</li>
                <li>• OTP expiration (5 minutes)</li>
                <li>• Attempt tracking and rate limiting</li>
                <li>• Secure token generation</li>
                <li>• Error handling without data leakage</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Production Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">SMS Service Integration</h4>
              <p className="text-sm text-gray-600 mb-2">
                Replace the mock SMS service with a real provider:
              </p>
              <div className="grid md:grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Twilio</strong><br/>
                  <code>npm install twilio</code>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <strong>AWS SNS</strong><br/>
                  <code>npm install @aws-sdk/client-sns</code>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <strong>MessageBird</strong><br/>
                  <code>npm install messagebird</code>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <strong>SendGrid</strong><br/>
                  <code>npm install @sendgrid/mail</code>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Database Integration</h4>
              <p className="text-sm text-gray-600">
                Store OTPs and user data in a secure database (PostgreSQL, MongoDB, etc.)
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Environment Variables</h4>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                <div>SMS_SERVICE_API_KEY=your_api_key</div>
                <div>SMS_SERVICE_SECRET=your_secret</div>
                <div>OTP_EXPIRY_MINUTES=5</div>
                <div>MAX_OTP_ATTEMPTS=3</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 