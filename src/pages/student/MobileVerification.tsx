import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, ArrowLeft, CheckCircle, Clock, TestTube } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useStudent } from "@/contexts/StudentContext";
import { useStudentStatus } from '@/components/layout/StudentStatusProvider';
import { sendOTP, verifyOTP, clearRecaptcha, getFirebaseIdToken } from "@/utils/firebase";

interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export default function MobileVerification() {
  const navigate = useNavigate();
  const { profile, setProfile } = useStudent();
  const { setStatus } = useStudentStatus();
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [testMode, setTestMode] = useState(false);

  // Get Google user data from URL params or localStorage
  const getGoogleUserData = (): GoogleUser | null => {
    // Try to get from localStorage first
    const storedData = localStorage.getItem('googleUserData');
    if (storedData) {
      return JSON.parse(storedData);
    }
    return null;
  };

  const googleUserData = getGoogleUserData();

  // If no Google user data, redirect to landing page
  if (!googleUserData) {
    navigate('/student-landing');
    return null;
  }

  // Ensure reCAPTCHA container exists when component mounts
  useEffect(() => {
    const container = document.getElementById('recaptcha-container');
    if (!container) {
      const newContainer = document.createElement('div');
      newContainer.id = 'recaptcha-container';
      newContainer.style.position = 'fixed';
      newContainer.style.top = '-9999px';
      newContainer.style.left = '-9999px';
      document.body.appendChild(newContainer);
    }
  }, []);

  // Handle resend timer
  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Set current user for protected routes
  const setCurrentUser = (userData: any) => {
    const currentUser = {
      id: userData.id || userData.firebaseUid || 'student-' + Date.now(),
      name: userData.name,
      email: userData.email,
      type: "student" as const,
      avatar: userData.picture
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Trigger storage event for App component to detect
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'currentUser',
      newValue: JSON.stringify(currentUser),
      oldValue: null,
      storageArea: localStorage
    }));
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mobileNumber || mobileNumber.length !== 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (testMode) {
        // Test mode: Simulate OTP send
        console.log('Test mode: Simulating OTP send to', mobileNumber);
        setOtpSent(true);
        startResendTimer();
        
        // Store mobile number in profile
        setProfile({
          ...profile,
          mobile: mobileNumber,
          ...googleUserData
        });
        
        toast({
          title: "Test Mode: OTP Sent",
          description: "Test OTP: 123456 (Test mode enabled)",
        });
      } else {
        // Original Firebase mode
        console.log('Original mode: Sending OTP via Firebase');
        
        // Format phone number for Firebase
        const phoneNumber = `+91${mobileNumber}`;
        
        // Send OTP using Firebase with reCAPTCHA
        const result = await sendOTP(phoneNumber, 'recaptcha-container');
        
        if (result.success) {
          setConfirmationResult(result.confirmationResult);
          setOtpSent(true);
          startResendTimer();
          
          // Store mobile number in profile
          setProfile({
            ...profile,
            mobile: mobileNumber,
            ...googleUserData
          });
          
          toast({
            title: "OTP Sent Successfully",
            description: "Please check your mobile for the verification code.",
          });
        } else {
          throw new Error(result.error || "Failed to send OTP");
        }
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      
      let errorMessage = "Failed to send OTP. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes('BILLING_NOT_ENABLED')) {
          errorMessage = "Firebase billing not enabled. Please enable billing in Firebase Console or use Test Mode.";
        } else if (error.message.includes('reCAPTCHA')) {
          errorMessage = "reCAPTCHA verification failed. Please try again or use Test Mode.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    
    try {
      if (testMode) {
        // Test mode: Simulate OTP resend
        console.log('Test mode: Simulating OTP resend to', mobileNumber);
        startResendTimer();
        
        toast({
          title: "Test Mode: OTP Resent",
          description: "Test OTP: 123456 (Test mode enabled)",
        });
      } else {
        // Original Firebase mode
        console.log('Original mode: Resending OTP via Firebase');
        
        // Clear previous reCAPTCHA
        clearRecaptcha();
        
        // Format phone number for Firebase
        const phoneNumber = `+91${mobileNumber}`;
        
        // Resend OTP using Firebase
        const result = await sendOTP(phoneNumber, 'recaptcha-container');
        
        if (result.success) {
          setConfirmationResult(result.confirmationResult);
          startResendTimer();
          
          toast({
            title: "OTP Resent Successfully",
            description: "Please check your mobile for the new verification code.",
          });
        } else {
          throw new Error(result.error || "Failed to resend OTP");
        }
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      
      let errorMessage = "Failed to resend OTP. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes('BILLING_NOT_ENABLED')) {
          errorMessage = "Firebase billing not enabled. Please enable billing in Firebase Console or use Test Mode.";
        } else if (error.message.includes('reCAPTCHA')) {
          errorMessage = "reCAPTCHA verification failed. Please try again or use Test Mode.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLanding = () => {
    // Clear stored data and go back to landing page
    localStorage.removeItem('googleUserData');
    navigate('/student-landing');
  };

  // Handle OTP verification with Firebase
  const handleOTPVerification = async (otp: string) => {
    if (testMode) {
      // Test mode: Simulate OTP verification
      if (otp === '123456') {
        console.log('Test mode: OTP verification successful');
        
        // Simulate successful verification
        const combinedUserData = {
          ...googleUserData,
          mobile: mobileNumber,
          firebaseUid: 'test-uid-' + Date.now(),
          verified: true,
        };
        
        // Update profile with combined data
        setProfile({
          ...profile,
          mobile: mobileNumber,
          firebaseUid: 'test-uid-' + Date.now(),
          ...googleUserData
        });
        setStatus('Profile Pending');
        
        // Set current user for protected routes
        setCurrentUser(combinedUserData);
        
        toast({
          title: "Test Mode: Verification Successful",
          description: `Welcome, ${googleUserData.name}! Redirecting to dashboard...`,
        });
        
        // Small delay to ensure state is updated before navigation
        setTimeout(() => {
          navigate('/student');
        }, 100);
      } else {
        toast({
          title: "Test Mode: Invalid OTP",
          description: "Test OTP is 123456. Please try again.",
          variant: "destructive",
        });
      }
      return;
    }

    // Original Firebase mode
    if (!confirmationResult) {
      toast({
        title: "Error",
        description: "Please send OTP first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Original mode: Verifying OTP via Firebase');
      
      // Verify OTP with Firebase
      const result = await verifyOTP(confirmationResult, otp);
      
      if (result.success && result.user) {
        // Get Firebase ID token for authentication
        const idToken = await getFirebaseIdToken();
        
        // Prepare headers with Firebase bearer token
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (idToken) {
          headers['Authorization'] = `Bearer ${idToken}`;
        }
        
        // Firebase verification successful, now call your API
        const apiResponse = await fetch('http://localhost/lifeboat/Student/verify_mobile', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            mobileNumber: mobileNumber,
            firebaseUid: result.user.uid,
            action: 'verify_mobile'
          }),
        });

        if (!apiResponse.ok) {
          const errorData = await apiResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${apiResponse.status}`);
        }

        const apiData = await apiResponse.json();
        
        if (apiData.success) {
          // Update profile with combined data
          setProfile({
            ...profile,
            mobile: mobileNumber,
            firebaseUid: result.user.uid,
            ...googleUserData
          });
          setStatus('Profile Pending');
          
          // Set current user for protected routes
          setCurrentUser({
            ...googleUserData,
            mobile: mobileNumber,
            firebaseUid: result.user.uid,
          });
          
          toast({
            title: "Verification Successful",
            description: `Welcome, ${googleUserData.name}! Redirecting to dashboard...`,
          });
          
          // Small delay to ensure state is updated before navigation
          setTimeout(() => {
            navigate('/student');
          }, 100);
        } else {
          throw new Error(apiData.message || "Backend verification failed");
        }
      } else {
        throw new Error(result.error || "Firebase verification failed");
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Test Mode Toggle */}
        <div className="mb-4 flex justify-center">
          <Button
            type="button"
            variant={testMode ? "default" : "outline"}
            size="sm"
            onClick={() => setTestMode(!testMode)}
            className={`flex items-center gap-2 ${testMode ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
          >
            <TestTube className="h-4 w-4" />
            {testMode ? "Test Mode ON" : "Test Mode OFF"}
          </Button>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Phone className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">
              {otpSent ? "Enter OTP" : "Mobile Verification"}
            </CardTitle>
            <p className="text-muted-foreground">
              {otpSent 
                ? "Enter the 6-digit code sent to your mobile"
                : `Welcome, ${googleUserData.name}! Please verify your mobile number to continue.`
              }
            </p>
            {testMode && (
              <div className="mt-2 p-2 bg-orange-100 border border-orange-300 rounded-md">
                <p className="text-sm text-orange-800 font-medium">
                  🧪 Test Mode Active: Use "123456" as OTP
                </p>
              </div>
            )}
            {!testMode && (
              <div className="mt-2 p-2 bg-blue-100 border border-blue-300 rounded-md">
                <p className="text-sm text-blue-800 font-medium">
                  🔥 Firebase Mode: Real OTP will be sent to your mobile
                </p>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            {!otpSent ? (
              // Step 1: Enter Mobile Number
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    maxLength={10}
                    required
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">
                    We'll send an OTP to verify your mobile number
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToLanding}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !mobileNumber || mobileNumber.length !== 10}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4 mr-2" />
                        Send OTP
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              // Step 2: Enter OTP
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Mobile Number</Label>
                  <div className="p-3 bg-gray-100 rounded-md text-gray-700">
                    +91 {mobileNumber}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setOtpSent(false);
                      setResendTimer(0);
                      setOtpCode("");
                      setConfirmationResult(null);
                      clearRecaptcha();
                    }}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Change Number
                  </Button>
                  <Button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0 || isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Sending...
                      </>
                    ) : resendTimer > 0 ? (
                      <>
                        <Clock className="h-4 w-4 mr-2" />
                        Resend in {resendTimer}s
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4 mr-2" />
                        Resend OTP
                      </>
                    )}
                  </Button>
                </div>

                {/* OTP Input */}
                <div className="space-y-4">
                  <Label>Enter OTP</Label>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otpCode}
                    onChange={(e) => {
                      const otp = e.target.value.replace(/\D/g, '');
                      setOtpCode(otp);
                      if (otp.length === 6) {
                        // Auto-verify when 6 digits are entered
                        handleOTPVerification(otp);
                      }
                    }}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Enter the 6-digit code sent to your mobile
                  </p>
                </div>
              </div>
            )}

            {/* User Info Display */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Google Account Info</h4>
              <div className="space-y-1 text-sm">
                <div><strong>Name:</strong> {googleUserData.name}</div>
                <div><strong>Email:</strong> {googleUserData.email}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </div>
  );
} 