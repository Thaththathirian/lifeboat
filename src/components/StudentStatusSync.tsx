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
         case 1: // PERSONAL_DETAILS_PENDING
           newStatus = 'profile_form_required';
           break;
         case 2: // PERSONAL_DOCUMENTS_PENDING
           newStatus = 'Profile Pending';
           break;
         case 3: // APPLICATION_SUBMITTED
           newStatus = 'Application Submitted';
           break;
         case 4: // INTERVIEW_SCHEDULED
           newStatus = 'Schedule Interview';
           break;
         case 5: // ACADEMIC_DOCUMENTS_PENDING
           newStatus = 'Academic documents pending';
           break;
         case 6: // ACADEMIC_DOCUMENTS_SUBMITTED
           newStatus = 'Academic documents submitted';
           break;
         case 7: // ELIGIBLE_FOR_SCHOLARSHIP
           newStatus = 'eligible_scholarship';
           break;
         case 8: // PAYMENT_PENDING
           newStatus = 'payment';
           break;
         case 9: // PAID
           newStatus = 'paid';
           break;
         case 10: // PAYMENT_VERIFIED
           newStatus = 'payment_verified';
           break;
         case 11: // RECEIPT_DOCUMENTS_SUBMITTED
           newStatus = 'active';
           break;
         case 12: // ALUMNI
           newStatus = 'alumni';
           break;
         case 13: // BLOCKED
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