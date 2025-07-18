import { useStudent } from "@/contexts/StudentContext";
import { Routes, Route } from "react-router-dom";
import { StudentHeader } from "@/components/StudentHeader";
import StudentLogin from "./StudentLogin";
import StudentProfile from "./StudentProfile";
import StudentDashboard from "./StudentDashboard";
import StudentPaymentHistory from "./StudentPaymentHistory";
import StudentActivities from "./StudentActivities";
import StudentMessagesPage from "./StudentMessagesPage";
import StudentDocuments from "./StudentDocuments";
import StudentAcademicDocuments from "./StudentAcademicDocuments";
import ApplyForNext from "./ApplyForNext";
import FutureReadyModule from "./FutureReadyModule";

export default function StudentMain() {
  const { status } = useStudent();

  // If not logged in, show login page
  if (status === 'login') {
    return <StudentLogin />;
  }

  // For logged in users, show the portal with header and routing
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <StudentHeader />
      
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/payment-history" element={<StudentPaymentHistory />} />
          <Route path="/activities" element={<StudentActivities />} />
          <Route path="/messages" element={<StudentMessagesPage />} />
          <Route path="/documents" element={<StudentDocuments />} />
          <Route path="/academic-documents" element={<StudentAcademicDocuments />} />
          <Route path="/apply-next" element={<ApplyForNext />} />
          <Route path="/future-ready-module" element={<FutureReadyModule />} />
        </Routes>
      </div>
    </div>
  );
}