import { useEffect, useState } from 'react';
import { getCurrentStatus } from '@/utils/backendService';
import { StudentStatus } from '@/types/student';

interface UseStudentStatusSyncOptions {
  autoSync?: boolean;
  onStatusChange?: (status: number) => void;
  onError?: (error: string) => void;
}

export const useStudentStatusSync = (options: UseStudentStatusSyncOptions = {}) => {
  const { autoSync = true, onStatusChange, onError } = options;
  const [currentStatus, setCurrentStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Syncing student status from API...');
      const statusResponse = await getCurrentStatus();
      
      if (statusResponse) {
        const statusNumber = statusResponse.status;
        console.log('✅ Received status from API:', statusNumber);
        setCurrentStatus(statusNumber);
        
        if (onStatusChange) {
          onStatusChange(statusNumber);
        }
      } else {
        console.log('⚠️ No status response from API (may be debounced)');
        // Don't set error if it's just debounced
        if (onError) {
          onError('Status API call was debounced or already in progress');
        }
      }
    } catch (err) {
      console.error('❌ Error syncing student status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-sync on mount if enabled
  useEffect(() => {
    if (autoSync) {
      syncStatus();
    }
  }, [autoSync]);

  // Listen for storage changes (login/logout events)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' && e.newValue) {
        // User logged in, sync status
        console.log('Auth token detected, syncing status...');
        syncStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    currentStatus,
    loading,
    error,
    syncStatus,
    isNewUser: currentStatus === StudentStatus.NEW_USER,
    isMobileVerified: currentStatus === StudentStatus.PERSONAL_DETAILS_PENDING,
    isProfileUpdated: currentStatus === StudentStatus.PERSONAL_DETAILS_SUBMITTED,
    isInterviewScheduled: currentStatus === StudentStatus.INTERVIEW_SCHEDULED,
    isDocumentUploaded: currentStatus === StudentStatus.PERSONAL_DETAILS_SUBMITTED,
    isWaitingForPayment: currentStatus === StudentStatus.PAYMENT_PENDING,
    isPaymentCompleted: currentStatus === StudentStatus.PAID,
    isPaymentVerified: currentStatus === StudentStatus.PAYMENT_VERIFIED,
    isReceiptVerified: currentStatus === StudentStatus.RECEIPT_DOCUMENTS_SUBMITTED,
    isCertificateUploaded: currentStatus === StudentStatus.RECEIPT_DOCUMENTS_SUBMITTED,
    isNextSemester: currentStatus === StudentStatus.ALUMNI,
    isAlumni: currentStatus === StudentStatus.ALUMNI,
    isBlocked: currentStatus === StudentStatus.BLOCKED,
  };
}; 