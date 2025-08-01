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
import { Upload, FileText, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useStudentStatus } from '@/components/layout/StudentStatusProvider';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { StudentStatus } from '@/types/student';

const documentsSchema = z.object({
  collegeName: z.string().min(1, "College name is required"),
  grade: z.string().min(1, "Grade is required"),
  otherGrade: z.string().optional(),
  currentSemester: z.string().optional(),
});

type DocumentsForm = z.infer<typeof documentsSchema>;

const documentTypes = [
  { key: "requestLetter", label: "Request Letter (Why do you require Scholarship)?", required: true },
  { key: "residentialProof", label: "Residential Proof", required: true },
  { key: "deathCertFather", label: "Death Certificate of your Father (If applicable)", required: false },
  { key: "deathCertMother", label: "Death Certificate of your Mother (If applicable)", required: false },
  { key: "incomeCert", label: "Income Certificate of your Parents", required: true },
  { key: "otherDocs", label: "Any other relevant document", required: false },
];

const registeredColleges = [
  { id: 'COL001', name: 'Mumbai University', place: 'Mumbai' },
  { id: 'COL002', name: 'Delhi College of Engineering', place: 'Delhi' },
  { id: 'COL003', name: 'Chennai Medical College', place: 'Chennai' },
];

export default function StudentDocuments() {
  const { profile, application, documents, setDocuments } = useStudent();
  const { status, setStatus } = useStudentStatus();
  const [uploads, setUploads] = useState<{[key: string]: File | null}>({});
  const [uploadStatus, setUploadStatus] = useState<{[key: string]: string}>({});
  const [selectedCollege, setSelectedCollege] = useState('');
  const [isOtherCollege, setIsOtherCollege] = useState(false);
  const [isOtherGrade, setIsOtherGrade] = useState(false);

  const form = useForm<DocumentsForm>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      collegeName: "",
      grade: "",
      otherGrade: "",
      currentSemester: "",
    }
  });

  const handleFileUpload = (key: string, file: File | null) => {
    if (file && file.size > 10 * 1024 * 1024) {
      setUploadStatus(prev => ({ ...prev, [key]: "File too large (max 10MB)" }));
      setUploads(prev => ({ ...prev, [key]: null }));
      return;
    }
    setUploads(prev => ({ ...prev, [key]: file }));
    setUploadStatus(prev => ({ ...prev, [key]: file ? "Uploaded" : "" }));
  };

  const handleSubmit = (data: DocumentsForm) => {
    const requiredDocs = documentTypes.filter(doc => doc.required);
    const hasAllRequired = requiredDocs.every(doc => uploads[doc.key]);
    
    if (!hasAllRequired) {
      alert("Please upload all required documents");
      return;
    }

    // Use otherGrade if grade is 'other'
    const gradeToSave = data.grade === 'other' ? data.otherGrade : data.grade;
    setDocuments({ ...data, grade: gradeToSave, uploads });
    setStatus(StudentStatus.APPLICATION_SUBMITTED);
  };

  const requiredDocs = documentTypes.filter(doc => doc.required);
  const hasAllRequired = requiredDocs.every(doc => uploads[doc.key]);

  // List of statuses where documents should be visible in read-only mode
  const readOnlyStatuses = [
    StudentStatus.APPLICATION_SUBMITTED,
    StudentStatus.INTERVIEW_SCHEDULED,
    StudentStatus.ELIGIBLE_FOR_SCHOLARSHIP,
    StudentStatus.PAYMENT_PENDING,
    StudentStatus.PAID,
    StudentStatus.ACADEMIC_DOCUMENTS_PENDING,
    StudentStatus.ACADEMIC_DOCUMENTS_SUBMITTED,
    StudentStatus.ALUMNI,
    StudentStatus.BLOCKED,
  ];

  if (status === StudentStatus.PERSONAL_DETAILS_PENDING) {
    return (
      <div className="text-center text-lg text-gray-500 py-16">
        Please complete your profile update before accessing this section.
      </div>
    );
  }

  if (status === StudentStatus.PERSONAL_DOCUMENTS_PENDING) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <FileText className="h-6 w-6" />
              Scholarship Document Submission
            </CardTitle>
            <p className="text-muted-foreground">Please fill the form and upload required scholarship documents</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Pre-filled Personal Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Personal Information (Pre-filled)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">First Name <span className='text-red-500'>*</span></label>
                  <div className="bg-gray-100 p-2 rounded text-gray-700 cursor-not-allowed">{(profile?.firstName || application?.profile?.firstName || 'N/A')}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Name <span className='text-red-500'>*</span></label>
                  <div className="bg-gray-100 p-2 rounded text-gray-700 cursor-not-allowed">{(profile?.lastName || application?.profile?.lastName || 'N/A')}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Gender <span className='text-red-500'>*</span></label>
                  <div className="bg-gray-100 p-2 rounded text-gray-700 cursor-not-allowed">{(profile?.gender || application?.profile?.gender || 'N/A')}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth <span className='text-red-500'>*</span></label>
                  <div className="bg-gray-100 p-2 rounded text-gray-700 cursor-not-allowed">{(profile?.dob || application?.profile?.dob || 'N/A')}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Mobile Number <span className='text-red-500'>*</span></label>
                  <div className="bg-gray-100 p-2 rounded text-gray-700 cursor-not-allowed">{(profile?.mobile || application?.profile?.mobile || 'N/A')}</div>
                </div>
              </div>
            </div>

            {/* College Information Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">College Information</h3>
                  <FormField
                    control={form.control}
                    name="collegeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>College/School Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={value => {
                              setSelectedCollege(value);
                              setIsOtherCollege(value === 'other');
                              if (value !== 'other') {
                                field.onChange(value);
                              } else {
                                field.onChange('');
                              }
                            }}
                            value={selectedCollege || (isOtherCollege ? 'other' : '')}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select college or school" />
                            </SelectTrigger>
                            <SelectContent>
                              {registeredColleges.map(col => (
                                <SelectItem key={col.id} value={`${col.name}, ${col.place}`}>
                                  {col.name}, {col.place}
                                </SelectItem>
                              ))}
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        {isOtherCollege && (
                          <Input
                            className="mt-2"
                            placeholder="Enter college or school name"
                            onChange={e => field.onChange(e.target.value)}
                            required
                          />
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="grade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={value => {
                            field.onChange(value);
                            setIsOtherGrade(value === 'other');
                            if (value !== 'other') {
                              form.setValue('otherGrade', '');
                            }
                          }} value={field.value} required>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select grade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="10th">10th Standard</SelectItem>
                              <SelectItem value="12th">12th Standard</SelectItem>
                              <SelectItem value="bcom">B.Com</SelectItem>
                              <SelectItem value="bca">B.C.A</SelectItem>
                              <SelectItem value="btech">B.Tech</SelectItem>
                              <SelectItem value="be">B.E</SelectItem>
                              <SelectItem value="mca">M.C.A</SelectItem>
                              <SelectItem value="mtech">M.Tech</SelectItem>
                              <SelectItem value="me">M.E</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {isOtherGrade && (
                            <FormField
                              control={form.control}
                              name="otherGrade"
                              render={({ field: otherField }) => (
                                <Input
                                  className="mt-2"
                                  placeholder="Enter your degree/class (e.g., 8th Standard, Diploma, etc.)"
                                  {...otherField}
                                  required
                                />
                              )}
                            />
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currentSemester"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Present Semester</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 1 or 2 or 6" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Document Uploads</h3>
                  <div className="text-xs text-gray-500 mb-2">Max file size: 10MB. Required documents are marked with <span className='text-red-500'>*</span>.</div>
                  {documentTypes.map(doc => (
                    <div key={doc.key} className="flex flex-col md:flex-row md:items-center gap-3">
                      <label className="flex-1">
                        {doc.label} {doc.required && <span className="text-red-500">*</span>}
                        <span className="ml-2 text-xs text-gray-500">(max 10MB)</span>
                      </label>
                      {!uploads[doc.key] && (
                        <Input
                          type="file"
                          accept="application/pdf,image/*"
                          className="flex-1"
                          onChange={e => handleFileUpload(doc.key, e.target.files?.[0] || null)}
                        />
                      )}
                      {uploads[doc.key] && uploadStatus[doc.key] === "Uploaded" && (
                        <TooltipProvider>
                          <span className="text-green-600 flex items-center gap-1">
                            <Check size={16}/>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span style={{ cursor: 'pointer', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                  {uploads[doc.key]?.name.length > 20
                                    ? uploads[doc.key]?.name.slice(0, 20) + '...'
                                    : uploads[doc.key]?.name}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                {uploads[doc.key]?.name}
                              </TooltipContent>
                            </Tooltip>
                            <button
                              type="button"
                              className="ml-2 text-red-500 hover:text-red-700 text-xs border border-red-200 rounded px-2 py-0.5"
                              onClick={() => {
                                setUploads(prev => ({ ...prev, [doc.key]: null }));
                                setUploadStatus(prev => ({ ...prev, [doc.key]: "" }));
                              }}
                              aria-label={`Remove ${doc.label}`}
                            >Remove</button>
                          </span>
                        </TooltipProvider>
                      )}
                      {uploadStatus[doc.key] && uploadStatus[doc.key] !== "Uploaded" && (
                        <span className="text-red-500 text-xs">{uploadStatus[doc.key]}</span>
                      )}
                    </div>
                  ))}
                </div>

                <Button type="submit" className="w-full mt-4" disabled={!hasAllRequired}>
                  Submit Documents
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // For all other statuses, always show a summary of uploaded documents if available
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">Scholarship Documents</CardTitle>
          <p className="text-muted-foreground">Below are your uploaded scholarship documents.</p>
        </CardHeader>
        <CardContent>
          {documents && documents.uploads ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentTypes.map(doc => (
                <div key={doc.key} className="flex items-center gap-2 min-h-[40px]">
                  <span className="font-medium text-sm w-1/2 md:w-auto" style={{ minWidth: 120 }}>{doc.label}</span>
                  {documents.uploads[doc.key] && typeof documents.uploads[doc.key] === 'object' && 'name' in documents.uploads[doc.key] ? (
                    <TooltipProvider>
                      <span className="flex items-center gap-1 text-green-600">
                        <Check size={16} />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {documents.uploads[doc.key].url ? (
                              <a
                                href={documents.uploads[doc.key].url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                                style={{
                                  maxWidth: 180,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  display: 'inline-block',
                                }}
                              >
                                {documents.uploads[doc.key].name.length > 25
                                  ? documents.uploads[doc.key].name.slice(0, 25) + '...'
                                  : documents.uploads[doc.key].name}
                              </a>
                            ) : (
                              <span
                                style={{
                                  maxWidth: 180,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  display: 'inline-block',
                                }}
                              >
                                {documents.uploads[doc.key].name.length > 25
                                  ? documents.uploads[doc.key].name.slice(0, 25) + '...'
                                  : documents.uploads[doc.key].name}
                              </span>
                            )}
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            {documents.uploads[doc.key].name}
                          </TooltipContent>
                        </Tooltip>
                      </span>
                    </TooltipProvider>
                  ) : (
                    <span className="text-gray-400">Not uploaded</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No documents uploaded yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}