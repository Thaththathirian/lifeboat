import React, { useState } from 'react';
import { DynamicDocumentUpload } from '@/components/DynamicDocumentUpload';
import { useStudentStatus } from '@/components/layout/StudentStatusProvider';
import { StudentStatus } from '@/types/student';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface DocumentFile {
  id: string;
  name: string;
  file?: File;
  fileData?: string;
  size: number;
  type: string;
  uploadTime: Date;
  status: 'pending' | 'uploaded' | 'error';
}

interface SubmittedDocument {
  id: string;
  filename: string;
  documentName: string;
  size: number;
  type: string;
  uploadTime: Date;
}

const StudentDocuments: React.FC = () => {
  const { setStatus } = useStudentStatus();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submittedDocuments, setSubmittedDocuments] = useState<SubmittedDocument[]>([]);
  const [showSubmittedData, setShowSubmittedData] = useState(false);
  
  const documentSuggestions = [
    'Request Letter',
    'Aadhar card',
    'Residential Proof',
    'Income Certificate',
    'Father Death Certificate',
    'Mother Death Certificate',
  ];

  const requiredDocuments = [
    'Request Letter',
    'Aadhar card',
    'Residential Proof',
    'Income Certificate'
  ];

  const notes = [
    { text: 'Request Letter (Why do you require Scholarship)?', required: true },
    { text: 'Aadhar card', required: true },
    { text: 'Residential Proof', required: true },
    { text: 'Income Certificate of your Parents', required: true },
    { text: 'Death Certificate of your Father (If you have marked "Late")', required: false },
    { text: 'Death Certificate of your Mother (If you have marked "Late")', required: false },
    { text: 'Any other relevant document', required: false }
  ];

  const submitDocumentsToAPI = async (documents: DocumentFile[]) => {
    try {
      // Get the JWT token from localStorage
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Prepare the data to send to API
      const documentsData = documents.map(doc => ({
        id: doc.id,
        filename: doc.file?.name || 'Unknown',
        documentName: doc.name,
        size: doc.size,
        type: doc.type,
        uploadTime: doc.uploadTime
      }));

      // API call to submit documents
      const response = await fetch('http://localhost/lifeboat/Student/personal_documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          documents: documentsData,
          studentId: localStorage.getItem('studentId') || 'unknown',
          submissionTime: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit documents');
      }

      const result = await response.json();
      console.log('Documents submitted successfully:', result);
      
      // Store submitted documents for display
      setSubmittedDocuments(documentsData);
      setShowSubmittedData(true);
      
      return result;
    } catch (error) {
      console.error('Error submitting documents:', error);
      throw error;
    }
  };

  const handleSubmit = async (documents: DocumentFile[]) => {
    try {
      // Show loading toast
      toast({
        title: "Submitting documents...",
        description: "Please wait while we process your documents",
      });

      // Submit to API
      await submitDocumentsToAPI(documents);
      
      // Update status to APPLICATION_SUBMITTED (3) after personal documents are submitted
      setStatus(StudentStatus.APPLICATION_SUBMITTED);
      
      // Show success toast
      toast({
        title: "Documents submitted successfully!",
        description: "Your personal documents have been submitted.",
        variant: "default",
      });

      // Redirect to /student immediately
      navigate('/student');
      
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your documents. Please try again.",
        variant: "destructive",
      });
    }
  };

  // If showing submitted data, display it
  if (showSubmittedData) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Submitted Documents</h1>
          <p className="text-gray-600">Your personal documents have been successfully submitted.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Submitted Documents List</h2>
          <div className="space-y-3">
            {submittedDocuments.map((doc, index) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Total documents submitted: {submittedDocuments.length}
              </p>
              <button
                onClick={() => navigate('/student')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DynamicDocumentUpload
      pageTitle="Personal Documents Upload"
      pageDescription="Upload your personal documents for scholarship application"
      documentSuggestions={documentSuggestions}
      requiredDocuments={requiredDocuments}
      notes={notes}
      localStorageKey="personalDocuments"
      onSubmit={handleSubmit}
      successNavigateTo="/student"
    />
  );
};

export default StudentDocuments;