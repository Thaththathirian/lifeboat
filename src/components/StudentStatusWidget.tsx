import { useState } from "react";
import { useStudent, StudentStatus } from "@/contexts/StudentContext";
import { Settings } from "lucide-react";

const statusOptions: { value: StudentStatus; label: string }[] = [
  { value: 'Profile Pending', label: 'Profile Pending' },
  { value: 'Profile Under Verification', label: 'Profile Under Verification' },
  { value: 'Schedule Interview', label: 'Schedule Interview' },
  { value: 'documents', label: 'Scholarship Documents Pending' },
  { value: 'documents_submitted', label: 'Application form submitted' },
  { value: 'interview', label: 'Schedule Interview' },
  { value: 'academic_documents_pending', label: 'Academic Documents Pending' },
  { value: 'academic_documents_submitted', label: 'Academic Documents Submitted' },
  { value: 'eligible_scholarship', label: 'Eligible for Scholarship' },
  { value: 'payment', label: 'Payment Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'academic_results_pending', label: 'Academic results pending' },
  { value: 'academic_verification_pending', label: 'Academic verification pending' },
  { value: 'apply_next', label: 'Apply for Next' },
  { value: 'alumni', label: 'Alumni' },
  { value: 'Future Ready Module', label: 'Future Ready Module' },
  { value: 'blocked', label: 'Blocked' },
];

export default function StudentStatusWidget({ devOnly = false }: { devOnly?: boolean }) {
  // Hide widget in production if devOnly is true
  if (devOnly && process.env.NODE_ENV === 'production') return null;

  const { status, setStatus } = useStudent();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg h-10 w-10 flex items-center justify-center focus:outline-none"
        aria-label="Change Status"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
      >
        <Settings className="h-5 w-5" />
      </button>
      {/* Minimal Modal/Popover */}
      {isOpen && (
        <div className="mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-3 animate-fade-in flex flex-col gap-2 relative">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-sm text-gray-700">Change Status</span>
            <span className="absolute right-3 top-1 text-2xl font-extrabold text-orange-500 select-none" style={{letterSpacing: '2px'}}>TEST MODE</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-700 text-lg leading-none ml-2">×</button>
          </div>
          <div className="flex flex-col gap-1">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => { setStatus(option.value); setIsOpen(false); }}
                className={`text-left px-2 py-1 rounded text-sm ${status === option.value ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-100'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}