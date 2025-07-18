import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStudent } from "@/contexts/StudentContext";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function StudentInterview() {
  const { setStatus } = useStudent();

  const interviewDetails = {
    date: "2024-07-15",
    time: "10:00 AM",
    location: "Scholarship Office, Room 201",
    interviewer: "Dr. Rajesh Kumar",
    mode: "In-Person"
  };

  const handleProceedToDocuments = () => {
    setStatus('documents');
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <User className="h-6 w-6" />
            Interview Scheduled
          </CardTitle>
          <p className="text-muted-foreground">Your interview has been scheduled. Please review the details below.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-blue-900">Interview Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{interviewDetails.date}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium">{interviewDetails.time}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{interviewDetails.location}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Interviewer</p>
                  <p className="font-medium">{interviewDetails.interviewer}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {interviewDetails.mode}
              </Badge>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Important Instructions:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Please arrive 15 minutes before the scheduled time</li>
              <li>• Bring a printed copy of your application</li>
              <li>• Carry a valid photo ID (Aadhar/Passport/Driving License)</li>
              <li>• Dress formally for the interview</li>
              <li>• Be prepared to discuss your academic goals and financial need</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">What to Expect:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Interview duration: 20-30 minutes</li>
              <li>• Questions about academic background and goals</li>
              <li>• Discussion about financial circumstances</li>
              <li>• Opportunity to ask questions about the scholarship</li>
            </ul>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              If you need to reschedule, please contact us at least 24 hours in advance.
            </p>
            
            <Button onClick={handleProceedToDocuments} className="w-full">
              Continue to Document Upload
            </Button>
            
            <p className="text-xs text-gray-500">
              Note: This is a demo. In the actual system, you would wait for interview completion.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}