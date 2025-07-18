import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStudent } from "@/contexts/StudentContext";
import { useStudentStatus } from '@/components/layout/StudentStatusProvider';
import { useToast } from "@/hooks/use-toast";
import { Calendar, User, Phone, Mail, GraduationCap, MessageSquare } from "lucide-react";

export default function FutureReadyModule() {
  const { profile, setProfile } = useStudent();
  const { status, setStatus } = useStudentStatus();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    studentName: profile?.firstName && profile?.lastName ? `${profile.firstName} ${profile.lastName}` : "",
    studentId: "STU" + Math.random().toString(36).substr(2, 8).toUpperCase(),
    phone: profile?.mobile || "",
    email: profile?.email || "",
    collegeName: profile?.collegeName || "",
    futureReadyDate: new Date().toISOString().split('T')[0], // Today's date as default
    remarks: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update profile with future ready module data
    setProfile({
      ...profile,
      futureReadyModule: {
        ...formData,
        submittedAt: new Date().toISOString()
      }
    });
    
    // Show success toast
    toast({
      title: "Future Ready Module Submitted Successfully!",
      description: "Your future ready module details have been submitted.",
      variant: "default",
    });
  };

  // If status is not Future Ready Module, show read-only view
  if (status !== 'Future Ready Module') {
    const futureReadyData = profile?.futureReadyModule;
    if (!futureReadyData) {
      return (
        <div className="max-w-2xl mx-auto py-10 px-4 text-center text-gray-600">
          Future Ready Module is not available for your current status.
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <GraduationCap className="h-6 w-6" />
              Future Ready Module Summary
            </CardTitle>
            <p className="text-muted-foreground">Your submitted future ready module details (read-only)</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><b>Student Name:</b> {futureReadyData.studentName}</div>
              <div><b>Student ID:</b> {futureReadyData.studentId}</div>
              <div><b>Phone:</b> {futureReadyData.phone}</div>
              <div><b>Email:</b> {futureReadyData.email}</div>
              <div><b>College Name:</b> {futureReadyData.collegeName}</div>
              <div><b>Future Ready Date:</b> {futureReadyData.futureReadyDate}</div>
              <div className="md:col-span-2"><b>Remarks:</b> {futureReadyData.remarks}</div>
            </div>
            {futureReadyData.submittedAt && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Submitted on: {new Date(futureReadyData.submittedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Future Ready Module
          </CardTitle>
          <p className="text-muted-foreground">Please fill out your future ready module details</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Student Name - Auto-filled */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <User className="inline h-4 w-4 mr-2" />
                Student Name <span className="text-red-500">*</span>
              </label>
              <Input 
                value={formData.studentName}
                onChange={(e) => handleInputChange('studentName', e.target.value)}
                required
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-muted-foreground mt-1">Auto-filled from your profile</p>
            </div>

            {/* Student ID - Auto-generated */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <User className="inline h-4 w-4 mr-2" />
                Student ID <span className="text-red-500">*</span>
              </label>
              <Input 
                value={formData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                required
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-muted-foreground mt-1">Auto-generated</p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Phone className="inline h-4 w-4 mr-2" />
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input 
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Mail className="inline h-4 w-4 mr-2" />
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input 
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            {/* College Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <GraduationCap className="inline h-4 w-4 mr-2" />
                College Name <span className="text-red-500">*</span>
              </label>
              <Input 
                placeholder="Enter your college name"
                value={formData.collegeName}
                onChange={(e) => handleInputChange('collegeName', e.target.value)}
                required
              />
            </div>

            {/* Future Ready Date */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Calendar className="inline h-4 w-4 mr-2" />
                Future Ready Date <span className="text-red-500">*</span>
              </label>
              <Input 
                type="date"
                value={formData.futureReadyDate}
                onChange={(e) => handleInputChange('futureReadyDate', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Default is today's date</p>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <MessageSquare className="inline h-4 w-4 mr-2" />
                Remarks
              </label>
              <Textarea 
                placeholder="Enter any additional remarks or comments"
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex justify-center">
              <Button type="submit" className="w-full md:w-auto px-8">
                Submit Future Ready Module
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 