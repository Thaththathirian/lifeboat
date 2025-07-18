import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStudent } from "@/contexts/StudentContext";
import { CheckCircle, Clock, Upload, FileText, DollarSign, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DocumentsSubmittedPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Documents Submitted Successfully
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <p className="text-green-800">
              Your documents have been submitted and are under review by our admin team.
              You will be notified once the review is complete.
            </p>
          </div>
          <Badge className="bg-blue-100 text-blue-800">Status: Documents Under Review</Badge>
        </CardContent>
      </Card>
    </div>
  );
}

export function ApprovedPage() {
  const { setStatus } = useStudent();
  
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Application Approved!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <p className="text-green-800 text-lg font-semibold">
              Congratulations! Your scholarship application has been approved.
            </p>
            <p className="text-green-700 mt-2">
              You are now eligible for scholarship funding. Please wait for payment allocation.
            </p>
          </div>
          <Button onClick={() => setStatus('eligible_scholarship')} className="bg-green-600 hover:bg-green-700">
            Continue to Scholarship Eligibility
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function EligibleScholarshipPage() {
  const { setStatus } = useStudent();
  
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            Eligible for Scholarship
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-blue-800 text-lg font-semibold">
              You are now eligible for scholarship funding!
            </p>
            <p className="text-blue-700 mt-2">
              Our admin team will allocate funds and map you with donors. 
              You will receive notification once payment is processed.
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-800 text-sm">
              Expected processing time: 3-5 business days
            </p>
          </div>
          <Button onClick={() => setStatus('payment')} className="bg-blue-600 hover:bg-blue-700">
            Simulate Payment Processing
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function PaymentPendingPage() {
  const { setStatus } = useStudent();
  
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Clock className="h-6 w-6 text-orange-600" />
            Payment Pending
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-orange-50 p-6 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-2">Payment Details</h3>
            <div className="space-y-2 text-orange-700">
              <p><strong>Scholarship Amount:</strong> ₹50,000</p>
              <p><strong>Donor:</strong> Anonymous Donor #1</p>
              <p><strong>Payment Status:</strong> Processing</p>
              <p><strong>Expected Date:</strong> Within 2-3 business days</p>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Next Steps:</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Payment will be transferred to your college account</li>
              <li>• You will receive an email notification</li>
              <li>• Upload fee receipt within 60 days of payment</li>
              <li>• College will verify the receipt</li>
            </ul>
          </div>
          
          <div className="text-center">
            <Button onClick={() => setStatus('active')} className="bg-green-600 hover:bg-green-700">
              Simulate Payment Completion
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ActiveStudentPage() {
  const { setStatus } = useStudent();
  
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Active Scholarship Student
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Payment Received!</h3>
            <div className="grid grid-cols-2 gap-4 text-green-700">
              <div>
                <p><strong>Amount Received:</strong> ₹50,000</p>
                <p><strong>Payment Date:</strong> 2024-07-08</p>
              </div>
              <div>
                <p><strong>Donor:</strong> Anonymous Donor #1</p>
                <p><strong>Status:</strong> Verified ✓</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-4">Upload Fee Receipt</h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-blue-700">Upload your college fee receipt here</p>
                <p className="text-xs text-blue-600 mt-1">Deadline: 60 days from payment date</p>
                <Button variant="outline" className="mt-2">Choose File</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={() => setStatus('academic_documents_pending')} className="bg-blue-600 hover:bg-blue-700">
              Upload Academic Results
            </Button>
            <Button onClick={() => setStatus('apply_next')} variant="outline">
              Apply for Next Semester
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function UploadResultsPage() {
  const { setStatus } = useStudent();
  
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Upload Academic Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-blue-800">
              Please upload your latest semester marksheets and academic results for verification.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <label className="text-sm font-medium">Current Semester Marksheet <span className="text-red-500">*</span></label>
              <p className="text-xs text-gray-500 mb-2">Maximum file size: 10MB</p>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="w-full" />
            </div>

            <div className="border rounded-lg p-4">
              <label className="text-sm font-medium">Previous Semester Results</label>
              <p className="text-xs text-gray-500 mb-2">Maximum file size: 10MB each, up to 3 files</p>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="w-full" />
            </div>
          </div>

          <Button onClick={() => setStatus('academic_documents_submitted')} className="w-full">
            Submit Academic Results
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function ResultsUploadedPage() {
  const { setStatus } = useStudent();
  
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Results Uploaded Successfully
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <p className="text-green-800">
              Your academic results have been submitted and are being verified by your institution.
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-800 text-sm">
              Verification typically takes 3-5 business days. You will be notified once verified.
            </p>
          </div>
          
          <Button onClick={() => setStatus('apply_next')} className="bg-blue-600 hover:bg-blue-700">
            Continue to Next Application
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function AlumniPage() {
  const { setStatus } = useStudent();
  
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <GraduationCap className="h-6 w-6 text-purple-600" />
            Congratulations, Alumni!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-purple-50 p-6 rounded-lg">
            <p className="text-purple-800 text-lg font-semibold">
              You have successfully completed your studies!
            </p>
            <p className="text-purple-700 mt-2">
              Welcome to our alumni community. Thank you for being part of our scholarship program.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Your Journey Summary</h3>
            <div className="text-blue-700 space-y-1">
              <p><strong>Total Scholarship Received:</strong> ₹2,00,000</p>
              <p><strong>Study Duration:</strong> 4 years</p>
              <p><strong>Completion Date:</strong> 2024-07-08</p>
            </div>
          </div>

          <div className="space-y-4">
            <Button onClick={() => setStatus('login')} className="w-full bg-purple-600 hover:bg-purple-700">
              Apply Again (New Course)
            </Button>
            <Button variant="outline" className="w-full">
              Join Alumni Network
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}