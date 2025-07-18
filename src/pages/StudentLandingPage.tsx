import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowRight, Users, Award, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { googleProvider, getGoogleOAuthUrl, handleOAuthCallback, verifyOAuthConfiguration } from "@/utils/googleOAuth";
import { useStudent } from "@/contexts/StudentContext";
import { authenticateWithBackend } from "@/utils/backendService";
import OTPVerification from "@/components/OTPVerification";
import { testFirebase, testRecaptcha } from "@/utils/firebase-test";

interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export default function StudentLandingPage() {
  const navigate = useNavigate();
  const { setStatus, setProfile } = useStudent();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [googleUserData, setGoogleUserData] = useState<GoogleUser | null>(null);

  // Check for OAuth callback on page load
  useEffect(() => {
    // Check if we're returning from Google OAuth
    if (window.location.hash.includes('access_token')) {
      console.log('Detected OAuth callback, processing...');
      handleOAuthCallback().then((oauthResult) => {
        if (oauthResult.success && 'user' in oauthResult && 'accessToken' in oauthResult) {
          // Process the OAuth result similar to Google Sign-In
          const successResult = oauthResult as { success: true; user: any; accessToken: string };
          handleOAuthSuccess(successResult.user, successResult.accessToken);
        } else {
          toast({
            title: "OAuth Failed",
            description: oauthResult.error || "Failed to authenticate with Google",
            variant: "destructive",
          });
        }
      }).catch((error) => {
        console.error('OAuth callback error:', error);
        toast({
          title: "OAuth Failed",
          description: "Failed to process OAuth callback",
          variant: "destructive",
        });
      });
    }
  }, []);

  // Initialize Google OAuth
  useEffect(() => {
    console.log('Initializing Google OAuth...');
    
    // Test Firebase configuration first
    const testFirebaseConfig = async () => {
      try {
        const firebaseTest = testFirebase();
        console.log('Firebase test result:', firebaseTest);
        
        if (firebaseTest.success) {
          console.log('✅ Firebase is working correctly');
          
          // Test reCAPTCHA loading
          try {
            await testRecaptcha();
            console.log('✅ reCAPTCHA is working correctly');
          } catch (error) {
            console.warn('⚠️ reCAPTCHA test failed:', error);
          }
        } else {
          console.error('❌ Firebase test failed:', firebaseTest.error);
        }
      } catch (error) {
        console.error('❌ Firebase configuration error:', error);
      }
    };
    
    testFirebaseConfig();
    
    // Load Google OAuth script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      console.log('Google OAuth script loaded');
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: googleProvider.clientId,
            callback: handleGoogleSignIn,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          console.log('Google OAuth initialized successfully');
          
          // Render the Google sign-in button
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-container'),
            {
              theme: 'outline',
              size: 'large',
              text: 'signin_with',
              shape: 'rectangular',
              width: 300,
            }
          );
        } catch (error) {
          console.error('Google OAuth initialization failed:', error);
          // Fallback: try without FedCM and with minimal configuration
          try {
            window.google.accounts.id.initialize({
              client_id: googleProvider.clientId,
              callback: handleGoogleSignIn,
              auto_select: false,
              cancel_on_tap_outside: true,
            });
            console.log('Google OAuth initialized with fallback');
            
            // Render the Google sign-in button
            window.google.accounts.id.renderButton(
              document.getElementById('google-signin-container'),
              {
                theme: 'outline',
                size: 'large',
                text: 'signin_with',
                shape: 'rectangular',
                width: 300,
              }
            );
          } catch (fallbackError) {
            console.error('Google OAuth fallback also failed:', fallbackError);
            toast({
              title: "Authentication Error",
              description: "Please check your Google OAuth configuration.",
              variant: "destructive",
            });
          }
        }
      }
    };

    script.onerror = () => {
      console.error('Failed to load Google OAuth script');
      toast({
        title: "Authentication Error",
        description: "Failed to load Google authentication. Please check your internet connection.",
        variant: "destructive",
      });
    };

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // Handle Google Sign-In
  const handleGoogleSignIn = async (response: any) => {
    try {
      console.log('Google Sign-In response received:', response);
      
      // Decode the JWT token to get user information
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const googleUserData: GoogleUser = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      };
      
      console.log('Google user data:', googleUserData);
      
      // Send JWT token to backend for verification
      setIsLoading(true);
      
      try {
        const backendResponse = await authenticateWithBackend(
          response.credential, // Send the full JWT token
          googleUserData
        );
        
        if (backendResponse.success) {
          // Store backend token in localStorage
          if (backendResponse.token) {
            localStorage.setItem('authToken', backendResponse.token);
          }
          
          // Set user profile and show OTP verification
          setProfile({
            ...googleUserData,
            ...backendResponse.user
          });
          setStatus('Profile Pending');
          
          // Store Google user data and show OTP verification
          setGoogleUserData(googleUserData);
          setShowOTPVerification(true);
          
          toast({
            title: "Google Sign-In Successful",
            description: `Welcome, ${googleUserData.name}! Please verify your phone number.`,
          });
        } else {
          toast({
            title: "Backend Verification Failed",
            description: backendResponse.error || "Failed to verify with backend",
            variant: "destructive",
          });
        }
      } catch (backendError) {
        console.error('Backend authentication failed:', backendError);
        toast({
          title: "Authentication Failed",
          description: "Failed to verify with backend. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      setIsLoading(false);
      toast({
        title: "Google Login Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  // Send token to backend
  const sendTokenToBackend = async (token: string, userData: GoogleUser) => {
    return await authenticateWithBackend(token, userData);
  };

  // Handle OAuth success (for fallback method)
  const handleOAuthSuccess = async (userData: GoogleUser, accessToken: string) => {
    setIsLoading(true);
    
    try {
      console.log('OAuth user data:', userData);
      
      // Send access token to backend
      const backendResponse = await sendTokenToBackend(accessToken, userData);
      
      if (backendResponse.success) {
        // Store backend token in localStorage
        if (backendResponse.token) {
          localStorage.setItem('authToken', backendResponse.token);
        }
        
        // Set user profile and navigate to student dashboard
        setProfile({
          ...userData,
          ...backendResponse.user
        });
        setStatus('Profile Pending');
        
        toast({
          title: "Login Successful",
          description: `Welcome, ${userData.name}! Redirecting to dashboard...`,
        });
        
        // Clear the URL hash and navigate to student dashboard
        window.location.hash = '';
        navigate('/student');
      } else {
        toast({
          title: "Login Failed",
          description: backendResponse.error || "Failed to authenticate with backend",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('OAuth success handling failed:', error);
      setIsLoading(false);
      toast({
        title: "Login Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  // Trigger Google Sign-In
  const handleApplyNow = () => {
    // Prevent multiple clicks
    if (isLoading) {
      return;
    }

    console.log('Triggering Google Sign-In...');
    
    // Set loading state immediately
    setIsLoading(true);
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('Google OAuth timeout, resetting state');
      setIsLoading(false);
      toast({
        title: "Authentication Timeout",
        description: "Google authentication is taking too long. Please try again.",
        variant: "destructive",
      });
    }, 10000); // 10 second timeout
    
    if (window.google) {
      try {
        console.log('Calling Google OAuth prompt...');
        // Use the proper Google OAuth prompt
        window.google.accounts.id.prompt();
        
        // Add a timeout to check if prompt was displayed
        setTimeout(() => {
          // If still loading, use fallback
          if (isLoading) {
            console.log('Google OAuth prompt not displayed, using fallback');
            const googleAuthUrl = getGoogleOAuthUrl();
            window.location.href = googleAuthUrl;
          }
        }, 2000);
        
        // Clear timeout if successful
        clearTimeout(timeoutId);
      } catch (error) {
        console.error('Google OAuth prompt failed:', error);
        clearTimeout(timeoutId);
        setIsLoading(false);
        
        // Handle different types of errors
        const errorMessage = error.toString();
        
        if (errorMessage.includes('FedCM')) {
          toast({
            title: "Browser Compatibility Issue",
            description: "Redirecting to Google authentication...",
          });
          
          // Use fallback Google OAuth URL
          const googleAuthUrl = getGoogleOAuthUrl();
          window.location.href = googleAuthUrl;
        } else if (errorMessage.includes('origin is not allowed') || errorMessage.includes('403')) {
          toast({
            title: "Configuration Error",
            description: "Google OAuth is not configured for this domain.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Authentication Failed",
            description: "Please try again or contact support.",
            variant: "destructive",
          });
        }
      }
    } else {
      console.log('Google OAuth not loaded, attempting to reload...');
      clearTimeout(timeoutId);
      setIsLoading(false);
      
      // Fallback: try to reload the script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google OAuth script reloaded');
        if (window.google) {
          try {
            window.google.accounts.id.initialize({
              client_id: googleProvider.clientId,
              callback: handleGoogleSignIn,
              auto_select: false,
              cancel_on_tap_outside: true,
            });
            window.google.accounts.id.prompt();
          } catch (error) {
            console.error('Google OAuth reload failed:', error);
            setIsLoading(false);
            toast({
              title: "Authentication Error",
              description: "Please try refreshing the page.",
              variant: "destructive",
            });
          }
        }
      };
      document.head.appendChild(script);
      
      toast({
        title: "Loading Authentication",
        description: "Please wait while we load Google authentication...",
      });
    }
  };

  // Manual reset function
  const handleReset = () => {
    console.log('Manual reset triggered');
    setIsLoading(false);
    setIsHovered(false);
    
    // Clear any Google OAuth state
    if (window.google && window.google.accounts) {
      try {
        // @ts-ignore - These methods exist in Google OAuth API but not in TypeScript definitions
        window.google.accounts.id.disableAutoSelect();
        // @ts-ignore
        window.google.accounts.id.cancel();
      } catch (error) {
        console.log('Google OAuth cleanup error:', error);
      }
    }
    
    // Clear any stored tokens
    localStorage.removeItem('authToken');
    
    toast({
      title: "Reset Complete",
      description: "Authentication state has been cleared. You can try again.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Scholarship Connect</h1>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Apply for
              <span className="text-blue-600 block">Scholarship</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connect with donors and secure your educational future. 
              Join thousands of students who have already benefited from our platform.
            </p>
          </motion.div>

          {/* Apply Now Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <div className="space-y-4">
              {/* <Button
                size="lg"
                disabled={isLoading}
                className={`text-2xl px-12 py-8 h-auto rounded-2xl shadow-2xl transition-all duration-300 ${
                  isHovered && !isLoading
                    ? 'bg-blue-600 scale-105 shadow-blue-500/50' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
                onMouseEnter={() => !isLoading && setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleApplyNow}
              >
                {isLoading ? (
                  <>
                    <div className="mr-4 h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span className="mr-4">Apply Now</span>
                    <ArrowRight className={`h-8 w-8 transition-transform duration-300 ${
                      isHovered ? 'translate-x-2' : ''
                    }`} />
                  </>
                )}
              </Button> */}
              
              {/* Google Sign-In Container */}
              <div id="google-signin-container" className="flex justify-center">
                {/* Google OAuth button will be rendered here */}
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Easy Application</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Simple and secure application process with Google login and OTP verification.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Direct Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Connect directly with donors and receive financial support for your education.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Secure Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your data is protected with industry-standard security measures.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Students Helped</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">₹50Cr+</div>
              <div className="text-gray-600">Scholarships Distributed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Active Donors</div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-500">
        <p>© 2024 Scholarship Connect. All rights reserved.</p>
      </footer>

      {/* OTP Verification Modal */}
      {showOTPVerification && googleUserData && (
        <OTPVerification
          googleUserData={googleUserData}
          onSuccess={async (combinedUserData) => {
            setShowOTPVerification(false);
            setIsLoading(true);
            
            try {
              // Send combined user data to backend
              const backendResponse = await authenticateWithBackend(
                combinedUserData.firebaseUid, // Use Firebase UID as token
                combinedUserData
              );
              
              if (backendResponse.success) {
                // Store backend token in localStorage
                if (backendResponse.token) {
                  localStorage.setItem('authToken', backendResponse.token);
                }
                
                // Set user profile and navigate to student dashboard
                setProfile({
                  ...combinedUserData,
                  ...backendResponse.user
                });
                setStatus('Profile Pending');
                
                toast({
                  title: "Authentication Successful",
                  description: `Welcome, ${combinedUserData.name}! Redirecting to dashboard...`,
                });
                
                // Navigate to student dashboard
                navigate('/student');
              } else {
                toast({
                  title: "Authentication Failed",
                  description: backendResponse.error || "Failed to authenticate with backend",
                  variant: "destructive",
                });
              }
            } catch (error) {
              console.error('Authentication failed:', error);
              toast({
                title: "Authentication Failed",
                description: "Please try again or contact support.",
                variant: "destructive",
              });
            } finally {
              setIsLoading(false);
            }
          }}
          onBack={() => {
            setShowOTPVerification(false);
            setGoogleUserData(null);
            setIsLoading(false);
            toast({
              title: "Authentication Cancelled",
              description: "You can try again later.",
            });
          }}
        />
      )}
    </div>
  );
} 