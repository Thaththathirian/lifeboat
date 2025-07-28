import React, { createContext, useContext, useEffect, useState } from 'react';
import { useStudentStatusSync } from '@/hooks/useStudentStatusSync';
import { StudentStatus, getStatusDescription } from '@/types/student';

const STATUS_KEY = 'studentStatus';
const defaultStatus = 'Profile Pending';

export const StudentStatusContext = createContext({
  status: defaultStatus,
  setStatus: (s: string) => {},
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
    return localStorage.getItem(STATUS_KEY) || defaultStatus;
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
        newStatus = 'mobile_verification_required';
      } else if (isMobileVerified) {
        newStatus = 'profile_form_required';
      } else if (isProfileUpdated) {
        newStatus = 'Profile Pending';
      } else if (isInterviewScheduled) {
        newStatus = 'Schedule Interview';
      } else if (isDocumentUploaded) {
        newStatus = 'Documents pending';
      } else if (isWaitingForPayment) {
        newStatus = 'payment';
      } else if (isPaymentCompleted) {
        newStatus = 'paid';
      } else if (isPaymentVerified) {
        newStatus = 'active';
      } else if (isReceiptVerified) {
        newStatus = 'active';
      } else if (isCertificateUploaded) {
        newStatus = 'active';
      } else if (isNextSemester) {
        newStatus = 'apply_next';
      } else if (isAlumni) {
        newStatus = 'alumni';
      } else if (isBlocked) {
        newStatus = 'blocked';
      }
      
      console.log('Mapped API status to UI status:', apiStatus, '->', newStatus);
      setStatus(newStatus);
    },
    onError: (errorMessage) => {
      console.error('Status sync error:', errorMessage);
    },
  });

  useEffect(() => {
    localStorage.setItem(STATUS_KEY, status);
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