import React, { createContext, useContext, useEffect, useState } from 'react';

const STATUS_KEY = 'studentStatus';
const defaultStatus = 'Profile Pending';

export const StudentStatusContext = createContext({
  status: defaultStatus,
  setStatus: (s: string) => {},
});

export function useStudentStatus() {
  return useContext(StudentStatusContext);
}

export function StudentStatusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState(() => {
    return localStorage.getItem(STATUS_KEY) || defaultStatus;
  });

  useEffect(() => {
    localStorage.setItem(STATUS_KEY, status);
  }, [status]);

  return (
    <StudentStatusContext.Provider value={{ status, setStatus }}>
      {children}
    </StudentStatusContext.Provider>
  );
} 