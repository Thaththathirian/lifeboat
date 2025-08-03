import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BadgeCheck, FileText, CheckCircle } from "lucide-react";
import { useStudent } from "@/contexts/StudentContext";
import { getTotalReceived } from "./StudentPayments";
import { useStudentStatus } from '@/components/layout/StudentStatusProvider';
import { StudentStatus } from '@/types/student';

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
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDocumentsPopup, setShowDocumentsPopup] = useState(false);
  const [submittedDocuments, setSubmittedDocuments] = useState<any[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const isLocked = getTotalReceived() > 0;

  // Simulate: Assume if any required doc is uploaded, section is locked
  const isDocSectionLocked = documents.some(doc => uploads[doc.key]);

  // Fetch submitted documents on component mount
  useEffect(() => {
    const fetchSubmittedDocuments = async () => {
      setLoadingDocuments(true);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('Authentication token not found');
          return;
        }

        const response = await fetch('http://localhost/lifeboat/Student/personal_documents', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSubmittedDocuments(data.documents || []);
        } else {
          console.error('Failed to fetch submitted documents');
        }
      } catch (error) {
        console.error('Error fetching submitted documents:', error);
      } finally {
        setLoadingDocuments(false);
      }
    };

    // Only fetch if status indicates documents might be submitted
    if (status >= StudentStatus.APPLICATION_SUBMITTED) {
      fetchSubmittedDocuments();
    }
  }, [status]);

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
    // Update status to APPLICATION_SUBMITTED (3) after successful submission
    setStatus(StudentStatus.APPLICATION_SUBMITTED);
    
    // Show success popup after a short delay
    setTimeout(() => {
      setShowSuccessPopup(true);
    }, 1500);
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    // Show documents list popup
    setTimeout(() => {
      setShowDocumentsPopup(true);
    }, 500);
  };

  const handleDocumentsPopupClose = () => {
    setShowDocumentsPopup(false);
    // Navigate to documents page
    setTimeout(() => {
      window.location.href = '/student/personal-documents';
    }, 300);
  };

  const canSubmit = documents.filter(d => d.required).every(d => uploads[d.key]);

  if (status === StudentStatus.BLOCKED) {
    return <div className="max-w-2xl mx-auto py-10 px-4 text-center text-red-600 font-bold text-xl">Your account has been blocked. Please contact support.</div>;
  }
  
  // Allow application to be visible at more statuses
  const visibleStatuses = [
    StudentStatus.INTERVIEW_SCHEDULED,
    StudentStatus.ELIGIBLE_FOR_SCHOLARSHIP,
    StudentStatus.PAYMENT_PENDING,
    StudentStatus.PAID,
    StudentStatus.ACADEMIC_DOCUMENTS_PENDING,
    StudentStatus.ACADEMIC_DOCUMENTS_SUBMITTED,
    StudentStatus.ALUMNI,
    StudentStatus.PERSONAL_DOCUMENTS_PENDING,
    StudentStatus.RECEIPT_DOCUMENTS_SUBMITTED,
    StudentStatus.APPLICATION_SUBMITTED,
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

      {/* Submitted Documents Section */}
      {status >= StudentStatus.APPLICATION_SUBMITTED && (
        <div className="bg-white p-6 rounded-xl shadow mt-8">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Submitted Personal Documents
          </h3>
          
          {loadingDocuments ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading submitted documents...</p>
            </div>
          ) : submittedDocuments.length > 0 ? (
            <div className="space-y-4">
              {submittedDocuments.map((doc, index) => (
                <div key={doc.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.documentName}</p>
                      <p className="text-sm text-gray-500">File: {doc.filename}</p>
                      <p className="text-xs text-gray-400">
                        Size: {(doc.size / 1024 / 1024).toFixed(2)} MB • 
                        Type: {doc.type} • 
                        Uploaded: {new Date(doc.uploadTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-green-600">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
              ))}
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Total documents submitted: {submittedDocuments.length}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No personal documents submitted yet.</p>
              <p className="text-sm mt-1">Documents will appear here once submitted.</p>
            </div>
          )}
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Application Submitted Successfully!</h3>
            <p className="text-gray-600 mb-6">Your scholarship application has been submitted successfully. You can now proceed to upload your personal documents.</p>
            <Button 
              onClick={handleSuccessPopupClose}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Documents List Popup */}
      {showDocumentsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Personal Documents Required</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-red-500 font-bold">*</span>
                <span className="text-gray-700">Request Letter (Why do you require Scholarship)?</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-500 font-bold">*</span>
                <span className="text-gray-700">Aadhar Card</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-500 font-bold">*</span>
                <span className="text-gray-700">Residential Proof</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-500 font-bold">*</span>
                <span className="text-gray-700">Income Certificate of your Parents</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 font-bold">•</span>
                <span className="text-gray-600">Death Certificate of your Father (If you have marked "Late")</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 font-bold">•</span>
                <span className="text-gray-600">Death Certificate of your Mother (If you have marked "Late")</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 font-bold">•</span>
                <span className="text-gray-600">Any other relevant document</span>
              </div>
            </div>
            <div className="text-center">
              <Button 
                onClick={handleDocumentsPopupClose}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Close & Proceed to Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}