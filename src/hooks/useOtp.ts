import { useState, useRef, useEffect, useCallback } from 'react';
import otpService from '@/utils/otpService';
import { toast } from '@/hooks/use-toast';

interface UseOTPProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
}

interface UseOTPReturn {
  // State
  step: 'mobile' | 'otp';
  mobile: string;
  otpTimer: number;
  isLoading: boolean;
  isSendingOtp: boolean;
  attempts: number;
  currentOtp: string;
  
  // Actions
  sendOTP: (mobileNumber: string) => Promise<boolean>;
  verifyOTP: (otp: string) => Promise<boolean>;
  resendOTP: () => Promise<boolean>;
  goBack: () => void;
  reset: () => void;
}

export function useOTP({ onSuccess, onError }: UseOTPProps = {}): UseOTPReturn {
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [currentOtp, setCurrentOtp] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startOtpTimer = useCallback(() => {
    setOtpTimer(30);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const sendOTP = useCallback(async (mobileNumber: string): Promise<boolean> => {
    setIsSendingOtp(true);
    try {
      const response = await otpService.sendOTP(mobileNumber);
      
      if (response.success) {
        setMobile(mobileNumber);
        setStep('otp');
        startOtpTimer();
        setCurrentOtp(response.otp || '');
        toast({
          title: "OTP Sent Successfully",
          description: `OTP has been sent to +91-${mobileNumber}`,
        });
        return true;
      } else {
        toast({
          title: "Failed to Send OTP",
          description: response.message,
          variant: "destructive",
        });
        onError?.(response.message);
        return false;
      }
    } catch (error) {
      const errorMessage = "Failed to send OTP. Please try again.";
      toast({
        title: "Failed to Send OTP",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(errorMessage);
      return false;
    } finally {
      setIsSendingOtp(false);
    }
  }, [startOtpTimer, onError]);

  const verifyOTP = useCallback(async (otp: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await otpService.verifyOTP(mobile, otp);
      
      if (response.success && response.user) {
        onSuccess?.(response.user);
        toast({
          title: "Login Successful",
          description: "Welcome back! Redirecting to your home...",
        });
        return true;
      } else {
        setAttempts(prev => prev + 1);
        
        if (attempts >= 2) {
          toast({
            title: "Too Many Failed Attempts",
            description: "Please try again after 5 minutes",
            variant: "destructive",
          });
        }
        
        onError?.(response.message);
        return false;
      }
    } catch (error) {
      const errorMessage = "Failed to verify OTP. Please try again.";
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [mobile, attempts, onSuccess, onError]);

  const resendOTP = useCallback(async (): Promise<boolean> => {
    setIsSendingOtp(true);
    try {
      const response = await otpService.resendOTP(mobile);
      
      if (response.success) {
        startOtpTimer();
        setCurrentOtp(response.otp || '');
        toast({
          title: "OTP Resent",
          description: `New OTP has been sent to +91-${mobile}`,
        });
        return true;
      } else {
        toast({
          title: "Failed to Resend OTP",
          description: response.message,
          variant: "destructive",
        });
        onError?.(response.message);
        return false;
      }
    } catch (error) {
      const errorMessage = "Failed to resend OTP. Please try again.";
      toast({
        title: "Failed to Resend OTP",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(errorMessage);
      return false;
    } finally {
      setIsSendingOtp(false);
    }
  }, [mobile, startOtpTimer, onError]);

  const goBack = useCallback(() => {
    setStep('mobile');
    setOtpTimer(0);
    setAttempts(0);
    setCurrentOtp('');
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const reset = useCallback(() => {
    setStep('mobile');
    setMobile('');
    setOtpTimer(0);
    setIsLoading(false);
    setIsSendingOtp(false);
    setAttempts(0);
    setCurrentOtp('');
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return {
    step,
    mobile,
    otpTimer,
    isLoading,
    isSendingOtp,
    attempts,
    currentOtp,
    sendOTP,
    verifyOTP,
    resendOTP,
    goBack,
    reset,
  };
} 