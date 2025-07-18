import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudent } from "@/contexts/StudentContext";
import { useStudentStatus } from '@/components/layout/StudentStatusProvider';
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";

export default function StudentProfile() {
  const { profile, setProfile } = useStudent();
  const { status, setStatus } = useStudentStatus();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
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
    fatherName: profile?.fatherName || "",
    fatherOccupation: profile?.fatherOccupation || "",
    motherName: profile?.motherName || "",
    motherOccupation: profile?.motherOccupation || "",
    parentsPhone: profile?.parentsPhone || "",
    familyDetails: profile?.familyDetails || "",
    familyAnnualIncome: profile?.familyAnnualIncome || "",
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
  });

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update profile
    setProfile({
      ...profile,
      ...formData,
      submitted: true,
      submittedAt: new Date().toISOString()
    });
    
    // Update status to Profile Under Verification
    setStatus('Profile Under Verification');
    
    // Show success toast
    toast({
      title: "Profile Submitted Successfully!",
      description: "Your profile has been submitted and is pending verification. You will be notified once verified.",
      variant: "default",
    });
  };

  // State districts data
  const stateDistricts = {
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Erode', 'Vellore', 'Tirunelveli', 'Kanchipuram', 'Thanjavur', 'Namakkal', 'Dharmapuri', 'Krishnagiri', 'Dindigul', 'Karur', 'Nagapattinam', 'Cuddalore', 'Kanyakumari', 'Theni', 'Pudukkottai', 'Sivaganga', 'Virudhunagar', 'Ramanathapuram', 'Perambalur', 'Ariyalur', 'Tiruvarur', 'Tiruppur', 'Nilgiris', 'Villupuram'],
    'Kerala': ['Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'],
    'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Belagavi', 'Davanagere', 'Ballari', 'Tumakuru', 'Shivamogga', 'Raichur', 'Bidar', 'Chikkamagaluru', 'Chitradurga', 'Dharwad', 'Gadag', 'Hassan', 'Kolar', 'Mandya', 'Udupi', 'Vijayapura'],
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Kadapa', 'Tirupati', 'Anantapur', 'Ongole', 'Rajahmundry', 'Srikakulam', 'Chittoor', 'Eluru', 'Vizianagaram', 'Machilipatnam'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Mahbubnagar', 'Adilabad', 'Rangareddy', 'Medak', 'Nalgonda', 'Suryapet', 'Jagtial', 'Siddipet', 'Kamareddy'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur', 'Jalgaon', 'Akola', 'Latur', 'Dhule', 'Ahmednagar', 'Satara', 'Chandrapur', 'Parbhani', 'Nanded', 'Sangli', 'Wardha'],
  };
  const stateList = Object.keys(stateDistricts).sort((a, b) => a.localeCompare(b));

  const [selectedState, setSelectedState] = useState(formData.state || '');
  const [selectedCity, setSelectedCity] = useState(formData.city || '');
  const [manualState, setManualState] = useState('');
  const [manualDistrict, setManualDistrict] = useState('');
  const [otherSemester, setOtherSemester] = useState('');
  const [otherCollege, setOtherCollege] = useState('');

  const cityOptions = (selectedState && selectedState !== 'Other' && stateDistricts[selectedState as keyof typeof stateDistricts])
    ? [...stateDistricts[selectedState as keyof typeof stateDistricts]].sort((a, b) => a.localeCompare(b))
    : [];

  // NOW we can have conditional rendering after ALL hooks are called
  if (status === 'Blocked') {
    return <div className="max-w-2xl mx-auto py-10 px-4 text-center text-red-600 font-bold text-xl">Your account has been blocked. Please contact support.</div>;
  }
  
  if (status !== 'Profile Pending' || profile?.submitted) {
    // Show read-only summary using context profile data
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">Profile Summary</CardTitle>
            <p className="text-muted-foreground">
              {profile?.submitted ? 'Your profile has been submitted and waiting to proceed next' : 'Your profile details (read-only)'}
            </p>
            {profile?.submittedAt && (
              <p className="text-sm text-muted-foreground mt-2">
                Submitted on: {new Date(profile.submittedAt).toLocaleDateString()}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Section 1: Personal Information */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Section 1: Personal Information</h3>
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
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-4 text-green-600">Section 2: Academic & Family Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><b>Grade:</b> {profile?.grade || '-'}</div>
                  <div><b>Present Semester:</b> {profile?.presentSemester || '-'}</div>
                  <div><b>Academic Year:</b> {profile?.academicYear || '-'}</div>
                  <div><b>College Name:</b> {profile?.collegeName || '-'}</div>
                  <div><b>College Phone:</b> {profile?.collegePhone || '-'}</div>
                  <div><b>College Email:</b> {profile?.collegeEmail || '-'}</div>
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
                <div className="mt-6">
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
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <User className="h-6 w-6" />
            Profile Update
          </CardTitle>
          <p className="text-muted-foreground">Please fill all required fields to continue</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Personal Information */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Section 1: Personal Information</h3>
              <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      placeholder="Enter first name" 
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <Input 
                      placeholder="Enter last name" 
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
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
                          required
                        />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Street or PO Box <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="Enter street address or PO Box" 
                    value={formData.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                       <Select
                      value={selectedState} 
                      onValueChange={(value) => {
                        setSelectedState(value);
                             setSelectedCity('');
                             setManualState('');
                             setManualDistrict('');
                        handleInputChange('city', '');
                        handleInputChange('state', value);
                      }}
                       >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {stateList.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {selectedState === 'Other' && (
                        <Input
                          className="mt-2"
                          placeholder="Enter your state"
                        value={manualState}
                        onChange={(e) => {
                            setManualState(e.target.value);
                          handleInputChange('state', e.target.value);
                        }}
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      District <span className="text-red-500">*</span>
                    </label>
                        {selectedState === '' ? (
                          <Input disabled placeholder="Select state first" />
                        ) : selectedState === 'Other' ? (
                          <Input
                            placeholder="Enter your district"
                        value={manualDistrict}
                        onChange={(e) => {
                              setManualDistrict(e.target.value);
                          handleInputChange('city', e.target.value);
                            }}
                          />
                        ) : (
                          <Select
                        value={selectedCity}
                        onValueChange={(value) => {
                          setSelectedCity(value);
                              setManualDistrict('');
                          handleInputChange('city', value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select district" />
                            </SelectTrigger>
                            <SelectContent>
                              {cityOptions.map(city => (
                                <SelectItem key={city} value={city}>{city}</SelectItem>
                              ))}
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                    {selectedCity === 'Other' && selectedState !== 'Other' && (
                        <Input
                          className="mt-2"
                          placeholder="Enter your district"
                        value={manualDistrict}
                        onChange={(e) => {
                            setManualDistrict(e.target.value);
                          handleInputChange('city', e.target.value);
                        }}
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Pin Code <span className="text-red-500">*</span>
                    </label>
                        <Input
                          placeholder="Enter 6-digit pin code"
                          maxLength={6}
                      value={formData.pinCode}
                      onChange={(e) => handleInputChange('pinCode', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      placeholder="Enter 10-digit mobile number" 
                      maxLength={10}
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      required
                    />
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
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Academic & Family Information */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-4 text-green-600">Section 2: Academic & Family Information</h3>
              <div className="space-y-6">
                
                {/* Academic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Grade* <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      placeholder="Example: B.com or B.B.A" 
                      value={formData.grade}
                      onChange={(e) => handleInputChange('grade', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Present Semester
                    </label>
                    <Select value={formData.presentSemester} onValueChange={(value) => handleInputChange('presentSemester', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st semester">1st Semester</SelectItem>
                        <SelectItem value="2nd semester">2nd Semester</SelectItem>
                        <SelectItem value="3rd semester">3rd Semester</SelectItem>
                        <SelectItem value="4th semester">4th Semester</SelectItem>
                        <SelectItem value="5th semester">5th Semester</SelectItem>
                        <SelectItem value="6th semester">6th Semester</SelectItem>
                        <SelectItem value="7th semester">7th Semester</SelectItem>
                        <SelectItem value="8th semester">8th Semester</SelectItem>
                        <SelectItem value="others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.presentSemester === 'others' && (
                      <Input
                        className="mt-2"
                        placeholder="Specify other semester"
                        value={otherSemester}
                        onChange={(e) => {
                          setOtherSemester(e.target.value);
                          handleInputChange('presentSemester', e.target.value);
                        }}
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Academic Year <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      placeholder="Example: 2013-2016" 
                      value={formData.academicYear}
                      onChange={(e) => handleInputChange('academicYear', e.target.value)}
                          required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      College Name <span className="text-red-500">*</span>
                    </label>
                    <Select value={formData.collegeName} onValueChange={(value) => handleInputChange('collegeName', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select college" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="college1">Mumbai University</SelectItem>
                        <SelectItem value="college2">Delhi University</SelectItem>
                        <SelectItem value="college3">Chennai University</SelectItem>
                        <SelectItem value="others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.collegeName === 'others' && (
                      <Input
                        className="mt-2"
                        placeholder="Enter college name"
                        value={otherCollege}
                        onChange={(e) => {
                          setOtherCollege(e.target.value);
                          handleInputChange('collegeName', e.target.value);
                        }}
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      College Phone No <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      placeholder="Enter college phone number" 
                      value={formData.collegePhone}
                      onChange={(e) => handleInputChange('collegePhone', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      College Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      type="email" 
                      placeholder="Enter college email" 
                      value={formData.collegeEmail}
                      onChange={(e) => handleInputChange('collegeEmail', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      College Website
                    </label>
                    <Input 
                      placeholder="Enter college website" 
                      value={formData.collegeWebsite}
                      onChange={(e) => handleInputChange('collegeWebsite', e.target.value)}
                    />
                  </div>
                </div>

                {/* Reference Person */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Reference Person Name <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      placeholder="Any professor, Department head or Principal" 
                      value={formData.referencePersonName}
                      onChange={(e) => handleInputChange('referencePersonName', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Qualification <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      placeholder="Enter qualification" 
                      value={formData.referencePersonQualification}
                      onChange={(e) => handleInputChange('referencePersonQualification', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      placeholder="Enter position" 
                      value={formData.referencePersonPosition}
                      onChange={(e) => handleInputChange('referencePersonPosition', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Family Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Father's Name <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      placeholder="Enter father's name" 
                      value={formData.fatherName}
                      onChange={(e) => handleInputChange('fatherName', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Father's Occupation <span className="text-red-500">*</span>
                    </label>
                    <Select value={formData.fatherOccupation} onValueChange={(value) => handleInputChange('fatherOccupation', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select occupation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="government">Government Employee</SelectItem>
                        <SelectItem value="private">Private Employee</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="farmer">Farmer</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                        <SelectItem value="others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mother's Name <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      placeholder="Enter mother's name" 
                      value={formData.motherName}
                      onChange={(e) => handleInputChange('motherName', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mother's Occupation <span className="text-red-500">*</span>
                    </label>
                    <Select value={formData.motherOccupation} onValueChange={(value) => handleInputChange('motherOccupation', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select occupation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="government">Government Employee</SelectItem>
                        <SelectItem value="private">Private Employee</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="farmer">Farmer</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                        <SelectItem value="homemaker">Homemaker</SelectItem>
                        <SelectItem value="others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Parents Phone No <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="Enter parents phone number" 
                    value={formData.parentsPhone}
                    onChange={(e) => handleInputChange('parentsPhone', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Family Details <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="Example: 1 Younger brother-Studying School, 1 Elder Sister- Married" 
                    value={formData.familyDetails}
                    onChange={(e) => handleInputChange('familyDetails', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Family Annual Income* <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      type="number" 
                      placeholder="Enter annual income" 
                      value={formData.familyAnnualIncome}
                      onChange={(e) => handleInputChange('familyAnnualIncome', Number(e.target.value))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Total College Fees Per Year* <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      type="number" 
                      placeholder="Enter college fees" 
                      value={formData.totalCollegeFees}
                      onChange={(e) => handleInputChange('totalCollegeFees', Number(e.target.value))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Scholarship Amount Required per year* <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      type="number" 
                      placeholder="Enter required amount" 
                      value={formData.scholarshipAmountRequired}
                      onChange={(e) => handleInputChange('scholarshipAmountRequired', Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                {/* Academic Marks */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Marks Scored in 10th Standard
                    </label>
                    <p className="text-xs text-gray-600 mb-2">Example: If you have scored 502 of 600 then 502/600. Then you enter only the Average which is 83.67 in the given field below</p>
                    <Input 
                      type="number" 
                      placeholder="Enter marks" 
                      value={formData.marks10th}
                      onChange={(e) => handleInputChange('marks10th', Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Marks Scored in 12th Standard
                    </label>
                    <p className="text-xs text-gray-600 mb-2">Example: If you have scored 502 of 600 then 502/600. Then you enter only the Average which is 83.67 in the given field below</p>
                    <Input
                      type="number" 
                      placeholder="Enter marks" 
                      value={formData.marks12th}
                      onChange={(e) => handleInputChange('marks12th', Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Marks scored in First Semester
                    </label>
                    <Input 
                      type="number" 
                      placeholder="Enter marks" 
                      value={formData.marksSem1}
                      onChange={(e) => handleInputChange('marksSem1', Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Marks scored in Second Semester
                    </label>
                    <Input 
                      type="number" 
                      placeholder="Enter marks" 
                      value={formData.marksSem2}
                      onChange={(e) => handleInputChange('marksSem2', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Marks scored in Third Semester
                    </label>
                    <Input 
                      type="number" 
                      placeholder="Enter marks" 
                      value={formData.marksSem3}
                      onChange={(e) => handleInputChange('marksSem3', Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Marks scored in Fourth Semester
                    </label>
                    <Input 
                      type="number" 
                      placeholder="Enter marks" 
                      value={formData.marksSem4}
                      onChange={(e) => handleInputChange('marksSem4', Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Marks scored in Fifth Semester
                    </label>
                    <Input 
                      type="number" 
                      placeholder="Enter marks" 
                      value={formData.marksSem5}
                      onChange={(e) => handleInputChange('marksSem5', Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Marks scored in Sixth Semester
                    </label>
                    <Input 
                      type="number" 
                      placeholder="Enter marks" 
                      value={formData.marksSem6}
                      onChange={(e) => handleInputChange('marksSem6', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Marks scored in Seventh Semester
                    </label>
                    <Input 
                      type="number" 
                      placeholder="Enter marks" 
                      value={formData.marksSem7}
                      onChange={(e) => handleInputChange('marksSem7', Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Marks scored in Eighth Semester
                    </label>
                    <Input 
                      type="number" 
                      placeholder="Enter marks" 
                      value={formData.marksSem8}
                      onChange={(e) => handleInputChange('marksSem8', Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Declaration */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.declaration}
                    onChange={(e) => handleInputChange('declaration', e.target.checked)}
                    className="mt-1"
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium">
                      I am aware that the application will be rejected and appropriate action taken, if information provided by me is found to be false or misleading.* <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>
              </div>
              </div>

              <div className="flex justify-center">
              <Button 
                type="submit" 
                className="w-full md:w-auto px-8"
                disabled={profile?.submitted}
              >
                {profile?.submitted ? 'Profile Already Submitted' : 'Submit Profile'}
                </Button>
              </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}