import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function DonorSettings() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+91 9876543210",
    occupation: "Software Engineer"
  });
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [shareDetails, setShareDetails] = useState(true);

  return (
    <div className="main-content-container">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Update your personal information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="occupation">Occupation</Label>
              <Input id="occupation" value={profile.occupation} onChange={e => setProfile(p => ({ ...p, occupation: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-muted-foreground">Receive updates about your donations</div>
              </div>
              <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">SMS Notifications</div>
                <div className="text-sm text-muted-foreground">Get SMS alerts for important updates</div>
              </div>
              <Switch checked={smsNotif} onCheckedChange={setSmsNotif} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Share Details with Students</div>
                <div className="text-sm text-muted-foreground">Allow students to see your name</div>
              </div>
              <Switch checked={shareDetails} onCheckedChange={setShareDetails} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 