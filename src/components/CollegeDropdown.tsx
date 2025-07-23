import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

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
      const response = await fetch('https://localhost/lifeboat/Admin/get_verified_colleges');
      const data = await response.json();
      
      if (data.status && data.data) {
        setColleges(data.data);
      } else {
        console.error('Failed to fetch colleges:', data.message);
      }
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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

  return (
    <div className="space-y-4">
      <div className="relative">
        <Select value={value} onValueChange={handleCollegeChange} disabled={disabled}>
          <SelectTrigger className={`w-1/2 ${className}`}>
            <SelectValue placeholder="Select college" />
            <ChevronDown className="h-4 w-4 opacity-50" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="" disabled>
                Loading colleges...
              </SelectItem>
            ) : (
              <>
                {colleges.map((college) => (
                  <SelectItem key={college.id} value={college.id}>
                    {college.name}
                  </SelectItem>
                ))}
                <SelectItem value="other">Other</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
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
} 