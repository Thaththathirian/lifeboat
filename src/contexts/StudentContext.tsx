import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type StudentStatus = 
  | 'login'
  | 'Profile Pending'
  | 'Profile Under Verification'
  | 'profile pending verification'
  | 'Schedule Interview'
  | 'interview'
  | 'documents'
  | 'Documents pending'
  | 'documents_submitted'
  | 'documents verification pending'
  | 'review'
  | 'approved'
  | 'eligible_scholarship'
  | 'payment'
  | 'paid'
  | 'active'
  | 'academic_documents_pending'
  | 'academic_documents_submitted'
  | 'academic_results_pending'
  | 'academic_verification_pending'
  | 'apply_next'
  | 'alumni'
  | 'Future Ready Module'
  | 'blocked';

interface StudentContextType {
  status: StudentStatus;
  setStatus: (status: StudentStatus) => void;
  profile: any;
  setProfile: (profile: any) => void;
  application: any;
  setApplication: (application: any) => void;
  documents: any;
  setDocuments: (documents: any) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<StudentStatus>(() => {
    return (localStorage.getItem('student_status') as StudentStatus) || 'Profile Pending';
  });
  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem('student_profile');
    return stored ? JSON.parse(stored) : null;
  });
  const [application, setApplication] = useState(() => {
    const stored = localStorage.getItem('student_application');
    return stored ? JSON.parse(stored) : null;
  });
  const [documents, setDocuments] = useState(() => {
    const stored = localStorage.getItem('student_documents');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    localStorage.setItem('student_status', status);
  }, [status]);
  useEffect(() => {
    localStorage.setItem('student_profile', JSON.stringify(profile));
  }, [profile]);
  useEffect(() => {
    localStorage.setItem('student_application', JSON.stringify(application));
  }, [application]);
  useEffect(() => {
    localStorage.setItem('student_documents', JSON.stringify(documents));
  }, [documents]);

  return (
    <StudentContext.Provider value={{
      status,
      setStatus,
      profile,
      setProfile,
      application,
      setApplication,
      documents,
      setDocuments
    }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
} 