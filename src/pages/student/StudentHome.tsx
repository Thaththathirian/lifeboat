import { useState, useEffect } from "react";
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTotalReceived, getLastReceived } from "./StudentPayments"
import { useNavigate } from "react-router-dom";
import { useStudent } from "@/contexts/StudentContext";
import { useStudentStatus } from '@/components/layout/StudentStatusProvider';
import { useStudentStatusSync } from '@/hooks/useStudentStatusSync';
import { StudentStatus } from '@/types/student';
import { useToast } from "@/hooks/use-toast";
import ProfileForm from "@/components/ProfileForm";
import SubmittedProfileDisplay from "@/components/SubmittedProfileDisplay";
import SubmittedDocumentsDisplay from "@/components/SubmittedDocumentsDisplay";

export default function StudentHome() {
  const { profile } = useStudent();
  const { status } = useStudentStatus();
  const totalReceived = getTotalReceived();
  const lastReceived = getLastReceived();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get the current API status from the sync hook
  const { currentStatus: currentApiStatus } = useStudentStatusSync({
    autoSync: false,
    onStatusChange: () => {},
    onError: () => {},
  });

  // Debug logging
  useEffect(() => {
    console.log('StudentHome Debug:', {
      profile: profile,
      status: status,
      currentApiStatus: currentApiStatus,
      profileSubmitted: profile?.submitted
    });
  }, [profile, status, currentApiStatus]);

  // If profile is not submitted, show the profile form (this is the correct flow)
  if (!profile?.submitted) {
    console.log('Showing ProfileForm - profile not submitted');
    return (
      <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] py-4 sm:py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl"
        >
          <Card className="mb-6 border-l-4 border-l-blue-500">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
              <p className="text-muted-foreground mt-2">
                Please fill out your profile details below to continue your scholarship application.
              </p>
            </CardHeader>
            <CardContent>
              <ProfileForm />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // If profile is submitted and status is PERSONAL_DOCUMENTS_PENDING, redirect to personal documents
  if (profile?.submitted && (currentApiStatus === StudentStatus.PERSONAL_DOCUMENTS_PENDING || status === StudentStatus.PERSONAL_DOCUMENTS_PENDING)) {
    console.log('Profile submitted and status is PERSONAL_DOCUMENTS_PENDING, redirecting to personal documents...');
    navigate('/student/personal-documents');
    return null;
  }

  // If profile is submitted and documents are pending verification, show waiting message
  if (status === StudentStatus.PERSONAL_DOCUMENTS_SUBMITTED || currentApiStatus === StudentStatus.PERSONAL_DOCUMENTS_SUBMITTED) {
    console.log('Documents submitted, showing waiting for approval...');
    return (
      <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] py-4 sm:py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl"
        >
          <Card className="mb-6 border-l-4 border-l-yellow-500">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Application Under Review</CardTitle>
              <p className="text-muted-foreground mt-2">
                Your application has been submitted and is currently under review. We will notify you once a decision has been made.
              </p>
            </CardHeader>
                         <CardContent>
               <div className="text-center text-lg font-semibold text-yellow-700 mb-4">
                 Thank you for your patience!
               </div>
               <SubmittedProfileDisplay />
               <div className="mt-6">
                 <SubmittedDocumentsDisplay />
               </div>
             </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // For all other statuses, show the submitted profile
  console.log('Showing submitted profile for status:', status);
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] py-4 sm:py-6 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <Card className="mb-6 border-l-4 border-l-green-500">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Application Status</CardTitle>
            <p className="text-muted-foreground mt-2">
              Your application is in progress. You can view your submitted details below.
            </p>
          </CardHeader>
                     <CardContent>
             <SubmittedProfileDisplay />
             <div className="mt-6">
               <SubmittedDocumentsDisplay />
             </div>
           </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}