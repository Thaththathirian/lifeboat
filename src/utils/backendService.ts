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
  user?: Record<string, unknown>;
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

// Debounce mechanism to prevent multiple simultaneous status API calls
let statusApiCallInProgress = false;
let lastStatusCallTime = 0;
const STATUS_API_DEBOUNCE_TIME = 2000; // 2 seconds debounce

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
  formData: Record<string, unknown>;
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
  fatherOccupationType: string;
  fatherOccupationDetails: string;
  motherName: string;
  motherOccupationType: string;
  motherOccupationDetails: string;
  parentsPhone: string;
  parentsPhoneLandline: string;
  familyDetails: string;
  familyAnnualIncome: string;
  numberOfSiblings: string;
  aspirations: string;
}

interface AcademicDetails {
  grade: string;
  presentSemester: string;
  academicYear: string;
  collegeName: string;
  collegeAddress: string;
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
  // Optional bank details for "other" college
  collegeBankName?: string;
  accountNumber?: string;
  confirmAccountNumber?: string;
  ifscCode?: string;
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
    
    // Map snake_case API response to camelCase form field names
    if (data.data) {
      const mappedData = {
        firstName: data.data.first_name || data.data.firstName || '',
        lastName: data.data.last_name || data.data.lastName || '',
        gender: data.data.gender || '',
        dob: data.data.dob || '',
        street: data.data.street || '',
        city: data.data.city || '',
        district: data.data.district || '',
        state: data.data.state || '',
        pinCode: data.data.pincode || data.data.pinCode || '',
        mobile: data.data.mobile || '',
        email: data.data.email || ''
      };
      return mappedData;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get personal details:', error);
    return null;
  }
};

// Save student personal details
export const savePersonalDetails = async (details: PersonalDetails): Promise<{ success: boolean; error?: string; fieldErrors?: Record<string, string> }> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const apiUrl = `${getApiBaseUrl()}/Student/personal_details`;
    console.log('Saving personal details to:', apiUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Convert to Form Data format as shown in the image
    const formData = new FormData();
    
    // Add all personal details fields
    formData.append('firstName', details.firstName);
    formData.append('lastName', details.lastName);
    formData.append('gender', details.gender);
    formData.append('dob', details.dob);
    formData.append('street', details.street);
    formData.append('city', details.city);
    formData.append('state', details.state);
    formData.append('pinCode', details.pinCode);
    formData.append('mobile', details.mobile);
    formData.append('email', details.email);
    
    // Prepare headers (don't set Content-Type for FormData - browser will set it with boundary)
    const headers: Record<string, string> = {};
    
    // Add authorization header
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: formData, // Send as FormData instead of JSON
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    const data = await response.json();
    console.log('Server response:', data);
    console.log('Response status field:', data.status);
    console.log('Response status type:', typeof data.status);
    
    // Always check the data.status field from the backend response
    // regardless of HTTP status code
    // Handle both boolean true and string "true"
    if (data.status === true || data.status === "true" || data.status === 1 || data.status === "1") {
      console.log('✅ Save successful - status is true');
      return { success: true };
    } else {
      console.log('❌ Save failed - status is not true:', data.status);
      console.log('Full error response:', data);
      
      // Extract error message from response
      let errorMessage = 'Failed to save your progress. Please try again.';
      let fieldErrors: Record<string, string> = {};
      
      if (data.message) {
        console.log('Error message type:', typeof data.message);
        console.log('Error message content:', data.message);
        
        if (typeof data.message === 'string') {
          errorMessage = data.message;
        } else if (typeof data.message === 'object') {
          // Handle validation errors object like {"ifscCode": "Invalid IFSC Code format."}
          fieldErrors = data.message;
          const errorMessages = Object.values(data.message);
          console.log('Extracted error messages:', errorMessages);
          errorMessage = errorMessages.join(', ');
        }
      }
      
      console.log('Final error message:', errorMessage);
      console.log('Field errors:', fieldErrors);
      return { success: false, error: errorMessage, fieldErrors };
    }
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
    
          // Map snake_case API response to camelCase form field names
      if (data.data) {
        const mappedData = {
          fatherName: data.data.father_name || data.data.fatherName || '',
          fatherOccupationType: data.data.father_occupation_type || data.data.fatherOccupationType || '',
          fatherOccupationDetails: data.data.father_occupation_details || data.data.fatherOccupationDetails || '',
          motherName: data.data.mother_name || data.data.motherName || '',
          motherOccupationType: data.data.mother_occupation_type || data.data.motherOccupationType || '',
          motherOccupationDetails: data.data.mother_occupation_details || data.data.motherOccupationDetails || '',
          parentsPhone: data.data.parents_phone || data.data.parentsPhone || '',
          parentsPhoneLandline: data.data.parents_phone_landline || data.data.parentsPhoneLandline || '',
          familyDetails: data.data.family_details || data.data.familyDetails || '',
          familyAnnualIncome: data.data.family_annual_income || data.data.familyAnnualIncome || '',
          numberOfSiblings: data.data.number_of_siblings || data.data.numberOfSiblings || '',
          aspirations: data.data.aspirations || data.data.aspirations || ''
        };
        return mappedData;
      }
    
    return null;
  } catch (error) {
    console.error('Failed to get family details:', error);
    return null;
  }
};

// Save student family details
export const saveFamilyDetails = async (details: FamilyDetails): Promise<{ success: boolean; error?: string; fieldErrors?: Record<string, string> }> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const apiUrl = `${getApiBaseUrl()}/Student/family_details`;
    console.log('Saving family details to:', apiUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Convert to Form Data format as shown in the image
    const formData = new FormData();
    
    // Add all family details fields
    formData.append('fatherName', details.fatherName);
    formData.append('fatherOccupationType', details.fatherOccupationType);
    formData.append('fatherOccupationDetails', details.fatherOccupationDetails);
    formData.append('motherName', details.motherName);
    formData.append('motherOccupationType', details.motherOccupationType);
    formData.append('motherOccupationDetails', details.motherOccupationDetails);
    formData.append('parentsPhone', details.parentsPhone);
    formData.append('parentsPhoneLandline', details.parentsPhoneLandline);
    formData.append('familyDetails', details.familyDetails);
    formData.append('familyAnnualIncome', details.familyAnnualIncome);
    formData.append('numberOfSiblings', details.numberOfSiblings);
    formData.append('aspirations', details.aspirations);
    
    // Prepare headers (don't set Content-Type for FormData - browser will set it with boundary)
    const headers: Record<string, string> = {};
    
    // Add authorization header
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: formData, // Send as FormData instead of JSON
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    const data = await response.json();
    console.log('Server response:', data);
    console.log('Response status field:', data.status);
    console.log('Response status type:', typeof data.status);
    
    // Always check the data.status field from the backend response
    // regardless of HTTP status code
    // Handle both boolean true and string "true"
    if (data.status === true || data.status === "true" || data.status === 1 || data.status === "1") {
      console.log('✅ Save successful - status is true');
      return { success: true };
    } else {
      console.log('❌ Save failed - status is not true:', data.status);
      console.log('Full error response:', data);
      
      // Extract error message from response
      let errorMessage = 'Failed to save your progress. Please try again.';
      let fieldErrors: Record<string, string> = {};
      
      if (data.message) {
        console.log('Error message type:', typeof data.message);
        console.log('Error message content:', data.message);
        
        if (typeof data.message === 'string') {
          errorMessage = data.message;
        } else if (typeof data.message === 'object') {
          // Handle validation errors object like {"ifscCode": "Invalid IFSC Code format."}
          fieldErrors = data.message;
          const errorMessages = Object.values(data.message);
          console.log('Extracted error messages:', errorMessages);
          errorMessage = errorMessages.join(', ');
        }
      }
      
      console.log('Final error message:', errorMessage);
      console.log('Field errors:', fieldErrors);
      return { success: false, error: errorMessage, fieldErrors };
    }
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
    
    // Map snake_case API response to camelCase form field names
    if (data.data) {
      const mappedData = {
        grade: data.data.grade || '',
        presentSemester: data.data.present_semester || data.data.presentSemester || '',
        academicYear: data.data.academic_year || data.data.academicYear || '',
        collegeName: data.data.college_name || data.data.collegeName || '',
        collegeAddress: data.data.college_address || data.data.collegeAddress || '',
        collegeWebsite: data.data.college_website || data.data.collegeWebsite || '',
        referencePersonName: data.data.reference_person_name || data.data.referencePersonName || '',
        referencePersonQualification: data.data.reference_person_qualification || data.data.referencePersonQualification || '',
        referencePersonPosition: data.data.reference_person_position || data.data.referencePersonPosition || '',
        referencePersonPhone: data.data.reference_person_phone || data.data.referencePersonPhone || '',
        referencePersonEmail: data.data.reference_person_email || data.data.referencePersonEmail || '',
        totalCollegeFees: data.data.total_college_fees || data.data.totalCollegeFees || '',
        scholarshipAmountRequired: data.data.scholarship_amount_required || data.data.scholarshipAmountRequired || '',
        marks10th: data.data.marks_10th || data.data.marks10th || '',
        marks12th: data.data.marks_12th || data.data.marks12th || '',
        marksSem1: data.data.marks_sem1 || data.data.marksSem1 || '',
        marksSem2: data.data.marks_sem2 || data.data.marksSem2 || '',
        marksSem3: data.data.marks_sem3 || data.data.marksSem3 || '',
        marksSem4: data.data.marks_sem4 || data.data.marksSem4 || '',
        marksSem5: data.data.marks_sem5 || data.data.marksSem5 || '',
        marksSem6: data.data.marks_sem6 || data.data.marksSem6 || '',
        marksSem7: data.data.marks_sem7 || data.data.marksSem7 || '',
        marksSem8: data.data.marks_sem8 || data.data.marksSem8 || '',
        declaration: data.data.declaration || false,
        arrears: data.data.arrears || '',
        awareness: data.data.awareness || false,
        // Optional bank details for "other" college
        collegeBankName: data.data.college_bank_name || data.data.collegeBankName || '',
        accountNumber: data.data.account_number || data.data.accountNumber || '',
        confirmAccountNumber: data.data.confirm_account_number || data.data.confirmAccountNumber || '',
        ifscCode: data.data.ifsc_code || data.data.ifscCode || ''
      };
      return mappedData;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get academic details:', error);
    return null;
  }
};

// Save student academic details
export const saveAcademicDetails = async (details: AcademicDetails): Promise<{ success: boolean; error?: string; fieldErrors?: Record<string, string> }> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const apiUrl = `${getApiBaseUrl()}/Student/academic_details`;
    console.log('Saving academic details to:', apiUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Convert to Form Data format as shown in the image
    const formData = new FormData();
    
    // Add all academic details fields
    formData.append('grade', details.grade);
    formData.append('presentSemester', details.presentSemester);
    formData.append('academicYear', details.academicYear);
    formData.append('collegeName', details.collegeName);
    formData.append('collegeAddress', details.collegeAddress);
    formData.append('collegeWebsite', details.collegeWebsite);
    formData.append('referencePersonName', details.referencePersonName);
    formData.append('referencePersonQualification', details.referencePersonQualification);
    formData.append('referencePersonPosition', details.referencePersonPosition);
    formData.append('totalCollegeFees', details.totalCollegeFees);
    formData.append('scholarshipAmountRequired', details.scholarshipAmountRequired);
    formData.append('marks10th', details.marks10th);
    formData.append('marks12th', details.marks12th);
    formData.append('marksSem1', details.marksSem1);
    formData.append('marksSem2', details.marksSem2);
    formData.append('marksSem3', details.marksSem3);
    formData.append('marksSem4', details.marksSem4);
    formData.append('marksSem5', details.marksSem5);
    formData.append('marksSem6', details.marksSem6);
    formData.append('marksSem7', details.marksSem7);
    formData.append('marksSem8', details.marksSem8);
    formData.append('declaration', details.declaration.toString());
    formData.append('arrears', details.arrears);
    formData.append('awareness', details.awareness.toString());
    
    // Add bank details if "other" college is selected
    if (details.collegeBankName) {
      formData.append('collegeBankName', details.collegeBankName);
    }
    if (details.accountNumber) {
      formData.append('accountNumber', details.accountNumber);
    }
    if (details.confirmAccountNumber) {
      formData.append('confirmAccountNumber', details.confirmAccountNumber);
    }
    if (details.ifscCode) {
      formData.append('ifscCode', details.ifscCode);
    }
    
    // Prepare headers (don't set Content-Type for FormData - browser will set it with boundary)
    const headers: Record<string, string> = {};
    
    // Add authorization header
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: formData, // Send as FormData instead of JSON
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    const data = await response.json();
    console.log('Server response:', data);
    console.log('Response status field:', data.status);
    console.log('Response status type:', typeof data.status);
    
    // Always check the data.status field from the backend response
    // regardless of HTTP status code
    // Handle both boolean true and string "true"
    if (data.status === true || data.status === "true" || data.status === 1 || data.status === "1") {
      console.log('✅ Save successful - status is true');
      return { success: true };
    } else {
      console.log('❌ Save failed - status is not true:', data.status);
      console.log('Full error response:', data);
      
      // Extract error message from response
      let errorMessage = 'Failed to save your progress. Please try again.';
      let fieldErrors: Record<string, string> = {};
      
      if (data.message) {
        console.log('Error message type:', typeof data.message);
        console.log('Error message content:', data.message);
        
        if (typeof data.message === 'string') {
          errorMessage = data.message;
        } else if (typeof data.message === 'object') {
          // Handle validation errors object like {"ifscCode": "Invalid IFSC Code format."}
          fieldErrors = data.message;
          const errorMessages = Object.values(data.message);
          console.log('Extracted error messages:', errorMessages);
          errorMessage = errorMessages.join(', ');
        }
      }
      
      console.log('Final error message:', errorMessage);
      console.log('Field errors:', fieldErrors);
      return { success: false, error: errorMessage, fieldErrors };
    }
  } catch (error) {
    console.error('Failed to save academic details:', error);
    throw error;
  }
};

// Verify mobile with Firebase token
export const verifyMobileWithToken = async (firebaseToken: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem('authToken');
    
    const apiUrl = `${getApiBaseUrl()}/Student/verify_mobile`;
    console.log('Verifying mobile with Firebase token at:', apiUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Get mobile number from profile or localStorage
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    let mobileNumber = profile.mobile || '';
    
    // If mobile number is empty, try to get it from other sources
    if (!mobileNumber) {
      // Try to get from current profile state
      const currentProfile = JSON.parse(localStorage.getItem('currentUser') || '{}');
      mobileNumber = currentProfile.mobile || '';
    }
    
    // If still empty, use a fallback for testing
    if (!mobileNumber) {
      mobileNumber = '9999999999'; // Fallback for testing
      console.warn('Mobile number not found, using fallback:', mobileNumber);
    }
    
    // Send data in Form Data format as shown in the image
    const formData = new FormData();
    formData.append('firebaseToken', firebaseToken);
    
    console.log('Sending mobile verification data as Form Data');
    console.log('Firebase token present:', !!firebaseToken);
    console.log('Authentication token present:', !!token);
    
    // Prepare headers (don't set Content-Type for FormData - browser will set it with boundary)
    const headers: Record<string, string> = {};
    
    // Add authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: formData, // Send as FormData instead of JSON
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Server response:', data);
    console.log('Response status field:', data.status);
    console.log('Response status type:', typeof data.status);
    
    // Check if status is explicitly true
    if (data.status === true) {
      console.log('✅ Mobile verification successful - status is true');
      return true;
    } else {
      console.log('❌ Mobile verification failed - status is not true:', data.status);
      return false;
    }
  } catch (error) {
    console.error('Failed to verify mobile with Firebase token:', error);
    throw error;
  }
};

// Get current student status
export const getCurrentStatus = async (): Promise<{ status: number } | null> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Check if a status API call is already in progress
    if (statusApiCallInProgress) {
      console.log('⚠️ Status API call already in progress, skipping...');
      return null;
    }

    // Check if we're within the debounce time
    const now = Date.now();
    if (now - lastStatusCallTime < STATUS_API_DEBOUNCE_TIME) {
      console.log('⚠️ Status API call debounced, last call was', now - lastStatusCallTime, 'ms ago');
      return null;
    }

    // Set the flag to prevent multiple simultaneous calls
    statusApiCallInProgress = true;
    lastStatusCallTime = now;

    const apiUrl = `${getApiBaseUrl()}/Student/get_current_status`;
    console.log('🔄 Fetching current status from:', apiUrl);
    
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
        return null; // No status found
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Status API response:', data);
    
    // Handle the new response format
    if (data.status === true && data.data && data.data.status) {
      const statusNumber = parseInt(data.data.status, 10);
      console.log('📊 Parsed status number:', statusNumber);
      return { status: statusNumber };
    }
    
    return null;
  } catch (error) {
    console.error('❌ Failed to get current status:', error);
    return null;
  } finally {
    // Always reset the flag, even if there's an error
    statusApiCallInProgress = false;
  }
};

// Force sync current status - can be called from any component
export const forceSyncCurrentStatus = async (): Promise<{ status: number } | null> => {
  console.log('🔄 Force syncing current status...');
  const result = await getCurrentStatus();
  if (result) {
    console.log('✅ Force sync successful:', result);
  } else {
    console.log('⚠️ Force sync skipped (debounced or already in progress)');
  }
  return result;
};

// Get submitted profile data
export const getSubmittedProfileData = async (): Promise<Record<string, unknown> | null> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const apiUrl = `${getApiBaseUrl()}/Student/get_submitted_profile`;
    console.log('Fetching submitted profile from:', apiUrl);
    
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
        return null; // No submitted profile found
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Failed to get submitted profile data:', error);
    return null;
  }
};