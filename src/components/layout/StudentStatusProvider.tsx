import React, { createContext, useContext, useEffect, useState } from 'react';
import { useStudentStatusSync } from '@/hooks/useStudentStatusSync';
import { StudentStatus, getStatusDescription } from '@/types/student';

const STATUS_KEY = 'studentStatus';
const defaultStatus = StudentStatus.PERSONAL_DOCUMENTS_PENDING;

export const StudentStatusContext = createContext({
  status: defaultStatus,
  setStatus: (s: number) => {},
  currentApiStatus: null as number | null,
  syncStatus: () => {},
  loading: false,
  error: null as string | null,
});

export function useStudentStatus() {
  return useContext(StudentStatusContext);
}

export function StudentStatusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState(() => {
    const storedStatus = localStorage.getItem(STATUS_KEY);
    if (storedStatus) {
      const statusNumber = parseInt(storedStatus);
      if (!isNaN(statusNumber)) {
        return statusNumber;
      }
    }
    return defaultStatus;
  });

  // Use the status sync hook
  const {
    currentStatus: currentApiStatus,
    loading,
    error,
    syncStatus,
    isNewUser,
    isMobileVerified,
    isProfileUpdated,
    isInterviewScheduled,
    isDocumentUploaded,
    isWaitingForPayment,
    isPaymentCompleted,
    isPaymentVerified,
    isReceiptVerified,
    isCertificateUploaded,
    isNextSemester,
    isAlumni,
    isBlocked,
  } = useStudentStatusSync({
    autoSync: true,
    onStatusChange: (apiStatus) => {
      console.log('Status changed from API:', apiStatus);
      
      // Map API status to UI status
      let newStatus = defaultStatus;
      
      if (isNewUser) {
        newStatus = StudentStatus.NEW_USER;
      } else if (isMobileVerified) {
        newStatus = StudentStatus.PROFILE_UPDATE_PENDING;
      } else if (isProfileUpdated) {
        newStatus = StudentStatus.PERSONAL_DOCUMENTS_PENDING;
      } else if (isInterviewScheduled) {
        newStatus = StudentStatus.INTERVIEW_SCHEDULED;
      } else if (isDocumentUploaded) {
        newStatus = StudentStatus.PERSONAL_DOCUMENTS_PENDING;
      } else if (isWaitingForPayment) {
        newStatus = StudentStatus.PAYMENT_PENDING;
      } else if (isPaymentCompleted) {
        newStatus = StudentStatus.PAID;
      } else if (isPaymentVerified) {
        newStatus = StudentStatus.PAYMENT_VERIFIED;
      } else if (isReceiptVerified) {
        newStatus = StudentStatus.RECEIPT_DOCUMENTS_SUBMITTED;
      } else if (isCertificateUploaded) {
        newStatus = StudentStatus.RECEIPT_DOCUMENTS_SUBMITTED;
      } else if (isNextSemester) {
        newStatus = StudentStatus.ALUMNI;
      } else if (isAlumni) {
        newStatus = StudentStatus.ALUMNI;
      } else if (isBlocked) {
        newStatus = StudentStatus.BLOCKED;
      }
      
      console.log('Mapped API status to UI status:', apiStatus, '->', newStatus);
      setStatus(newStatus);
    },
    onError: (errorMessage) => {
      console.error('Status sync error:', errorMessage);
    },
  });

  useEffect(() => {
    localStorage.setItem(STATUS_KEY, status.toString());
  }, [status]);

  return (
    <StudentStatusContext.Provider value={{ 
      status, 
      setStatus, 
      currentApiStatus,
      syncStatus,
      loading,
      error,
    }}>
      {children}
    </StudentStatusContext.Provider>
  );
} 