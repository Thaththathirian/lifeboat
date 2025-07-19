import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, useParams } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { StudentProvider } from "@/contexts/StudentContext"
import { pageStateManager } from "@/utils/pageState"
import { StudentStatusProvider } from '@/components/layout/StudentStatusProvider'

// Pages
import LandingPage from "@/pages/LandingPage"
import LoginPage from "@/pages/LoginPage"
import DonatePage from "@/pages/DonatePage"
import NotFound from "@/pages/NotFound"
import StudentLandingPage from "@/pages/StudentLandingPage"
import GoogleLoginPage from "@/pages/student/GoogleLoginPage"
import MobileVerification from "@/pages/student/MobileVerification"

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard"
import AdminMessages from "@/pages/admin/AdminMessages"
import AdminNotifications from "@/pages/admin/AdminNotifications"
import AdminStudents from "@/pages/admin/AdminStudents"
import AdminColleges from "@/pages/admin/AdminColleges"
import AdminDonors from "@/pages/admin/AdminDonors"
import AdminPaymentAllotment from "@/pages/admin/AdminPaymentAllotment"

// Student Pages
import StudentDashboard from "@/pages/student/StudentDashboard"
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

// Donor Pages
import DonorDashboard from "@/pages/donor/DonorDashboard"
import DonorDonations from "@/pages/donor/DonorDonations"
import DonorStudents from "@/pages/donor/DonorStudents"
import DonorPayments from "@/pages/donor/DonorPayments"
import DonorAutoPayment from "@/pages/donor/DonorAutoPayment"
import DonorMessages from "@/pages/donor/DonorMessages"
import DonorNotifications from "@/pages/donor/DonorNotifications"
import DonorSettings from "@/pages/donor/DonorSettings"

// College Pages
import CollegeDashboard from "@/pages/college/CollegeDashboard"
import CollegeStudents from "@/pages/college/CollegeStudents"
import CollegePaymentVerification from "@/pages/college/CollegePaymentVerification"
import CollegeReceiptManagement from "@/pages/college/CollegeReceiptManagement"
import CollegeReports from "@/pages/college/CollegeReports"
import CollegeMessages from "@/pages/college/CollegeMessages"
import CollegeNotifications from "@/pages/college/CollegeNotifications"
import CollegeProfile from "@/pages/college/CollegeProfile"

// New components
import RegisteredColleges from './pages/admin/colleges/RegisteredColleges';
import PendingColleges from './pages/admin/colleges/PendingColleges';
import ScholarshipAccount from './pages/admin/colleges/ScholarshipAccount';
import ReceiptManagement from './pages/admin/colleges/ReceiptManagement';
import CollegeInspection from './pages/admin/CollegeInspection';

import AddCollege from './pages/admin/colleges/AddCollege';
import EditCollege from './pages/admin/colleges/EditCollege';

// Donor components
import AllDonors from './pages/admin/donors/AllDonors';
import DonorMapping from './pages/admin/donors/DonorMapping';
import DonationReports from './pages/admin/donors/DonationReports';
import AutoMessaging from './pages/admin/donors/AutoMessaging';
import DonorForm from './pages/admin/donors/DonorForm';
import { mockDonors } from './pages/admin/donors/AllDonors';

// Mock user data for demonstration
const mockUsers = {
  admin: {
    id: "admin1",
    name: "Admin User",
    email: "admin@scholarship.com",
    type: "admin" as const,
    avatar: undefined
  },
  student: {
    id: "student1",
    name: "Rahul Kumar",
    email: "rahul@email.com",
    type: "student" as const,
    avatar: undefined
  },
  donor: {
    id: "donor1",
    name: "John Doe",
    email: "john@email.com",
    type: "donor" as const,
    avatar: undefined
  },
  college: {
    id: "college1",
    name: "Mumbai University",
    email: "admin@mu.ac.in",
    type: "college" as const,
    avatar: undefined
  }
}

function App() {
  const [currentUser, setCurrentUser] = useState<typeof mockUsers.admin | typeof mockUsers.student | typeof mockUsers.donor | typeof mockUsers.college | null>(null)
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

  // Enhanced route restoration with scroll position
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedState = pageStateManager.getState();
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      
      if (savedState && window.location.pathname === "/") {
        navigate(savedState.route, { replace: true });
        if (savedState.scrollPosition) {
          pageStateManager.restoreScrollPosition(savedState.scrollPosition);
        }
      }
    }
  }, []);

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
      return <Navigate to="/login" replace />
    }
    return <>{children}</>
  }

  // Add a wrapper component for edit donor
  function EditDonorWrapper({ onSubmit }: { onSubmit: (donor: any) => void }) {
    const { id } = useParams();
    const donor = mockDonors.find(d => d.id === id);
    console.log('EditDonorWrapper id:', id, 'donor:', donor);
    if (!donor) {
      return <div style={{ padding: 32, textAlign: 'center', color: 'red' }}>Donor not found for ID: {id}</div>;
    }
    return <DonorForm mode="edit" donor={donor} onSubmit={onSubmit} />;
  }

  return (
    <StudentProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<StudentLandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/student/google-login" element={<GoogleLoginPage />} />
          <Route path="/mobile-verification" element={<MobileVerification />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout
                userType="admin"
                userName={currentUser?.name || ""}
                userAvatar={currentUser?.avatar}
                currentPath={currentPath}
                onNavigate={handleNavigate}
              >
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/messages" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout
                userType="admin"
                userName={currentUser?.name || ""}
                userAvatar={currentUser?.avatar}
                currentPath={currentPath}
                onNavigate={handleNavigate}
              >
                <AdminMessages />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/notifications" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout
                userType="admin"
                userName={currentUser?.name || ""}
                userAvatar={currentUser?.avatar}
                currentPath={currentPath}
                onNavigate={handleNavigate}
              >
                <AdminNotifications />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/students/all" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout userType="admin" userName={currentUser?.name || ""} userAvatar={currentUser?.avatar} currentPath={currentPath} onNavigate={handleNavigate}>
                <AdminStudents initialTab="all" />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/students/applied" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout userType="admin" userName={currentUser?.name || ""} userAvatar={currentUser?.avatar} currentPath={currentPath} onNavigate={handleNavigate}>
                <AdminStudents initialTab="applied" />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/students/approved" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout userType="admin" userName={currentUser?.name || ""} userAvatar={currentUser?.avatar} currentPath={currentPath} onNavigate={handleNavigate}>
                <AdminStudents initialTab="approved" />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/students/active" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout userType="admin" userName={currentUser?.name || ""} userAvatar={currentUser?.avatar} currentPath={currentPath} onNavigate={handleNavigate}>
                <AdminStudents initialTab="active" />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/students/inactive" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout userType="admin" userName={currentUser?.name || ""} userAvatar={currentUser?.avatar} currentPath={currentPath} onNavigate={handleNavigate}>
                <AdminStudents initialTab="inactive" />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/students/alumni" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout userType="admin" userName={currentUser?.name || ""} userAvatar={currentUser?.avatar} currentPath={currentPath} onNavigate={handleNavigate}>
                <AdminStudents initialTab="alumni" />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/colleges" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout userType="admin" userName={currentUser?.name || ""} userAvatar={currentUser?.avatar} currentPath={currentPath} onNavigate={handleNavigate}>
                <AdminColleges />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/colleges/add" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout userType="admin" userName={currentUser?.name || ""} userAvatar={currentUser?.avatar} currentPath={currentPath} onNavigate={handleNavigate}>
                <AddCollege />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/colleges/edit/:id" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout userType="admin" userName={currentUser?.name || ""} userAvatar={currentUser?.avatar} currentPath={currentPath} onNavigate={handleNavigate}>
                <EditCollege />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/donors" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout userType="admin" userName={currentUser?.name || ""} userAvatar={currentUser?.avatar} currentPath={currentPath} onNavigate={handleNavigate}>
                <AdminDonors />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/donors/all" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout userType="admin" userName={currentUser?.name || ""} userAvatar={currentUser?.avatar} currentPath={currentPath} onNavigate={handleNavigate}>
                <AllDonors />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/donors/add" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout userType="admin" userName={currentUser?.name || ""} userAvatar={currentUser?.avatar} currentPath={currentPath} onNavigate={handleNavigate}>
                <DonorForm mode="add" onSubmit={() => {}} />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/donors/edit/:id" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout userType="admin" userName={currentUser?.name || ""} userAvatar={currentUser?.avatar} currentPath={currentPath} onNavigate={handleNavigate}>
                <EditDonorWrapper onSubmit={() => {}} />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/donors/mapping" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout userType="admin" userName={currentUser?.name || ""} userAvatar={currentUser?.avatar} currentPath={currentPath} onNavigate={handleNavigate}>
                <DonorMapping />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/donors/messaging" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout userType="admin" userName={currentUser?.name || ""} userAvatar={currentUser?.avatar} currentPath={currentPath} onNavigate={handleNavigate}>
                <AutoMessaging />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/colleges/registered" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout userType="admin" userName={currentUser?.name || ""} userAvatar={currentUser?.avatar} currentPath={currentPath} onNavigate={handleNavigate}>
                <RegisteredColleges />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/colleges/pending" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout userType="admin" userName={currentUser?.name || ""} userAvatar={currentUser?.avatar} currentPath={currentPath} onNavigate={handleNavigate}>
                <PendingColleges />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/colleges/scholarship-account" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout userType="admin" userName={currentUser?.name || ""} userAvatar={currentUser?.avatar} currentPath={currentPath} onNavigate={handleNavigate}>
                <ScholarshipAccount />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/students/receipts" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout userType="admin" userName={currentUser?.name || ""} userAvatar={currentUser?.avatar} currentPath={currentPath} onNavigate={handleNavigate}>
                <ReceiptManagement />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/college-inspection" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout userType="admin" userName={currentUser?.name || ""} userAvatar={currentUser?.avatar} currentPath={currentPath} onNavigate={handleNavigate}>
                <CollegeInspection />
              </DashboardLayout>
            </ProtectedRoute>
          } />


          <Route path="/admin/payments" element={
            <ProtectedRoute allowedUserType="admin">
              <DashboardLayout userType="admin" userName={currentUser?.name || ""} userAvatar={currentUser?.avatar} currentPath={currentPath} onNavigate={handleNavigate}>
                <AdminPaymentAllotment />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute allowedUserType="student">
              <StudentStatusProvider>
                <DashboardLayout
                  userType="student"
                  userName={currentUser?.name || ""}
                  userAvatar={currentUser?.avatar}
                  currentPath={currentPath}
                  onNavigate={handleNavigate}
                >
                  <StudentDashboard />
                </DashboardLayout>
              </StudentStatusProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/student/profile" element={
            <ProtectedRoute allowedUserType="student">
              <StudentStatusProvider>
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
          
          {/* Donor Routes */}
          <Route path="/donor" element={
            <ProtectedRoute allowedUserType="donor">
              <DashboardLayout
                userType="donor"
                userName={currentUser?.name || ""}
                userAvatar={currentUser?.avatar}
                currentPath={currentPath}
                onNavigate={handleNavigate}
              >
                <DonorDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/donor/donations" element={
            <ProtectedRoute allowedUserType="donor">
              <DashboardLayout
                userType="donor"
                userName={currentUser?.name || ""}
                userAvatar={currentUser?.avatar}
                currentPath={currentPath}
                onNavigate={handleNavigate}
              >
                <DonorDonations />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/donor/students" element={
            <ProtectedRoute allowedUserType="donor">
              <DashboardLayout
                userType="donor"
                userName={currentUser?.name || ""}
                userAvatar={currentUser?.avatar}
                currentPath={currentPath}
                onNavigate={handleNavigate}
              >
                <DonorStudents />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/donor/payments" element={
            <ProtectedRoute allowedUserType="donor">
              <DashboardLayout
                userType="donor"
                userName={currentUser?.name || ""}
                userAvatar={currentUser?.avatar}
                currentPath={currentPath}
                onNavigate={handleNavigate}
              >
                <DonorPayments />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/donor/auto-payment" element={
            <ProtectedRoute allowedUserType="donor">
              <DashboardLayout
                userType="donor"
                userName={currentUser?.name || ""}
                userAvatar={currentUser?.avatar}
                currentPath={currentPath}
                onNavigate={handleNavigate}
              >
                <DonorAutoPayment />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/donor/messages" element={
            <ProtectedRoute allowedUserType="donor">
              <DashboardLayout
                userType="donor"
                userName={currentUser?.name || ""}
                userAvatar={currentUser?.avatar}
                currentPath={currentPath}
                onNavigate={handleNavigate}
              >
                <DonorMessages />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/donor/notifications" element={
            <ProtectedRoute allowedUserType="donor">
              <DashboardLayout
                userType="donor"
                userName={currentUser?.name || ""}
                userAvatar={currentUser?.avatar}
                currentPath={currentPath}
                onNavigate={handleNavigate}
              >
                <DonorNotifications />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/donor/settings" element={
            <ProtectedRoute allowedUserType="donor">
              <DashboardLayout
                userType="donor"
                userName={currentUser?.name || ""}
                userAvatar={currentUser?.avatar}
                currentPath={currentPath}
                onNavigate={handleNavigate}
              >
                <DonorSettings />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* College Routes */}
          <Route path="/college" element={
            <ProtectedRoute allowedUserType="college">
              <DashboardLayout
                userType="college"
                userName={currentUser?.name || ""}
                userAvatar={currentUser?.avatar}
                currentPath={currentPath}
                onNavigate={handleNavigate}
              >
                <CollegeDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/college/students" element={
            <ProtectedRoute allowedUserType="college">
              <DashboardLayout
                userType="college"
                userName={currentUser?.name || ""}
                userAvatar={currentUser?.avatar}
                currentPath={currentPath}
                onNavigate={handleNavigate}
              >
                <CollegeStudents />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/college/payments" element={
            <ProtectedRoute allowedUserType="college">
              <DashboardLayout
                userType="college"
                userName={currentUser?.name || ""}
                userAvatar={currentUser?.avatar}
                currentPath={currentPath}
                onNavigate={handleNavigate}
              >
                <CollegePaymentVerification />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/college/receipts" element={
            <ProtectedRoute allowedUserType="college">
              <DashboardLayout
                userType="college"
                userName={currentUser?.name || ""}
                userAvatar={currentUser?.avatar}
                currentPath={currentPath}
                onNavigate={handleNavigate}
              >
                <CollegeReceiptManagement />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/college/reports" element={
            <ProtectedRoute allowedUserType="college">
              <DashboardLayout
                userType="college"
                userName={currentUser?.name || ""}
                userAvatar={currentUser?.avatar}
                currentPath={currentPath}
                onNavigate={handleNavigate}
              >
                <CollegeReports />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/college/messages" element={
            <ProtectedRoute allowedUserType="college">
              <DashboardLayout
                userType="college"
                userName={currentUser?.name || ""}
                userAvatar={currentUser?.avatar}
                currentPath={currentPath}
                onNavigate={handleNavigate}
              >
                <CollegeMessages />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/college/notifications" element={
            <ProtectedRoute allowedUserType="college">
              <DashboardLayout
                userType="college"
                userName={currentUser?.name || ""}
                userAvatar={currentUser?.avatar}
                currentPath={currentPath}
                onNavigate={handleNavigate}
              >
                <CollegeNotifications />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/college/settings" element={
            <ProtectedRoute allowedUserType="college">
              <DashboardLayout
                userType="college"
                userName={currentUser?.name || ""}
                userAvatar={currentUser?.avatar}
                currentPath={currentPath}
                onNavigate={handleNavigate}
              >
                <CollegeProfile />
              </DashboardLayout>
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
