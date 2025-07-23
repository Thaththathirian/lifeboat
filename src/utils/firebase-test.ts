// Simple Firebase test to verify configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your_firebase_api_key_here",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your_firebase_auth_domain_here",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your_firebase_project_id_here",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your_firebase_storage_bucket_here",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "your_messaging_sender_id_here",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "your_firebase_app_id_here",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "your_measurement_id_here"
};

// Test Firebase initialization
export const testFirebase = () => {
  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    console.log('✅ Firebase initialized successfully');
    console.log('✅ Auth service available:', !!auth);
    return { success: true, app, auth };
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    return { success: false, error };
  }
};

// Test reCAPTCHA loading
export const testRecaptcha = () => {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/enterprise.js?render=6LcNOYcrAAAAACohTUXyMG1kPT06KDLrvMXh8ArS';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('✅ reCAPTCHA script loaded successfully');
      resolve();
    };
    
    script.onerror = () => {
      console.error('❌ reCAPTCHA script failed to load');
      reject(new Error('reCAPTCHA script failed to load'));
    };
    
    document.head.appendChild(script);
  });
}; 