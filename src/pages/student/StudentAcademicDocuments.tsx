import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useStudent } from "@/contexts/StudentContext";
import { FileText, Check, Upload } from "lucide-react";
import { useStudentStatus } from '@/components/layout/StudentStatusProvider';

const documentsSchema = z.object({
  collegeName: z.string().min(1, "College name is required"),
  grade: z.string().min(1, "Grade is required"),
  currentSemester: z.string().min(1, "Current semester is required"),
});

type DocumentsForm = z.infer<typeof documentsSchema>;

const academicDocumentTypes = [
  { key: "collegeId", label: "College/School Identification Card", required: true },
  { key: "marksheet10", label: "10th Standard Mark Sheet", required: false },
  { key: "marksheet12", label: "12th Standard Mark Sheet", required: false },
  { key: "semesterMarksheets", label: "Semester Marksheets (up to previous semester in combined PDF)", required: false },
  { key: "feesStructure", label: "School/College Fees Structure", required: true },
];

const registeredColleges = [
  { id: 'COL001', name: 'Mumbai University', place: 'Mumbai' },
  { id: 'COL002', name: 'Delhi College of Engineering', place: 'Delhi' },
  { id: 'COL003', name: 'Chennai Medical College', place: 'Chennai' },
];

export default function StudentAcademicDocuments() {
  const { profile, documents, setDocuments } = useStudent();
  const { status, setStatus } = useStudentStatus();
  const [uploads, setUploads] = useState<{[key: string]: File | null}>({});
  const [uploadStatus, setUploadStatus] = useState<{[key: string]: string}>({});
  // For academic results upload
  const academicResultsFile = documents?.academicUploads?.academicResults || null;
  const [selectedFile, setSelectedFile] = useState<File | null>(academicResultsFile);
  const [resultsUploadStatus, setResultsUploadStatus] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  // Add state for academic result status
  const [resultStatus, setResultStatus] = useState<'pending' | 'verified' | 'rejected'>('pending');

  const handleFileUpload = (key: string, file: File | null) => {
    if (file && file.size > 10 * 1024 * 1024) {
      setUploadStatus(prev => ({ ...prev, [key]: "File too large (max 10MB)" }));
      setUploads(prev => ({ ...prev, [key]: null }));
      return;
    }
    setUploads(prev => ({ ...prev, [key]: file }));
    setUploadStatus(prev => ({ ...prev, [key]: file ? "Uploaded" : "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };
  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (files.length === 0) return;
    setDocuments({
      ...documents,
      academicUploads: {
        ...documents.academicUploads,
        uploadedFiles: files.map((file) => ({ name: file.name })),
      },
    });
    setStatus('Academic Documents Submitted');
  };

  const requiredDocs = academicDocumentTypes.filter(doc => doc.required);
  const hasAllRequired = requiredDocs.every(doc => uploads[doc.key]);

  // List of statuses where documents should be visible in read-only mode
  const readOnlyStatuses = [
    'Academic Documents Submitted',
    'Apply for Next',
    'Alumni',
    'Blocked',
  ];

  // Only show the academic documents summary table for relevant statuses
  const showAcademicDocs = status !== 'Profile Update' && status !== 'Application form submitted';

  // Hide all content if status is 'Application form submitted' or 'Schedule Interview'
  if (status === 'Application form submitted' || status === 'Schedule Interview') {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-2xl text-gray-500 font-semibold">
        Academic documents are not available at this stage.
      </div>
    );
  }

  if (status === 'Scholarship Documents Pending') {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-2xl text-gray-500 font-semibold">
        Academic documents are not available at this stage.
      </div>
    );
  }

  if (status === 'Profile Update') {
    return (
      <div className="text-center text-lg text-gray-500 py-16">
        Please complete your profile update before accessing this section.
      </div>
    );
  }

  // Define statuses where the academic result card should be shown
  const showResultStatuses = [
    'Academic verification pending',
    'Eligible for Scholarship',
    'Payment Pending',
    'Paid',
    'Apply for Next',
    'Alumni',
    'Blocked',
  ];

  // Academic Results Card (upload or summary) - only after 'Paid' or later statuses
  const showResultsCardStatuses = [
    'Paid',
    'Academic verification pending',
    'Academic Documents Submitted',
    'Apply for Next',
    'Alumni',
    'Blocked',
  ];
  const showResultsUpload = showResultsCardStatuses.includes(status);
  const showResultsSummary = !!documents?.academicUploads?.academicResults && showResultsCardStatuses.includes(status);

  if (status === 'Academic results pending') {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files[0] && files[0].size > 10 * 1024 * 1024) {
        setResultsUploadStatus("File too large (max 10MB)");
        setSelectedFile(null);
        return;
      }
      setSelectedFile(files[0] || null);
      setResultsUploadStatus("");
    };
    const handleSubmit = () => {
      if (!selectedFile) return;
      setDocuments({
        ...documents,
        academicUploads: {
          ...documents?.academicUploads,
          academicResults: selectedFile
        }
      });
      setStatus('Academic verification pending');
    };
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Card className="shadow-xl mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Upload className="h-6 w-6" /> Academic Results Upload
            </CardTitle>
            <p className="text-muted-foreground">Upload your latest academic results (PDF/image, max 10MB each).</p>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              accept="application/pdf,image/*"
              multiple={false}
              onChange={handleFileChange}
            />
            {resultsUploadStatus && <div className="text-red-500 text-xs mt-1">{resultsUploadStatus}</div>}
            {selectedFile && <div className="mt-2 text-green-700">{selectedFile.name}</div>}
            <Button
              className="mt-4"
              disabled={!selectedFile}
              onClick={handleSubmit}
            >
              Submit Academic Results
            </Button>
          </CardContent>
        </Card>
        {showAcademicDocs && (
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">Academic Documents</CardTitle>
              <p className="text-muted-foreground">Below are your uploaded academic documents.</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2">
                  <tbody>
                    {academicDocumentTypes.filter(doc => doc.key !== 'academicResults').map(doc => {
                      const file = documents?.academicUploads?.[doc.key];
                      return (
                        <tr key={doc.key} className="bg-white hover:bg-gray-50 rounded-lg shadow-sm">
                          <td className="py-2 px-4 font-medium text-gray-700 whitespace-nowrap align-middle">{doc.label}</td>
                          <td className="py-2 px-4 align-middle">
                            {file ? (
                              <span className="flex items-center gap-2 text-green-700">
                                <Check className="inline h-4 w-4" />
                                <a
                                  href={file.url || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline hover:text-green-900 max-w-xs truncate inline-block align-middle"
                                  style={{ maxWidth: 220, verticalAlign: 'middle' }}
                                  title={file.name}
                                >
                                  {file.name && file.name.length > 30 ? file.name.slice(0, 30) + '...' : file.name}
                                </a>
                              </span>
                            ) : (
                              <span className="text-gray-400">Not uploaded</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Academic Results Card (upload or summary) */}
        {(showResultsUpload || showResultsSummary) && (
          <div className="mt-8">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">Academic Results</CardTitle>
                <p className="text-muted-foreground">Upload or view your academic results.</p>
              </CardHeader>
              <CardContent>
                {showResultsUpload && (
                  <div>
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      multiple={false}
                      onChange={handleFileChange}
                    />
                    {resultsUploadStatus && <div className="text-red-500 text-xs mt-1">{resultsUploadStatus}</div>}
                    {selectedFile && <div className="mt-2 text-green-700">{selectedFile.name}</div>}
                    <Button
                      className="mt-4"
                      disabled={!selectedFile}
                      onClick={handleSubmit}
                    >
                      Submit Academic Results
                    </Button>
                  </div>
                )}
                {showResultsSummary && !showResultsUpload && (
                  <div className="flex items-center gap-2 mt-2">
                    <Check className="inline h-4 w-4 text-green-700" />
                    <a
                      href={documents.academicUploads.academicResults.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-green-900 max-w-xs truncate inline-block align-middle"
                      style={{ maxWidth: 220, verticalAlign: 'middle' }}
                      title={documents.academicUploads.academicResults.name}
                    >
                      {documents.academicUploads.academicResults.name && documents.academicUploads.academicResults.name.length > 30
                        ? documents.academicUploads.academicResults.name.slice(0, 30) + '...'
                        : documents.academicUploads.academicResults.name}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  if (status === 'Academic Documents Pending') {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">Academic Document Submission</CardTitle>
            <p className="text-muted-foreground">Please upload your academic documents</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Pre-filled Personal Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Personal Information (Pre-filled and Non-editable)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">First Name</label>
                  <div className="bg-gray-100 p-2 rounded text-gray-700 cursor-not-allowed">{profile?.firstName || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Name</label>
                  <div className="bg-gray-100 p-2 rounded text-gray-700 cursor-not-allowed">{profile?.lastName || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Gender</label>
                  <div className="bg-gray-100 p-2 rounded text-gray-700 cursor-not-allowed">{profile?.gender || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  <div className="bg-gray-100 p-2 rounded text-gray-700 cursor-not-allowed">{profile?.dob || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Mobile Number</label>
                  <div className="bg-gray-100 p-2 rounded text-gray-700 cursor-not-allowed">{profile?.mobile || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* College Information - Pre-filled and Non-editable */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">College Information (Pre-filled and Non-editable)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">College/School Name</label>
                  <div className="bg-gray-100 p-2 rounded text-gray-700 cursor-not-allowed">{documents?.collegeName || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Grade</label>
                  <div className="bg-gray-100 p-2 rounded text-gray-700 cursor-not-allowed">{documents?.grade || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Present Semester</label>
                  <div className="bg-gray-100 p-2 rounded text-gray-700 cursor-not-allowed">{documents?.currentSemester || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Academic Document Uploads</h3>
              <div className="text-xs text-gray-500 mb-2">Max file size: 10MB each. All documents are required.</div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Academic Document Uploads</h3>
                <div className="text-sm text-gray-600 mb-2">
                  Max file size: 10MB each. You can upload multiple files. Please upload the following as applicable:
                </div>
                <ul className="list-disc pl-6 mb-4 text-gray-700">
                  <li>College/School Identification Card <span className="text-red-500">*</span></li>
                  <li>School/College Fees Structure <span className="text-red-500">*</span></li>
                  <li>10th, 12th, Diploma, Semester Marksheet(s) (as applicable)</li>
                </ul>
                <div className="mb-4">
                  <label htmlFor="academic-upload-input" className="cursor-pointer">
                    <Button type="button" asChild className="cursor-pointer">
                      <span>Choose Files</span>
                    </Button>
                  </label>
                  <input
                    id="academic-upload-input"
                    type="file"
                    multiple
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
                {files.length > 0 && (
                  <div className="mb-4">
                    <div className="font-medium mb-1">Selected Files:</div>
                    <ul className="list-decimal pl-6">
                      {files.map((file, idx) => {
                        const maxLen = 40;
                        const name = file.name.length > maxLen ? file.name.slice(0, 20) + '...' + file.name.slice(-12) : file.name;
                        return (
                          <li key={idx} className="flex items-center gap-3 mb-2 bg-gray-100 rounded px-3 py-2">
                            <span className="inline-flex items-center gap-1">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span className="truncate max-w-xs" title={file.name}>{name}</span>
                            </span>
                            <button
                              type="button"
                              className="text-red-600 hover:underline text-xs ml-2"
                              onClick={() => handleRemoveFile(idx)}
                            >
                              Remove
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full mt-4" 
              disabled={files.length === 0}
            >
              Submit Academic Documents
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const submittedStatuses = [
    'Academic Documents Submitted',
    'Eligible for Scholarship',
    'Payment Pending',
    'Paid',
    'Academic results pending',
    'Academic verification pending',
    'Apply for Next',
    'Alumni',
    'Blocked',
  ];

  if (submittedStatuses.includes(status)) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">Academic Documents</CardTitle>
            <p className="text-muted-foreground">Below are your uploaded academic documents.</p>
          </CardHeader>
          <CardContent>
            {/* Above the academic documents card, show the academic results card if present */}
            {showResultStatuses.includes(status) && documents?.academicUploads?.academicResults && (
              <div className="mb-6">
                <div className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Academic Results</h3>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 rounded bg-green-100 text-green-700 font-semibold text-xs hover:bg-green-200 transition"
                        onClick={() => setResultStatus('verified')}
                        type="button"
                      >
                        Verify
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-red-100 text-red-700 font-semibold text-xs hover:bg-red-200 transition"
                        onClick={() => setResultStatus('rejected')}
                        type="button"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <span className="truncate max-w-xs font-medium" title={documents.academicUploads.academicResults.name}>{documents.academicUploads.academicResults.name}</span>
                    </div>
                    {resultStatus === 'verified' && <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-sm"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>Verified</span>}
                    {resultStatus === 'rejected' && <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold text-sm"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>Rejected</span>}
                    {resultStatus === 'pending' && <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold text-sm">Pending</span>}
                  </div>
                </div>
              </div>
            )}
            <div className="overflow-x-auto">
              <ul className="space-y-2">
                {documents?.academicUploads?.uploadedFiles?.map((file: any, idx: number) => {
                  // Mock status: alternate between verified, rejected, pending for demo
                  const statuses = ['verified', 'rejected', 'pending'];
                  const status = statuses[idx % statuses.length];
                  return (
                    <li key={idx} className="flex items-center gap-3 bg-gray-100 rounded px-3 py-2 justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="truncate max-w-xs" title={file.name}>{file.name}</span>
                      </span>
                      {status === 'verified' && <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>Verified</span>}
                      {status === 'rejected' && <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>Rejected</span>}
                      {status === 'pending' && <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-semibold">Pending</span>}
                    </li>
                  );
                })}
              </ul>
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
          <CardTitle className="text-2xl flex items-center justify-center gap-2">Academic Documents Submitted</CardTitle>
          <p className="text-muted-foreground">Your academic documents have been submitted and are under review.</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {academicDocumentTypes.map(doc => (
              <div key={doc.key} className="flex items-center gap-2">
                <span>{doc.label}</span>
                <span className="text-green-600">✔</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}