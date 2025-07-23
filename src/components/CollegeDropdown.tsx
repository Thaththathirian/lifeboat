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
  disabled?: boolean;
  className?: string;
}

export default function CollegeDropdown({
  value,
  onValueChange,
  onCollegeSelect,
  disabled = false,
  className = ""
}: CollegeDropdownProps) {
  const [colleges, setColleges] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtherFields, setShowOtherFields] = useState(false);
  const [otherCollegeData, setOtherCollegeData] = useState({
    collegeName: "",
    collegeBankName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: ""
  });

  // Fetch colleges from API
  const fetchColleges = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost/lifeboat/Admin/get_verified_colleges');
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
    setOtherCollegeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  try {
    console.log('CollegeDropdown: Rendering with', { colleges: colleges.length, isLoading, value });
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
            />
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
            />
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
              />
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
              />
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
            />
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