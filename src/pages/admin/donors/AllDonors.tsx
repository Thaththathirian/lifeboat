import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Calendar, Gift, CreditCard, Edit, Trash2, MessageSquare, LogIn, ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import DonorForm from './DonorForm';

export const mockDonors = [
  { 
    id: "DON001", 
    name: "John Doe", 
    email: "john.doe@email.com", 
    phone: "+91 9876543210", 
    occupation: "Businessman", 
    address: "123 Main St, Mumbai, MH 400001",
    dob: "1985-06-15",
    totalDonated: 100000, 
    lastDonation: "2024-01-10", 
    donationType: "Monthly", 
    autoDebit: true, 
    activeStudents: 2,
    unallocatedAmount: 50000,
    joinDate: "2023-06-01",
    preferredContact: "Email",
    status: "Active"
  },
  { 
    id: "DON002", 
    name: "Sarah Wilson", 
    email: "sarah.wilson@email.com", 
    phone: "+91 9876543211", 
    occupation: "Doctor", 
    address: "456 Oak Ave, Delhi, DL 110001",
    dob: "1990-03-22",
    totalDonated: 50000, 
    lastDonation: "2024-01-05", 
    donationType: "Quarterly", 
    autoDebit: false, 
    activeStudents: 1,
    unallocatedAmount: 0,
    joinDate: "2023-08-15",
    preferredContact: "Phone",
    status: "Active"
  },
  { 
    id: "DON003", 
    name: "Amit Patel", 
    email: "amit.patel@email.com", 
    phone: "+91 9876543212", 
    occupation: "Engineer", 
    address: "789 Pine Rd, Bangalore, KA 560001",
    dob: "1988-11-08",
    totalDonated: 75000, 
    lastDonation: "2024-02-12", 
    donationType: "One-Time", 
    autoDebit: false, 
    activeStudents: 0,
    unallocatedAmount: 75000,
    joinDate: "2024-01-20",
    preferredContact: "Email",
    status: "Active"
  },
  { 
    id: "DON004", 
    name: "Priya Sharma", 
    email: "priya.sharma@email.com", 
    phone: "+91 9876543213", 
    occupation: "Teacher", 
    address: "321 Cedar St, Pune, MH 411001",
    dob: "1982-07-12",
    totalDonated: 120000, 
    lastDonation: "2024-03-01", 
    donationType: "Monthly", 
    autoDebit: true, 
    activeStudents: 3,
    unallocatedAmount: 80000,
    joinDate: "2023-04-10",
    preferredContact: "WhatsApp",
    status: "Active"
  },
];

export default function AllDonors() {
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [openDonor, setOpenDonor] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageTarget, setMessageTarget] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  const [sortBy, setSortBy] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [autoDebitFilter, setAutoDebitFilter] = useState('all');
  const [studentsFilter, setStudentsFilter] = useState('all');

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  };

  let filtered = mockDonors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(filter.toLowerCase()) || 
                       donor.id.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter === "all" || donor.status.toLowerCase() === statusFilter;
    const matchesType = typeFilter === "all" || donor.donationType === typeFilter;
    const matchesAutoDebit = autoDebitFilter === 'all' || (autoDebitFilter === 'yes' ? donor.autoDebit : !donor.autoDebit);
    const matchesStudents = studentsFilter === 'all' || String(donor.activeStudents) === studentsFilter;
    return matchesSearch && matchesStatus && matchesType && matchesAutoDebit && matchesStudents;
  });

  // Move inactive donors to the bottom
  filtered = [
    ...filtered.filter(d => d.status.toLowerCase() !== 'inactive'),
    ...filtered.filter(d => d.status.toLowerCase() === 'inactive'),
  ];

  if (sortBy) {
    filtered = [...filtered].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const handleSendMessage = (donor: any) => {
    toast({
      title: "Message Sent",
      description: `Message sent to ${donor.name}`,
    });
  };

  const handleOpenMessageDialog = (donor: any) => {
    setMessageTarget(donor);
    setMessageDialogOpen(true);
    setMessageText("");
  };
  const handleSendMessageDialog = () => {
    toast({
      title: "Message Sent",
      description: `Message sent to ${messageTarget?.name}`,
    });
    setMessageDialogOpen(false);
    setMessageText("");
  };

  const handleEditDonor = (donor: any) => {
    setOpenDonor(donor);
    setEditMode(true);
  };

  const handleDeleteDonor = (donorId: string) => {
    if (confirm("Are you sure you want to delete this donor?")) {
      toast({
        title: "Donor Deleted",
        description: "Donor has been successfully deleted",
        variant: "destructive"
      });
    }
  };

  const handleLoginAsDonor = (donor: any) => {
    toast({
      title: "Logged in as Donor",
      description: `You are now logged in as ${donor.name}`,
    });
  };

  return (
    <div className="main-content-container">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">All Donors</h2>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/admin/donors/add')}>Add New Donor</Button>
          <Button variant="outline">Download List</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          className="max-w-xs"
          placeholder="Search donors..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Monthly">Monthly</SelectItem>
            <SelectItem value="Quarterly">Quarterly</SelectItem>
            <SelectItem value="Half Yearly">Half Yearly</SelectItem>
            <SelectItem value="Annually">Annually</SelectItem>
            <SelectItem value="One-Time">One-Time</SelectItem>
          </SelectContent>
        </Select>
        <Select value={autoDebitFilter} onValueChange={setAutoDebitFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Auto Debit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
        <Select value={studentsFilter} onValueChange={setStudentsFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Active Students" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="0">0</SelectItem>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Donors ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center cursor-pointer" onClick={() => handleSort('id')}>Donor ID {sortBy === 'id' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}</TableHead>
                <TableHead className="text-center cursor-pointer" onClick={() => handleSort('name')}>Name {sortBy === 'name' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}</TableHead>
                <TableHead className="text-center cursor-pointer" onClick={() => handleSort('phone')}>Contact {sortBy === 'phone' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}</TableHead>
                <TableHead className="text-center cursor-pointer" onClick={() => handleSort('totalDonated')}>Total Donated {sortBy === 'totalDonated' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}</TableHead>
                <TableHead className="text-center cursor-pointer" onClick={() => handleSort('unallocatedAmount')}>Unallocated Amount {sortBy === 'unallocatedAmount' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}</TableHead>
                <TableHead className="text-center cursor-pointer" onClick={() => handleSort('donationType')}>Donation Type {sortBy === 'donationType' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}</TableHead>
                <TableHead className="text-center cursor-pointer" onClick={() => handleSort('autoDebit')}>Auto Debit {sortBy === 'autoDebit' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}</TableHead>
                <TableHead className="text-center cursor-pointer" onClick={() => handleSort('activeStudents')}>Active Students {sortBy === 'activeStudents' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}</TableHead>
                <TableHead className="text-center cursor-pointer" onClick={() => handleSort('status')}>Status {sortBy === 'status' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(donor => (
                <TableRow key={donor.id}>
                  <TableCell className="text-center">{donor.id}</TableCell>
                  <TableCell className="text-center">{donor.name}</TableCell>
                  <TableCell className="text-center">{donor.phone}</TableCell>
                  <TableCell className="text-center">₹{donor.totalDonated.toLocaleString()}</TableCell>
                  <TableCell className="text-center">₹{donor.unallocatedAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-center">{donor.donationType}</TableCell>
                  <TableCell className="text-center">{donor.autoDebit ? <Badge variant="default" className="bg-green-100 text-green-800">Yes</Badge> : <Badge variant="default" className="bg-yellow-100 text-yellow-800">No</Badge>}</TableCell>
                  <TableCell className="text-center"><Badge variant="default" className="bg-blue-100 text-blue-800">{donor.activeStudents}</Badge></TableCell>
                  <TableCell className="text-center"><Badge variant={donor.status === "Active" ? "default" : "secondary"}>{donor.status}</Badge></TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button size="sm" variant="outline" onClick={() => setOpenDonor(donor)}>View</Button>
                      <Button size="sm" variant="outline" onClick={() => navigate(`/admin/donors/edit/${donor.id}`)}><Edit className="h-3 w-3" /></Button>
                      <Button size="sm" variant="outline" onClick={() => handleLoginAsDonor(donor)}><LogIn className="h-3 w-3" /></Button>
                      <Button size="sm" variant="outline" onClick={() => handleOpenMessageDialog(donor)}><MessageSquare className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Donor Details Modal */}
      <Dialog open={!!openDonor} onOpenChange={() => {setOpenDonor(null); setEditMode(false);}}>
        <DialogContent className="max-w-2xl">
          {openDonor && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {editMode ? "Edit Donor" : "Donor Details"} - {openDonor.name} ({openDonor.id})
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm">{openDonor.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-sm">{openDonor.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Address</div>
                      <div className="text-sm">{openDonor.address}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Date of Birth</div>
                      <div className="text-sm">{openDonor.dob}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Total Donated</div>
                      <div className="text-sm">₹{openDonor.totalDonated.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Donation Type</div>
                      <div className="text-sm">{openDonor.donationType}</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Auto Debit</div>
                    <div className="text-sm">{openDonor.autoDebit ? "Enabled" : "Disabled"}</div>
                  </div>
                  <div>
                    <div className="font-medium">Active Students</div>
                    <div className="text-sm">{openDonor.activeStudents}</div>
                  </div>
                  <div>
                    <div className="font-medium">Unallocated Amount</div>
                    <div className="text-sm">₹{openDonor.unallocatedAmount.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                {editMode ? (
                  <>
                    <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                    <Button onClick={() => {setEditMode(false); toast({title: "Donor Updated", description: "Donor details have been updated successfully"});}}>
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setEditMode(true)}>Edit</Button>
                    <Button onClick={() => handleSendMessage(openDonor)}>Send Message</Button>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Message to {messageTarget?.name}</DialogTitle>
          </DialogHeader>
          <textarea
            className="w-full border rounded p-2 min-h-[80px]"
            placeholder="Type your message..."
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSendMessageDialog} disabled={!messageText.trim()}>Send</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}