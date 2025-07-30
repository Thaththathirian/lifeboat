import { STUDENT_STATUS_DISPLAY } from '@/constants/studentStatus';

/**
 * Get the human-readable display name for a student status code
 * @param statusCode - The numeric status code
 * @returns The display name for the status, or 'Unknown Status' if not found
 */
export const getStatusDisplayName = (statusCode: number): string => {
  // Special handling for NEW_USER status to show as "Profile Update Pending"
  if (statusCode === 0) {
    return 'Profile Update Pending';
  }
  return STUDENT_STATUS_DISPLAY[statusCode as keyof typeof STUDENT_STATUS_DISPLAY] || 'Unknown Status';
};

/**
 * Get the status display name with fallback for undefined/null status
 * @param statusCode - The numeric status code (can be null/undefined)
 * @returns The display name for the status, or 'Loading...' if status is null/undefined
 */
export const getStatusDisplayNameSafe = (statusCode: number | null | undefined): string => {
  if (statusCode === null || statusCode === undefined) {
    return 'Loading...';
  }
  return getStatusDisplayName(statusCode);
}; 