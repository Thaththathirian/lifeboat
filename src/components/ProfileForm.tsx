import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudent } from "@/contexts/StudentContext";
import { useStudentStatus } from '@/components/layout/StudentStatusProvider';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { saveProfileDraft, getProfileDraft } from "@/utils/backendService";

export default function ProfileForm() {
  const { profile, setProfile } = useStudent();
  const { setStatus } = useStudentStatus();
  const { toast } = useToast();

  // Current step state
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    gender: profile?.gender || "",
    dob: profile?.dob || "",
    street: profile?.street || "",
    city: profile?.city || "",
    state: profile?.state || "",
    pinCode: profile?.pinCode || "",
    mobile: profile?.mobile || "",
    email: profile?.email || "",
    
    // Family Details
    fatherName: profile?.fatherName || "",
    fatherOccupation: profile?.fatherOccupation || "",
    motherName: profile?.motherName || "",
    motherOccupation: profile?.motherOccupation || "",
    parentsPhone: profile?.parentsPhone || "",
    familyDetails: profile?.familyDetails || "",
    familyAnnualIncome: profile?.familyAnnualIncome || "",
    
    // Academic Details
    grade: profile?.grade || "",
    presentSemester: profile?.presentSemester || "",
    academicYear: profile?.academicYear || "",
    collegeName: profile?.collegeName || "",
    collegePhone: profile?.collegePhone || "",
    collegeEmail: profile?.collegeEmail || "",
    collegeWebsite: profile?.collegeWebsite || "",
    referencePersonName: profile?.referencePersonName || "",
    referencePersonQualification: profile?.referencePersonQualification || "",
    referencePersonPosition: profile?.referencePersonPosition || "",
    totalCollegeFees: profile?.totalCollegeFees || "",
    scholarshipAmountRequired: profile?.scholarshipAmountRequired || "",
    marks10th: profile?.marks10th || "",
    marks12th: profile?.marks12th || "",
    marksSem1: profile?.marksSem1 || "",
    marksSem2: profile?.marksSem2 || "",
    marksSem3: profile?.marksSem3 || "",
    marksSem4: profile?.marksSem4 || "",
    marksSem5: profile?.marksSem5 || "",
    marksSem6: profile?.marksSem6 || "",
    marksSem7: profile?.marksSem7 || "",
    marksSem8: profile?.marksSem8 || "",
    declaration: profile?.declaration || false,
    arrears: profile?.arrears || '',
    awareness: profile?.awareness || false,
  });

  const [otherCollege, setOtherCollege] = useState("");

  // Load draft data when component mounts
  useEffect(() => {
    const loadDraftData = async () => {
      try {
        // Only try to load draft data if user is authenticated
        if (!isAuthenticated()) {
          console.log('User not authenticated, skipping draft load');
          return;
        }
        
        const draftData = await getProfileDraft();
        if (draftData) {
          setFormData(draftData.formData);
          setCurrentStep(draftData.currentStep);
        }
      } catch (error) {
        console.error('Error loading draft data:', error);
        // Don't show error toast for draft loading to avoid spam
        // Just log the error and continue with empty form
      } finally {
        setIsLoading(false);
      }
    };

    loadDraftData();
  }, []);

  // Validation patterns
  const patterns = {
    name: /^[A-Za-z\s]+$/, // Only letters and spaces
    mobile: /^\d{10}$/, // Exactly 10 digits
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email format
    pinCode: /^\d{6}$/, // Exactly 6 digits
    amount: /^\d+$/, // Only numbers
    marks: /^\d{1,3}(\.\d{1,2})?$/, // Numbers with optional decimal (1-3 digits before decimal, 1-2 after)
  };

  // Input event handlers to prevent invalid characters
  const handleNameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const char = String.fromCharCode(e.which);
    if (!/[A-Za-z\s]/.test(char)) {
      e.preventDefault();
    }
  };

  const handleNumberKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const char = String.fromCharCode(e.which);
    if (!/\d/.test(char)) {
      e.preventDefault();
    }
  };

  const handleMobileKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const char = String.fromCharCode(e.which);
    if (!/\d/.test(char)) {
      e.preventDefault();
    }
    // Prevent more than 10 digits
    if (e.currentTarget.value.length >= 10 && e.which !== 8) { // 8 is backspace
      e.preventDefault();
    }
  };

  const handlePinCodeKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const char = String.fromCharCode(e.which);
    if (!/\d/.test(char)) {
      e.preventDefault();
    }
    // Prevent more than 6 digits
    if (e.currentTarget.value.length >= 6 && e.which !== 8) { // 8 is backspace
      e.preventDefault();
    }
  };

  // Validation functions with error messages
  const validateName = (value: string, fieldName: string) => {
    if (value === '') return { isValid: true, error: '' };
    if (!patterns.name.test(value)) {
      return { isValid: false, error: `${fieldName} should only contain letters and spaces` };
    }
    return { isValid: true, error: '' };
  };

  const validateMobile = (value: string, fieldName: string) => {
    if (value === '') return { isValid: true, error: '' };
    if (!patterns.mobile.test(value)) {
      return { isValid: false, error: `${fieldName} should be exactly 10 digits` };
    }
    return { isValid: true, error: '' };
  };

  const validateEmail = (value: string, fieldName: string) => {
    if (value === '') return { isValid: true, error: '' };
    if (!patterns.email.test(value)) {
      return { isValid: false, error: `Please enter a valid ${fieldName.toLowerCase()}` };
    }
    return { isValid: true, error: '' };
  };

  const validatePinCode = (value: string, fieldName: string) => {
    if (value === '') return { isValid: true, error: '' };
    if (!patterns.pinCode.test(value)) {
      return { isValid: false, error: `${fieldName} should be exactly 6 digits` };
    }
    return { isValid: true, error: '' };
  };

  const validateAmount = (value: string, fieldName: string) => {
    if (value === '') return { isValid: true, error: '' };
    if (!patterns.amount.test(value)) {
      return { isValid: false, error: `${fieldName} should contain only numbers` };
    }
    return { isValid: true, error: '' };
  };

  const validateMarks = (value: string, fieldName: string) => {
    if (value === '') return { isValid: true, error: '' };
    if (!patterns.marks.test(value)) {
      return { isValid: false, error: `${fieldName} should be a number between 0-100 (can include decimals)` };
    }
    const numValue = parseFloat(value);
    if (numValue < 0 || numValue > 100) {
      return { isValid: false, error: `${fieldName} should be between 0 and 100` };
    }
    return { isValid: true, error: '' };
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    // Apply validation and filtering based on field type
    let validatedValue = value;
    let fieldError = '';
    
    if (typeof value === 'string') {
      switch (field) {
        case 'firstName':
        case 'lastName':
        case 'fatherName':
        case 'motherName':
        case 'referencePersonName':
          // Filter out numbers and special characters, keep only letters and spaces
          validatedValue = value.replace(/[^A-Za-z\s]/g, '');
          const nameValidation = validateName(validatedValue, field === 'firstName' ? 'First Name' : 
            field === 'lastName' ? 'Last Name' : 
            field === 'fatherName' ? 'Father\'s Name' : 
            field === 'motherName' ? 'Mother\'s Name' : 'Reference Person Name');
          if (!nameValidation.isValid) {
            fieldError = nameValidation.error;
          }
          break;
        case 'mobile':
        case 'parentsPhone':
        case 'collegePhone':
          // Filter out non-digits and limit to 10 digits
          validatedValue = value.replace(/\D/g, '').slice(0, 10);
          const mobileValidation = validateMobile(validatedValue, 
            field === 'mobile' ? 'Mobile Number' : 
            field === 'parentsPhone' ? 'Parents\' Phone Number' : 'College Phone');
          if (!mobileValidation.isValid) {
            fieldError = mobileValidation.error;
          }
          break;
        case 'email':
        case 'collegeEmail':
          // Allow email characters but validate format
          const emailValidation = validateEmail(value, 
            field === 'email' ? 'Email Address' : 'College Email');
          if (!emailValidation.isValid) {
            fieldError = emailValidation.error;
          }
          break;
        case 'pinCode':
          // Filter out non-digits and limit to 6 digits
          validatedValue = value.replace(/\D/g, '').slice(0, 6);
          const pinCodeValidation = validatePinCode(validatedValue, 'PIN Code');
          if (!pinCodeValidation.isValid) {
            fieldError = pinCodeValidation.error;
          }
          break;
        case 'familyAnnualIncome':
        case 'totalCollegeFees':
        case 'scholarshipAmountRequired':
          // Filter out non-digits
          validatedValue = value.replace(/\D/g, '');
          const amountValidation = validateAmount(validatedValue, 
            field === 'familyAnnualIncome' ? 'Family Annual Income' : 
            field === 'totalCollegeFees' ? 'Total College Fees' : 'Scholarship Amount Required');
          if (!amountValidation.isValid) {
            fieldError = amountValidation.error;
          }
          break;
        case 'marks10th':
        case 'marks12th':
        case 'marksSem1':
        case 'marksSem2':
        case 'marksSem3':
        case 'marksSem4':
        case 'marksSem5':
        case 'marksSem6':
        case 'marksSem7':
        case 'marksSem8':
          // Allow numbers and decimal point, validate range
          const marksValidation = validateMarks(value, 
            field === 'marks10th' ? '10th Marks' : 
            field === 'marks12th' ? '12th Marks' : 
            field === 'marksSem1' ? 'Semester 1 Marks' : 
            field === 'marksSem2' ? 'Semester 2 Marks' : 
            field === 'marksSem3' ? 'Semester 3 Marks' : 
            field === 'marksSem4' ? 'Semester 4 Marks' : 
            field === 'marksSem5' ? 'Semester 5 Marks' : 
            field === 'marksSem6' ? 'Semester 6 Marks' : 
            field === 'marksSem7' ? 'Semester 7 Marks' : 'Semester 8 Marks');
          if (!marksValidation.isValid) {
            fieldError = marksValidation.error;
          }
          break;
      }
    }

    // Update form data
    setFormData(prev => ({
      ...prev,
      [field]: validatedValue
    }));

    // Update errors
    setErrors(prev => ({
      ...prev,
      [field]: fieldError
    }));
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  };

  // Auto-save function for form changes
  const autoSave = async (updatedFormData: any) => {
    try {
      // Check if user is authenticated before attempting to save
      if (!isAuthenticated()) {
        console.log('User not authenticated, skipping auto-save');
        return;
      }
      
      await saveProfileDraft({
        formData: updatedFormData,
        currentStep,
        lastSaved: new Date().toISOString()
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
      // Don't show error toast for auto-save to avoid spam
    }
  };

  // Debounced auto-save effect
  useEffect(() => {
    if (!isLoading) {
      // Check if user is authenticated before setting up auto-save
      if (!isAuthenticated()) {
        return; // Don't auto-save if not authenticated
      }
      
      const timeoutId = setTimeout(() => {
        autoSave(formData);
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [formData, currentStep, isLoading]);

  // Check if current step has any errors
  const hasCurrentStepErrors = () => {
    const currentStepFields = {
      1: ['firstName', 'lastName', 'gender', 'dob', 'street', 'city', 'state', 'pinCode', 'mobile', 'email'],
      2: ['fatherName', 'fatherOccupation', 'motherName', 'motherOccupation', 'parentsPhone', 'familyAnnualIncome'],
      3: ['grade', 'academicYear', 'collegeName', 'totalCollegeFees', 'scholarshipAmountRequired', 'declaration', 'awareness']
    };
    
    const fieldsToCheck = currentStepFields[currentStep as keyof typeof currentStepFields] || [];
    return fieldsToCheck.some(field => errors[field]);
  };



  // Validation functions for each section
  const isPersonalDetailsValid = () => {
    return formData.firstName && formData.lastName && formData.gender && 
           formData.dob && formData.street && formData.city && 
           formData.state && formData.pinCode && formData.mobile && formData.email &&
           !hasCurrentStepErrors();
  };

  const isFamilyDetailsValid = () => {
    return formData.fatherName && formData.fatherOccupation && 
           formData.motherName && formData.motherOccupation && 
           formData.parentsPhone && formData.familyAnnualIncome &&
           !hasCurrentStepErrors();
  };

  // Check if all required fields across all sections are filled
  const isAllRequiredFieldsFilled = () => {
    // Personal Details
    const personalValid = formData.firstName && formData.lastName && formData.gender && 
                         formData.dob && formData.street && formData.city && 
                         formData.state && formData.pinCode && formData.mobile && formData.email;
    
    // Family Details
    const familyValid = formData.fatherName && formData.fatherOccupation && 
                       formData.motherName && formData.motherOccupation && 
                       formData.parentsPhone && formData.familyAnnualIncome;
    
    // Academic Details
    const academicValid = formData.grade && formData.academicYear && 
                         formData.collegeName && formData.totalCollegeFees && 
                         formData.scholarshipAmountRequired && formData.declaration && formData.awareness;
    
    return personalValid && familyValid && academicValid;
  };

  // Check if there are any validation errors across all sections
  const hasAnyErrors = () => {
    const allFields = [
      'firstName', 'lastName', 'gender', 'dob', 'street', 'city', 'state', 'pinCode', 'mobile', 'email',
      'fatherName', 'fatherOccupation', 'motherName', 'motherOccupation', 'parentsPhone', 'familyAnnualIncome',
      'grade', 'academicYear', 'collegeName', 'totalCollegeFees', 'scholarshipAmountRequired', 'declaration', 'awareness'
    ];
    return allFields.some(field => errors[field]);
  };

  const isAcademicDetailsValid = () => {
    return formData.grade && formData.academicYear && 
           formData.collegeName && formData.totalCollegeFees && 
           formData.scholarshipAmountRequired && formData.declaration && formData.awareness &&
           !hasCurrentStepErrors();
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      setIsSaving(true);
      try {
        // Check if user is authenticated before attempting to save
        if (!isAuthenticated()) {
          toast({
            title: "Authentication Required",
            description: "Please log in to save your progress.",
            variant: "destructive",
          });
          return;
        }
        
        // Save current step data to backend
        await saveProfileDraft({
          formData,
          currentStep: currentStep + 1,
          lastSaved: new Date().toISOString()
        });
        
        // Show success message
        toast({
          title: "Progress Saved!",
          description: "Your progress has been saved. You can continue later.",
          variant: "default",
        });
        
        // Move to next step
        setCurrentStep(currentStep + 1);
      } catch (error) {
        console.error('Error saving draft:', error);
        toast({
          title: "Save Failed",
          description: "Failed to save your progress. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    try {
      // Update profile
      setProfile({
        ...profile,
        ...formData,
        submitted: true,
        submittedAt: new Date().toISOString()
      });
      
      // Update status to Profile Under Verification
      setStatus('Profile Under Verification');
      
      // Clear draft data after successful submission
      await saveProfileDraft(null); // Clear draft
      
      // Show success toast
      toast({
        title: "Profile Submitted Successfully!",
        description: "Your profile has been submitted and is pending verification. You will be notified once verified.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error submitting profile:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Check if profile is submitted but not yet approved
  const isSubmitted = profile?.submitted;
  const isReadOnly = isSubmitted && profile?.status !== 'approved';

  // Progress calculation
  const progress = (currentStep / 3) * 100;

  // Render submitted profile summary
  const renderSubmittedProfile = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-blue-600">Submitted Profile Summary</CardTitle>
          <p className="text-muted-foreground">Your submitted profile details (read-only)</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-4">Section 1: Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">First Name</label>
                <p className="text-gray-900">{profile?.firstName || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Last Name</label>
                <p className="text-gray-900">{profile?.lastName || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <p className="text-gray-900">{profile?.gender || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="text-gray-900">{profile?.dob || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Street Address</label>
                <p className="text-gray-900">{profile?.street || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">City</label>
                <p className="text-gray-900">{profile?.city || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">State</label>
                <p className="text-gray-900">{profile?.state || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">PIN Code</label>
                <p className="text-gray-900">{profile?.pinCode || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Mobile Number</label>
                <p className="text-gray-900">{profile?.mobile || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email Address</label>
                <p className="text-gray-900">{profile?.email || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Family Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-4">Section 2: Family Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Father's Name</label>
                <p className="text-gray-900">{profile?.fatherName || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Father's Occupation</label>
                <p className="text-gray-900">{profile?.fatherOccupation || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Mother's Name</label>
                <p className="text-gray-900">{profile?.motherName || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Mother's Occupation</label>
                <p className="text-gray-900">{profile?.motherOccupation || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Parents' Phone Number</label>
                <p className="text-gray-900">{profile?.parentsPhone || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Family Annual Income</label>
                <p className="text-gray-900">{profile?.familyAnnualIncome || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Academic Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-4">Section 3: Academic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Grade</label>
                <p className="text-gray-900">{profile?.grade || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Present Semester</label>
                <p className="text-gray-900">{profile?.presentSemester || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Academic Year</label>
                <p className="text-gray-900">{profile?.academicYear || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">College Name</label>
                <p className="text-gray-900">{profile?.collegeName || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Total College Fees</label>
                <p className="text-gray-900">{profile?.totalCollegeFees || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Scholarship Amount Required</label>
                <p className="text-gray-900">{profile?.scholarshipAmountRequired || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Submission Details */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">Submission Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Submission Date</label>
                <p className="text-gray-900">{profile?.submittedAt ? new Date(profile.submittedAt).toLocaleDateString() : 'Not available'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className="text-gray-900">{profile?.status || 'Pending Verification'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Personal Details Section
  const renderPersonalDetails = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-blue-600">Step 1: Personal Details</CardTitle>
        <p className="text-muted-foreground">Please provide your personal information</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
              <label className="block text-sm font-medium mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
            <Input 
              placeholder="Enter first name" 
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              disabled={isReadOnly}
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
                      <div>
              <label className="block text-sm font-medium mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
            <Input 
              placeholder="Enter last name" 
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              disabled={isReadOnly}
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
              <label className="block text-sm font-medium mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)} disabled={isReadOnly}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
                      <div>
              <label className="block text-sm font-medium mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
            <Input
              type="date"
              value={formData.dob}
              onChange={(e) => handleInputChange('dob', e.target.value)}
              onClick={(e) => {
                // Open date picker when clicking anywhere in the input
                const input = e.target as HTMLInputElement;
                input.showPicker?.();
              }}
              disabled={isReadOnly}
              className="cursor-pointer"
            />
          </div>
        </div>

                  <div>
            <label className="block text-sm font-medium mb-2">
              Street Address <span className="text-red-500">*</span>
            </label>
          <Input 
            placeholder="Enter street address" 
            value={formData.street}
            onChange={(e) => handleInputChange('street', e.target.value)}
            disabled={isReadOnly}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <div>
              <label className="block text-sm font-medium mb-2">
                City <span className="text-red-500">*</span>
              </label>
            <Input 
              placeholder="Enter city" 
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              disabled={isReadOnly}
            />
          </div>
                      <div>
              <label className="block text-sm font-medium mb-2">
                State <span className="text-red-500">*</span>
              </label>
            <Input 
              placeholder="Enter state" 
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              disabled={isReadOnly}
            />
          </div>
                      <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium mb-2">
                PIN Code <span className="text-red-500">*</span>
              </label>
            <Input 
              placeholder="Enter PIN code" 
              value={formData.pinCode}
              onChange={(e) => handleInputChange('pinCode', e.target.value)}
              onKeyPress={handlePinCodeKeyPress}
              disabled={isReadOnly}
              className={errors.pinCode ? 'border-red-500' : ''}
            />
            {errors.pinCode && (
              <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
              <label className="block text-sm font-medium mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
            <Input 
              placeholder="Enter mobile number" 
              value={formData.mobile}
              onChange={(e) => handleInputChange('mobile', e.target.value)}
              onKeyPress={handleMobileKeyPress}
              disabled={isReadOnly}
              className={errors.mobile ? 'border-red-500' : ''}
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
            )}
          </div>
                      <div>
              <label className="block text-sm font-medium mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
            <Input 
              type="email"
              placeholder="Enter email address" 
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isReadOnly}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Family Details Section
  const renderFamilyDetails = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-blue-600">Step 2: Family Details</CardTitle>
        <p className="text-muted-foreground">Please provide your family information</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
              <label className="block text-sm font-medium mb-2">
                Father's Name <span className="text-red-500">*</span>
              </label>
            <Input 
              placeholder="Enter father's name" 
              value={formData.fatherName}
              onChange={(e) => handleInputChange('fatherName', e.target.value)}
              onKeyPress={handleNameKeyPress}
              disabled={isReadOnly}
              className={errors.fatherName ? 'border-red-500' : ''}
            />
            {errors.fatherName && (
              <p className="text-red-500 text-xs mt-1">{errors.fatherName}</p>
            )}
          </div>
                      <div>
              <label className="block text-sm font-medium mb-2">
                Father's Occupation
              </label>
            <Input 
              placeholder="Enter father's occupation" 
              value={formData.fatherOccupation}
              onChange={(e) => handleInputChange('fatherOccupation', e.target.value)}
              disabled={isReadOnly}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
              <label className="block text-sm font-medium mb-2">
                Mother's Name <span className="text-red-500">*</span>
              </label>
            <Input 
              placeholder="Enter mother's name" 
              value={formData.motherName}
              onChange={(e) => handleInputChange('motherName', e.target.value)}
              disabled={isReadOnly}
            />
          </div>
                      <div>
              <label className="block text-sm font-medium mb-2">
                Mother's Occupation
              </label>
            <Input 
              placeholder="Enter mother's occupation" 
              value={formData.motherOccupation}
              onChange={(e) => handleInputChange('motherOccupation', e.target.value)}
              disabled={isReadOnly}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
              <label className="block text-sm font-medium mb-2">
                Parents' Phone Number <span className="text-red-500">*</span>
              </label>
            <Input 
              placeholder="Enter parents' phone number" 
              value={formData.parentsPhone}
              onChange={(e) => handleInputChange('parentsPhone', e.target.value)}
              onKeyPress={handleMobileKeyPress}
              disabled={isReadOnly}
              className={errors.parentsPhone ? 'border-red-500' : ''}
            />
            {errors.parentsPhone && (
              <p className="text-red-500 text-xs mt-1">{errors.parentsPhone}</p>
            )}
          </div>
                      <div>
              <label className="block text-sm font-medium mb-2">
                Family Annual Income <span className="text-red-500">*</span>
              </label>
            <Input 
              placeholder="Enter annual income" 
              value={formData.familyAnnualIncome}
              onChange={(e) => handleInputChange('familyAnnualIncome', e.target.value)}
              onKeyPress={handleNumberKeyPress}
              disabled={isReadOnly}
              className={errors.familyAnnualIncome ? 'border-red-500' : ''}
            />
            {errors.familyAnnualIncome && (
              <p className="text-red-500 text-xs mt-1">{errors.familyAnnualIncome}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Family Details
          </label>
          <Input 
            placeholder="Example: 1 Younger brother-Studying School, 1 Elder Sister- Married" 
            value={formData.familyDetails}
            onChange={(e) => handleInputChange('familyDetails', e.target.value)}
            disabled={isReadOnly}
          />
        </div>
      </CardContent>
    </Card>
  );

  // Academic Details Section
  const renderAcademicDetails = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-blue-600">Step 3: Academic Details</CardTitle>
        <p className="text-muted-foreground">Please provide your academic information</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
              <label className="block text-sm font-medium mb-2">
                Grade/Class <span className="text-red-500">*</span>
              </label>
            <Input 
              placeholder="Example: B.com or B.B.A or 10th std" 
              value={formData.grade}
              onChange={(e) => handleInputChange('grade', e.target.value)}
              disabled={isReadOnly}
            />
          </div>
                      <div>
              <label className="block text-sm font-medium mb-2">
                Present Semester
              </label>
            <Input 
              placeholder="Enter semester" 
              value={formData.presentSemester}
              onChange={(e) => handleInputChange('presentSemester', e.target.value)}
              disabled={isReadOnly}
            />
          </div>
        </div>

                            <div>
            <label className="block text-sm font-medium mb-2">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <Input 
              placeholder="Example: 2013-2016" 
              value={formData.academicYear}
              onChange={(e) => handleInputChange('academicYear', e.target.value)}
              disabled={isReadOnly}
            />
          </div>

                  <div>
            <label className="block text-sm font-medium mb-2">
              College Name <span className="text-red-500">*</span>
            </label>
          <Input 
            placeholder="Enter college name" 
            value={formData.collegeName}
            onChange={(e) => handleInputChange('collegeName', e.target.value)}
            disabled={isReadOnly}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              College Phone
            </label>
            <Input 
              placeholder="Enter college phone" 
              value={formData.collegePhone}
              onChange={(e) => handleInputChange('collegePhone', e.target.value)}
              disabled={isReadOnly}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              College Email
            </label>
            <Input 
              type="email"
              placeholder="Enter college email" 
              value={formData.collegeEmail}
              onChange={(e) => handleInputChange('collegeEmail', e.target.value)}
              disabled={isReadOnly}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            College Website
          </label>
          <Input 
            placeholder="Enter college website" 
            value={formData.collegeWebsite}
            onChange={(e) => handleInputChange('collegeWebsite', e.target.value)}
            disabled={isReadOnly}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Reference Person Name
            </label>
            <Input 
              placeholder="Enter reference person name" 
              value={formData.referencePersonName}
              onChange={(e) => handleInputChange('referencePersonName', e.target.value)}
              disabled={isReadOnly}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Reference Person Qualification
            </label>
            <Input 
              placeholder="Enter qualification" 
              value={formData.referencePersonQualification}
              onChange={(e) => handleInputChange('referencePersonQualification', e.target.value)}
              disabled={isReadOnly}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Reference Person Position
          </label>
          <Input 
            placeholder="Enter position" 
            value={formData.referencePersonPosition}
            onChange={(e) => handleInputChange('referencePersonPosition', e.target.value)}
            disabled={isReadOnly}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
              <label className="block text-sm font-medium mb-2">
                Total College Fees <span className="text-red-500">*</span>
              </label>
            <Input 
              placeholder="Enter total fees" 
              value={formData.totalCollegeFees}
              onChange={(e) => handleInputChange('totalCollegeFees', e.target.value)}
              onKeyPress={handleNumberKeyPress}
              disabled={isReadOnly}
              className={errors.totalCollegeFees ? 'border-red-500' : ''}
            />
            {errors.totalCollegeFees && (
              <p className="text-red-500 text-xs mt-1">{errors.totalCollegeFees}</p>
            )}
          </div>
                      <div>
              <label className="block text-sm font-medium mb-2">
                Scholarship Amount Required <span className="text-red-500">*</span>
              </label>
            <Input 
              placeholder="Enter required amount" 
              value={formData.scholarshipAmountRequired}
              onChange={(e) => handleInputChange('scholarshipAmountRequired', e.target.value)}
              onKeyPress={handleNumberKeyPress}
              disabled={isReadOnly}
              className={errors.scholarshipAmountRequired ? 'border-red-500' : ''}
            />
            {errors.scholarshipAmountRequired && (
              <p className="text-red-500 text-xs mt-1">{errors.scholarshipAmountRequired}</p>
            )}
          </div>
        </div>

        {/* Academic Marks Section */}
        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold mb-4">Academic Marks</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">10th Marks</label>
              <Input 
                placeholder="Enter marks" 
                value={formData.marks10th}
                onChange={(e) => handleInputChange('marks10th', e.target.value)}
                disabled={isReadOnly}
                className={errors.marks10th ? 'border-red-500' : ''}
              />
              {errors.marks10th && (
                <p className="text-red-500 text-xs mt-1">{errors.marks10th}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">12th Marks</label>
              <Input 
                placeholder="Enter marks" 
                value={formData.marks12th}
                onChange={(e) => handleInputChange('marks12th', e.target.value)}
                disabled={isReadOnly}
                className={errors.marks12th ? 'border-red-500' : ''}
              />
              {errors.marks12th && (
                <p className="text-red-500 text-xs mt-1">{errors.marks12th}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Semester 1</label>
              <Input 
                placeholder="Enter marks" 
                value={formData.marksSem1}
                onChange={(e) => handleInputChange('marksSem1', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Semester 2</label>
              <Input 
                placeholder="Enter marks" 
                value={formData.marksSem2}
                onChange={(e) => handleInputChange('marksSem2', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Semester 3</label>
              <Input 
                placeholder="Enter marks" 
                value={formData.marksSem3}
                onChange={(e) => handleInputChange('marksSem3', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Semester 4</label>
              <Input 
                placeholder="Enter marks" 
                value={formData.marksSem4}
                onChange={(e) => handleInputChange('marksSem4', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Semester 5</label>
              <Input 
                placeholder="Enter marks" 
                value={formData.marksSem5}
                onChange={(e) => handleInputChange('marksSem5', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Semester 6</label>
              <Input 
                placeholder="Enter marks" 
                value={formData.marksSem6}
                onChange={(e) => handleInputChange('marksSem6', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Semester 7</label>
              <Input 
                placeholder="Enter marks" 
                value={formData.marksSem7}
                onChange={(e) => handleInputChange('marksSem7', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Semester 8</label>
              <Input 
                placeholder="Enter marks" 
                value={formData.marksSem8}
                onChange={(e) => handleInputChange('marksSem8', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
          </div>
        </div>

        {/* Any Arrears Section */}
        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold mb-4">Academic Status</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Any Arrears so far <span className="text-xs text-gray-500">(Not for 1st semester Students)</span>
              </label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="arrears-yes"
                    name="arrears"
                    value="yes"
                    checked={formData.arrears === 'yes'}
                    onChange={(e) => handleInputChange('arrears', e.target.value)}
                    disabled={isReadOnly}
                    className="text-blue-600"
                  />
                  <label htmlFor="arrears-yes" className="text-sm">Yes</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="arrears-no"
                    name="arrears"
                    value="no"
                    checked={formData.arrears === 'no'}
                    onChange={(e) => handleInputChange('arrears', e.target.value)}
                    disabled={isReadOnly}
                    className="text-blue-600"
                  />
                  <label htmlFor="arrears-no" className="text-sm">No</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Declarations Section */}
        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold mb-4">Declarations</h4>
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="awareness"
                checked={formData.awareness}
                onCheckedChange={(checked) => handleInputChange('awareness', checked)}
                disabled={isReadOnly}
              />
              <label htmlFor="awareness" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I am aware that the application will be rejected and appropriate action taken, if information provided by me is found to be false or misleading. <span className="text-red-500">*</span>
              </label>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox
                id="declaration"
                checked={formData.declaration}
                onCheckedChange={(checked) => handleInputChange('declaration', checked)}
                disabled={isReadOnly}
              />
              <label htmlFor="declaration" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I hereby declare that all the information provided by me in the application are completely true and correct in particular. <span className="text-red-500">*</span>
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your saved progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {isSubmitted ? (
        // Show submitted profile summary ONLY
        renderSubmittedProfile()
      ) : (
        // Show form and navigation ONLY if not submitted
        <>
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-muted-foreground gap-1 sm:gap-0">
              <span>Step {currentStep} of 3</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="hidden xs:inline">Personal Details</span>
              <span className="xs:hidden">Personal</span>
              <span className="hidden xs:inline">Family Details</span>
              <span className="xs:hidden">Family</span>
              <span className="hidden xs:inline">Academic Details</span>
              <span className="xs:hidden">Academic</span>
            </div>
          </div>

          {/* Top Navigation Buttons */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-2 bg-gray-50 p-2 rounded-lg">
              <Button 
                size="sm"
                variant={currentStep === 1 ? "default" : "outline"}
                onClick={() => setCurrentStep(1)}
                className="min-w-[100px]"
              >
                Personal Details
              </Button>
              <Button 
                size="sm"
                variant={currentStep === 2 ? "default" : "outline"}
                onClick={() => setCurrentStep(2)}
                className="min-w-[100px]"
              >
                Family Details
              </Button>
              <Button 
                size="sm"
                variant={currentStep === 3 ? "default" : "outline"}
                onClick={() => setCurrentStep(3)}
                className="min-w-[100px]"
              >
                Academic Details
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Render current step */}
            {currentStep === 1 && renderPersonalDetails()}
            {currentStep === 2 && renderFamilyDetails()}
            {currentStep === 3 && renderAcademicDetails()}

            {/* Bottom Action Button */}
            <div className="flex justify-end mt-6">
              {currentStep < 3 ? (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !isPersonalDetailsValid()) ||
                    (currentStep === 2 && !isFamilyDetailsValid()) ||
                    isReadOnly ||
                    isSaving
                  }
                  className="w-full sm:w-auto"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save & Next'
                  )}
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={!isAllRequiredFieldsFilled() || hasAnyErrors() || isSubmitted || isSaving}
                  className="w-full sm:w-auto"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : !isAllRequiredFieldsFilled() ? (
                    'Complete All Sections to Submit'
                  ) : hasAnyErrors() ? (
                    'Fix All Errors to Submit'
                  ) : (
                    isSubmitted ? 'Profile Already Submitted' : 'Submit Profile'
                  )}
                </Button>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
} 