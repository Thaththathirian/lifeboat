import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BadgeCheck } from "lucide-react";
import { useStudent } from "@/contexts/StudentContext";
import { getTotalReceived } from "./StudentPayments";
import { useStudentStatus } from '@/components/layout/StudentStatusProvider';

const profile = {
  firstName: "Rahul",
  lastName: "Kumar",
  gender: "Male",
  dob: "2002-05-15",
  mobile: "9876543210",
  email: "rahul.kumar@email.com",
  city: "Mumbai",
  state: "Maharashtra",
};

const documents = [
  { key: "aadhar", label: "Aadhar Card", required: true },
  { key: "marksheet", label: "12th Marksheet", required: true },
  { key: "income", label: "Income Certificate", required: false },
];

export default function StudentApplication() {
  const { setApplication, setProfile } = useStudent();
  const { status, setStatus } = useStudentStatus();
  const [uploads, setUploads] = useState<{[k: string]: File | null}>({});
  const [uploadStatus, setUploadStatus] = useState<{[k: string]: string}>({});
  const [submitted, setSubmitted] = useState(false);
  const isLocked = getTotalReceived() > 0;

  // Simulate: Assume if any required doc is uploaded, section is locked
  const isDocSectionLocked = documents.some(doc => uploads[doc.key]);

  const handleFile = (key: string, file: File | null) => {
    if (file && file.size > 10 * 1024 * 1024) {
      setUploadStatus(s => ({ ...s, [key]: "File too large (max 10MB)" }));
      setUploads(u => ({ ...u, [key]: null }));
      return;
    }
    setUploads(u => ({ ...u, [key]: file }));
    setUploadStatus(s => ({ ...s, [key]: file ? "Uploaded" : "" }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setApplication({ profile, documents: uploads });
    setProfile(profile);
    setStatus('Upload Documents');
    // In a real app, you would save to backend here
    setTimeout(() => {
      window.location.href = '/student/documents';
    }, 1500);
  };

  const canSubmit = documents.filter(d => d.required).every(d => uploads[d.key]);

  if (status === 'Blocked') {
    return <div className="max-w-2xl mx-auto py-10 px-4 text-center text-red-600 font-bold text-xl">Your account has been blocked. Please contact support.</div>;
  }
  // Allow application to be visible at more statuses
  const visibleStatuses = [
    'Schedule Interview',
    'Eligible for Scholarship',
    'Payment Pending',
    'Paid',
    'Academic Results Pending',
    'Academic verification pending',
    'Apply for Next',
    'Alumni',
    'Upload Documents', // <-- add this
    'Documents Submitted', // <-- add this
  ];
  if (!visibleStatuses.includes(status)) {
    return <div className="max-w-2xl mx-auto py-10 px-4 text-center text-gray-600 font-bold text-xl">Application is not available at this stage.</div>;
  }

  return (
    <div className="max-w-3xl w-full mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Scholarship Application</h2>
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h3 className="font-semibold mb-4">Your Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(profile).map(([k, v]) => (
            <div key={k}>
              <Label className="capitalize">{k.replace(/([A-Z])/g, ' $1')}: </Label>
              <div className="bg-gray-100 rounded px-3 py-2 text-gray-700">{v}</div>
            </div>
          ))}
            </div>
          </div>
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-4">Upload Documents</h3>
        {isDocSectionLocked ? (
          <div className="space-y-6">
            {documents.map(doc => (
              <div key={doc.key} className="flex flex-col md:flex-row md:items-center gap-3">
                <Label className="flex-1">
                  {doc.label} {doc.required && <span className="text-red-500">*</span>}
                  <span className="ml-2 text-xs text-gray-500">(max 10MB)</span>
                </Label>
                {uploads[doc.key] ? (
                  <span className="text-green-600 flex items-center gap-1"><BadgeCheck size={16}/> {uploads[doc.key]?.name}</span>
                ) : (
                  <span className="text-gray-400">No file uploaded</span>
                )}
                  </div>
            ))}
                  </div>
        ) : (
        <div className="space-y-6">
          {documents.map(doc => (
            <div key={doc.key} className="flex flex-col md:flex-row md:items-center gap-3">
              <Label className="flex-1">
                {doc.label} {doc.required && <span className="text-red-500">*</span>}
                <span className="ml-2 text-xs text-gray-500">(max 10MB)</span>
              </Label>
              <Input
                type="file"
                accept="application/pdf,image/*"
                className="flex-1"
                onChange={e => handleFile(doc.key, e.target.files?.[0] || null)}
                disabled={isLocked}
              />
              {uploads[doc.key] && uploadStatus[doc.key] === "Uploaded" && (
                <span className="text-green-600 flex items-center gap-1"><BadgeCheck size={16}/> Uploaded</span>
              )}
              {uploadStatus[doc.key] && uploadStatus[doc.key] !== "Uploaded" && (
                <span className="text-red-500 text-xs">{uploadStatus[doc.key]}</span>
              )}
                </div>
          ))}
                  </div>
        )}
        <Button 
          className="mt-8 w-full" 
          disabled={!canSubmit || submitted || isLocked || isDocSectionLocked}
          onClick={handleSubmit}
        >
          {submitted ? "Submitting..." : "Submit Application"}
        </Button>
        {submitted && (
          <div className="text-green-600 text-center mt-2">Application submitted successfully! Redirecting to documents...</div>
        )}
      </div>
    </div>
  );
}