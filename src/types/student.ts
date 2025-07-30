// Student status codes as defined in the backend
export enum StudentStatus {
  NEW_USER = 0,
  PROFILE_UPDATE_PENDING = 1,
  PERSONAL_DOCUMENTS_PENDING = 2,
  PERSONAL_DOCUMENTS_SUBMITTED = 3,
  INTERVIEW_SCHEDULED = 4,
  ACADEMIC_DOCUMENTS_PENDING = 5,
  ACADEMIC_DOCUMENTS_SUBMITTED = 6,
  ELIGIBLE_FOR_SCHOLARSHIP = 7,
  PAYMENT_PENDING = 8,
  PAID = 9,
  PAYMENT_VERIFIED = 10,
  RECEIPT_DOCUMENTS_SUBMITTED = 11,
  ALUMNI = 12,
  BLOCKED = 13,
}

// Helper function to get status description
export const getStatusDescription = (status: number): string => {
  switch (status) {
    case StudentStatus.NEW_USER:
      return 'New User - Mobile verification required';
    case StudentStatus.PROFILE_UPDATE_PENDING:
      return 'Profile Update Pending - Profile form required';
    case StudentStatus.PERSONAL_DOCUMENTS_PENDING:
      return 'Personal Documents Pending - Awaiting verification';
    case StudentStatus.PERSONAL_DOCUMENTS_SUBMITTED:
      return 'Personal Documents Submitted';
    case StudentStatus.INTERVIEW_SCHEDULED:
      return 'Interview Scheduled';
    case StudentStatus.ACADEMIC_DOCUMENTS_PENDING:
      return 'Academic Documents Pending';
    case StudentStatus.ACADEMIC_DOCUMENTS_SUBMITTED:
      return 'Academic Documents Submitted';
    case StudentStatus.ELIGIBLE_FOR_SCHOLARSHIP:
      return 'Eligible for Scholarship';
    case StudentStatus.PAYMENT_PENDING:
      return 'Payment Pending';
    case StudentStatus.PAID:
      return 'Paid';
    case StudentStatus.PAYMENT_VERIFIED:
      return 'Payment Verified';
    case StudentStatus.RECEIPT_DOCUMENTS_SUBMITTED:
      return 'Receipt Documents Submitted';
    case StudentStatus.ALUMNI:
      return 'Alumni';
    case StudentStatus.BLOCKED:
      return 'Blocked';
    default:
      return 'Unknown Status';
  }
};

// Interface for the status API response
export interface StudentStatusResponse {
  status: boolean;
  message: string;
  data: {
    status: string;
  };
} 