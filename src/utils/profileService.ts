// src/utils/profileService.ts
// This file contains the service for managing student profile details
// It makes real API calls to the backend server for data persistence

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
  referencePersonPhone: string;
  referencePersonEmail: string;
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

// Cache for API responses to avoid repeated calls
const cache = {
  personalDetails: null as PersonalDetails | null,
  familyDetails: null as FamilyDetails | null,
  academicDetails: null as AcademicDetails | null,
  lastFetch: {
    personalDetails: 0,
    familyDetails: 0,
    academicDetails: 0
  }
};

// Get API base URL
const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost/lifeboat';
};

// Helper function to get student ID (in production, this would come from auth)
const getStudentId = () => {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    try {
      const user = JSON.parse(currentUser);
      return user.id || 'default-student-123';
    } catch {
      return 'default-student-123';
    }
  }
  return 'default-student-123';
};

// Helper function to get OAuth token
const getOAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to make API calls
const makeApiCall = async (endpoint: string, method: 'GET' | 'POST', data?: any) => {
  const url = `${getApiBaseUrl()}${endpoint}`;
  const oauthToken = getOAuthToken();
  
  const headers: Record<string, string> = {};

  // Add OAuth token to headers if available
  if (oauthToken) {
    headers['Authorization'] = `Bearer ${oauthToken}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (data && method === 'POST') {
    // Convert to Form Data format as shown in the image
    const formData = new FormData();
    
    // Add all data fields to FormData
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    // Don't set Content-Type for FormData - browser will set it with boundary
    config.body = formData;
  }

  try {
    const response = await fetch(url, config);
    
    // Always try to parse the response
    const result = await response.json();
    
    // Return the parsed result regardless of HTTP status
    // The calling function will check the result.status field
    return result;
  } catch (error) {
    console.error('API call error:', error);
    // Return null instead of throwing to prevent crashes
    return null;
  }
};

// GET Personal Details
export const getPersonalDetails = async (): Promise<PersonalDetails | null> => {
  // Check cache first (5 minutes cache)
  if (cache.personalDetails && Date.now() - cache.lastFetch.personalDetails < 300000) {
    console.log('Returning cached personal details');
    return cache.personalDetails;
  }

  console.log('Fetching personal details from API');
  const result = await makeApiCall('/Student/get_personal_details', 'GET');
  
  if (result && result.status === true && result.data) {
    cache.personalDetails = result.data;
    cache.lastFetch.personalDetails = Date.now();
    console.log('Personal details cached successfully');
    return result.data;
  }
  
  return null;
};

// POST Personal Details
export const savePersonalDetails = async (details: PersonalDetails): Promise<{ success: boolean; error?: string; fieldErrors?: Record<string, string> }> => {
  console.log('Saving personal details to API');
  const result = await makeApiCall('/Student/personal_details', 'POST', details);
  
  console.log('API result:', result);
  console.log('Result status:', result?.status);
  console.log('Result status type:', typeof result?.status);
  
  // Handle both boolean true and string "true"
  if (result && (result.status === true || result.status === "true" || result.status === 1 || result.status === "1" || result.status === "success")) {
    // Update cache
    cache.personalDetails = details;
    cache.lastFetch.personalDetails = Date.now();
    console.log('✅ Personal details saved and cached');
    return { success: true };
  }
  
  console.log('❌ Personal details save failed - status is not true');
  console.log('Full error response:', result);
  
  // Extract error message from response
  let errorMessage = 'Failed to save your progress. Please try again.';
  let fieldErrors: Record<string, string> = {};
  
  if (result?.message) {
    console.log('Error message type:', typeof result.message);
    console.log('Error message content:', result.message);
    
    if (typeof result.message === 'string') {
      errorMessage = result.message;
    } else if (typeof result.message === 'object') {
      // Handle validation errors object like {"street": "The Street Address field must be at least 5 characters in length."}
      fieldErrors = result.message;
      const errorMessages = Object.values(result.message);
      console.log('Extracted error messages:', errorMessages);
      errorMessage = errorMessages.join(', ');
    }
  }
  
  console.log('Final error message:', errorMessage);
  return { success: false, error: errorMessage, fieldErrors };
};

// GET Family Details
export const getFamilyDetails = async (): Promise<FamilyDetails | null> => {
  // Check cache first (5 minutes cache)
  if (cache.familyDetails && Date.now() - cache.lastFetch.familyDetails < 300000) {
    console.log('Returning cached family details');
    return cache.familyDetails;
  }

  console.log('Fetching family details from API');
  const result = await makeApiCall('/Student/get_family_details', 'GET');
  
  if (result && result.status === true && result.data) {
    cache.familyDetails = result.data;
    cache.lastFetch.familyDetails = Date.now();
    console.log('Family details cached successfully');
    return result.data;
  }
  
  return null;
};

// POST Family Details
export const saveFamilyDetails = async (details: FamilyDetails): Promise<{ success: boolean; error?: string; fieldErrors?: Record<string, string> }> => {
  console.log('Saving family details to API');
  const result = await makeApiCall('/Student/family_details', 'POST', details);
  
  console.log('API result:', result);
  console.log('Result status:', result?.status);
  console.log('Result status type:', typeof result?.status);
  
  // Handle both boolean true and string "true"
  if (result && (result.status === true || result.status === "true" || result.status === 1 || result.status === "1" || result.status === "success")) {
    // Update cache
    cache.familyDetails = details;
    cache.lastFetch.familyDetails = Date.now();
    console.log('✅ Family details saved and cached');
    return { success: true };
  }
  
  console.log('❌ Family details save failed - status is not true');
  console.log('Full error response:', result);
  
  // Extract error message from response
  let errorMessage = 'Failed to save your progress. Please try again.';
  let fieldErrors: Record<string, string> = {};
  
  if (result?.message) {
    console.log('Error message type:', typeof result.message);
    console.log('Error message content:', result.message);
    
    if (typeof result.message === 'string') {
      errorMessage = result.message;
    } else if (typeof result.message === 'object') {
      // Handle validation errors object like {"street": "The Street Address field must be at least 5 characters in length."}
      fieldErrors = result.message;
      const errorMessages = Object.values(result.message);
      console.log('Extracted error messages:', errorMessages);
      errorMessage = errorMessages.join(', ');
    }
  }
  
  console.log('Final error message:', errorMessage);
  return { success: false, error: errorMessage, fieldErrors };
};

// GET Academic Details
export const getAcademicDetails = async (): Promise<AcademicDetails | null> => {
  // Check cache first (5 minutes cache)
  if (cache.academicDetails && Date.now() - cache.lastFetch.academicDetails < 300000) {
    console.log('Returning cached academic details');
    return cache.academicDetails;
  }

  console.log('Fetching academic details from API');
  const result = await makeApiCall('/Student/get_academic_details', 'GET');
  
  if (result && result.status === true && result.data) {
    cache.academicDetails = result.data;
    cache.lastFetch.academicDetails = Date.now();
    console.log('Academic details cached successfully');
    return result.data;
  }
  
  return null;
};

// POST Academic Details
export const saveAcademicDetails = async (details: AcademicDetails): Promise<{ success: boolean; error?: string; fieldErrors?: Record<string, string> }> => {
  console.log('Saving academic details to API');
  const result = await makeApiCall('/Student/academic_details', 'POST', details);
  
  console.log('API result:', result);
  console.log('Result status:', result?.status);
  console.log('Result status type:', typeof result?.status);
  
  // Handle both boolean true and string "true"
  if (result && (result.status === true || result.status === "true" || result.status === 1 || result.status === "1" || result.status === "success")) {
    // Update cache
    cache.academicDetails = details;
    cache.lastFetch.academicDetails = Date.now();
    console.log('✅ Academic details saved and cached');
    return { success: true };
  }
  
  console.log('❌ Academic details save failed - status is not true');
  console.log('Full error response:', result);
  
  // Extract error message from response
  let errorMessage = 'Failed to save your progress. Please try again.';
  let fieldErrors: Record<string, string> = {};
  
  if (result?.message) {
    console.log('Error message type:', typeof result.message);
    console.log('Error message content:', result.message);
    
    if (typeof result.message === 'string') {
      errorMessage = result.message;
    } else if (typeof result.message === 'object') {
      // Handle validation errors object like {"street": "The Street Address field must be at least 5 characters in length."}
      fieldErrors = result.message;
      const errorMessages = Object.values(result.message);
      console.log('Extracted error messages:', errorMessages);
      errorMessage = errorMessages.join(', ');
    }
  }
  
  console.log('Final error message:', errorMessage);
  return { success: false, error: errorMessage, fieldErrors };
};

// Clear cache (useful for logout or after successful submission)
export const clearProfileCache = () => {
  cache.personalDetails = null;
  cache.familyDetails = null;
  cache.academicDetails = null;
  cache.lastFetch.personalDetails = 0;
  cache.lastFetch.familyDetails = 0;
  cache.lastFetch.academicDetails = 0;
  console.log('Profile cache cleared');
};

// Get cache status for debugging
export const getCacheStatus = () => {
  return {
    personalDetails: !!cache.personalDetails,
    familyDetails: !!cache.familyDetails,
    academicDetails: !!cache.academicDetails,
    lastFetch: cache.lastFetch
  };
}; 