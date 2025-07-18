import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Users, MessageSquare, Gift } from "lucide-react";

const mockDonors = [
  { id: "DON001", name: "John Doe", occupation: "Businessman", totalDonated: 100000, lastDonation: "2024-01-10", donationType: "Monthly", autoDebit: true, activeStudents: 2 },
  { id: "DON002", name: "Sarah Wilson", occupation: "Doctor", totalDonated: 50000, lastDonation: "2024-01-05", donationType: "Quarterly", autoDebit: false, activeStudents: 1 },
  { id: "DON003", name: "Amit Patel", occupation: "Engineer", totalDonated: 75000, lastDonation: "2024-02-12", donationType: "One-Time", autoDebit: false, activeStudents: 0 },
  { id: "DON004", name: "Priya Sharma", occupation: "Teacher", totalDonated: 120000, lastDonation: "2024-03-01", donationType: "Monthly", autoDebit: true, activeStudents: 3 },
  { id: "DON005", name: "Vikram Singh", occupation: "Lawyer", totalDonated: 30000, lastDonation: "2024-01-20", donationType: "Quarterly", autoDebit: false, activeStudents: 1 },
  { id: "DON006", name: "Meera Das", occupation: "Artist", totalDonated: 20000, lastDonation: "2024-02-28", donationType: "One-Time", autoDebit: false, activeStudents: 0 },
  { id: "DON007", name: "Rohit Sinha", occupation: "Accountant", totalDonated: 90000, lastDonation: "2024-03-10", donationType: "Monthly", autoDebit: true, activeStudents: 2 },
  { id: "DON008", name: "Divya Nair", occupation: "Entrepreneur", totalDonated: 150000, lastDonation: "2024-03-15", donationType: "Monthly", autoDebit: true, activeStudents: 4 },
  { id: "DON009", name: "Karan Mehta", occupation: "Consultant", totalDonated: 60000, lastDonation: "2024-02-05", donationType: "Quarterly", autoDebit: false, activeStudents: 1 },
  { id: "DON010", name: "Neha Gupta", occupation: "Scientist", totalDonated: 110000, lastDonation: "2024-03-12", donationType: "Monthly", autoDebit: true, activeStudents: 3 }
];

export default function AdminDonors() {
  const [filter, setFilter] = useState("");
  const [openDonor, setOpenDonor] = useState(null);

  const filtered = mockDonors.filter(d =>
    d.name.toLowerCase().includes(filter.toLowerCase()) || d.id.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="main-content-container">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Donor Management</h2>
        <Button variant="outline">Download List</Button>
      </div>
      <Input
        className="mb-4 max-w-xs"
        placeholder="Filter by name or ID..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Donors</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Donor ID</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Occupation</TableHead>
                <TableHead className="text-center">Total Donated</TableHead>
                <TableHead className="text-center">Last Donation</TableHead>
                <TableHead className="text-center">Donation Type</TableHead>
                <TableHead className="text-center">Auto Debit</TableHead>
                <TableHead className="text-center">Active Students</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(donor => (
                <TableRow key={donor.id}>
                  <TableCell className="text-center" style={{textAlign: 'center'}}>{donor.id}</TableCell>
                  <TableCell className="text-center" style={{textAlign: 'center'}}>{donor.name}</TableCell>
                  <TableCell className="text-center" style={{textAlign: 'center'}}>{donor.occupation}</TableCell>
                  <TableCell className="text-center" style={{textAlign: 'center'}}>₹{donor.totalDonated.toLocaleString()}</TableCell>
                  <TableCell className="text-center" style={{textAlign: 'center'}}>{donor.lastDonation}</TableCell>
                  <TableCell className="text-center" style={{textAlign: 'center'}}>{donor.donationType}</TableCell>
                  <TableCell className="text-center" style={{textAlign: 'center'}}>
                    {donor.autoDebit
                      ? <Badge variant="default" className="bg-green-100 text-green-800">Yes</Badge>
                      : <Badge variant="default" className="bg-yellow-100 text-yellow-800">No</Badge>
                    }
                  </TableCell>
                  <TableCell className="text-center" style={{textAlign: 'center'}}><Badge variant="default" className="bg-blue-100 text-blue-800">{donor.activeStudents}</Badge></TableCell>
                  <TableCell className="text-center" style={{textAlign: 'center'}}>
                    <Button size="sm" variant="outline" onClick={() => setOpenDonor(donor)}>View</Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MapPin className="h-3 w-3 mr-1" />
                          Mapping
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Donor-Student Mapping for {donor.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-muted rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="font-semibold">Total Donated:</div>
                                <div className="text-2xl font-bold text-green-600">₹{donor.totalDonated.toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="font-semibold">Active Students:</div>
                                <div className="text-2xl font-bold text-blue-600">{donor.activeStudents}</div>
                              </div>
                            </div>
                          </div>
                          
                          {donor.activeStudents > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Currently Sponsored Students:</h4>
                              <div className="space-y-2">
                                {Array.from({length: donor.activeStudents}, (_, i) => (
                                  <div key={i} className="flex justify-between items-center p-3 border rounded">
                                    <div>
                                      <div className="font-medium">Student {i + 1}</div>
                                      <div className="text-sm text-muted-foreground">Engineering College</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-semibold">₹{(50000 - i * 5000).toLocaleString()}</div>
                                      <Badge variant="default">Active</Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex justify-end gap-2">
                            <Button variant="outline">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Send Message
                            </Button>
                            <Button>
                              <Gift className="h-4 w-4 mr-2" />
                              Create New Mapping
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Donor Details Modal */}
      <Dialog open={!!openDonor} onOpenChange={() => setOpenDonor(null)}>
        <DialogContent className="max-w-lg w-full p-6">
          {openDonor && (
            <>
              <DialogHeader>
                <DialogTitle>{openDonor.name} ({openDonor.id})</DialogTitle>
              </DialogHeader>
              <div className="mb-2"><b>Occupation:</b> {openDonor.occupation}</div>
              <div className="mb-2"><b>Total Donated:</b> ₹{openDonor.totalDonated.toLocaleString()}</div>
              <div className="mb-2"><b>Last Donation:</b> {openDonor.lastDonation}</div>
              <div className="mb-2"><b>Donation Type:</b> {openDonor.donationType}</div>
              <div className="mb-2"><b>Auto Debit:</b> {openDonor.autoDebit ? "Yes" : "No"}</div>
              <div className="mb-2"><b>Active Students:</b> {openDonor.activeStudents}</div>
              <Button variant="outline" className="mt-4">Edit Details</Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 