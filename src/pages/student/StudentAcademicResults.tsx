import { useState } from "react";
import { useStudentStatus } from '@/components/layout/StudentStatusProvider';
import { CheckCircle, Upload, XCircle } from 'lucide-react';
import { StudentStatus } from '@/types/student';

const results = [
  {
    semester: "1st Semester",
    cgpa: 8.5,
    subjects: [
      { name: "Mathematics", grade: "A", marks: 85 },
      { name: "Physics", grade: "A-", marks: 82 },
      { name: "Chemistry", grade: "B+", marks: 78 },
      { name: "English", grade: "A", marks: 88 }
    ]
  },
  {
    semester: "2nd Semester", 
    cgpa: 8.8,
    subjects: [
      { name: "Advanced Mathematics", grade: "A", marks: 87 },
      { name: "Mechanics", grade: "A", marks: 89 },
      { name: "Organic Chemistry", grade: "A-", marks: 84 },
      { name: "Computer Science", grade: "A+", marks: 92 }
    ]
  }
];

export default function StudentAcademicResults() {
  const { status, setStatus } = useStudentStatus();
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'rejected'>('pending'); // Simulate verification

  if (status === StudentStatus.BLOCKED) {
    return <div className="max-w-2xl mx-auto py-10 px-4 text-center text-red-600 font-bold text-xl">Your account has been blocked. Please contact support.</div>;
  }
  if (status === StudentStatus.ACADEMIC_DOCUMENTS_PENDING) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <h2 className="text-2xl font-bold mb-6">Academic Documents Pending</h2>
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="font-semibold mb-2 flex items-center gap-2"><Upload className="h-5 w-5 text-blue-600" /> Upload Academic Documents</div>
          <div className="text-xs text-gray-600 mb-2">You can upload up to 5 files (PDF/image, max 10MB each).</div>
          <input
            type="file"
            accept="application/pdf,image/*"
            multiple
            onChange={e => {
              const selected = Array.from(e.target.files || []);
              if (selected.length + files.length > 5) {
                setError('You can upload up to 5 files.');
                return;
              }
              if (selected.some(f => f.size > 10 * 1024 * 1024)) {
                setError('Each file must be less than 10MB.');
                return;
              }
              setFiles(prev => [...prev, ...selected]);
              setError('');
            }}
            disabled={files.length >= 5}
          />
          {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
          <div className="mt-3 space-y-2">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm bg-gray-50 rounded px-2 py-1">
                <span>{file.name}</span>
                <button className="text-xs text-red-500 underline" onClick={() => setFiles(files.filter((_, i) => i !== idx))}>Remove</button>
              </div>
            ))}
          </div>
          <button
            className="mt-4 w-full bg-blue-600 text-white rounded py-2 font-semibold disabled:opacity-50"
            disabled={files.length === 0}
            onClick={() => { setStatus(StudentStatus.ACADEMIC_DOCUMENTS_SUBMITTED); }}
          >
            Submit Academic Documents
          </button>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-700 text-sm">
          Please upload your latest academic documents. Your documents will be reviewed and verified by the admin/college.
        </div>
      </div>
    );
  }
  if (status === StudentStatus.ACADEMIC_DOCUMENTS_SUBMITTED) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <h2 className="text-2xl font-bold mb-6">Academic Documents Submitted</h2>
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="font-semibold mb-2 flex items-center gap-2"><Upload className="h-5 w-5 text-blue-600" /> Uploaded Academic Documents</div>
          <div className="mt-3 space-y-2">
            {files.length === 0 ? (
              <div className="text-gray-500">No files uploaded.</div>
            ) : files.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm bg-gray-50 rounded px-2 py-1">
                <span>{file.name}</span>
                {verificationStatus === 'verified' && (
                  <span className="text-green-600 flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Verified</span>
                )}
                {verificationStatus === 'rejected' && (
                  <span className="text-red-600 flex items-center gap-1"><XCircle className="h-4 w-4" /> Rejected</span>
                )}
                {verificationStatus === 'pending' && (
                  <span className="text-yellow-600 font-semibold text-xs bg-yellow-100 rounded px-2 py-1">Pending Verification</span>
                )}
              </div>
            ))}
          </div>
          {/* Simulate verification toggle for demo */}
          <div className="flex gap-4 mt-4">
            <button
              className="w-full bg-green-600 text-white rounded py-2 font-semibold"
              onClick={() => setVerificationStatus('verified')}
              disabled={verificationStatus === 'verified'}
            >
              Mark as Verified
            </button>
            <button
              className="w-full bg-red-600 text-white rounded py-2 font-semibold"
              onClick={() => setVerificationStatus('rejected')}
              disabled={verificationStatus === 'rejected'}
            >
              Mark as Rejected
            </button>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-700 text-sm">
          {verificationStatus === 'verified' && 'Your academic documents have been verified. Thank you!'}
          {verificationStatus === 'rejected' && 'Your academic documents have been rejected. Please contact your college/admin for more information.'}
          {verificationStatus === 'pending' && 'Your documents are under review. You will be notified once they are verified.'}
        </div>
      </div>
    );
  }
  // Show summary for Apply for Next and later statuses
  const summaryStatuses = [
    StudentStatus.ALUMNI,
  ];
  if (summaryStatuses.includes(status)) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <h2 className="text-2xl font-bold mb-6">Academic Documents</h2>
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="font-semibold mb-2 flex items-center gap-2"><Upload className="h-5 w-5 text-blue-600" /> Uploaded Academic Documents</div>
          <div className="mt-3 space-y-2">
            {files.length === 0 ? (
              <div className="text-gray-500">No files uploaded.</div>
            ) : files.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm bg-gray-50 rounded px-2 py-1">
                <span>{file.name}</span>
                {verificationStatus === 'verified' && (
                  <span className="text-green-600 flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Verified</span>
                )}
                {verificationStatus === 'rejected' && (
                  <span className="text-red-600 flex items-center gap-1"><XCircle className="h-4 w-4" /> Rejected</span>
                )}
                {verificationStatus === 'pending' && (
                  <span className="text-yellow-600 font-semibold text-xs bg-yellow-100 rounded px-2 py-1">Pending Verification</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-700 text-sm">
          {verificationStatus === 'verified' && 'Your academic documents have been verified. Thank you!'}
          {verificationStatus === 'rejected' && 'Your academic documents have been rejected. Please contact your college/admin for more information.'}
          {verificationStatus === 'pending' && 'Your documents are under review. You will be notified once they are verified.'}
        </div>
      </div>
    );
  }
  return <div className="max-w-2xl mx-auto py-10 px-4 text-center text-gray-600 font-bold text-xl">Academic documents are not available at this stage.</div>;
} 