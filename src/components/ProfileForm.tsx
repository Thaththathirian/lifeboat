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
import CollegeDropdown from "./CollegeDropdown";
import {
  getPersonalDetails,
  savePersonalDetails,
  getFamilyDetails,
  saveFamilyDetails,
  getAcademicDetails,
  saveAcademicDetails,
  clearProfileCache,
  getCacheStatus,
} from "@/utils/profileService";

export default function ProfileForm() {
  const { profile, setProfile } = useStudent();
  const { setStatus } = useStudentStatus();
  const { toast } = useToast();

  // Current step state
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasLoadedData, setHasLoadedData] = useState(false);

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
    referencePersonPhone: profile?.referencePersonPhone || "",
    referencePersonEmail: profile?.referencePersonEmail || "",
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
  const [selectedCollege, setSelectedCollege] = useState<any>(null);

  // Helper function to get input styling based on errors
  const getInputStyling = (fieldName: string) => {
    const hasError = errors[fieldName];
    return {
      className: `${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} transition-colors duration-200`,
      errorMessage: hasError ? `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required` : ''
    };
  };

  // Load profile data when component mounts
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Only try to load data if user is authenticated
        if (!isAuthenticated()) {
          console.log('User not authenticated, skipping data load');
          setIsLoading(false);
          return;
        }

        // Check if profile is already submitted - if so, don't make API calls
        if (profile?.submitted) {
          console.log('Profile already submitted, skipping API calls');
          setIsLoading(false);
          return;
        }

        // Check if data has already been loaded using localStorage
        const hasLoadedKey = 'profileDataLoaded';
        const sessionKey = 'profileDataSession';
        const currentSession = Date.now().toString();
        
        if (localStorage.getItem(hasLoadedKey)) {
          console.log('Data already loaded in this session, skipping API calls');
          setIsLoading(false);
          return;
        }
        
        // Set session flag to prevent multiple calls
        localStorage.setItem(sessionKey, currentSession);
        
        // Check if another session is already in progress
        const existingSession = localStorage.getItem(sessionKey);
        if (existingSession && existingSession !== currentSession) {
          console.log('Another session is already loading data, skipping...');
          setIsLoading(false);
          return;
        }
        
        // Load data from all three sections with caching
        const [personalDetails, familyDetails, academicDetails] = await Promise.allSettled([
          getPersonalDetails(),
          getFamilyDetails(),
          getAcademicDetails()
        ]);

        // Update form data with fetched data
        const updatedFormData = { ...formData };

        // Personal Details
        if (personalDetails.status === 'fulfilled' && personalDetails.value) {
          Object.assign(updatedFormData, personalDetails.value);
        }

        // Family Details
        if (familyDetails.status === 'fulfilled' && familyDetails.value) {
          Object.assign(updatedFormData, familyDetails.value);
        }

        // Academic Details
        if (academicDetails.status === 'fulfilled' && academicDetails.value) {
          Object.assign(updatedFormData, academicDetails.value);
        }

        // Set form data with fetched data
        setFormData(updatedFormData);
        
        // Mark that data has been loaded using localStorage
        localStorage.setItem(hasLoadedKey, 'true');
        setHasLoadedData(true);
        
        // Clear session flag after successful load
        localStorage.removeItem(sessionKey);
        
        // Log cache status for debugging
        console.log('Cache status:', getCacheStatus());

      } catch (error) {
        console.error('Error loading profile data:', error);
        // Don't show error toast for data loading to avoid spam
        // Just log the error and continue with empty form
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();

    // Cleanup function to clear the flag when component unmounts
    return () => {
      // Clear the flag when component unmounts
      localStorage.removeItem('profileDataLoaded');
      localStorage.removeItem('profileDataSession');
    };
  }, [profile?.submitted]);

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

  const handleCollegeSelect = (college: any) => {
    setSelectedCollege(college);
    if (college) {
      // Auto-fill college details when a college is selected
      handleInputChange('collegePhone', college.mobile);
      handleInputChange('collegeEmail', college.email);
      handleInputChange('collegeWebsite', college.website);
    }
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
    const currentUser = localStorage.getItem('currentUser');
    const googleUserData = localStorage.getItem('googleUserData');
    return !!(currentUser || googleUserData);
  };

  // Auto-save function for form changes
  const autoSave = async (updatedFormData: any) => {
    try {
      // Check if user is authenticated before attempting to save
      if (!isAuthenticated()) {
        console.log('User not authenticated, skipping auto-save');
        return;
      }
      
      // Save to appropriate API endpoint based on current step
      if (currentStep === 1) {
        // Save personal details
        const personalDetails = {
          firstName: updatedFormData.firstName,
          lastName: updatedFormData.lastName,
          gender: updatedFormData.gender,
          dob: updatedFormData.dob,
          street: updatedFormData.street,
          city: updatedFormData.city,
          state: updatedFormData.state,
          pinCode: updatedFormData.pinCode,
          mobile: updatedFormData.mobile,
          email: updatedFormData.email,
        };
        await savePersonalDetails(personalDetails);
      } else if (currentStep === 2) {
        // Save family details
        const familyDetails = {
          fatherName: updatedFormData.fatherName,
          fatherOccupation: updatedFormData.fatherOccupation,
          motherName: updatedFormData.motherName,
          motherOccupation: updatedFormData.motherOccupation,
          parentsPhone: updatedFormData.parentsPhone,
          familyDetails: updatedFormData.familyDetails,
          familyAnnualIncome: updatedFormData.familyAnnualIncome,
        };
        await saveFamilyDetails(familyDetails);
      } else if (currentStep === 3) {
        // Save academic details
        const academicDetails = {
          grade: updatedFormData.grade,
          presentSemester: updatedFormData.presentSemester,
          academicYear: updatedFormData.academicYear,
          collegeName: updatedFormData.collegeName,
          collegePhone: updatedFormData.collegePhone,
          collegeEmail: updatedFormData.collegeEmail,
          collegeWebsite: updatedFormData.collegeWebsite,
          referencePersonName: updatedFormData.referencePersonName,
          referencePersonQualification: updatedFormData.referencePersonQualification,
          referencePersonPosition: updatedFormData.referencePersonPosition,
          referencePersonPhone: updatedFormData.referencePersonPhone || "",
          referencePersonEmail: updatedFormData.referencePersonEmail || "",
          totalCollegeFees: updatedFormData.totalCollegeFees,
          scholarshipAmountRequired: updatedFormData.scholarshipAmountRequired,
          marks10th: updatedFormData.marks10th,
          marks12th: updatedFormData.marks12th,
          marksSem1: updatedFormData.marksSem1,
          marksSem2: updatedFormData.marksSem2,
          marksSem3: updatedFormData.marksSem3,
          marksSem4: updatedFormData.marksSem4,
          marksSem5: updatedFormData.marksSem5,
          marksSem6: updatedFormData.marksSem6,
          marksSem7: updatedFormData.marksSem7,
          marksSem8: updatedFormData.marksSem8,
          declaration: updatedFormData.declaration,
          arrears: updatedFormData.arrears,
          awareness: updatedFormData.awareness,
        };
        await saveAcademicDetails(academicDetails);
      }
      
      // Cache is automatically updated by the save functions
    } catch (error) {
      console.error('Auto-save failed:', error);
      // Don't show error toast for auto-save to avoid spam
    }
  };

  // Auto-save removed - data is saved when user clicks Next or Submit

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
      // Trigger validation for all fields in current step
      const currentStepFields = {
        1: ['firstName', 'lastName', 'gender', 'dob', 'street', 'city', 'state', 'pinCode', 'mobile', 'email'],
        2: ['fatherName', 'fatherOccupation', 'motherName', 'motherOccupation', 'parentsPhone', 'familyAnnualIncome'],
        3: ['grade', 'academicYear', 'collegeName', 'totalCollegeFees', 'scholarshipAmountRequired', 'declaration', 'awareness']
      };
      
      const fieldsToValidate = currentStepFields[currentStep as keyof typeof currentStepFields] || [];
      
      // Validate each field and set errors
      fieldsToValidate.forEach(field => {
        const value = formData[field as keyof typeof formData];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          setErrors(prev => ({
            ...prev,
            [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
          }));
        }
      });
      
      // Validate current step before proceeding
      let isValid = false;
      let errorMessage = "";
      
      if (currentStep === 1) {
        isValid = isPersonalDetailsValid();
        if (!isValid) {
          errorMessage = "Please fill all required personal details correctly.";
        }
      } else if (currentStep === 2) {
        isValid = isFamilyDetailsValid();
        if (!isValid) {
          errorMessage = "Please fill all required family details correctly.";
        }
      }
      
      if (!isValid) {
        toast({
          title: "Validation Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
      
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
        
        // Save current step data to appropriate API endpoint
        let saveSuccess = false;
        
        if (currentStep === 1) {
          // Save personal details
          const personalDetails = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            gender: formData.gender,
            dob: formData.dob,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pinCode: formData.pinCode,
            mobile: formData.mobile,
            email: formData.email,
          };
          saveSuccess = await savePersonalDetails(personalDetails);
        } else if (currentStep === 2) {
          // Save family details
          const familyDetails = {
            fatherName: formData.fatherName,
            fatherOccupation: formData.fatherOccupation,
            motherName: formData.motherName,
            motherOccupation: formData.motherOccupation,
            parentsPhone: formData.parentsPhone,
            familyDetails: formData.familyDetails,
            familyAnnualIncome: formData.familyAnnualIncome,
          };
          saveSuccess = await saveFamilyDetails(familyDetails);
        }
        
        if (saveSuccess) {
          // Show success message
          toast({
            title: "Progress Saved!",
            description: "Your progress has been saved. You can continue later.",
            variant: "default",
          });
          
          // Move to next step
          setCurrentStep(currentStep + 1);
        } else {
          throw new Error('Failed to save data');
        }
      } catch (error) {
        console.error('Error saving data:', error);
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
    
    // Trigger validation for all required fields
    const allRequiredFields = [
      'firstName', 'lastName', 'gender', 'dob', 'street', 'city', 'state', 'pinCode', 'mobile', 'email',
      'fatherName', 'fatherOccupation', 'motherName', 'motherOccupation', 'parentsPhone', 'familyAnnualIncome',
      'grade', 'academicYear', 'collegeName', 'totalCollegeFees', 'scholarshipAmountRequired', 'declaration', 'awareness'
    ];
    
    // Validate each field and set errors
    allRequiredFields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      if (!value || (typeof value === 'string' && value.trim() === '') || (typeof value === 'boolean' && !value)) {
        setErrors(prev => ({
          ...prev,
          [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        }));
      }
    });
    
    // Validate all sections before submitting
    if (!isAllRequiredFieldsFilled()) {
      toast({
        title: "Validation Error",
        description: "Please complete all required fields in all sections before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    if (hasAnyErrors()) {
      toast({
        title: "Validation Error",
        description: "Please fix all validation errors before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    try {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        toast({
          title: "Authentication Required",
          description: "Please log in to submit your profile.",
          variant: "destructive",
        });
        return;
      }

      // Save academic details first
      const academicDetails = {
        grade: formData.grade,
        presentSemester: formData.presentSemester,
        academicYear: formData.academicYear,
        collegeName: formData.collegeName,
        collegePhone: formData.collegePhone,
        collegeEmail: formData.collegeEmail,
        collegeWebsite: formData.collegeWebsite,
        referencePersonName: formData.referencePersonName,
        referencePersonQualification: formData.referencePersonQualification,
        referencePersonPosition: formData.referencePersonPosition,
        referencePersonPhone: formData.referencePersonPhone || "",
        referencePersonEmail: formData.referencePersonEmail || "",
        totalCollegeFees: formData.totalCollegeFees,
        scholarshipAmountRequired: formData.scholarshipAmountRequired,
        marks10th: formData.marks10th,
        marks12th: formData.marks12th,
        marksSem1: formData.marksSem1,
        marksSem2: formData.marksSem2,
        marksSem3: formData.marksSem3,
        marksSem4: formData.marksSem4,
        marksSem5: formData.marksSem5,
        marksSem6: formData.marksSem6,
        marksSem7: formData.marksSem7,
        marksSem8: formData.marksSem8,
        declaration: formData.declaration,
        arrears: formData.arrears,
        awareness: formData.awareness,
      };

      const academicSaveSuccess = await saveAcademicDetails(academicDetails);

      if (!academicSaveSuccess) {
        throw new Error('Failed to save academic details');
      }

      // Update profile with submitted data
      const submittedProfile = {
        ...profile,
        ...formData,
        submitted: true,
        submittedAt: new Date().toISOString()
      };
      
      setProfile(submittedProfile);
      
      // Update status to Profile Under Verification
      setStatus('Profile Under Verification');
      
      // Clear profile cache after successful submission
      clearProfileCache();
      
      // Clear the data loaded flag since profile is now submitted
      localStorage.removeItem('profileDataLoaded');
      
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
              className={`${errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} transition-colors duration-200`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.firstName}</p>
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
              className={getInputStyling('lastName').className}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
              <label className="block text-sm font-medium mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)} disabled={isReadOnly}>
              <SelectTrigger className={getInputStyling('gender').className}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.gender}</p>
            )}
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
              className={`cursor-pointer ${getInputStyling('dob').className}`}
            />
            {errors.dob && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.dob}</p>
            )}
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
            className={getInputStyling('street').className}
          />
          {errors.street && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.street}</p>
          )}
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
              className={getInputStyling('city').className}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.city}</p>
            )}
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
              className={getInputStyling('state').className}
            />
            {errors.state && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.state}</p>
            )}
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
              className={getInputStyling('pinCode').className}
            />
            {errors.pinCode && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.pinCode}</p>
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
              className={getInputStyling('mobile').className}
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.mobile}</p>
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
              className={getInputStyling('email').className}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>
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
              className={getInputStyling('fatherName').className}
            />
            {errors.fatherName && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.fatherName}</p>
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
              className={getInputStyling('fatherOccupation').className}
            />
            {errors.fatherOccupation && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.fatherOccupation}</p>
            )}
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
              className={getInputStyling('motherName').className}
            />
            {errors.motherName && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.motherName}</p>
            )}
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
              className={getInputStyling('motherOccupation').className}
            />
            {errors.motherOccupation && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.motherOccupation}</p>
            )}
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
              className={getInputStyling('parentsPhone').className}
            />
            {errors.parentsPhone && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.parentsPhone}</p>
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
              className={getInputStyling('familyAnnualIncome').className}
            />
            {errors.familyAnnualIncome && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.familyAnnualIncome}</p>
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
              className={getInputStyling('grade').className}
            />
            {errors.grade && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.grade}</p>
            )}
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
              className={getInputStyling('academicYear').className}
            />
            {errors.academicYear && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.academicYear}</p>
            )}
          </div>

                  <div>
            <label className="block text-sm font-medium mb-2">
              College Name <span className="text-red-500">*</span>
            </label>
            <CollegeDropdown
              key="college-dropdown"
              value={formData.collegeName}
              onValueChange={(value) => handleInputChange('collegeName', value)}
              onCollegeSelect={handleCollegeSelect}
              disabled={isReadOnly}
              className={getInputStyling('collegeName').className}
            />
            {errors.collegeName && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.collegeName}</p>
            )}
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
              className={getInputStyling('totalCollegeFees').className}
            />
            {errors.totalCollegeFees && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.totalCollegeFees}</p>
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
              className={getInputStyling('scholarshipAmountRequired').className}
            />
            {errors.scholarshipAmountRequired && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.scholarshipAmountRequired}</p>
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
                className={errors.awareness ? 'border-red-500' : ''}
              />
              <label htmlFor="awareness" className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${errors.awareness ? 'text-red-500' : ''}`}>
                I am aware that the application will be rejected and appropriate action taken, if information provided by me is found to be false or misleading. <span className="text-red-500">*</span>
              </label>
            </div>
            {errors.awareness && (
              <p className="text-red-500 text-xs mt-1 font-medium ml-6">{errors.awareness}</p>
            )}
            
            <div className="flex items-start space-x-2">
              <Checkbox
                id="declaration"
                checked={formData.declaration}
                onCheckedChange={(checked) => handleInputChange('declaration', checked)}
                disabled={isReadOnly}
                className={errors.declaration ? 'border-red-500' : ''}
              />
              <label htmlFor="declaration" className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${errors.declaration ? 'text-red-500' : ''}`}>
                I hereby declare that all the information provided by me in the application are completely true and correct in particular. <span className="text-red-500">*</span>
              </label>
            </div>
            {errors.declaration && (
              <p className="text-red-500 text-xs mt-1 font-medium ml-6">{errors.declaration}</p>
            )}
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

  try {
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
                    disabled={isReadOnly || isSaving}
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
                    disabled={isSubmitted || isSaving}
                    className="w-full sm:w-auto"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
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
  } catch (error) {
    console.error('Error rendering ProfileForm:', error);
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-4">There was an error loading the profile form.</p>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      </div>
    );
  }
} 