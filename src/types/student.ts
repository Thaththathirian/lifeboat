// Student status codes as defined in the backend
export enum StudentStatus {
  NEW_USER = 0,
  MOBILE_VERIFIED = 1,
  PROFILE_UPDATED = 2,
  PERSONAL_DOCUMENTS_PENDING = 3,
  PERSONAL_DOCUMENTS_SUBMITTED = 4,
  INTERVIEW_SCHEDULED = 5,
  ACADEMIC_DOCUMENTS_PENDING = 6,
  ACADEMIC_DOCUMENTS_SUBMITTED = 7,
  ELIGIBLE_FOR_SCHOLARSHIP = 8,
  PAYMENT_PENDING = 9,
  PAID = 10,
  PAYMENT_VERIFIED = 11,
  RECEIPT_DOCUMENTS_SUBMITTED = 12,
  ALUMNI = 13,
  BLOCKED = 14,
}

// Helper function to get status description
export const getStatusDescription = (status: number): string => {
  switch (status) {
    case StudentStatus.NEW_USER:
      return 'New User - Mobile verification required';
    case StudentStatus.MOBILE_VERIFIED:
      return 'Mobile Verified - Profile form required';
    case StudentStatus.PROFILE_UPDATED:
      return 'Profile Updated - Awaiting verification';
    case StudentStatus.PERSONAL_DOCUMENTS_PENDING:
      return 'Personal Documents Pending';
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