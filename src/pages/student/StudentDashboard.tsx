import { useState } from "react";
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
import { getStatusDisplayNameSafe } from "@/utils/statusUtils";

function ApplyForNextModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [form, setForm] = useState({
    idNo: "LBFS856",
    phone: "9876543210",
    passed: "yes",
    marksheets: [] as File[],
  });
  const [status, setStatus] = useState("");
  const handleFile = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 5);
    if (arr.some(f => f.size > 10 * 1024 * 1024)) {
      setStatus("File too large (max 10MB)");
      setForm(f => ({ ...f, marksheets: [] }));
      return;
    }
    setForm(f => ({ ...f, marksheets: arr }));
    setStatus("");
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={onClose}>&times;</button>
        <div className="font-bold text-lg mb-4">Apply for Next</div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">ID No</label>
            <input className="w-full bg-gray-100 rounded px-3 py-2" value={form.idNo} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number<span className="text-red-500">*</span></label>
            <input className="w-full bg-gray-100 rounded px-3 py-2" value={form.phone} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Have you passed all Subjects with nil Arrears?<span className="text-red-500">*</span></label>
            <select className="w-full rounded px-3 py-2 border" value={form.passed} disabled>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Upload Last semester/Quarterly/Half yearly/Annual Exam mark sheet (max 5 files, each max 10MB)</label>
            <input type="file" multiple accept="application/pdf,image/*" className="w-full" onChange={e => handleFile(e.target.files)} />
            {status && <div className="text-xs text-red-500 mt-1">{status}</div>}
            {form.marksheets.length > 0 && <div className="text-xs text-green-600 mt-1">{form.marksheets.length} file(s) selected</div>}
          </div>
          <button type="button" className="w-full mt-4 bg-blue-600 text-white rounded py-2" onClick={onClose}>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default function StudentHome() {
  const { status, profile } = useStudent();
  const totalReceived = getTotalReceived();
  const lastReceived = getLastReceived();
  const navigate = useNavigate();

  // Get the current API status from the sync hook
  const { currentStatus: currentApiStatus } = useStudentStatusSync({
    autoSync: false,
    onStatusChange: () => {},
    onError: () => {},
  });

  // Get username from email/profile or first letter of name
  const getUsername = () => {
    if (profile?.email) {
      return profile.email.split('@')[0]; // Use email username
    } else if (profile?.firstName) {
      return profile.firstName.charAt(0).toUpperCase(); // First letter of name
    } else if (profile?.name) {
      return profile.name.charAt(0).toUpperCase(); // First letter of name
    }
    return 'User'; // Fallback
  };

  // Type guard function to check if status is a profile-related status
  const isProfileStatus = (status: number): boolean => {
    return status === StudentStatus.PERSONAL_DOCUMENTS_PENDING;
  };

  // List of statuses where payment stats should be shown (start at 'Paid' and all later statuses)
  const paymentStatsStatuses = [
    'Paid',
    'Academic results pending',
    'Academic verification pending',
    'Apply for Next',
    'Alumni',
    'Blocked',
  ];

  // Show payment stats if status is 'Paid' or later
  const showPaymentStats = paymentStatsStatuses.includes(status);

  // List of statuses that should show the main dashboard summary
  const dashboardSummaryStatuses = [
    'Paid',
    'Academic Documents Pending',
    'Academic verification pending',
    'Apply for Next',
    'Alumni',
  ];

  // Status-driven dashboard content
  const getStatusCard = () => {
    console.log('Current status:', status);
    console.log('Current API status:', currentApiStatus);
    
    // Handle status 0 (NEW_USER) and status 1 (PROFILE_UPDATE_PENDING) - Show form application
    if (currentApiStatus === StudentStatus.NEW_USER || currentApiStatus === StudentStatus.PROFILE_UPDATE_PENDING) {
      console.log('Status is NEW_USER (0) or PROFILE_UPDATE_PENDING (1), showing form application...');
      return (
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
      );
    }
    
    // Handle status 2 (PERSONAL_DOCUMENTS_PENDING) - Show completed form
    if (currentApiStatus === StudentStatus.PERSONAL_DOCUMENTS_PENDING) {
      console.log('Status is PERSONAL_DOCUMENTS_PENDING (2), showing completed form...');
      return (
        <Card className="mb-6 border-l-4 border-l-green-500">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Profile Submitted Successfully</CardTitle>
            <p className="text-muted-foreground mt-2">
              Your profile has been submitted and is pending verification. You can view your submitted details below.
            </p>
          </CardHeader>
          <CardContent>
            <SubmittedProfileDisplay />
          </CardContent>
        </Card>
      );
    }

    // Handle other statuses with existing logic
    // Always show form on home page if profile is not submitted or under verification
    if (!profile?.submitted || status === StudentStatus.PERSONAL_DOCUMENTS_PENDING) {
      return (
        <Card className="mb-6 border-l-4 border-l-blue-500">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
            <p className="text-muted-foreground mt-2">
              {!profile?.submitted 
                ? "Please fill out your profile details below to continue your scholarship application."
                : "Your profile has been submitted and is pending verification. You can view your submitted details below."
              }
            </p>
          </CardHeader>
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>
      );
    }

    // Profile pending verification status
    if (status === StudentStatus.PERSONAL_DOCUMENTS_PENDING) {
      console.log('Status is profile pending verification, showing verification pending card');
      return (
        <Card className="mb-6 border-l-4 border-l-yellow-500">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">Profile Verification Pending</CardTitle>
            <p className="text-muted-foreground mt-2">Your profile has been submitted and is under verification by admin. You can view your submitted profile details below.</p>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate('/student/profile')} variant="outline">View Profile</Button>
          </CardContent>
        </Card>
      );
    }



    // Schedule Interview status
    if (status === StudentStatus.INTERVIEW_SCHEDULED) {
      return (
        <Card className="mb-6 border-l-4 border-l-blue-500">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Interview Scheduled</CardTitle>
            <p className="text-muted-foreground mt-2">Your interview has been scheduled on <span className="font-semibold text-blue-600">15th January 2024 at 10:00 AM</span> at <span className="font-semibold text-blue-600">Main Campus, Room 205</span>.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Interview Details:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">Date:</span> 15th January 2024</div>
                  <div><span className="font-medium">Time:</span> 10:00 AM</div>
                  <div><span className="font-medium">Location:</span> Main Campus, Room 205</div>
                  <div><span className="font-medium">Interviewer:</span> Dr. Sarah Johnson</div>
                  <div><span className="font-medium">Duration:</span> 30 minutes</div>
                  <div><span className="font-medium">Notes:</span> Please bring all required documents and arrive 15 minutes early</div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Required Documents:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Original ID proof (Aadhar Card/Passport)</li>
                  <li>• All academic certificates and mark sheets</li>
                  <li>• Income certificate of parents</li>
                  <li>• Caste certificate (if applicable)</li>
                  <li>• Domicile certificate</li>
                  <li>• Passport size photographs (2 copies)</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Important Instructions:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Please arrive 15 minutes before the scheduled time</li>
                  <li>• Dress formally and professionally</li>
                  <li>• Bring all required documents in original</li>
                  <li>• Be prepared to discuss your academic background and financial need</li>
                  <li>• Mobile phones should be switched off during the interview</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate('/student/profile')} variant="outline">View Profile</Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Documents pending status
    if (status === StudentStatus.PERSONAL_DOCUMENTS_PENDING || status === StudentStatus.PERSONAL_DOCUMENTS_SUBMITTED) {
      return (
        <Card className="mb-6 border-l-4 border-l-blue-500">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Documents Upload Required</CardTitle>
            <p className="text-muted-foreground mt-2">Please upload your personal documents and academic documents to proceed with your application.</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold text-lg mb-2">Personal Documents</h3>
                <p className="text-sm text-muted-foreground mb-4">Upload your personal and financial documents</p>
                <Button onClick={() => navigate('/student/documents')} className="w-full">
                  Upload Personal Documents
                </Button>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold text-lg mb-2">Academic Documents</h3>
                <p className="text-sm text-muted-foreground mb-4">Upload your educational certificates and marksheets</p>
                <Button onClick={() => navigate('/student/academic-documents')} variant="outline" className="w-full">
                  Upload Academic Documents
                </Button>
              </Card>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Documents verification pending
    if (status === StudentStatus.PERSONAL_DOCUMENTS_SUBMITTED) {
      return (
        <Card className="mb-6 border-l-4 border-l-yellow-500">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Documents Under Review</CardTitle>
            <p className="text-muted-foreground mt-2">Your documents have been submitted and are currently under verification. You can view your submitted documents anytime.</p>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => navigate('/student/documents')}>
              View Personal Documents
            </Button>
            <Button variant="outline" onClick={() => navigate('/student/academic-documents')}>
              View Academic Documents
            </Button>
          </CardContent>
        </Card>
      );
    }

    // Eligible for scholarship
    if (status === StudentStatus.ELIGIBLE_FOR_SCHOLARSHIP) {
      return (
        <Card className="mb-6 border-l-4 border-l-green-500">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Eligible for Scholarship</CardTitle>
            <p className="text-green-700 font-semibold mt-2">You are eligible for the scholarship. Wait for the payment to start.</p>
          </CardHeader>
        </Card>
      );
    }

    // Payment pending/paid
    if (status === StudentStatus.PAYMENT_PENDING || status === StudentStatus.PAID) {
      return (
        <Card className="mb-6 border-l-4 border-l-green-500">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Payment Status</CardTitle>
            <p className="text-green-700 font-semibold mt-2">
              Payment Amount: ₹{totalReceived.toLocaleString()} | Total Received: ₹{totalReceived.toLocaleString()}
            </p>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate('/student/payment-history')}>
              Upload Receipt
            </Button>
          </CardContent>
        </Card>
      );
    }

    // Academic documents pending (merged with results pending)
    if (status === StudentStatus.ACADEMIC_DOCUMENTS_PENDING || status === StudentStatus.ACADEMIC_DOCUMENTS_SUBMITTED) {
      return (
        <Card className="mb-6 border-l-4 border-l-blue-500">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Academic Documents Pending</CardTitle>
            <p className="text-muted-foreground mt-2">Please upload your current semester/year marksheets.</p>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate('/student/academic-documents')}>
              Upload Academic Documents
            </Button>
          </CardContent>
        </Card>
      );
    }

    // Alumni status
    if (status === StudentStatus.ALUMNI) {
      return (
        <Card className="mb-6 border-l-4 border-l-green-500">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Alumni</CardTitle>
            <p className="text-green-700 font-semibold mt-2">Congratulations on completing your scholarship journey!</p>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate('/student/apply-next')}>
              Apply for Scholarship
            </Button>
          </CardContent>
        </Card>
      );
    }

    // Future Ready Module status
    if (status === 'Future Ready Module') {
      return (
        <Card className="mb-6 border-l-4 border-l-purple-500">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">Future Ready Module</CardTitle>
            <p className="text-muted-foreground mt-2">Please complete your future ready module to finalize your scholarship journey.</p>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate('/student/future-ready-module')} variant="outline">Complete Future Ready Module</Button>
          </CardContent>
        </Card>
      );
    }

    // Default case
    return (
      <Card className="mb-6 border-l-4 border-l-gray-500">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <p className="text-muted-foreground mt-2">Check your application status and continue your scholarship journey.</p>
        </CardHeader>
        {isProfileStatus(status) && !profile?.submitted && (
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate('/student/profile')}>Update Profile</Button>
          </CardContent>
        )}
        {isProfileStatus(status) && profile?.submitted && (
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate('/student/profile')} variant="outline">View Profile</Button>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[calc(100vh-4rem)] py-4 sm:py-6 md:py-8 px-2 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl"
      >
        {/* Application Status Card - Always First */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Application Status</h2>
                  <p className="text-muted-foreground">Current progress of your scholarship application</p>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {getStatusDisplayNameSafe(status)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Card - Second */}
        <div className="mb-8">
          {getStatusCard()}
        </div>

        {/* Profile Summary Card - Show when profile is submitted and verified */}
        {(status === StudentStatus.PERSONAL_DOCUMENTS_PENDING || status === StudentStatus.INTERVIEW_SCHEDULED || status === StudentStatus.PERSONAL_DOCUMENTS_PENDING || status === StudentStatus.PERSONAL_DOCUMENTS_SUBMITTED || status === StudentStatus.ELIGIBLE_FOR_SCHOLARSHIP || status === StudentStatus.PAYMENT_PENDING || status === StudentStatus.PAID || status === StudentStatus.ACADEMIC_DOCUMENTS_PENDING || status === StudentStatus.ACADEMIC_DOCUMENTS_SUBMITTED || status === StudentStatus.ALUMNI) && profile?.submitted && (
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  {status === StudentStatus.PERSONAL_DOCUMENTS_PENDING ? 'Submitted Profile Summary (Pending Verification)' : 'Profile Summary'}
                </CardTitle>
                <p className="text-muted-foreground">
                  {status === StudentStatus.PERSONAL_DOCUMENTS_PENDING 
                    ? 'Your submitted profile details (read-only) - Awaiting admin verification'
                    : 'Your verified profile details (read-only)'
                  }
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Section 1: Personal Information */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3 text-blue-600">Section 1: Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><b>First Name:</b> {profile?.firstName || '-'}</div>
                      <div><b>Last Name:</b> {profile?.lastName || '-'}</div>
                      <div><b>Gender:</b> {profile?.gender || '-'}</div>
                      <div><b>Date of Birth:</b> {profile?.dob || '-'}</div>
                      <div><b>Street:</b> {profile?.street || '-'}</div>
                      <div><b>City:</b> {profile?.city || '-'}</div>
                      <div><b>State:</b> {profile?.state || '-'}</div>
                      <div><b>Pin Code:</b> {profile?.pinCode || '-'}</div>
                      <div><b>Mobile:</b> {profile?.mobile || '-'}</div>
                      <div><b>Email:</b> {profile?.email || '-'}</div>
                    </div>
                  </div>

                  {/* Section 2: Academic & Family Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-green-600">Section 2: Academic & Family Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><b>Grade:</b> {profile?.grade || '-'}</div>
                      <div><b>Present Semester:</b> {profile?.presentSemester || '-'}</div>
                      <div><b>Academic Year:</b> {profile?.academicYear || '-'}</div>
                      <div><b>College Name:</b> {profile?.collegeName || '-'}</div>
                      <div><b>College Phone:</b> {profile?.collegePhone || '-'}</div>
                      <div><b>College Email:</b> {profile?.collegeEmail || '-'}</div>
                      <div><b>College Address:</b> {profile?.collegeAddress || '-'}</div>
                      <div><b>College Website:</b> {profile?.collegeWebsite || '-'}</div>
                      <div><b>Reference Person Name:</b> {profile?.referencePersonName || '-'}</div>
                      <div><b>Reference Qualification:</b> {profile?.referencePersonQualification || '-'}</div>
                      <div><b>Reference Position:</b> {profile?.referencePersonPosition || '-'}</div>
                      <div><b>Father's Name:</b> {profile?.fatherName || '-'}</div>
                      <div><b>Father's Occupation:</b> {profile?.fatherOccupation || '-'}</div>
                      <div><b>Mother's Name:</b> {profile?.motherName || '-'}</div>
                      <div><b>Mother's Occupation:</b> {profile?.motherOccupation || '-'}</div>
                      <div><b>Parents Phone:</b> {profile?.parentsPhone || '-'}</div>
                      <div><b>Family Details:</b> {profile?.familyDetails || '-'}</div>
                      <div><b>Family Annual Income:</b> {profile?.familyAnnualIncome ? `₹${profile.familyAnnualIncome.toLocaleString()}` : '-'}</div>
                      <div><b>Total College Fees:</b> {profile?.totalCollegeFees ? `₹${profile.totalCollegeFees.toLocaleString()}` : '-'}</div>
                      <div><b>Scholarship Amount Required:</b> {profile?.scholarshipAmountRequired ? `₹${profile.scholarshipAmountRequired.toLocaleString()}` : '-'}</div>
                    </div>

                    {/* Academic Marks */}
                    <div className="mt-4">
                      <h4 className="text-md font-semibold mb-3 text-gray-700">Academic Marks</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div><b>10th Standard:</b> {profile?.marks10th || '-'}</div>
                        <div><b>12th Standard:</b> {profile?.marks12th || '-'}</div>
                        <div><b>Semester 1:</b> {profile?.marksSem1 || '-'}</div>
                        <div><b>Semester 2:</b> {profile?.marksSem2 || '-'}</div>
                        <div><b>Semester 3:</b> {profile?.marksSem3 || '-'}</div>
                        <div><b>Semester 4:</b> {profile?.marksSem4 || '-'}</div>
                        <div><b>Semester 5:</b> {profile?.marksSem5 || '-'}</div>
                        <div><b>Semester 6:</b> {profile?.marksSem6 || '-'}</div>
                        <div><b>Semester 7:</b> {profile?.marksSem7 || '-'}</div>
                        <div><b>Semester 8:</b> {profile?.marksSem8 || '-'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {profile?.submittedAt && (
                  <div className="mt-6 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Submitted on: {new Date(profile.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Future Ready Module Summary Card - Show when submitted */}
        {profile?.futureReadyModule && (
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Future Ready Module Summary</CardTitle>
                <p className="text-muted-foreground">Your submitted future ready module details</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><b>Student Name:</b> {profile.futureReadyModule.studentName}</div>
                  <div><b>Student ID:</b> {profile.futureReadyModule.studentId}</div>
                  <div><b>Phone:</b> {profile.futureReadyModule.phone}</div>
                  <div><b>Email:</b> {profile.futureReadyModule.email}</div>
                  <div><b>College Name:</b> {profile.futureReadyModule.collegeName}</div>
                  <div><b>Future Ready Date:</b> {profile.futureReadyModule.futureReadyDate}</div>
                  <div className="md:col-span-2"><b>Remarks:</b> {profile.futureReadyModule.remarks}</div>
                </div>
                {profile.futureReadyModule.submittedAt && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Submitted on: {new Date(profile.futureReadyModule.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Additional Cards - Only show after Application Status card */}
        <div className="space-y-6">
          {/* Stats Cards - only show payment details if showPaymentStats is true */}
          {showPaymentStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Received</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-700">₹{totalReceived.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Last Received</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold text-green-600">{lastReceived ? `₹${lastReceived.amount.toLocaleString()} (${lastReceived.date})` : '-'}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Apply for Next Card: Only show if status is alumni */}
          {status === 'alumni' && (
            <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/student/apply-next')}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">Apply for Next Scholarship</div>
                  <div className="text-sm text-muted-foreground">Fill the form to apply for the next scholarship period.</div>
                </div>
                <Button>Apply</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>
    </div>
  )
}