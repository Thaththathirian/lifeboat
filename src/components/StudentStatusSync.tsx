import { useEffect } from 'react';
import { useStudentStatusSync } from '@/hooks/useStudentStatusSync';
import { useStudentStatus } from '@/components/layout/StudentStatusProvider';
import { forceSyncCurrentStatus } from '@/utils/backendService';

export function StudentStatusSync() {
  const { setStatus } = useStudentStatus();
  
  const { currentStatus, loading, error, syncStatus } = useStudentStatusSync({
    autoSync: false, // Disable auto sync to prevent multiple calls
    onStatusChange: (apiStatus) => {
      console.log('Status changed from API:', apiStatus);
      
      // Map API status to UI status
      let newStatus = 'Profile Pending';
      
      switch (apiStatus) {
        case 0: // NEW_USER
          newStatus = 'mobile_verification_required';
          break;
        case 1: // MOBILE_VERIFIED
          newStatus = 'profile_form_required';
          break;
        case 2: // PROFILE_UPDATED
          newStatus = 'Profile Pending';
          break;
        case 3: // INTERVIEW_SCHEDULED
          newStatus = 'Schedule Interview';
          break;
        case 4: // DOCUMENT_UPLOADED
          newStatus = 'Documents pending';
          break;
        case 5: // WAITING_FOR_PAYMENT
          newStatus = 'payment';
          break;
        case 6: // PAYMENT_COMPLETED
          newStatus = 'paid';
          break;
        case 7: // PAYMENT_VERIFIED
        case 8: // RECEIPT_VERIFIED
        case 9: // CERTIFICATE_UPLOADED
          newStatus = 'active';
          break;
        case 10: // NEXT_SEMESTER
          newStatus = 'apply_next';
          break;
        case 11: // ALUMNI
          newStatus = 'alumni';
          break;
        case 12: // BLOCKED
          newStatus = 'blocked';
          break;
        default:
          newStatus = 'Profile Pending';
      }
      
      console.log('Mapped API status to UI status:', apiStatus, '->', newStatus);
      setStatus(newStatus);
    },
    onError: (errorMessage) => {
      console.error('Status sync error:', errorMessage);
    },
  });

  // Force sync on mount to ensure status is called immediately after OAuth
  useEffect(() => {
    let isMounted = true;
    
    console.log('🔄 StudentStatusSync mounted, forcing status sync...');
    forceSyncCurrentStatus().then((result) => {
      if (isMounted) {
        if (result) {
          console.log('✅ Initial status sync successful:', result);
        } else {
          console.log('⚠️ Initial status sync skipped (debounced)');
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // This component doesn't render anything, it just handles status synchronization
  return null;
} 