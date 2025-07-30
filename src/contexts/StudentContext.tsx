import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { STUDENT_STATUS, STUDENT_STATUS_DISPLAY, StudentStatusType } from '../constants/studentStatus';

export type StudentStatus = StudentStatusType;

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
    const storedStatus = localStorage.getItem('student_status');
    if (storedStatus) {
      const statusNumber = parseInt(storedStatus);
      if (!isNaN(statusNumber)) {
        return statusNumber as StudentStatus;
      }
    }
    return STUDENT_STATUS.NEW_USER;
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
    localStorage.setItem('student_status', status.toString());
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