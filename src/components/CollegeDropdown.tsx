import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface College {
  id: string;
  name: string;
  mobile: string;
  email: string;
  website: string;
}

interface CollegeDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  onCollegeSelect?: (college: College | null) => void;
  onOtherCollegeDataChange?: (data: {
    collegeName: string;
    collegePhone: string;
    collegeBankName: string;
    accountNumber: string;
    confirmAccountNumber: string;
    ifscCode: string;
  }) => void;
  disabled?: boolean;
  className?: string;
  errors?: Record<string, string>;
}

export default function CollegeDropdown({
  value,
  onValueChange,
  onCollegeSelect,
  onOtherCollegeDataChange,
  disabled = false,
  className = "",
  errors = {}
}: CollegeDropdownProps) {
  const [colleges, setColleges] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtherFields, setShowOtherFields] = useState(false);
  const [otherCollegeData, setOtherCollegeData] = useState({
    collegeName: "",
    collegePhone: "",
    collegeBankName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: ""
  });

  // Fetch colleges from API
  const fetchColleges = async () => {
    setIsLoading(true);
    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('authToken');
      
      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if token is available
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('http://localhost/lifeboat/Admin/get_all_colleges?status=1', {
        method: 'GET',
        headers,
      });
      const data = await response.json();
      
      if (data.status && data.data) {
        setColleges(data.data);
      } else {
        console.error('Failed to fetch colleges:', data.message);
        setColleges([]); // Set empty array to show fallback
      }
    } catch (error) {
      console.error('Error fetching colleges:', error);
      setColleges([]); // Set empty array to show fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('CollegeDropdown: useEffect called');
    fetchColleges();
  }, []);

  const handleCollegeChange = (selectedValue: string) => {
    onValueChange(selectedValue);
    
    if (selectedValue === "other") {
      setShowOtherFields(true);
      onCollegeSelect?.(null);
    } else {
      setShowOtherFields(false);
      const selectedCollege = colleges.find(college => college.id === selectedValue);
      onCollegeSelect?.(selectedCollege || null);
    }
  };

  const handleOtherFieldChange = (field: string, value: string) => {
    const updatedData = {
      ...otherCollegeData,
      [field]: value
    };
    setOtherCollegeData(updatedData);
    
    // Debug logging for account number fields
    if (field === 'accountNumber' || field === 'confirmAccountNumber') {
      console.log(`🔍 CollegeDropdown: ${field} changed to:`, value);
      console.log('Current otherCollegeData:', updatedData);
    }
    
    // Notify parent component of the updated bank details
    if (onOtherCollegeDataChange) {
      onOtherCollegeDataChange(updatedData);
    }
  };

  try {
    console.log('CollegeDropdown: Rendering with', { 
      colleges: colleges.length, 
      isLoading, 
      value,
      errors,
      otherCollegeData: {
        accountNumber: otherCollegeData.accountNumber,
        confirmAccountNumber: otherCollegeData.confirmAccountNumber,
        accountNumbersMatch: otherCollegeData.accountNumber === otherCollegeData.confirmAccountNumber
      }
    });
    return (
      <div className="space-y-4">
        <div className="relative">
          <select 
            value={value} 
            onChange={(e) => handleCollegeChange(e.target.value)} 
            disabled={disabled}
            className={`w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
          >
            <option value="">Select college</option>
            {isLoading ? (
              <option value="loading" disabled>Loading colleges...</option>
            ) : colleges.length > 0 ? (
              <>
                {colleges.map((college) => (
                  <option key={college.id} value={college.id}>
                    {college.name}
                  </option>
                ))}
                <option value="other">Other</option>
              </>
            ) : (
              <>
                <option value="no-colleges" disabled>No colleges available</option>
                <option value="other">Other</option>
              </>
            )}
          </select>
        </div>

      {showOtherFields && (
        <div className="space-y-4 border-l-2 border-blue-200 pl-4">
          <h4 className="text-sm font-medium text-gray-700">Additional College Information</h4>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              College Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter college name"
              value={otherCollegeData.collegeName}
              onChange={(e) => handleOtherFieldChange('collegeName', e.target.value)}
              disabled={disabled}
              className={errors.collegeName ? 'border-red-500' : ''}
            />
            {errors.collegeName && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.collegeName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              College Phone <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter college phone number"
              value={otherCollegeData.collegePhone}
              onChange={(e) => handleOtherFieldChange('collegePhone', e.target.value)}
              disabled={disabled}
              className={errors.collegePhone ? 'border-red-500' : ''}
            />
            {errors.collegePhone && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.collegePhone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              College Bank Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter bank name"
              value={otherCollegeData.collegeBankName}
              onChange={(e) => handleOtherFieldChange('collegeBankName', e.target.value)}
              disabled={disabled}
              className={errors.collegeBankName ? 'border-red-500' : ''}
            />
            {errors.collegeBankName && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.collegeBankName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Account Number <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter account number"
                value={otherCollegeData.accountNumber}
                onChange={(e) => handleOtherFieldChange('accountNumber', e.target.value)}
                disabled={disabled}
                className={errors.accountNumber ? 'border-red-500' : ''}
              />
              {errors.accountNumber && (
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.accountNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Account Number <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Confirm account number"
                value={otherCollegeData.confirmAccountNumber}
                onChange={(e) => handleOtherFieldChange('confirmAccountNumber', e.target.value)}
                disabled={disabled}
                className={errors.confirmAccountNumber ? 'border-red-500' : ''}
              />
              {errors.confirmAccountNumber && (
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmAccountNumber}</p>
              )}
              {!errors.confirmAccountNumber && otherCollegeData.accountNumber && otherCollegeData.confirmAccountNumber && 
               otherCollegeData.accountNumber === otherCollegeData.confirmAccountNumber && (
                <p className="text-green-500 text-xs mt-1 font-medium">✓ Account numbers match</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              IFSC Code <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter IFSC code"
              value={otherCollegeData.ifscCode}
              onChange={(e) => handleOtherFieldChange('ifscCode', e.target.value)}
              disabled={disabled}
              className={errors.ifscCode ? 'border-red-500' : ''}
            />
            {errors.ifscCode && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.ifscCode}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
  } catch (error) {
    console.error('Error rendering CollegeDropdown:', error);
    // Fallback to simple input if Select component fails
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            College Name <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Enter college name"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            disabled={disabled}
            className={className}
          />
        </div>
      </div>
    );
  }
} 