# Student Profile API Integration

This document explains the API integration for student profile form filling in the Scholarship Connect Platform.

## API Endpoints

The following API endpoints are used for student profile management:

### Personal Details
- **GET** `http://localhost/lifeboat/Student/get_personal_details` - Retrieve student personal details
- **POST** `http://localhost/lifeboat/Student/personal_details` - Save student personal details

### Family Details
- **GET** `http://localhost/lifeboat/Student/get_family_details` - Retrieve student family details
- **POST** `http://localhost/lifeboat/Student/family_details` - Save student family details

### Academic Details
- **GET** `http://localhost/lifeboat/Student/get_academic_details` - Retrieve student academic details
- **POST** `http://localhost/lifeboat/Student/academic_details` - Save student academic details

## Implementation Details

### Backend Service Functions

The following functions are implemented in `src/utils/backendService.ts`:

1. **Personal Details Functions:**
   - `getPersonalDetails()` - Fetches personal details from the API
   - `savePersonalDetails(details)` - Saves personal details to the API

2. **Family Details Functions:**
   - `getFamilyDetails()` - Fetches family details from the API
   - `saveFamilyDetails(details)` - Saves family details to the API

3. **Academic Details Functions:**
   - `getAcademicDetails()` - Fetches academic details from the API
   - `saveAcademicDetails(details)` - Saves academic details to the API

### Profile Form Integration

The `ProfileForm` component (`src/components/ProfileForm.tsx`) is fully integrated with the API endpoints:

#### Data Loading on Component Mount
```typescript
useEffect(() => {
  const loadProfileData = async () => {
    // Load data from all three sections
    const [personalDetails, familyDetails, academicDetails, draftData] = await Promise.allSettled([
      getPersonalDetails(),
      getFamilyDetails(),
      getAcademicDetails(),
      getProfileDraft()
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

    setFormData(updatedFormData);
  };

  loadProfileData();
}, []);
```

#### Step-by-Step Saving
When users move between steps, data is automatically saved to the appropriate API endpoint:

1. **Step 1 (Personal Details)**: Saves to `/Student/personal_details`
2. **Step 2 (Family Details)**: Saves to `/Student/family_details`
3. **Step 3 (Academic Details)**: Saves to `/Student/academic_details`

#### Auto-Save Functionality
The form includes auto-save functionality that saves data every 2 seconds of inactivity:

```typescript
const autoSave = async (updatedFormData: any) => {
  if (currentStep === 1) {
    await savePersonalDetails(personalDetails);
  } else if (currentStep === 2) {
    await saveFamilyDetails(familyDetails);
  } else if (currentStep === 3) {
    await saveAcademicDetails(academicDetails);
  }
};
```

#### Data Persistence
- When users visit a section they've already filled, the submitted data is automatically loaded and displayed
- Partial submissions are preserved and can be continued later
- Draft data is also saved as a backup

## Key Features

### 1. Partial Form Submission
- Users can fill and submit 1 or 2 sections and return later
- Data is automatically loaded when revisiting sections
- Progress is preserved across sessions

### 2. Real-time Validation
- Input validation with error messages
- Field-specific validation (names, mobile numbers, emails, etc.)
- Step-by-step validation before proceeding

### 3. Auto-Save
- Automatic saving every 2 seconds of inactivity
- Saves to appropriate API endpoint based on current step
- Backup draft saving for offline functionality

### 4. Error Handling
- Graceful handling of API failures
- User-friendly error messages
- Fallback to draft data if API is unavailable

### 5. Authentication Integration
- Checks for user authentication before API calls
- Proper token handling for secure API communication
- Redirects to login if not authenticated

## Usage Flow

1. **Initial Load**: Component fetches existing data from all three API endpoints
2. **Form Filling**: Users fill out forms step by step
3. **Auto-Save**: Data is automatically saved as users type
4. **Step Navigation**: Moving between steps saves current section data
5. **Final Submission**: All sections are validated and submitted together
6. **Data Retrieval**: When revisiting, previously submitted data is loaded

## API Response Format

The API endpoints expect and return data in the following format:

### Personal Details
```json
{
  "firstName": "string",
  "lastName": "string",
  "gender": "string",
  "dob": "string",
  "street": "string",
  "city": "string",
  "state": "string",
  "pinCode": "string",
  "mobile": "string",
  "email": "string"
}
```

### Family Details
```json
{
  "fatherName": "string",
  "fatherOccupation": "string",
  "motherName": "string",
  "motherOccupation": "string",
  "parentsPhone": "string",
  "familyDetails": "string",
  "familyAnnualIncome": "string"
}
```

### Academic Details
```json
{
  "grade": "string",
  "presentSemester": "string",
  "academicYear": "string",
  "collegeName": "string",
  "collegePhone": "string",
  "collegeEmail": "string",
  "collegeWebsite": "string",
  "referencePersonName": "string",
  "referencePersonQualification": "string",
  "referencePersonPosition": "string",
  "totalCollegeFees": "string",
  "scholarshipAmountRequired": "string",
  "marks10th": "string",
  "marks12th": "string",
  "marksSem1": "string",
  "marksSem2": "string",
  "marksSem3": "string",
  "marksSem4": "string",
  "marksSem5": "string",
  "marksSem6": "string",
  "marksSem7": "string",
  "marksSem8": "string",
  "declaration": "boolean",
  "arrears": "string",
  "awareness": "boolean"
}
```

## Security Features

- Authentication token validation before API calls
- Input sanitization and validation
- Error handling for network failures
- Secure token storage and transmission

The implementation is complete and ready for use with the specified API endpoints. 