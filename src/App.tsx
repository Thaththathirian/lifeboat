import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { StudentProvider } from "@/contexts/StudentContext"
import { pageStateManager } from "@/utils/pageState"
import { StudentStatusProvider } from '@/components/layout/StudentStatusProvider'
import { StudentStatusSync } from '@/components/StudentStatusSync'

// Pages
import LandingPage from "@/pages/LandingPage"
import NotFound from "@/pages/NotFound"
import StudentLandingPage from "@/pages/StudentLandingPage"
import GoogleLoginPage from "@/pages/student/GoogleLoginPage"
import MobileVerification from "@/pages/student/MobileVerification"

// Student Pages
import StudentHome from "@/pages/student/StudentHome"
import StudentProfile from "@/pages/student/StudentProfile"
import StudentApplication from "@/pages/student/StudentApplication"
import StudentDocuments from "@/pages/student/StudentDocuments"
import StudentMessages from "@/pages/student/StudentMessages"
import StudentPayments from "@/pages/student/StudentPayments"
import StudentPaymentHistory from "@/pages/student/StudentPaymentHistory"
import StudentActivities from "@/pages/student/StudentActivities"
import StudentAcademicResults from "@/pages/student/StudentAcademicResults"
import StudentAlumni from "@/pages/student/StudentAlumni"
import ApplyForNext from "@/pages/student/ApplyForNext"
import StudentAcademicDocuments from "@/pages/student/StudentAcademicDocuments"

// Mock user data for demonstration
const mockUsers = {
  student: {
    id: "student1",
    name: "Rahul Kumar",
    email: "rahul@email.com",
    type: "student" as const,
    avatar: undefined
  }
}

function App() {
  const [currentUser, setCurrentUser] = useState<typeof mockUsers.student | null>(null)
  const [currentPath, setCurrentPath] = useState(() => localStorage.getItem('currentPath') || "/")
  const location = useLocation();
  const navigate = useNavigate();

  // Enhanced page state persistence
  useEffect(() => {
    if (location.pathname !== currentPath) {
      setCurrentPath(location.pathname);
    }
    pageStateManager.saveState(location.pathname);
  }, [location.pathname]);

  // Enhanced route restoration with scroll position and user state management
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedState = pageStateManager.getState();
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        
        if (savedState && window.location.pathname === "/") {
          navigate(savedState.route, { replace: true });
          if (savedState.scrollPosition) {
            pageStateManager.restoreScrollPosition(savedState.scrollPosition);
          }
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Listen for localStorage changes to update currentUser state
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentUser') {
        if (e.newValue) {
          try {
            const parsedUser = JSON.parse(e.newValue);
            setCurrentUser(parsedUser);
          } catch (error) {
            console.error('Error parsing currentUser from storage event:', error);
          }
        } else {
          setCurrentUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Also check localStorage periodically for changes (for same-tab updates)
  useEffect(() => {
    const checkUserState = () => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          if (!currentUser || currentUser.id !== parsedUser.id) {
            setCurrentUser(parsedUser);
          }
        } catch (error) {
          console.error('Error parsing currentUser:', error);
        }
      } else if (currentUser) {
        setCurrentUser(null);
      }
    };

    const interval = setInterval(checkUserState, 1000); // Check every second
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser))
  }, [currentUser])

  const handleLogin = (userType: keyof typeof mockUsers) => {
    setCurrentUser(mockUsers[userType])
    setCurrentPath(`/${userType}`)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentPath("/")
    localStorage.removeItem('currentUser');
  }

  const handleNavigate = (path: string) => {
    setCurrentPath(path)
  }

  // Protected Route Component
  const ProtectedRoute = ({ 
    children, 
    allowedUserType 
  }: { 
    children: React.ReactNode
    allowedUserType: string 
  }) => {
    if (!currentUser || currentUser.type !== allowedUserType) {
      return <Navigate to="/" replace />
    }
    return <>{children}</>
  }

  return (
    <StudentProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<StudentLandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/student/google-login" element={<GoogleLoginPage />} />
          <Route path="/mobile-verification" element={<MobileVerification />} />
          
          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute allowedUserType="student">
              <StudentStatusProvider>
                <StudentStatusSync />
                <DashboardLayout
                  userType="student"
                  userName={currentUser?.name || ""}
                  userAvatar={currentUser?.avatar}
                  currentPath={currentPath}
                  onNavigate={handleNavigate}
                >
                  <StudentHome />
                </DashboardLayout>
              </StudentStatusProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/student/profile" element={
            <ProtectedRoute allowedUserType="student">
              <StudentStatusProvider>
                <StudentStatusSync />
                <DashboardLayout
                  userType="student"
                  userName={currentUser?.name || ""}
                  userAvatar={currentUser?.avatar}
                  currentPath={currentPath}
                  onNavigate={handleNavigate}
                >
                  <StudentProfile />
                </DashboardLayout>
              </StudentStatusProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/student/application" element={
            <ProtectedRoute allowedUserType="student">
              <StudentStatusProvider>
                <StudentStatusSync />
                <DashboardLayout
                  userType="student"
                  userName={currentUser?.name || ""}
                  userAvatar={currentUser?.avatar}
                  currentPath={currentPath}
                  onNavigate={handleNavigate}
                >
                  <StudentApplication />
                </DashboardLayout>
              </StudentStatusProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/student/documents" element={
            <ProtectedRoute allowedUserType="student">
              <StudentStatusProvider>
                <DashboardLayout
                  userType="student"
                  userName={currentUser?.name || ""}
                  userAvatar={currentUser?.avatar}
                  currentPath={currentPath}
                  onNavigate={handleNavigate}
                >
                  <StudentDocuments />
                </DashboardLayout>
              </StudentStatusProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/student/messages" element={
            <ProtectedRoute allowedUserType="student">
              <StudentStatusProvider>
                <DashboardLayout
                  userType="student"
                  userName={currentUser?.name || ""}
                  userAvatar={currentUser?.avatar}
                  currentPath={currentPath}
                  onNavigate={handleNavigate}
                >
                  <StudentMessages />
                </DashboardLayout>
              </StudentStatusProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/student/payments" element={
            <ProtectedRoute allowedUserType="student">
              <StudentStatusProvider>
                <DashboardLayout
                  userType="student"
                  userName={currentUser?.name || ""}
                  userAvatar={currentUser?.avatar}
                  currentPath={currentPath}
                  onNavigate={handleNavigate}
                >
                  <StudentPayments />
                </DashboardLayout>
              </StudentStatusProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/student/academic-results" element={
            <ProtectedRoute allowedUserType="student">
              <StudentStatusProvider>
                <DashboardLayout
                  userType="student"
                  userName={currentUser?.name || ""}
                  userAvatar={currentUser?.avatar}
                  currentPath={currentPath}
                  onNavigate={handleNavigate}
                >
                  <StudentAcademicResults />
                </DashboardLayout>
              </StudentStatusProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/student/alumni" element={
            <ProtectedRoute allowedUserType="student">
              <StudentStatusProvider>
                <DashboardLayout
                  userType="student"
                  userName={currentUser?.name || ""}
                  userAvatar={currentUser?.avatar}
                  currentPath={currentPath}
                  onNavigate={handleNavigate}
                >
                  <StudentAlumni />
                </DashboardLayout>
              </StudentStatusProvider>
            </ProtectedRoute>
          } />

          <Route path="/student/apply-next" element={
            <ProtectedRoute allowedUserType="student">
              <StudentStatusProvider>
                <DashboardLayout
                  userType="student"
                  userName={currentUser?.name || ""}
                  userAvatar={currentUser?.avatar}
                  currentPath={currentPath}
                  onNavigate={handleNavigate}
                >
                  <ApplyForNext />
                </DashboardLayout>
              </StudentStatusProvider>
            </ProtectedRoute>
          } />

          <Route path="/student/academic-documents" element={
            <ProtectedRoute allowedUserType="student">
              <StudentStatusProvider>
                <DashboardLayout
                  userType="student"
                  userName={currentUser?.name || ""}
                  userAvatar={currentUser?.avatar}
                  currentPath={currentPath}
                  onNavigate={handleNavigate}
                >
                  <StudentAcademicDocuments />
                </DashboardLayout>
              </StudentStatusProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/student/payment-history" element={
            <ProtectedRoute allowedUserType="student">
              <StudentStatusProvider>
                <DashboardLayout
                  userType="student"
                  userName={currentUser?.name || ""}
                  userAvatar={currentUser?.avatar}
                  currentPath={currentPath}
                  onNavigate={handleNavigate}
                >
                  <StudentPaymentHistory />
                </DashboardLayout>
              </StudentStatusProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/student/activities" element={
            <ProtectedRoute allowedUserType="student">
              <StudentStatusProvider>
                <DashboardLayout
                  userType="student"
                  userName={currentUser?.name || ""}
                  userAvatar={currentUser?.avatar}
                  currentPath={currentPath}
                  onNavigate={handleNavigate}
                >
                  <StudentActivities />
                </DashboardLayout>
              </StudentStatusProvider>
            </ProtectedRoute>
          } />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      
      {/* Toast Notifications */}
      <Toaster />
    </StudentProvider>
  )
}

export default App
