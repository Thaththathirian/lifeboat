// OTP Service for handling OTP operations
import { getFirebaseIdToken } from './firebase';

export interface OTPResponse {
  success: boolean;
  message: string;
  otp?: string; // Only for testing
  expiresAt?: Date;
}

export interface OTPVerificationResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: Record<string, unknown>;
}

class OTPService {
  private static instance: OTPService;
  private otpStore: Map<string, { otp: string; expiresAt: Date }> = new Map();

  private constructor() {}

  static getInstance(): OTPService {
    if (!OTPService.instance) {
      OTPService.instance = new OTPService();
    }
    return OTPService.instance;
  }

  // Generate a random 6-digit OTP
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP to mobile number
  async sendOTP(mobileNumber: string): Promise<OTPResponse> {
    try {
      // Validate mobile number
      if (!this.isValidMobileNumber(mobileNumber)) {
        return {
          success: false,
          message: "Invalid mobile number format"
        };
      }

      // Generate OTP (but do not return it for testing)
      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Store OTP (in production, this would be stored in database)
      this.otpStore.set(mobileNumber, { otp, expiresAt });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, integrate with SMS service like Twilio, AWS SNS, etc.
      console.log(`OTP for ${mobileNumber}: ${otp}`);

      return {
        success: true,
        message: "OTP sent successfully",
        // Do not return the OTP for testing
        expiresAt
      };
    } catch (error) {
      console.error("Error sending OTP:", error);
      return {
        success: false,
        message: "Failed to send OTP. Please try again."
      };
    }
  }

  // Verify OTP
  async verifyOTP(mobileNumber: string, otp: string): Promise<OTPVerificationResponse> {
    try {
      // Get Firebase ID token for authentication
      const idToken = await getFirebaseIdToken();
      
      // Prepare headers with Firebase bearer token
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      // Call the backend API for OTP verification
      const response = await fetch('http://localhost/lifeboat/Student/verify_mobile', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          mobileNumber: mobileNumber,
          otp: otp
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: data.success || false,
        message: data.message || "OTP verification completed",
        token: data.token,
        user: data.user
      };
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return {
        success: false,
        message: "Failed to verify OTP. Please try again."
      };
    }
  }

  // Resend OTP
  async resendOTP(mobileNumber: string): Promise<OTPResponse> {
    // Clear existing OTP first
    this.otpStore.delete(mobileNumber);
    
    // Send new OTP
    return this.sendOTP(mobileNumber);
  }

  // Validate mobile number (Indian format)
  private isValidMobileNumber(mobile: string): boolean {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  }

  // Validate OTP format
  private isValidOTP(otp: string): boolean {
    const otpRegex = /^\d{6}$/;
    return otpRegex.test(otp);
  }

  // Get remaining attempts (for rate limiting)
  getRemainingAttempts(mobileNumber: string): number {
    // In production, this would check against a database
    return 3; // Mock value
  }

  // Check if mobile number is blocked
  isMobileBlocked(mobileNumber: string): boolean {
    // In production, this would check against a database
    return false; // Mock value
  }

  // Clear all stored OTPs (for testing)
  clearAllOTPs(): void {
    this.otpStore.clear();
  }
}

export default OTPService.getInstance(); 