// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your_firebase_api_key_here",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your_firebase_auth_domain_here",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your_firebase_project_id_here",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your_firebase_storage_bucket_here",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "your_messaging_sender_id_here",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "your_firebase_app_id_here",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "your_measurement_id_here"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Analytics (only in production)
let analytics;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}

// Initialize reCAPTCHA verifier
let recaptchaVerifier: RecaptchaVerifier | null = null;

export const initializeRecaptcha = (containerId: string) => {
  try {
    // Clear existing verifier if it exists
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch (e) {
        console.log('Clearing existing reCAPTCHA verifier');
      }
      recaptchaVerifier = null;
    }

    // Check if container exists
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`reCAPTCHA container with id '${containerId}' not found`);
      throw new Error('reCAPTCHA container not found');
    }

    // Create new verifier
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      }
    });

    console.log('reCAPTCHA verifier initialized successfully');
    return recaptchaVerifier;
  } catch (error) {
    console.error('Error initializing reCAPTCHA:', error);
    throw error;
  }
};

// Send OTP to phone number
export const sendOTP = async (phoneNumber: string, containerId: string) => {
  try {
    console.log('Sending OTP to:', phoneNumber);
    
    // Ensure reCAPTCHA is properly initialized
    const verifier = initializeRecaptcha(containerId);
    
    // Render reCAPTCHA if not already rendered
    try {
      await verifier.render();
      console.log('reCAPTCHA rendered successfully');
    } catch (renderError) {
      console.log('reCAPTCHA already rendered or render failed:', renderError);
    }
    
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
    
    console.log('OTP sent successfully');
    
    return {
      success: true,
      confirmationResult,
      message: 'OTP sent successfully'
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to send OTP'
    };
  }
};

// Verify OTP
export const verifyOTP = async (confirmationResult: any, otp: string) => {
  try {
    console.log('Verifying OTP...');
    
    const result = await confirmationResult.confirm(otp);
    
    if (result.user) {
      console.log('OTP verified successfully');
      
      // Get user ID token
      const idToken = await result.user.getIdToken();
      
      return {
        success: true,
        user: result.user,
        idToken,
        message: 'OTP verified successfully'
      };
    } else {
      throw new Error('OTP verification failed');
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to verify OTP'
    };
  }
};

// Clear reCAPTCHA
export const clearRecaptcha = () => {
  try {
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
      console.log('reCAPTCHA cleared successfully');
    }
  } catch (error) {
    console.error('Error clearing reCAPTCHA:', error);
  }
};

// Get Firebase ID token
export const getFirebaseIdToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  } catch (error) {
    console.error('Error getting Firebase ID token:', error);
    return null;
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Sign out
export const signOut = async () => {
  try {
    await auth.signOut();
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error);
  }
}; 