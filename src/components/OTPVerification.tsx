import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Lock, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { sendOTP, verifyOTP, clearRecaptcha } from "@/utils/firebase";

interface OTPVerificationProps {
  onSuccess: (userData: any) => void;
  onBack: () => void;
  googleUserData: any;
}

export default function OTPVerification({ onSuccess, onBack, googleUserData }: OTPVerificationProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleSendOTP = async () => {
    if (phoneNumber.replace(/\D/g, "").length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await sendOTP(`+91${phoneNumber.replace(/\D/g, "")}`, "recaptcha-container");
      
      if (result.success) {
        setConfirmationResult(result.confirmationResult);
        setStep("otp");
        setCountdown(30); // 30 second cooldown
        toast({
          title: "OTP Sent",
          description: "A 6-digit OTP has been sent to your phone number.",
        });
        
        // Store reCAPTCHA token for backend verification
        if (result.recaptchaToken) {
          localStorage.setItem('recaptchaToken', result.recaptchaToken);
        }
      } else {
        toast({
          title: "Failed to Send OTP",
          description: result.error || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await verifyOTP(confirmationResult, otp);
      
      if (result.success) {
        // Combine Google user data with phone verification
        const combinedUserData = {
          ...googleUserData,
          phoneNumber: phoneNumber.replace(/\D/g, ""),
          firebaseUid: result.user.uid,
          verified: true,
        };
        
        toast({
          title: "Verification Successful",
          description: "Your phone number has been verified successfully!",
        });
        
        onSuccess(combinedUserData);
      } else {
        toast({
          title: "Invalid OTP",
          description: result.error || "Please check your OTP and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    
    try {
      const result = await sendOTP(`+91${phoneNumber.replace(/\D/g, "")}`, "recaptcha-container");
      
      if (result.success) {
        setConfirmationResult(result.confirmationResult);
        setCountdown(30);
        toast({
          title: "OTP Resent",
          description: "A new OTP has been sent to your phone number.",
        });
      } else {
        toast({
          title: "Failed to Resend OTP",
          description: result.error || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    clearRecaptcha();
    onBack();
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
              {step === "phone" ? (
                <Phone className="h-12 w-12 text-blue-600" />
              ) : (
                <Lock className="h-12 w-12 text-green-600" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {step === "phone" ? "Enter Phone Number" : "Verify OTP"}
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              {step === "phone" 
                ? "We'll send a verification code to your phone number"
                : "Enter the 6-digit code sent to your phone"
              }
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step === "phone" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      +91
                    </span>
                    <Input
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      placeholder="Enter your phone number"
                      className="pl-12"
                      maxLength={12}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Format: XXX-XXX-XXXX
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSendOTP}
                    disabled={isLoading || phoneNumber.replace(/\D/g, "").length !== 10}
                    className="flex-1"
                  >
                    {isLoading ? "Sending..." : "Send OTP"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OTP Code
                  </label>
                  <Input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className="text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep("phone")}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={isLoading || otp.length !== 6}
                    className="flex-1"
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>
                </div>
                
                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={handleResendOTP}
                    disabled={countdown > 0}
                    className="text-sm"
                  >
                    {countdown > 0 
                      ? `Resend in ${countdown}s` 
                      : "Resend OTP"
                    }
                  </Button>
                </div>
              </div>
            )}
            
            {/* reCAPTCHA container */}
            <div id="recaptcha-container"></div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 