// Student status codes as defined in the backend
export enum StudentStatus {
  NEW_USER = 0,
  MOBILE_VERIFIED = 1,
  PROFILE_UPDATED = 2,
  INTERVIEW_SCHEDULED = 3,
  DOCUMENT_UPLOADED = 4,
  WAITING_FOR_PAYMENT = 5,
  PAYMENT_COMPLETED = 6,
  PAYMENT_VERIFIED = 7,
  RECEIPT_VERIFIED = 8,
  CERTIFICATE_UPLOADED = 9,
  NEXT_SEMESTER = 10,
  ALUMNI = 11,
  BLOCKED = 12,
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
    case StudentStatus.INTERVIEW_SCHEDULED:
      return 'Interview Scheduled';
    case StudentStatus.DOCUMENT_UPLOADED:
      return 'Documents Uploaded - Awaiting verification';
    case StudentStatus.WAITING_FOR_PAYMENT:
      return 'Waiting for Payment';
    case StudentStatus.PAYMENT_COMPLETED:
      return 'Payment Completed';
    case StudentStatus.PAYMENT_VERIFIED:
      return 'Payment Verified';
    case StudentStatus.RECEIPT_VERIFIED:
      return 'Receipt Verified';
    case StudentStatus.CERTIFICATE_UPLOADED:
      return 'Certificate Uploaded';
    case StudentStatus.NEXT_SEMESTER:
      return 'Next Semester';
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