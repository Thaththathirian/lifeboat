// src/utils/profileService.ts
// This file contains the service for managing student profile details
// It simulates API calls using local storage for caching and persistence,
// as per the requirement to not use a real backend in this project.

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
  referencePersonPhone: string;
  referencePersonEmail: string;
}

// Local in-memory cache for profile data
const profileCache = {
  personal: null as PersonalDetails | null,
  family: null as FamilyDetails | null,
  academic: null as AcademicDetails | null,
};

// Keys for localStorage to persist cached data and profile completion status
const LS_PROFILE_COMPLETED_KEY = 'profileCompleted';
const LS_PERSONAL_DETAILS_KEY = 'cachedPersonalDetails';
const LS_FAMILY_DETAILS_KEY = 'cachedFamilyDetails';
const LS_ACADEMIC_DETAILS_KEY = 'cachedAcademicDetails';

/**
 * Checks if the user's profile has been marked as completed.
 * @returns {boolean} True if the profile is completed, false otherwise.
 */
export const isProfileCompleted = (): boolean => {
  return localStorage.getItem(LS_PROFILE_COMPLETED_KEY) === 'true';
};

/**
 * Sets the profile completion status.
 * @param {boolean} completed - True to mark profile as completed, false otherwise.
 */
export const setProfileCompleted = (completed: boolean) => {
  localStorage.setItem(LS_PROFILE_COMPLETED_KEY, String(completed));
  console.log(`Profile completion status set to: ${completed}`);
};

/**
 * Clears all profile-related data from both in-memory cache and localStorage.
 * This should be called after a successful full profile submission.
 */
export const clearProfileCache = () => {
  profileCache.personal = null;
  profileCache.family = null;
  profileCache.academic = null;
  localStorage.removeItem(LS_PERSONAL_DETAILS_KEY);
  localStorage.removeItem(LS_FAMILY_DETAILS_KEY);
  localStorage.removeItem(LS_ACADEMIC_DETAILS_KEY);
  localStorage.removeItem(LS_PROFILE_COMPLETED_KEY);
  console.log('Profile cache and completion status cleared.');
};

/**
 * Simulates a GET API call for profile data.
 * It checks local cache and localStorage first. If the profile is completed,
 * it will not "fetch" new data. If in "Profile Pending" state and no data exists,
 * it returns default empty data.
 * @param {string} key - The key for the specific profile section (e.g., 'personal', 'family', 'academic').
 * @param {T | null} defaultData - Default data to return if no existing data is found.
 * @returns {Promise<T | null>} A promise that resolves with the data or null.
 */
const simulateGet = async <T>(key: string, defaultData: T | null = null): Promise<T | null> => {
  console.log(`Simulating GET for ${key}...`);

  // 1. Check in-memory cache first
  if (profileCache[key as keyof typeof profileCache]) {
    console.log(`Returning in-memory cached data for ${key}.`);
    return profileCache[key as keyof typeof profileCache] as T;
  }

  // 2. Check localStorage for persisted cache
  const localStorageKey = `cached${key.charAt(0).toUpperCase() + key.slice(1)}Details`;
  const storedData = localStorage.getItem(localStorageKey);
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      profileCache[key as keyof typeof profileCache] = parsedData; // Update in-memory cache
      console.log(`Returning localStorage data for ${key}.`);
      return parsedData;
    } catch (e) {
      console.error(`Error parsing stored data for ${key} from localStorage:`, e);
      localStorage.removeItem(localStorageKey); // Clear corrupted data
    }
  }

  // 3. If profile is completed, and no cached data, don't "call" API, return null.
  // This addresses "if user not created any data and saved to backed, then dont call get api calls"
  // by assuming "completed" means data is already there or not needed.
  if (isProfileCompleted()) {
    console.log(`Profile completed, not fetching new data for ${key}.`);
    return null;
  }

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // 4. If user is in "Profile Pending" (i.e., not completed) and no data exists,
  // simulate an empty response to provide initial form data.
  console.log(`Simulating empty response for ${key} (Profile Pending, no existing data).`);
  return defaultData;
};

/**
 * Simulates a POST API call for profile data.
 * It stores the data in local storage and returns success, without making a network call.
 * @param {string} key - The key for the specific profile section (e.g., 'personal', 'family', 'academic').
 * @param {T} data - The data to "save".
 * @returns {Promise<boolean>} A promise that resolves with true for success.
 */
const simulatePost = async <T>(key: string, data: T): Promise<boolean> => {
  console.log(`Simulating POST for ${key} with data:`, data);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call delay

  // Store data in local cache and localStorage
  profileCache[key as keyof typeof profileCache] = data;
  localStorage.setItem(`cached${key.charAt(0).toUpperCase() + key.slice(1)}Details`, JSON.stringify(data));

  console.log(`Simulated POST successful for ${key}. Data cached.`);
  return true;
};

// --- Exported Functions for Profile Sections ---

// GET Personal Details
export const getPersonalDetails = async (): Promise<PersonalDetails | null> => {
  return simulateGet<PersonalDetails>('personal', {
    firstName: '', lastName: '', gender: '', dob: '', street: '', city: '',
    state: '', pinCode: '', mobile: '', email: ''
  });
};

// POST Personal Details
export const savePersonalDetails = async (details: PersonalDetails): Promise<boolean> => {
  return simulatePost<PersonalDetails>('personal', details);
};

// GET Family Details
export const getFamilyDetails = async (): Promise<FamilyDetails | null> => {
  return simulateGet<FamilyDetails>('family', {
    fatherName: '', fatherOccupation: '', motherName: '', motherOccupation: '',
    parentsPhone: '', familyDetails: '', familyAnnualIncome: ''
  });
};

// POST Family Details
export const saveFamilyDetails = async (details: FamilyDetails): Promise<boolean> => {
  return simulatePost<FamilyDetails>('family', details);
};

// GET Academic Details
export const getAcademicDetails = async (): Promise<AcademicDetails | null> => {
  return simulateGet<AcademicDetails>('academic', {
    grade: '', presentSemester: '', academicYear: '', collegeName: '',
    collegePhone: '', collegeEmail: '', collegeWebsite: '',
    referencePersonName: '', referencePersonQualification: '', referencePersonPhone: '',
    referencePersonEmail: ''
  });
};

// POST Academic Details
export const saveAcademicDetails = async (details: AcademicDetails): Promise<boolean> => {
  return simulatePost<AcademicDetails>('academic', details);
};

// --- Initialization ---
// Load initial cache from localStorage when the service is imported
(() => {
  const personal = localStorage.getItem(LS_PERSONAL_DETAILS_KEY);
  if (personal) profileCache.personal = JSON.parse(personal);
  const family = localStorage.getItem(LS_FAMILY_DETAILS_KEY);
  if (family) profileCache.family = JSON.parse(family);
  const academic = localStorage.getItem(LS_ACADEMIC_DETAILS_KEY);
  if (academic) profileCache.academic = JSON.parse(academic);
  console.log('Profile service initialized. Cache loaded from localStorage.');
})(); 