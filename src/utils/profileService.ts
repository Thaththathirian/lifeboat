// Profile service with caching and conditional API calls
// Only calls APIs when user is in "Profile Pending" status and data doesn't exist

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

// Cache for API responses
const cache = {
  personalDetails: null as PersonalDetails | null,
  familyDetails: null as FamilyDetails | null,
  academicDetails: null as AcademicDetails | null,
  hasData: false, // Track if user has saved any data
  lastFetch: {
    personalDetails: 0,
    familyDetails: 0,
    academicDetails: 0
  }
};

// Check if user is in "Profile Pending" status
const isProfilePending = (): boolean => {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return false;
  
  try {
    const user = JSON.parse(currentUser);
    return user.status === 'Profile Pending';
  } catch {
    return false;
  }
};

// Check if user has any saved data
const hasUserData = (): boolean => {
  return cache.hasData;
};

// Get API base URL
const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost/lifeboat';
};

// Personal Details API
export const getPersonalDetails = async (): Promise<PersonalDetails | null> => {
  // Only call API if user is in "Profile Pending" status and no cached data
  if (!isProfilePending() || hasUserData()) {
    console.log('Skipping personal details API call - user not in pending status or has data');
    return cache.personalDetails;
  }

  // Check cache first
  if (cache.personalDetails && Date.now() - cache.lastFetch.personalDetails < 300000) { // 5 minutes cache
    console.log('Returning cached personal details');
    return cache.personalDetails;
  }

  try {
    console.log('Fetching personal details from API');
    const apiUrl = `${getApiBaseUrl()}/Student/get_personal_details`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.log('User not authenticated for personal details');
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === true && data.data) {
      cache.personalDetails = data.data;
      cache.lastFetch.personalDetails = Date.now();
      cache.hasData = true;
      console.log('Personal details cached successfully');
      return data.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching personal details:', error);
    return null;
  }
};

// Family Details API
export const getFamilyDetails = async (): Promise<FamilyDetails | null> => {
  // Only call API if user is in "Profile Pending" status and no cached data
  if (!isProfilePending() || hasUserData()) {
    console.log('Skipping family details API call - user not in pending status or has data');
    return cache.familyDetails;
  }

  // Check cache first
  if (cache.familyDetails && Date.now() - cache.lastFetch.familyDetails < 300000) { // 5 minutes cache
    console.log('Returning cached family details');
    return cache.familyDetails;
  }

  try {
    console.log('Fetching family details from API');
    const apiUrl = `${getApiBaseUrl()}/Student/get_family_details`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.log('User not authenticated for family details');
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === true && data.data) {
      cache.familyDetails = data.data;
      cache.lastFetch.familyDetails = Date.now();
      cache.hasData = true;
      console.log('Family details cached successfully');
      return data.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching family details:', error);
    return null;
  }
};

// Academic Details API
export const getAcademicDetails = async (): Promise<AcademicDetails | null> => {
  // Only call API if user is in "Profile Pending" status and no cached data
  if (!isProfilePending() || hasUserData()) {
    console.log('Skipping academic details API call - user not in pending status or has data');
    return cache.academicDetails;
  }

  // Check cache first
  if (cache.academicDetails && Date.now() - cache.lastFetch.academicDetails < 300000) { // 5 minutes cache
    console.log('Returning cached academic details');
    return cache.academicDetails;
  }

  try {
    console.log('Fetching academic details from API');
    const apiUrl = `${getApiBaseUrl()}/Student/get_academic_details`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.log('User not authenticated for academic details');
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === true && data.data) {
      cache.academicDetails = data.data;
      cache.lastFetch.academicDetails = Date.now();
      cache.hasData = true;
      console.log('Academic details cached successfully');
      return data.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching academic details:', error);
    return null;
  }
};

// Save Personal Details
export const savePersonalDetails = async (details: PersonalDetails): Promise<boolean> => {
  try {
    const apiUrl = `${getApiBaseUrl()}/Student/personal_details`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
      body: JSON.stringify(details),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === true) {
      // Update cache
      cache.personalDetails = details;
      cache.lastFetch.personalDetails = Date.now();
      cache.hasData = true;
      console.log('Personal details saved and cached');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error saving personal details:', error);
    return false;
  }
};

// Save Family Details
export const saveFamilyDetails = async (details: FamilyDetails): Promise<boolean> => {
  try {
    const apiUrl = `${getApiBaseUrl()}/Student/family_details`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
      body: JSON.stringify(details),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === true) {
      // Update cache
      cache.familyDetails = details;
      cache.lastFetch.familyDetails = Date.now();
      cache.hasData = true;
      console.log('Family details saved and cached');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error saving family details:', error);
    return false;
  }
};

// Save Academic Details
export const saveAcademicDetails = async (details: AcademicDetails): Promise<boolean> => {
  try {
    const apiUrl = `${getApiBaseUrl()}/Student/academic_details`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
      body: JSON.stringify(details),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === true) {
      // Update cache
      cache.academicDetails = details;
      cache.lastFetch.academicDetails = Date.now();
      cache.hasData = true;
      console.log('Academic details saved and cached');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error saving academic details:', error);
    return false;
  }
};

// Clear cache (useful for logout)
export const clearProfileCache = () => {
  cache.personalDetails = null;
  cache.familyDetails = null;
  cache.academicDetails = null;
  cache.hasData = false;
  cache.lastFetch.personalDetails = 0;
  cache.lastFetch.familyDetails = 0;
  cache.lastFetch.academicDetails = 0;
  console.log('Profile cache cleared');
};

// Get cache status for debugging
export const getCacheStatus = () => {
  return {
    hasData: cache.hasData,
    personalDetails: !!cache.personalDetails,
    familyDetails: !!cache.familyDetails,
    academicDetails: !!cache.academicDetails,
    isProfilePending: isProfilePending()
  };
}; 