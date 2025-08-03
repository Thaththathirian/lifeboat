import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Image, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadTime: Date;
  status?: 'pending' | 'uploaded' | 'error' | 'verified' | 'rejected';
}

interface SubmittedDocumentsDisplayProps {
  documents?: DocumentFile[];
  title?: string;
  description?: string;
  localStorageKey?: string;
}

const SubmittedDocumentsDisplay: React.FC<SubmittedDocumentsDisplayProps> = ({ 
  documents = [], 
  title = "Submitted Documents",
  description = "Your uploaded documents are being reviewed by our team.",
  localStorageKey
}) => {
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'uploaded':
        return <Badge variant="default" className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Uploaded</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  // Load documents from localStorage if no documents provided
  React.useEffect(() => {
    if (localStorageKey && documents.length === 0) {
      const savedDocuments = localStorage.getItem(localStorageKey);
      if (savedDocuments) {
        try {
          const parsedDocuments = JSON.parse(savedDocuments).map((doc: any) => ({
            ...doc,
            uploadTime: new Date(doc.uploadTime)
          }));
          // Update the documents state if this component had state management
          // For now, this just loads the data for display
        } catch (error) {
          console.error(`Error loading documents from localStorage (${localStorageKey}):`, error);
        }
      }
    }
  }, [localStorageKey, documents.length]);

  if (documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No documents have been submitted yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getFileIcon(doc.type)}
                <div>
                  <p className="font-medium text-sm">{doc.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(doc.size)} • {doc.uploadTime.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(doc.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmittedDocumentsDisplay; 