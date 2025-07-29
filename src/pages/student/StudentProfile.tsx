import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useStudent } from "@/contexts/StudentContext";

export default function StudentProfile() {
  const { status, profile } = useStudent();
  const navigate = useNavigate();

  // If no profile is submitted, redirect to home
  if (!profile?.submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">Profile Not Submitted</CardTitle>
            <p className="text-gray-600">You haven't submitted your profile yet. Please complete your profile first.</p>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/student')}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full min-h-[calc(100vh-4rem)] py-4 sm:py-6 md:py-8 px-2 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl space-y-6"
      >
        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              Profile Summary
              {status === 'Profile Under Verification' && (
                <Badge variant="secondary" className="text-sm">Pending Verification</Badge>
              )}
              {status !== 'Profile Under Verification' && status !== 'Profile Pending' && (
                <Badge variant="default" className="text-sm">Verified</Badge>
              )}
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              {status === 'Profile Under Verification' 
                ? 'Your submitted profile details (read-only) - Awaiting admin verification'
                : 'Your verified profile details (read-only)'
              }
            </p>
          </CardHeader>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-blue-600">Section 1: Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">First Name</label>
                <p className="text-gray-900 font-medium">{profile?.firstName || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Last Name</label>
                <p className="text-gray-900 font-medium">{profile?.lastName || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <p className="text-gray-900 font-medium">{profile?.gender || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="text-gray-900 font-medium">{profile?.dob || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Street Address</label>
                <p className="text-gray-900 font-medium">{profile?.street || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">City</label>
                <p className="text-gray-900 font-medium">{profile?.city || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">State</label>
                <p className="text-gray-900 font-medium">{profile?.state || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">PIN Code</label>
                <p className="text-gray-900 font-medium">{profile?.pinCode || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Mobile Number</label>
                <p className="text-gray-900 font-medium">{profile?.mobile || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email Address</label>
                <p className="text-gray-900 font-medium">{profile?.email || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Family Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-green-600">Section 2: Family Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Father's Name</label>
                <p className="text-gray-900 font-medium">{profile?.fatherName || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Father's Occupation</label>
                <p className="text-gray-900 font-medium">{profile?.fatherOccupation || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Mother's Name</label>
                <p className="text-gray-900 font-medium">{profile?.motherName || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Mother's Occupation</label>
                <p className="text-gray-900 font-medium">{profile?.motherOccupation || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Parents' Phone Number</label>
                <p className="text-gray-900 font-medium">{profile?.parentsPhone || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Family Annual Income</label>
                <p className="text-gray-900 font-medium">
                  {profile?.familyAnnualIncome ? `₹${profile.familyAnnualIncome.toLocaleString()}` : '-'}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Family Details</label>
                <p className="text-gray-900 font-medium">{profile?.familyDetails || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-purple-600">Section 3: Academic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Grade/Class</label>
                <p className="text-gray-900 font-medium">{profile?.grade || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Present Semester</label>
                <p className="text-gray-900 font-medium">{profile?.presentSemester || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Academic Year</label>
                <p className="text-gray-900 font-medium">{profile?.academicYear || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">College Name</label>
                <p className="text-gray-900 font-medium">{profile?.collegeName || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">College Phone</label>
                <p className="text-gray-900 font-medium">{profile?.collegePhone || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">College Email</label>
                <p className="text-gray-900 font-medium">{profile?.collegeEmail || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">College Website</label>
                <p className="text-gray-900 font-medium">{profile?.collegeWebsite || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Reference Person Name</label>
                <p className="text-gray-900 font-medium">{profile?.referencePersonName || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Reference Qualification</label>
                <p className="text-gray-900 font-medium">{profile?.referencePersonQualification || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Reference Position</label>
                <p className="text-gray-900 font-medium">{profile?.referencePersonPosition || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Total College Fees</label>
                <p className="text-gray-900 font-medium">
                  {profile?.totalCollegeFees ? `₹${profile.totalCollegeFees.toLocaleString()}` : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Scholarship Amount Required</label>
                <p className="text-gray-900 font-medium">
                  {profile?.scholarshipAmountRequired ? `₹${profile.scholarshipAmountRequired.toLocaleString()}` : '-'}
                </p>
              </div>
            </div>

            {/* Academic Marks */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Academic Marks</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">10th Standard</label>
                  <p className="text-gray-900 font-medium">{profile?.marks10th || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">12th Standard</label>
                  <p className="text-gray-900 font-medium">{profile?.marks12th || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Semester 1</label>
                  <p className="text-gray-900 font-medium">{profile?.marksSem1 || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Semester 2</label>
                  <p className="text-gray-900 font-medium">{profile?.marksSem2 || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Semester 3</label>
                  <p className="text-gray-900 font-medium">{profile?.marksSem3 || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Semester 4</label>
                  <p className="text-gray-900 font-medium">{profile?.marksSem4 || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Semester 5</label>
                  <p className="text-gray-900 font-medium">{profile?.marksSem5 || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Semester 6</label>
                  <p className="text-gray-900 font-medium">{profile?.marksSem6 || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Semester 7</label>
                  <p className="text-gray-900 font-medium">{profile?.marksSem7 || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Semester 8</label>
                  <p className="text-gray-900 font-medium">{profile?.marksSem8 || '-'}</p>
                </div>
              </div>
            </div>

            {/* Academic Status */}
            {profile?.arrears && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Academic Status</h4>
                <div>
                  <label className="text-sm font-medium text-gray-600">Any Arrears so far</label>
                  <p className="text-gray-900 font-medium capitalize">{profile.arrears}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submission Info */}
        {profile?.submittedAt && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Submitted on: {new Date(profile.submittedAt).toLocaleDateString()} at{' '}
                  {new Date(profile.submittedAt).toLocaleTimeString()}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate('/student')} variant="outline">
            Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}