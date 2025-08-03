import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { usePWA } from '@/hooks/usePWA';
import { 
  Upload, 
  FileText, 
  Image, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  WifiOff,
  Eye
} from 'lucide-react';

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

interface DocumentNote {
  text: string;
  required: boolean;
}

interface DynamicDocumentUploadProps {
  // Page configuration
  pageTitle: string;
  pageDescription: string;
  
  // Document configuration
  documentSuggestions: string[];
  requiredDocuments: string[];
  notes: DocumentNote[];
  
  // Storage configuration
  localStorageKey: string;
  
  // API configuration
  onSubmit: (documents: DocumentFile[]) => Promise<void>;
  
  // Navigation
  successNavigateTo?: string;
  
  // Custom styling
  cardClassName?: string;
  notesCardClassName?: string;
}

export function DynamicDocumentUpload({
  pageTitle,
  pageDescription,
  documentSuggestions,
  requiredDocuments,
  notes,
  localStorageKey,
  onSubmit,
  successNavigateTo,
  cardClassName = "",
  notesCardClassName = "bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-lg"
}: DynamicDocumentUploadProps) {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [editingDocument, setEditingDocument] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [showDocumentNamePopup, setShowDocumentNamePopup] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isOnline } = usePWA();

  // Load documents from localStorage on mount
  useEffect(() => {
    const savedDocuments = localStorage.getItem(localStorageKey);
    if (savedDocuments) {
      try {
        const parsedDocuments = JSON.parse(savedDocuments).map((doc: any) => ({
          ...doc,
          uploadTime: new Date(doc.uploadTime)
        }));
        setDocuments(parsedDocuments);
      } catch (error) {
        console.error(`Error loading documents from localStorage (${localStorageKey}):`, error);
        // Clear corrupted data
        localStorage.removeItem(localStorageKey);
      }
    }
  }, [localStorageKey]);

  // Save documents to localStorage
  useEffect(() => {
    if (documents.length > 0) {
      const serializableDocuments = documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        fileData: doc.fileData,
        size: doc.size,
        type: doc.type,
        uploadTime: doc.uploadTime,
        status: doc.status
      }));
      localStorage.setItem(localStorageKey, JSON.stringify(serializableDocuments));
    }
  }, [documents, localStorageKey]);

  const isRequired = (name: string) => {
    return requiredDocuments.some(req => 
      name.toLowerCase().includes(req.toLowerCase())
    );
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 2MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setShowDocumentNamePopup(true);
      setDocumentName('');
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleDocumentNameChange = (value: string) => {
    setDocumentName(value);
    setShowSuggestions(true);
    setSelectedSuggestionIndex(-1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setDocumentName(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    const filteredSuggestions = documentSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(documentName.toLowerCase())
    );

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < filteredSuggestions.length) {
          handleSuggestionClick(filteredSuggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentName.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a document name",
        variant: "destructive",
      });
      return;
    }

    if (!isOnline) {
      toast({
        title: "Offline",
        description: "Please check your internet connection and try again",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      const newDocument: DocumentFile = {
        id: Date.now().toString(),
        name: documentName.trim(),
        file: selectedFile,
        fileData: fileData,
        size: selectedFile.size,
        type: selectedFile.type,
        uploadTime: new Date(),
        status: 'uploaded'
      };

      setDocuments(prev => [...prev, newDocument]);
      setSelectedFile(null);
      setDocumentName('');
      setShowSuggestions(false);
      setShowDocumentNamePopup(false);

      toast({
        title: "Document uploaded successfully",
        description: `${newDocument.name} has been uploaded`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast({
      title: "Document removed",
      description: "Document has been removed from your uploads",
      variant: "default",
    });
  };

  const handleEditDocument = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      setEditingDocument(id);
      setDocumentName(doc.name);
    }
  };

  const handleSaveEdit = () => {
    if (editingDocument && documentName.trim()) {
      setDocuments(prev => prev.map(doc => 
        doc.id === editingDocument 
          ? { ...doc, name: documentName.trim() }
          : doc
      ));
      setEditingDocument(null);
      setDocumentName('');
      toast({
        title: "Document name updated",
        description: "Document name has been updated successfully",
        variant: "default",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingDocument(null);
    setDocumentName('');
  };



  const handlePreviewDocument = (doc: DocumentFile) => {
    if (doc.type.startsWith('image/')) {
      if (doc.file) {
        const url = URL.createObjectURL(doc.file);
        window.open(url, '_blank');
      } else if (doc.fileData) {
        window.open(doc.fileData, '_blank');
      }
    } else {
      if (doc.file) {
        const url = URL.createObjectURL(doc.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (doc.fileData) {
        const a = document.createElement('a');
        a.href = doc.fileData;
        a.download = doc.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  };

  const handleSubmitApplication = async () => {
    if (documents.length === 0) {
      toast({
        title: "No documents uploaded",
        description: "Please upload at least one document before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call the API (parent component will handle navigation and toasts)
      await onSubmit(documents);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  };



  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{pageTitle}</h1>
          <p className="text-gray-600 text-sm">{pageDescription}</p>
        </div>
      </div>

      {!isOnline && (
        <div className="mb-4 flex items-center gap-2 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
          <WifiOff className="w-4 h-4 text-red-500" />
          <span className="text-red-600">You're offline - Some features may be limited</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Upload and Documents Area - 70% */}
        <div className="lg:col-span-7">
          <Card className={cardClassName}>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                             {/* Upload Form */}
               <div className="space-y-3">
                 <div>
                   <Label htmlFor="file-upload">Select Document</Label>
                   <div className="mt-2">
                     <input
                       id="file-upload"
                       type="file"
                       className="hidden"
                       accept="image/*,.pdf,.doc,.docx,.txt"
                       onChange={handleFileSelect}
                     />
                     <Button 
                       onClick={() => document.getElementById('file-upload')?.click()}
                       disabled={!isOnline}
                       className="w-full"
                     >
                       <Upload className="w-4 h-4 mr-2" />
                       Choose File
                     </Button>
                   </div>
                 </div>
               </div>

              {/* Uploaded Documents - Below Upload Button */}
              {documents.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900">Uploaded Documents</h3>
                    <span className="text-xs text-gray-500">
                      {documents.length} document{documents.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-white border border-gray-200 rounded-lg p-2 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => handlePreviewDocument(doc)}
                      >
                        {/* Document Thumbnail */}
                        <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                          {doc.type.startsWith('image/') ? (
                            <img
                              src={doc.file ? URL.createObjectURL(doc.file) : doc.fileData || ''}
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

                        {/* Document Info - Compact */}
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
                          
                          {/* Status and Required Badge - Compact */}
                          <div className="flex items-center justify-center gap-1 mb-2">
                            {isRequired(doc.name) && (
                              <Badge variant="destructive" className="text-xs px-1 py-0">Required</Badge>
                            )}
                            {getStatusIcon(doc.status)}
                          </div>

                          {/* Action Buttons - Compact */}
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePreviewDocument(doc);
                              }}
                              disabled={!isOnline}
                              className="h-6 px-1 text-xs"
                            >
                              <Eye className="w-2.5 h-2.5 mr-0.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditDocument(doc.id);
                              }}
                              disabled={!isOnline}
                              className="h-6 w-6 p-0"
                            >
                              <Edit3 className="w-2.5 h-2.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveDocument(doc.id);
                              }}
                              disabled={!isOnline}
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
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
        </div>

        {/* Required Documents - 30% */}
        <div className="lg:col-span-3">
          <Card className={notesCardClassName}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-blue-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full shadow-sm"></div>
                Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {notes.map((note, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/50 transition-colors">
                    <div className="flex-shrink-0 mt-0.5">
                      {note.required ? (
                        <div className="w-2 h-2 bg-red-500 rounded-full shadow-sm"></div>
                      ) : (
                        <div className="w-2 h-2 bg-green-500 rounded-full shadow-sm"></div>
                      )}
                    </div>
                    <span className={`text-xs text-gray-800 font-medium leading-relaxed`}>
                      {note.text}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Button - Smaller and at Bottom */}
      <div className="mt-6 lg:col-span-7">
        <div className="flex justify-center">
          <Button
            size="sm"
            className="px-6"
            disabled={!isOnline || documents.length === 0}
            onClick={handleSubmitApplication}
          >
            Submit Documents
          </Button>
        </div>
      </div>

             {/* Document Name Popup Modal */}
       {showDocumentNamePopup && selectedFile && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
             <h3 className="text-lg font-semibold mb-4">Enter Document Name</h3>
             
             {/* File Preview */}
             <div className="mb-4 p-3 bg-gray-50 rounded-lg">
               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                   {selectedFile.type.startsWith('image/') ? (
                     <Image className="w-6 h-6 text-blue-500" />
                   ) : (
                     <FileText className="w-6 h-6 text-gray-500" />
                   )}
                 </div>
                 <div className="flex-1">
                   <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
                   <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                 </div>
               </div>
             </div>
             
             {/* Document Name Input */}
             <div className="mb-4">
               <Label htmlFor="popup-document-name">Document Name</Label>
               <div className="relative mt-2">
                 <Input
                   id="popup-document-name"
                   value={documentName}
                   onChange={(e) => handleDocumentNameChange(e.target.value)}
                   onKeyDown={handleKeyDown}
                   placeholder="Enter document name or select from suggestions..."
                   className="mb-2"
                   autoFocus
                 />
                 {showSuggestions && documentName && (
                   <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                     {documentSuggestions
                       .filter(suggestion => 
                         suggestion.toLowerCase().includes(documentName.toLowerCase())
                       )
                       .map((suggestion, index) => (
                         <button
                           key={index}
                           className={`w-full px-3 py-2 text-left text-sm focus:outline-none ${
                             index === selectedSuggestionIndex 
                               ? 'bg-blue-100 text-blue-900' 
                               : 'hover:bg-gray-100'
                           }`}
                           onClick={() => handleSuggestionClick(suggestion)}
                           onMouseEnter={() => setSelectedSuggestionIndex(index)}
                         >
                           {suggestion}
                         </button>
                       ))}
                   </div>
                 )}
               </div>
             </div>
             
             {/* Action Buttons */}
             <div className="flex gap-2">
               <Button 
                 onClick={handleUpload} 
                 disabled={!documentName.trim() || isUploading}
                 className="flex-1"
               >
                 {isUploading ? (
                   <>
                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                     Uploading...
                   </>
                 ) : (
                   <>
                     <Upload className="w-4 h-4 mr-2" />
                     Upload Document
                   </>
                 )}
               </Button>
               <Button 
                 variant="outline" 
                 onClick={() => {
                   setShowDocumentNamePopup(false);
                   setSelectedFile(null);
                   setDocumentName('');
                   setShowSuggestions(false);
                 }}
                 className="flex-1"
               >
                 Cancel
               </Button>
             </div>
           </div>
         </div>
       )}

       {/* Edit Modal */}
       {editingDocument && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
             <h3 className="text-lg font-semibold mb-4">Edit Document Name</h3>
             <Input
               value={documentName}
               onChange={(e) => setDocumentName(e.target.value)}
               placeholder="Enter new document name..."
               className="mb-4"
             />
             <div className="flex gap-2">
               <Button onClick={handleSaveEdit} className="flex-1">
                 Save
               </Button>
               <Button variant="outline" onClick={handleCancelEdit} className="flex-1">
                 Cancel
               </Button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
} 