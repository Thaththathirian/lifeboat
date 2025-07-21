import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStudent } from "@/contexts/StudentContext";
import { User } from "lucide-react";
import ProfileForm from "@/components/ProfileForm";

export default function StudentProfile() {
  const { profile } = useStudent();

  // Check if profile is approved
  const isProfileApproved = profile?.status === 'approved';

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 md:py-10 px-2 sm:px-4">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <User className="h-6 w-6" />
            Profile
          </CardTitle>
          <p className="text-muted-foreground">
            {isProfileApproved 
              ? "Your approved profile information"
              : "Complete your profile on the home page to view your data here"
            }
          </p>
        </CardHeader>
        <CardContent>
          {isProfileApproved ? (
            <ProfileForm />
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">Profile Not Yet Available</h3>
              <p className="text-muted-foreground mb-4">
                Please complete your profile on the home page first. Once your profile is approved, 
                you'll be able to view your information here.
              </p>
              <Button onClick={() => window.location.href = '/student'}>
                Go to Home Page
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}