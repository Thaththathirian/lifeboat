import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Image, CheckCircle, Clock, AlertCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '@/contexts/StudentContext';
import SubmittedDocumentsDisplay from '@/components/SubmittedDocumentsDisplay';

interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadTime: Date;
  fileData?: string;
  status?: 'pending' | 'uploaded' | 'error' | 'verified' | 'rejected';
}

const StudentApplicationReview: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useStudent();
  const [personalDocuments, setPersonalDocuments] = useState<DocumentFile[]>([]);

  // Load personal documents from localStorage
  useEffect(() => {
    const savedDocuments = localStorage.getItem('personalDocuments');
    if (savedDocuments) {
      try {
        const parsedDocuments = JSON.parse(savedDocuments).map((doc: any) => ({
          ...doc,
          uploadTime: new Date(doc.uploadTime),
          status: 'pending' // Set status to pending for review
        }));
        setPersonalDocuments(parsedDocuments);
      } catch (error) {
        console.error('Error loading personal documents:', error);
      }
    }
  }, []);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="w-8 h-8 text-blue-500" />;
    }
    return <FileText className="w-8 h-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handlePreviewDocument = (doc: DocumentFile) => {
    if (doc.fileData) {
      window.open(doc.fileData, '_blank');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Review</h1>
        <p className="text-gray-600">Your application has been submitted and is under review</p>
      </div>

      {/* Application Status Card */}
      <Card className="mb-6 border-l-4 border-l-yellow-500">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            Application Status: Under Review
          </CardTitle>
          <p className="text-muted-foreground">
            Your application has been successfully submitted and is currently being reviewed by our team.
            You will be notified once the review is complete.
          </p>
        </CardHeader>
      </Card>

      {/* Profile Details */}
      {profile && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Profile Details</CardTitle>
            <p className="text-muted-foreground">Your submitted profile information</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Section 1: Personal Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3 text-blue-600">Section 1: Personal Information</h3>
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
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-600">Section 2: Academic & Family Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><b>Grade:</b> {profile?.grade || '-'}</div>
                  <div><b>Present Semester:</b> {profile?.presentSemester || '-'}</div>
                  <div><b>Academic Year:</b> {profile?.academicYear || '-'}</div>
                  <div><b>College Name:</b> {profile?.collegeName || '-'}</div>
                  <div><b>College Phone:</b> {profile?.collegePhone || '-'}</div>
                  <div><b>College Email:</b> {profile?.collegeEmail || '-'}</div>
                  <div><b>College Address:</b> {profile?.collegeAddress || '-'}</div>
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
                <div className="mt-4">
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

            {profile?.submittedAt && (
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Submitted on: {new Date(profile.submittedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Submitted Documents */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Submitted Documents</CardTitle>
          <p className="text-muted-foreground">Your uploaded personal documents</p>
        </CardHeader>
        <CardContent>
          {personalDocuments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No documents have been submitted yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {personalDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white border border-gray-200 rounded-lg p-2 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handlePreviewDocument(doc)}
                  >
                    {/* Document Thumbnail */}
                    <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                      {doc.type.startsWith('image/') ? (
                        <img
                          src={doc.fileData || ''}
                          alt={doc.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = `
                              <div class="flex flex-col items-center text-gray-500">
                                <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span class="text-xs mt-1 text-center">IMAGE</span>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-500">
                          {getFileIcon(doc.type)}
                          <span className="text-xs mt-1 text-center">{doc.type.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                        </div>
                      )}
                    </div>

                    {/* Document Info */}
                    <div className="text-center w-full">
                      <h3 
                        className="font-medium text-gray-900 text-xs truncate mb-1 cursor-help w-full px-1 max-w-[120px]"
                        title={doc.name}
                      >
                        {doc.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-1">
                        {formatFileSize(doc.size)}
                      </p>
                      
                      {/* Status Badge */}
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          <Clock className="w-2.5 h-2.5 mr-0.5" />
                          Pending
                        </Badge>
                      </div>

                      {/* View Button */}
                      <div className="flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewDocument(doc);
                          }}
                          className="h-6 px-1 text-xs"
                        >
                          <Eye className="w-2.5 h-2.5 mr-0.5" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/student')}
        >
          Back to Dashboard
        </Button>
        <Button
          onClick={() => navigate('/student/personal-documents')}
        >
          Upload More Documents
        </Button>
      </div>
    </div>
  );
};

export default StudentApplicationReview; 