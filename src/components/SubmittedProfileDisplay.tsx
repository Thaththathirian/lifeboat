import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStudent } from "@/contexts/StudentContext";
import { useEffect, useState, useCallback } from "react";
import { getSubmittedProfileData, getPersonalDetails, getFamilyDetails, getAcademicDetails } from "@/utils/backendService";
import { StudentStatus } from "@/types/student";
import { Loader2 } from "lucide-react";
import { useStudentStatus } from "@/components/layout/StudentStatusProvider";

interface Mark {
  exam_name: string;
  marks: string;
  year: string;
}

interface CollegeHistory {
  college_name: string;
  year: string;
  details: string;
}

interface FamilyInfo {
  father_name: string | null;
  father_occupation: string | null;
  mother_name: string | null;
  mother_occupation: string | null;
  parents_phone: string | null;
  family_details: string | null;
  family_anuual_income: string | null;
}

interface SubmittedProfileData {
  student_id: string;
  first_name: string;
  last_name: string | null;
  mobile: string;
  email: string;
  picture: string;
  gender: string | null;
  dob: string | null;
  street: string | null;
  city: string | null;
  district: string | null;
  pincode: string | null;
  present_grade: string | null;
  present_semester: string | null;
  present_academic_year: string | null;
  total_college_fees: string | null;
  status: string;
  scholarship_amount_required: string | null;
  created_at: string;
  college_name: string | null;
  family_info: FamilyInfo;
  marks: Mark[];
  college_history: CollegeHistory[];
}

interface PersonalDetails {
  firstName: string;
  gender: string;
  dob: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  mobile: string;
}

interface FamilyDetails {
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  parentsPhone: string;
  familyDetails: string;
  familyAnnualIncome: string;
}

interface AcademicDetails {
  grade: string;
  presentSemester: string;
  academicYear: string;
  collegeName: string;
  totalCollegeFees: string;
  scholarshipAmountRequired: string;
}

interface SubmittedProfileDisplayProps {
  onIncompleteProfile?: (sections?: string[]) => void;
}

export default function SubmittedProfileDisplay({ onIncompleteProfile }: SubmittedProfileDisplayProps) {
  const { status, setStatus } = useStudent();
  const { currentApiStatus, loading: statusLoading, error: statusError } = useStudentStatus();
  const [submittedData, setSubmittedData] = useState<SubmittedProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [incompleteSections, setIncompleteSections] = useState<string[]>([]);

  // Function to check if required fields are null/missing
  const checkProfileCompleteness = (data: SubmittedProfileData): boolean => {
    const requiredFields = [
      data.gender,
      data.dob,
      data.street,
      data.city,
      data.district,
      data.pincode,
      data.present_grade,
      data.present_semester,
      data.present_academic_year,
      data.total_college_fees,
      data.scholarship_amount_required,
      data.college_name,
      data.family_info?.father_name,
      data.family_info?.father_occupation,
      data.family_info?.mother_name,
      data.family_info?.mother_occupation,
      data.family_info?.parents_phone,
      data.family_info?.family_details,
      data.family_info?.family_anuual_income
    ];

    // Check if any required field is null, undefined, empty string, or string "null"
    const hasNullFields = requiredFields.some(field => 
      field === null || field === undefined || field === '' || field === 'null'
    );

    console.log('Profile completeness check details:');
    console.log('Required fields:', {
      gender: data.gender,
      dob: data.dob,
      street: data.street,
      city: data.city,
      district: data.district,
      pincode: data.pincode,
      present_grade: data.present_grade,
      present_semester: data.present_semester,
      present_academic_year: data.present_academic_year,
      total_college_fees: data.total_college_fees,
      scholarship_amount_required: data.scholarship_amount_required,
      college_name: data.college_name,
      father_name: data.family_info?.father_name,
      father_occupation: data.family_info?.father_occupation,
      mother_name: data.family_info?.mother_name,
      mother_occupation: data.family_info?.mother_occupation,
      parents_phone: data.family_info?.parents_phone,
      family_details: data.family_info?.family_details,
      family_annual_income: data.family_info?.family_anuual_income
    });
    console.log('Has null fields:', hasNullFields);

    return !hasNullFields;
  };

  // Helper functions to check if individual sections are incomplete
  const hasIncompletePersonalDetails = (details: PersonalDetails): boolean => {
    const requiredFields = [
      details.firstName,
      details.gender,
      details.dob,
      details.street,
      details.city,
      details.state,
      details.pinCode,
      details.mobile
    ];
    return requiredFields.some(field => 
      !field || field === null || field === undefined || field === '' || field === 'null'
    );
  };

  const hasIncompleteFamilyDetails = (details: FamilyDetails): boolean => {
    const requiredFields = [
      details.fatherName,
      details.fatherOccupation,
      details.motherName,
      details.motherOccupation,
      details.parentsPhone,
      details.familyDetails,
      details.familyAnnualIncome
    ];
    return requiredFields.some(field => 
      !field || field === null || field === undefined || field === '' || field === 'null'
    );
  };

  const hasIncompleteAcademicDetails = (details: AcademicDetails): boolean => {
    const requiredFields = [
      details.grade,
      details.presentSemester,
      details.academicYear,
      details.collegeName,
      details.totalCollegeFees,
      details.scholarshipAmountRequired
    ];
    return requiredFields.some(field => 
      !field || field === null || field === undefined || field === '' || field === 'null'
    );
  };

  // Function to check individual sections
  const checkIndividualSections = useCallback(async () => {
    const sections: string[] = [];
    
    try {
      // Check Personal Details
      console.log('Checking personal details...');
      const personalDetails = await getPersonalDetails();
      if (!personalDetails || hasIncompletePersonalDetails(personalDetails)) {
        sections.push('Personal Details');
        console.log('Personal details are incomplete');
      } else {
        console.log('Personal details are complete');
      }

      // Check Family Details
      console.log('Checking family details...');
      const familyDetails = await getFamilyDetails();
      if (!familyDetails || hasIncompleteFamilyDetails(familyDetails)) {
        sections.push('Family Details');
        console.log('Family details are incomplete');
      } else {
        console.log('Family details are complete');
      }

      // Check Academic Details
      console.log('Checking academic details...');
      const academicDetails = await getAcademicDetails();
      if (!academicDetails || hasIncompleteAcademicDetails(academicDetails)) {
        sections.push('Academic Details');
        console.log('Academic details are incomplete');
      } else {
        console.log('Academic details are complete');
      }

      setIncompleteSections(sections);
      console.log('Incomplete sections:', sections);
      
      return sections.length > 0;
    } catch (error) {
      console.error('Error checking individual sections:', error);
      return true; // Assume incomplete if there's an error
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the current API status from the context
        const studentStatus = currentApiStatus;
        console.log('Current student status from API:', studentStatus);
        
        if (studentStatus === null) {
          console.log('No status available yet, waiting...');
          return;
        }
        
        if (studentStatus === StudentStatus.MOBILE_VERIFIED) {
          // Status 1: User only updated OTP - always show form filling page
          console.log('Status is MOBILE_VERIFIED (1), showing form filling page...');
          const hasIncompleteSections = await checkIndividualSections();
          
          // For status 1, always show the form filling page
          if (onIncompleteProfile) {
            console.log('Status 1: Always showing form filling page');
            onIncompleteProfile(hasIncompleteSections ? incompleteSections : []);
            return;
          }
        } else if (studentStatus === StudentStatus.PROFILE_UPDATED) {
          // Status 2: User submitted profile - ONLY call get_submitted_profile
          console.log('Status is PROFILE_UPDATED (2), fetching submitted profile...');
          const data = await getSubmittedProfileData();
          
          if (data) {
            console.log('Received submitted profile data:', data);
            setSubmittedData(data as unknown as SubmittedProfileData);
            
            // Check if profile is complete using the submitted data
            const isComplete = checkProfileCompleteness(data as unknown as SubmittedProfileData);
            console.log('Profile completeness check:', isComplete);
            
            if (!isComplete && onIncompleteProfile) {
              console.log('Profile is incomplete, calling onIncompleteProfile callback');
              onIncompleteProfile(['Profile Incomplete']);
              return;
            } else if (!isComplete) {
              console.log('Profile is incomplete but no callback provided');
            } else {
              console.log('Profile is complete, showing submitted profile display');
            }
          } else {
            console.log('No submitted profile data found');
            setError('No submitted profile data found');
          }
        } else if (studentStatus === StudentStatus.NEW_USER) {
          // Status 0: New user - needs mobile verification
          console.log('Status is NEW_USER (0), user needs mobile verification');
          setError('Mobile verification required. Please verify your mobile number to continue.');
        } else {
          console.log('Status not handled:', studentStatus);
          setError('Status not supported');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'Profile Pending' && currentApiStatus !== null) {
      fetchData();
    }
  }, [status, currentApiStatus, onIncompleteProfile, setStatus, checkIndividualSections, incompleteSections]);

  if (status !== 'Profile Pending') {
    return null;
  }

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
          <CardTitle className="text-xl text-blue-600">Loading Profile Data</CardTitle>
          <p className="text-muted-foreground mt-2">
            {currentApiStatus === StudentStatus.NEW_USER && "Checking mobile verification status..."}
            {currentApiStatus === StudentStatus.MOBILE_VERIFIED && "Loading profile form..."}
            {currentApiStatus === StudentStatus.PROFILE_UPDATED && "Loading submitted profile..."}
            {currentApiStatus === StudentStatus.INTERVIEW_SCHEDULED && "Loading interview details..."}
            {currentApiStatus === StudentStatus.DOCUMENT_UPLOADED && "Loading document status..."}
            {!currentApiStatus && "Checking your application status..."}
          </p>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-6 border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="text-xl text-red-600">Profile Data Unavailable</CardTitle>
          <p className="text-muted-foreground">{error}</p>
        </CardHeader>
      </Card>
    );
  }

  // Don't render if profile is incomplete (callback should have been called)
  if (submittedData && !checkProfileCompleteness(submittedData)) {
    return null;
  }

  // Only render if we have submitted data (status 2)
  if (!submittedData) {
    return null;
  }

  return (
    <Card className="mb-6 border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="text-xl text-blue-600 flex items-center gap-2">
          Submitted Profile Summary
          <Badge variant="secondary">Pending Verification</Badge>
        </CardTitle>
        <p className="text-muted-foreground">
          Your submitted profile details (read-only) - Awaiting admin verification
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Section 1: Personal Information */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3 text-blue-600">Section 1: Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><b>Student ID:</b> {submittedData.student_id || '-'}</div>
            <div><b>First Name:</b> {submittedData.first_name || '-'}</div>
            <div><b>Last Name:</b> {submittedData.last_name || '-'}</div>
            <div><b>Gender:</b> {submittedData.gender || '-'}</div>
            <div><b>Date of Birth:</b> {submittedData.dob || '-'}</div>
            <div><b>Street:</b> {submittedData.street || '-'}</div>
            <div><b>City:</b> {submittedData.city || '-'}</div>
            <div><b>District:</b> {submittedData.district || '-'}</div>
            <div><b>Pin Code:</b> {submittedData.pincode || '-'}</div>
            <div><b>Mobile:</b> {submittedData.mobile || '-'}</div>
            <div><b>Email:</b> {submittedData.email || '-'}</div>
            <div><b>Profile Picture:</b> {submittedData.picture ? 'Available' : 'Not provided'}</div>
            <div><b>Created At:</b> {submittedData.created_at ? new Date(submittedData.created_at).toLocaleDateString() : '-'}</div>
          </div>
        </div>

        {/* Section 2: Academic & Family Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-green-600">Section 2: Academic & Family Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Academic Details */}
            <div><b>Present Grade:</b> {submittedData.present_grade || '-'}</div>
            <div><b>Present Semester:</b> {submittedData.present_semester || '-'}</div>
            <div><b>Academic Year:</b> {submittedData.present_academic_year || '-'}</div>
            <div><b>College Name:</b> {submittedData.college_name || '-'}</div>
            <div><b>Total College Fees:</b> {submittedData.total_college_fees ? `₹${submittedData.total_college_fees.toLocaleString()}` : '-'}</div>
            <div><b>Scholarship Amount Required:</b> {submittedData.scholarship_amount_required ? `₹${submittedData.scholarship_amount_required.toLocaleString()}` : '-'}</div>
            <div><b>Status:</b> {submittedData.status || '-'}</div>

            {/* Family Details */}
            <div><b>Father's Name:</b> {submittedData.family_info?.father_name || '-'}</div>
            <div><b>Father's Occupation:</b> {submittedData.family_info?.father_occupation || '-'}</div>
            <div><b>Mother's Name:</b> {submittedData.family_info?.mother_name || '-'}</div>
            <div><b>Mother's Occupation:</b> {submittedData.family_info?.mother_occupation || '-'}</div>
            <div><b>Parents Phone:</b> {submittedData.family_info?.parents_phone || '-'}</div>
            <div><b>Family Details:</b> {submittedData.family_info?.family_details || '-'}</div>
            <div><b>Family Annual Income:</b> {submittedData.family_info?.family_anuual_income ? `₹${submittedData.family_info.family_anuual_income.toLocaleString()}` : '-'}</div>
          </div>

          {/* Academic Marks */}
          {submittedData.marks && submittedData.marks.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-semibold mb-3 text-gray-700">Academic Marks</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {submittedData.marks.map((mark, index) => (
                  <div key={index} className="border p-3 rounded">
                    <div><b>Exam:</b> {mark.exam_name || 'N/A'}</div>
                    <div><b>Marks:</b> {mark.marks || 'N/A'}</div>
                    <div><b>Year:</b> {mark.year || 'N/A'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* College History */}
          {submittedData.college_history && submittedData.college_history.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-semibold mb-3 text-gray-700">College History</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {submittedData.college_history.map((college, index) => (
                  <div key={index} className="border p-3 rounded">
                    <div><b>College:</b> {college.college_name || 'N/A'}</div>
                    <div><b>Year:</b> {college.year || 'N/A'}</div>
                    <div><b>Details:</b> {college.details || 'N/A'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 