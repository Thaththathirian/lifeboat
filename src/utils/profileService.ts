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
    // Convert data to FormData format instead of JSON
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      const value = data[key];
      // Convert boolean values to strings for FormData
      formData.append(key, typeof value === 'boolean' ? value.toString() : value);
    });
    
    // Don't set Content-Type header - let browser set it with boundary for FormData
    config.body = formData;
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      console.error(`API call failed: ${response.status} ${response.statusText}`);
      return null;
    }

    const result = await response.json();
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
export const savePersonalDetails = async (details: PersonalDetails): Promise<boolean> => {
  console.log('Saving personal details to API');
  const result = await makeApiCall('/Student/personal_details', 'POST', details);
  
  if (result && result.status === true) {
    // Update cache
    cache.personalDetails = details;
    cache.lastFetch.personalDetails = Date.now();
    console.log('Personal details saved and cached');
    return true;
  }
  
  return false;
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
export const saveFamilyDetails = async (details: FamilyDetails): Promise<boolean> => {
  console.log('Saving family details to API');
  const result = await makeApiCall('/Student/family_details', 'POST', details);
  
  if (result && result.status === true) {
    // Update cache
    cache.familyDetails = details;
    cache.lastFetch.familyDetails = Date.now();
    console.log('Family details saved and cached');
    return true;
  }
  
  return false;
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
export const saveAcademicDetails = async (details: AcademicDetails): Promise<boolean> => {
  console.log('Saving academic details to API');
  const result = await makeApiCall('/Student/academic_details', 'POST', details);
  
  if (result && result.status === true) {
    // Update cache
    cache.academicDetails = details;
    cache.lastFetch.academicDetails = Date.now();
    console.log('Academic details saved and cached');
    return true;
  }
  
  return false;
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