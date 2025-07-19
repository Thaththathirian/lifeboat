import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useStudent } from "@/contexts/StudentContext";
import { useStudentStatus } from '@/components/layout/StudentStatusProvider';
import OTPVerification from "@/components/OTPVerification";

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
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

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
      // Call the OTP sending API
      const response = await fetch('http://localhost/lifeboat/Student/verify_mobile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileNumber: mobileNumber,
          action: 'send_otp' // Indicate this is for sending OTP
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Store mobile number in profile
        setProfile({
          ...profile,
          mobile: mobileNumber,
          ...googleUserData
        });

        setOtpSent(true);
        startResendTimer();
        
        toast({
          title: "OTP Sent Successfully",
          description: "Please check your mobile for the verification code.",
        });
      } else {
        throw new Error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send OTP. Please try again.",
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
      const response = await fetch('http://localhost/lifeboat/Student/verify_mobile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileNumber: mobileNumber,
          action: 'resend_otp'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        startResendTimer();
        toast({
          title: "OTP Resent Successfully",
          description: "Please check your mobile for the new verification code.",
        });
      } else {
        throw new Error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend OTP. Please try again.",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
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
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                    onChange={(e) => {
                      const otp = e.target.value.replace(/\D/g, '');
                      if (otp.length === 6) {
                        // Auto-verify when 6 digits are entered
                        handleOTPVerification(otp);
                      }
                    }}
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

      {/* OTP Verification Modal */}
      {showOTPVerification && (
        <OTPVerification
          googleUserData={googleUserData}
          onSuccess={async (combinedUserData) => {
            setShowOTPVerification(false);
            setIsLoading(true);
            
            try {
              // Update profile with combined data
              setProfile({
                ...combinedUserData,
                mobile: mobileNumber
              });
              setStatus('Profile Pending');
              
              toast({
                title: "Verification Successful",
                description: `Welcome, ${combinedUserData.name}! Redirecting to dashboard...`,
              });
              
              // Navigate to student dashboard
              navigate('/student');
            } catch (error) {
              console.error('Verification failed:', error);
              toast({
                title: "Verification Failed",
                description: "Please try again or contact support.",
                variant: "destructive",
              });
            } finally {
              setIsLoading(false);
            }
          }}
          onBack={() => {
            setShowOTPVerification(false);
            setIsLoading(false);
            toast({
              title: "Verification Cancelled",
              description: "You can try again later.",
            });
          }}
        />
      )}
    </div>
  );

  // Handle OTP verification
  function handleOTPVerification(otp: string) {
    setIsLoading(true);
    
    fetch('http://localhost/lifeboat/Student/verify_mobile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobileNumber: mobileNumber,
        otp: otp,
        action: 'verify_otp'
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Show OTP verification modal for final step
        setShowOTPVerification(true);
        toast({
          title: "OTP Verified",
          description: "Mobile number verified successfully!",
        });
      } else {
        toast({
          title: "Invalid OTP",
          description: data.message || "Please enter the correct OTP.",
          variant: "destructive",
        });
      }
    })
    .catch(error => {
      console.error('Error verifying OTP:', error);
      toast({
        title: "Verification Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    })
    .finally(() => {
      setIsLoading(false);
    });
  }
} 