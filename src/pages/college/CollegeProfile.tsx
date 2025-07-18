import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initialProfile = {
  collegeName: "ABC Engineering College",
  phone: "9876543210",
  address: "123 Main St, City, State, 123456",
  email: "college@email.com",
  repName: "Dr. Suresh Kumar",
  repPhone: "9876543211",
  repEmail: "suresh@email.com",
  established: "1995",
  departments: 12,
  students: 1200,
  batches: 20,
  passPercent: 92,
  infra: "Labs, Library, Placement Training",
  feeConcession: "10% for LBF Scholars",
  coordName: "Ms. Priya Singh",
  coordPhone: "9876543212",
  coordEmail: "priya@email.com",
  designation: "Coordinator",
  bankName: "State Bank of India",
  accountNo: "1234567890",
  ifsc: "SBIN0001234",
  cheque: ""
};

export default function CollegeProfile() {
  const [profile, setProfile] = useState(initialProfile);

  return (
    <div className="main-content-container">
      <h2 className="text-2xl font-bold mb-6">College Profile</h2>
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Edit Profile (Annual Update Required)</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>School/College Name *</Label>
              <Input value={profile.collegeName} required onChange={e => setProfile(p => ({ ...p, collegeName: e.target.value }))} />
            </div>
            <div>
              <Label>Phone *</Label>
              <Input value={profile.phone} required onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <Label>Address *</Label>
              <Input value={profile.address} required onChange={e => setProfile(p => ({ ...p, address: e.target.value }))} />
            </div>
            <div>
              <Label>Email *</Label>
              <Input value={profile.email} required onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <Label>Representative Name *</Label>
              <Input value={profile.repName} required onChange={e => setProfile(p => ({ ...p, repName: e.target.value }))} />
            </div>
            <div>
              <Label>Representative Phone *</Label>
              <Input value={profile.repPhone} required onChange={e => setProfile(p => ({ ...p, repPhone: e.target.value }))} />
            </div>
            <div>
              <Label>Representative Email *</Label>
              <Input value={profile.repEmail} required onChange={e => setProfile(p => ({ ...p, repEmail: e.target.value }))} />
            </div>
            <div>
              <Label>Established Year *</Label>
              <Input value={profile.established} required onChange={e => setProfile(p => ({ ...p, established: e.target.value }))} />
            </div>
            <div>
              <Label>No. of Departments *</Label>
              <Input value={profile.departments.toString()} required onChange={e => setProfile(p => ({ ...p, departments: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <Label>No. of Students *</Label>
              <Input value={profile.students.toString()} required onChange={e => setProfile(p => ({ ...p, students: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <Label>No. of Batches Passed *</Label>
              <Input value={profile.batches.toString()} required onChange={e => setProfile(p => ({ ...p, batches: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <Label>Pass Percentage *</Label>
              <Input value={profile.passPercent.toString()} required onChange={e => setProfile(p => ({ ...p, passPercent: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <Label>Infrastructure Facilities *</Label>
              <Input value={profile.infra} required onChange={e => setProfile(p => ({ ...p, infra: e.target.value }))} />
            </div>
            <div>
              <Label>Fee Concession *</Label>
              <Input value={profile.feeConcession} required onChange={e => setProfile(p => ({ ...p, feeConcession: e.target.value }))} />
            </div>
            <div>
              <Label>Coordinator Name *</Label>
              <Input value={profile.coordName} required onChange={e => setProfile(p => ({ ...p, coordName: e.target.value }))} />
            </div>
            <div>
              <Label>Coordinator Phone *</Label>
              <Input value={profile.coordPhone} required onChange={e => setProfile(p => ({ ...p, coordPhone: e.target.value }))} />
            </div>
            <div>
              <Label>Coordinator Email *</Label>
              <Input value={profile.coordEmail} required onChange={e => setProfile(p => ({ ...p, coordEmail: e.target.value }))} />
            </div>
            <div>
              <Label>Designation *</Label>
              <Input value={profile.designation} required onChange={e => setProfile(p => ({ ...p, designation: e.target.value }))} />
            </div>
            <div>
              <Label>Bank Name *</Label>
              <Input value={profile.bankName} required onChange={e => setProfile(p => ({ ...p, bankName: e.target.value }))} />
            </div>
            <div>
              <Label>Account Number *</Label>
              <Input value={profile.accountNo} required onChange={e => setProfile(p => ({ ...p, accountNo: e.target.value }))} />
            </div>
            <div>
              <Label>IFSC *</Label>
              <Input value={profile.ifsc} required onChange={e => setProfile(p => ({ ...p, ifsc: e.target.value }))} />
            </div>
            <div>
              <Label>Cancelled Cheque (Upload) *</Label>
              <Input type="file" required onChange={e => setProfile(p => ({ ...p, cheque: e.target.files?.[0]?.name || "" }))} />
            </div>
          </form>
          <div className="flex justify-end mt-6">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 