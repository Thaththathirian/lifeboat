import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, X, FileText, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedDocument {
  id: string;
  name: string;
  file: File;
  uploadedAt: Date;
}

interface DocumentUploadProps {
  title: string;
  description: string;
  requiredDocs: string[];
  onSubmit: (documents: UploadedDocument[]) => void;
  submittedDocuments?: UploadedDocument[];
  isReadOnly?: boolean;
}

export function DocumentUpload({
  title,
  description,
  requiredDocs,
  onSubmit,
  submittedDocuments,
  isReadOnly = false
}: DocumentUploadProps) {
  const [documents, setDocuments] = useState<UploadedDocument[]>(submittedDocuments || []);
  const [documentName, setDocumentName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 2MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleAddDocument = () => {
    if (!selectedFile || !documentName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both document name and file",
        variant: "destructive",
      });
      return;
    }

    const newDocument: UploadedDocument = {
      id: Date.now().toString(),
      name: documentName.trim(),
      file: selectedFile,
      uploadedAt: new Date(),
    };

    setDocuments([...documents, newDocument]);
    setDocumentName("");
    setSelectedFile(null);
    
    // Reset file input
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    toast({
      title: "Document added",
      description: "Document has been added to your upload list",
    });
  };

  const handleRemoveDocument = (id: string) => {
    if (isReadOnly) return;
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleSubmitAll = () => {
    if (documents.length === 0) {
      toast({
        title: "No documents",
        description: "Please add at least one document before submitting",
        variant: "destructive",
      });
      return;
    }

    onSubmit(documents);
    toast({
      title: "Documents submitted",
      description: "Your documents have been submitted successfully",
    });
  };

  const handleViewDocument = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <p className="text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Required Documents List */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-blue-900">Required Documents:</h3>
            <ul className="space-y-2">
              {requiredDocs.map((doc, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-sm text-blue-800">{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {!isReadOnly && (
            <>
              {/* Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Upload Document</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select a file and provide a name for your document
                  </p>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Document Name
                    </label>
                    <Input
                      placeholder="Enter document name (e.g., Income Certificate)"
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select File (Max 2MB)
                    </label>
                    <Input
                      id="file-input"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileSelect}
                    />
                  </div>

                  <Button onClick={handleAddDocument} className="w-full">
                    Add Document
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Uploaded Documents List */}
          {documents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {isReadOnly ? 'Submitted Documents' : 'Documents to Submit'}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {documents.map((doc) => (
                  <Card key={doc.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-500">
                            {doc.file.name} • {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <p className="text-xs text-gray-400">
                            Uploaded: {doc.uploadedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocument(doc.file)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {!isReadOnly && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveDocument(doc.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {!isReadOnly && documents.length > 0 && (
            <div className="text-center">
              <Button onClick={handleSubmitAll} size="lg" className="px-8">
                Submit All Documents
              </Button>
            </div>
          )}

          {isReadOnly && (
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Documents Submitted
              </Badge>
              <p className="text-sm text-green-700 mt-2">
                These documents have been submitted and are under review
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}