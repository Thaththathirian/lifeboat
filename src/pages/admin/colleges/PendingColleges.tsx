import React, { useState, useMemo } from 'react';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, CheckCircle, XCircle, MessageSquare, Download, FileText } from 'lucide-react';

// Mock data for pending colleges
const mockPendingColleges = [
  { 
    id: 'COL004', 
    name: 'Pune Institute of Technology', 
    submitDate: '2024-07-01', 
    status: 'Document Review', 
    reason: 'University certificate pending',
    contactPerson: 'Dr. Rajesh Kumar',
    phone: '+91-9876543210',
    email: 'admin@pit.edu.in',
    establishedYear: '2010',
    departments: 8,
    totalStudents: 1200
  },
  { 
    id: 'COL005', 
    name: 'Chennai Arts College', 
    submitDate: '2024-06-15', 
    status: 'MOU Pending', 
    reason: 'Signed MOU awaiting upload',
    contactPerson: 'Prof. Meera Nair',
    phone: '+91-9876543211',
    email: 'info@cac.edu.in',
    establishedYear: '2008',
    departments: 5,
    totalStudents: 800
  },
  { 
    id: 'COL006', 
    name: 'Bangalore Science Institute', 
    submitDate: '2024-07-10', 
    status: 'Initial Review', 
    reason: 'Application under initial review',
    contactPerson: 'Dr. Suresh Reddy',
    phone: '+91-9876543212',
    email: 'contact@bsi.edu.in',
    establishedYear: '2015',
    departments: 6,
    totalStudents: 950
  }
];

export default function PendingColleges() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('submitDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [actionModal, setActionModal] = useState<{ type: string, college: any } | null>(null);

  // Filter and sort
  const filtered = useMemo(() => {
    let data = mockPendingColleges.filter(col =>
      col.name.toLowerCase().includes(search.toLowerCase()) ||
      col.id.toLowerCase().includes(search.toLowerCase()) ||
      col.status.toLowerCase().includes(search.toLowerCase())
    );
    data = [...data].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDir === 'asc' ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [search, sortKey, sortDir]);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "College ID,College Name,Submit Date,Status,Reason,Contact Person,Phone,Email,Established Year,Departments,Total Students\n"
      + filtered.map(col => 
          `${col.id},${col.name},${col.submitDate},${col.status},${col.reason},${col.contactPerson},${col.phone},${col.email},${col.establishedYear},${col.departments},${col.totalStudents}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pending_colleges.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Document Review': return 'bg-yellow-100 text-yellow-800';
      case 'MOU Pending': return 'bg-blue-100 text-blue-800';
      case 'Initial Review': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="main-content-container">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold">Pending Colleges</h1>
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search colleges..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-48"
          />
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="mr-1" />Download
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead onClick={() => handleSort('id')} className="cursor-pointer">College ID</TableHead> */}
            <TableHead onClick={() => handleSort('name')} className="cursor-pointer">College Name</TableHead>
            <TableHead onClick={() => handleSort('submitDate')} className="cursor-pointer">Submit Date</TableHead>
            {/* <TableHead onClick={() => handleSort('status')} className="cursor-pointer">Status</TableHead> */}
            <TableHead>Contact Person</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map(col => (
            <TableRow key={col.id}>
              {/* <TableCell>{col.id}</TableCell> */}
              <TableCell>{col.name}</TableCell>
              <TableCell>{col.submitDate}</TableCell>
              {/* <TableCell>
                <Badge className={getStatusColor(col.status)}>
                  {col.status}
                </Badge>
              </TableCell> */}
              <TableCell>{col.contactPerson}</TableCell>
              <TableCell>{col.phone}</TableCell>
              <TableCell className="max-w-[200px] truncate">{col.reason}</TableCell>
              <TableCell>
                <div className="flex flex-row gap-1 items-center p-0 whitespace-nowrap">
                  <Button size="icon" variant="ghost" title="View Details" onClick={() => setActionModal({ type: 'view', college: col })}><Eye /></Button>
                  <Button size="icon" variant="ghost" title="Approve" onClick={() => setActionModal({ type: 'approve', college: col })}><CheckCircle /></Button>
                  <Button size="icon" variant="ghost" title="Reject" onClick={() => setActionModal({ type: 'reject', college: col })}><XCircle /></Button>
                  <Button size="icon" variant="ghost" title="Message" onClick={() => setActionModal({ type: 'message', college: col })}><MessageSquare /></Button>
                  <Button size="icon" variant="ghost" title="Documents" onClick={() => setActionModal({ type: 'documents', college: col })}><FileText /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>Colleges waiting for approval and verification.</TableCaption>
      </Table>

      {/* Action Modals */}
      <Dialog open={!!actionModal} onOpenChange={v => !v && setActionModal(null)}>
        <DialogContent className="max-w-md w-full p-6 rounded-xl shadow-2xl mx-auto bg-white">
          <DialogHeader>
            <DialogTitle>
              {actionModal?.type === 'view' && 'College Details'}
              {actionModal?.type === 'approve' && 'Approve College'}
              {actionModal?.type === 'reject' && 'Reject College'}
              {actionModal?.type === 'message' && 'Send Message'}
              {actionModal?.type === 'documents' && 'Document Review'}
            </DialogTitle>
          </DialogHeader>
          
          {actionModal?.type === 'view' && (
            <div className="space-y-3">
              <div><strong>ID:</strong> {actionModal.college.id}</div>
              <div><strong>Name:</strong> {actionModal.college.name}</div>
              <div><strong>Status:</strong> {actionModal.college.status}</div>
              <div><strong>Submit Date:</strong> {actionModal.college.submitDate}</div>
              <div><strong>Contact Person:</strong> {actionModal.college.contactPerson}</div>
              <div><strong>Phone:</strong> {actionModal.college.phone}</div>
              <div><strong>Email:</strong> {actionModal.college.email}</div>
              <div><strong>Established:</strong> {actionModal.college.establishedYear}</div>
              <div><strong>Departments:</strong> {actionModal.college.departments}</div>
              <div><strong>Total Students:</strong> {actionModal.college.totalStudents}</div>
              <div><strong>Reason:</strong> {actionModal.college.reason}</div>
            </div>
          )}

          {actionModal?.type === 'approve' && (
            <div className="space-y-4">
              <p>Are you sure you want to approve <strong>{actionModal.college.name}</strong>?</p>
              <div className="space-y-2">
                {/* College ID is now auto-generated, so remove the input */}
                <textarea className="w-full border rounded p-2" placeholder="Approval remarks..." rows={3} />
              </div>
              <Button className="w-full mt-4">Approve College</Button>
            </div>
          )}

          {actionModal?.type === 'reject' && (
            <div className="space-y-4">
              <p>Reject <strong>{actionModal.college.name}</strong>?</p>
              <textarea className="w-full border rounded p-2" placeholder="Rejection reason..." rows={3} />
              <Button className="w-full" variant="destructive">Reject College</Button>
            </div>
          )}

          {actionModal?.type === 'message' && (
            <div className="space-y-4">
              <p>Send message to <strong>{actionModal.college.name}</strong></p>
              <textarea className="w-full border rounded p-2" placeholder="Type your message..." rows={4} />
              <Button className="w-full">Send Message</Button>
            </div>
          )}

          {actionModal?.type === 'documents' && (
            <div className="space-y-4">
              <p>Document Review for <strong>{actionModal.college.name}</strong></p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>University Certificate</span>
                  <Badge className="bg-red-100 text-red-800">Missing</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Registration Documents</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                </div>
                <div className="flex justify-between">
                  <span>MOU Agreement</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                </div>
              </div>
              <Button className="w-full">Request Missing Documents</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}