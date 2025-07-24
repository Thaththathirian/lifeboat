// Backend service for handling Google OAuth authentication
// This file shows how tokens are sent to the backend

interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface BackendAuthResponse {
  success: boolean;
  user?: any;
  error?: string;
  token?: string;
}

interface BackendAuthRequest {
  userData: GoogleUser; // Token is sent in Authorization header, not in body
}

// Get the correct API base URL for development and production
const getApiBaseUrl = () => {
  // Always use the direct backend URL, not through Vite proxy
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost/lifeboat';
  }
  return 'http://localhost/lifeboat';
};

// Send Google OAuth token to backend for verification and user creation
export const authenticateWithBackend = async (
  googleToken: string, 
  userData: GoogleUser
): Promise<BackendAuthResponse> => {
  try {
    console.log('Sending Google JWT token to backend for verification...');
    console.log('User data:', userData);
    console.log('Token type:', typeof googleToken);
    console.log('Token length:', googleToken.length);
    
    // Get reCAPTCHA token if available
    const recaptchaToken = localStorage.getItem('recaptchaToken');
    
    // Use the correct API endpoint
    const apiUrl = `${getApiBaseUrl()}/OAuth/Student`;
    console.log('API URL:', apiUrl);
    console.log('Full request details:', {
      url: apiUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${googleToken.substring(0, 20)}...`, // Log partial token for security
      },
      body: {
        userData: userData,
        recaptchaToken: recaptchaToken ? 'PRESENT' : 'MISSING',
        tokenType: 'google_jwt',
      }
    });
    
    // Send JWT token in Authorization header for backend verification
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${googleToken}`, // Google JWT token for verification
      },
      body: JSON.stringify({
        userData: userData, // User data for profile creation
        recaptchaToken: recaptchaToken, // reCAPTCHA token for security
        tokenType: 'google_jwt', // Indicate this is a Google JWT token
      }),
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend error response:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Backend authentication successful:', data);
    console.log('OAuth response data structure:', {
      status: data.status,
      message: data.message,
      hasData: !!data.data,
      dataLength: data.data ? data.data.length : 0
    });
    
    // Clear reCAPTCHA token after successful authentication
    localStorage.removeItem('recaptchaToken');
    
    return {
      success: true,
      user: data.user,
      token: data.data // OAuth response token is in data.data
    };
  } catch (error) {
    console.error('Backend authentication failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Backend connection failed'
    };
  }
};

// Verify user session with backend
export const verifySession = async (): Promise<BackendAuthResponse> => {
  try {
    const response = await fetch('/api/auth/verify', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Session verification failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      user: data.user
    };
  } catch (error) {
    console.error('Session verification failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Session verification failed'
    };
  }
};

// Logout user from backend
export const logoutFromBackend = async (): Promise<BackendAuthResponse> => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Logout failed: ${response.status}`);
    }

    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');

    return {
      success: true
    };
  } catch (error) {
    console.error('Backend logout failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Logout failed'
    };
  }
};

// Example backend API endpoints that should be implemented:

/*
POST /api/auth/google
Headers: 
  Authorization: Bearer google_jwt_token_here
  Content-Type: application/json

Body:
{
  "userData": {
    "id": "google_user_id",
    "name": "User Name",
    "email": "user@example.com",
    "picture": "profile_picture_url"
  }
}

Response:
{
  "success": true,
  "user": {
    "id": "backend_user_id",
    "googleId": "google_user_id",
    "name": "User Name",
    "email": "user@example.com",
    "picture": "profile_picture_url",
    "status": "Profile Pending",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "backend_jwt_token"
}

GET /api/auth/verify
Headers: Authorization: Bearer backend_jwt_token

Response:
{
  "success": true,
  "user": {
    "id": "backend_user_id",
    "googleId": "google_user_id",
    "name": "User Name",
    "email": "user@example.com",
    "picture": "profile_picture_url",
    "status": "Profile Pending"
  }
}

POST /api/auth/logout
Headers: Authorization: Bearer backend_jwt_token

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
*/ 

// Profile draft management functions
interface ProfileDraft {
  formData: any;
  currentStep: number;
  lastSaved: string;
}

// Save profile draft to backend
export const saveProfileDraft = async (draftData: ProfileDraft | null): Promise<boolean> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const apiUrl = `${getApiBaseUrl()}/profile/draft`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        draftData: draftData, // null to clear draft, or draft object to save
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Failed to save profile draft:', error);
    throw error;
  }
};

// Get profile draft from backend
export const getProfileDraft = async (): Promise<ProfileDraft | null> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return null;
    }

    const apiUrl = `${getApiBaseUrl()}/profile/draft`;
    console.log('Fetching draft from:', apiUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No draft found
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.draftData || null;
  } catch (error) {
    console.error('Failed to get profile draft:', error);
    // Return null instead of throwing to allow form to work offline
    return null;
  }
};

// Student Profile API functions
interface PersonalDetails {
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  mobile: string;
  email: string;
}

interface FamilyDetails {
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  parentsPhone: string;
  familyDetails: string;
  familyAnnualIncome: string;
}

interface AcademicDetails {
  grade: string;
  presentSemester: string;
  academicYear: string;
  collegeName: string;
  collegePhone: string;
  collegeEmail: string;
  collegeWebsite: string;
  referencePersonName: string;
  referencePersonQualification: string;
  referencePersonPosition: string;
  totalCollegeFees: string;
  scholarshipAmountRequired: string;
  marks10th: string;
  marks12th: string;
  marksSem1: string;
  marksSem2: string;
  marksSem3: string;
  marksSem4: string;
  marksSem5: string;
  marksSem6: string;
  marksSem7: string;
  marksSem8: string;
  declaration: boolean;
  arrears: string;
  awareness: boolean;
}

// Get student personal details
export const getPersonalDetails = async (): Promise<PersonalDetails | null> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const apiUrl = `${getApiBaseUrl()}/Student/get_personal_details`;
    console.log('Fetching personal details from:', apiUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No personal details found
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Failed to get personal details:', error);
    return null;
  }
};

// Save student personal details
export const savePersonalDetails = async (details: PersonalDetails): Promise<boolean> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const apiUrl = `${getApiBaseUrl()}/Student/personal_details`;
    console.log('Saving personal details to:', apiUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Convert to FormData format
    const formData = new FormData();
    Object.keys(details).forEach(key => {
      formData.append(key, details[key as keyof PersonalDetails]);
    });
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type - let browser set it with boundary for FormData
      },
      body: formData,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Failed to save personal details:', error);
    throw error;
  }
};

// Get student family details
export const getFamilyDetails = async (): Promise<FamilyDetails | null> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const apiUrl = `${getApiBaseUrl()}/Student/get_family_details`;
    console.log('Fetching family details from:', apiUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No family details found
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Failed to get family details:', error);
    return null;
  }
};

// Save student family details
export const saveFamilyDetails = async (details: FamilyDetails): Promise<boolean> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const apiUrl = `${getApiBaseUrl()}/Student/family_details`;
    console.log('Saving family details to:', apiUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Convert to FormData format
    const formData = new FormData();
    Object.keys(details).forEach(key => {
      formData.append(key, details[key as keyof FamilyDetails]);
    });
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type - let browser set it with boundary for FormData
      },
      body: formData,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Failed to save family details:', error);
    throw error;
  }
};

// Get student academic details
export const getAcademicDetails = async (): Promise<AcademicDetails | null> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const apiUrl = `${getApiBaseUrl()}/Student/get_academic_details`;
    console.log('Fetching academic details from:', apiUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No academic details found
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Failed to get academic details:', error);
    return null;
  }
};

// Save student academic details
export const saveAcademicDetails = async (details: AcademicDetails): Promise<boolean> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const apiUrl = `${getApiBaseUrl()}/Student/academic_details`;
    console.log('Saving academic details to:', apiUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Convert to FormData format
    const formData = new FormData();
    Object.keys(details).forEach(key => {
      const value = details[key as keyof AcademicDetails];
      // Convert boolean values to strings for FormData
      formData.append(key, typeof value === 'boolean' ? value.toString() : value);
    });
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type - let browser set it with boundary for FormData
      },
      body: formData,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Failed to save academic details:', error);
    throw error;
  }
};

// Verify mobile with Firebase token
export const verifyMobileWithToken = async (firebaseToken: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const apiUrl = `${getApiBaseUrl()}/Student/verify_mobile`;
    console.log('Verifying mobile with Firebase token at:', apiUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Convert to FormData format as shown in the image
    const formData = new FormData();
    formData.append('firebaseToken', firebaseToken);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type - let browser set it with boundary for FormData
      },
      body: formData,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Failed to verify mobile with Firebase token:', error);
    throw error;
  }
};