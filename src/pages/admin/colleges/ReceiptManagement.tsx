import React, { useState, useMemo } from 'react';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, CheckCircle, XCircle, Download, FileText, Clock, MessageSquare, ArrowUp, ArrowDown } from 'lucide-react';

// Mock data for receipts
const mockReceipts = [
  { 
    id: 'R001', 
    college: 'Mumbai University', 
    student: 'Amit Kumar',
    studentId: 'STU001',
    amount: 50000, 
    paymentDate: '2024-06-10',
    receiptDate: '2024-06-12',
    status: 'College Verified',
    semester: 'Semester 3',
    receiptNumber: 'RCP/2024/001',
    uploadedBy: 'Student'
  },
  { 
    id: 'R002', 
    college: 'Delhi College of Engineering', 
    student: 'Priya Singh',
    studentId: 'STU002',
    amount: 45000, 
    paymentDate: '2024-06-15',
    receiptDate: '2024-06-18',
    status: 'Pending Verification',
    semester: 'Semester 2',
    receiptNumber: 'RCP/2024/002',
    uploadedBy: 'Student'
  },
  { 
    id: 'R003', 
    college: 'Chennai Medical College', 
    student: 'Rahul Sharma',
    studentId: 'STU003',
    amount: 60000, 
    paymentDate: '2024-07-01',
    receiptDate: '2024-07-03',
    status: 'College Verified',
    semester: 'Semester 1',
    receiptNumber: 'RCP/2024/003',
    uploadedBy: 'Student'
  },
  { 
    id: 'R004', 
    college: 'Mumbai University', 
    student: 'Sneha Patel',
    studentId: 'STU004',
    amount: 35000, 
    paymentDate: '2024-05-20',
    receiptDate: null,
    status: 'Overdue',
    semester: 'Semester 4',
    receiptNumber: null,
    uploadedBy: null
  }
];

export default function ReceiptManagement() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('paymentDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionModal, setActionModal] = useState<{ type: string, receipt: any } | null>(null);

  // Filter and sort
  const filtered = useMemo(() => {
    let data = mockReceipts.filter(receipt => {
      const matchesSearch = receipt.college.toLowerCase().includes(search.toLowerCase()) ||
        receipt.student.toLowerCase().includes(search.toLowerCase()) ||
        receipt.studentId.toLowerCase().includes(search.toLowerCase()) ||
        receipt.id.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || receipt.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    data = [...data].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDir === 'asc' ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [search, sortKey, sortDir, statusFilter]);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Receipt ID,College,Student Name,Student ID,Amount,Payment Date,Receipt Date,Status,Semester,Receipt Number,Uploaded By\n"
      + filtered.map(receipt => 
          `${receipt.id},${receipt.college},${receipt.student},${receipt.studentId},${receipt.amount},${receipt.paymentDate},${receipt.receiptDate || 'N/A'},${receipt.status},${receipt.semester},${receipt.receiptNumber || 'N/A'},${receipt.uploadedBy || 'N/A'}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "receipt_management.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'College Verified': return 'bg-blue-100 text-blue-800';
      case 'Pending Verification': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statusOptions = ['all', 'College Verified', 'Pending Verification', 'Overdue'];

  return (
    <div className="main-content-container">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold">Receipt Management</h1>
        <div className="flex gap-2 items-center flex-wrap">
          <Input
            placeholder="Search receipts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-48"
          />
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2 bg-white"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status}
              </option>
            ))}
          </select>
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="mr-1" />Download
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Receipts</p>
            <p className="text-2xl font-bold">{filtered.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-center">
            <p className="text-sm text-gray-600">Verified</p>
            <p className="text-2xl font-bold text-green-600">
              {filtered.filter(r => r.status === 'College Verified').length}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-center">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {filtered.filter(r => r.status === 'Pending Verification').length}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-center">
            <p className="text-sm text-gray-600">Overdue</p>
            <p className="text-2xl font-bold text-red-600">
              {filtered.filter(r => r.status === 'Overdue').length}
            </p>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('id')} className="text-center cursor-pointer">
              Receipt ID {sortKey === 'id' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
            </TableHead>
            <TableHead onClick={() => handleSort('college')} className="text-center cursor-pointer">
              College {sortKey === 'college' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
            </TableHead>
            <TableHead onClick={() => handleSort('student')} className="text-center cursor-pointer">
              Student {sortKey === 'student' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
            </TableHead>
            <TableHead onClick={() => handleSort('amount')} className="text-center cursor-pointer">
              Amount {sortKey === 'amount' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
            </TableHead>
            <TableHead onClick={() => handleSort('paymentDate')} className="text-center cursor-pointer">
              Payment Date {sortKey === 'paymentDate' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
            </TableHead>
            <TableHead onClick={() => handleSort('receiptDate')} className="text-center cursor-pointer">
              Receipt Date {sortKey === 'receiptDate' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
            </TableHead>
            <TableHead onClick={() => handleSort('status')} className="text-center cursor-pointer">
              Status {sortKey === 'status' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
            </TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map(receipt => (
            <TableRow key={receipt.id}>
              <TableCell className="text-center">{receipt.id}</TableCell>
              <TableCell className="text-center">{receipt.college}</TableCell>
              <TableCell className="text-center">
                <div>
                  <div className="font-medium">{receipt.student}</div>
                  <div className="text-sm text-gray-500">{receipt.studentId}</div>
                </div>
              </TableCell>
              <TableCell className="text-center">₹{receipt.amount.toLocaleString()}</TableCell>
              <TableCell className="text-center">{receipt.paymentDate}</TableCell>
              <TableCell className="text-center">{receipt.receiptDate || 'Not uploaded'}</TableCell>
              <TableCell className="text-center">
                <Badge className={getStatusColor(receipt.status)}>
                  {receipt.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-1 items-center p-0 whitespace-nowrap">
                  <Button size="icon" variant="ghost" title="View Details" onClick={() => setActionModal({ type: 'view', receipt })}><Eye /></Button>
                  <Button size="icon" variant="ghost" title="View Receipt" onClick={() => setActionModal({ type: 'receipt', receipt })}><FileText /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>Management of fee receipts and verification status.</TableCaption>
      </Table>

      {/* Action Modals */}
      <Dialog open={!!actionModal} onOpenChange={v => !v && setActionModal(null)}>
        <DialogContent className="max-w-md w-full p-6 rounded-xl shadow-2xl mx-auto bg-white">
          <DialogHeader>
            <DialogTitle>
              {actionModal?.type === 'view' && 'Receipt Details'}
              {actionModal?.type === 'receipt' && 'View Receipt'}
            </DialogTitle>
          </DialogHeader>
          
          {actionModal?.type === 'view' && (
            <div className="space-y-3">
              <div><strong>Receipt ID:</strong> {actionModal.receipt.id}</div>
              <div><strong>Student:</strong> {actionModal.receipt.student} ({actionModal.receipt.studentId})</div>
              <div><strong>College:</strong> {actionModal.receipt.college}</div>
              <div><strong>Amount:</strong> ₹{actionModal.receipt.amount.toLocaleString()}</div>
              <div><strong>Payment Date:</strong> {actionModal.receipt.paymentDate}</div>
              <div><strong>Receipt Date:</strong> {actionModal.receipt.receiptDate || 'Not uploaded'}</div>
              <div><strong>Status:</strong> {actionModal.receipt.status}</div>
              <div><strong>Semester:</strong> {actionModal.receipt.semester}</div>
              <div><strong>Receipt Number:</strong> {actionModal.receipt.receiptNumber || 'N/A'}</div>
              <div><strong>Uploaded By:</strong> {actionModal.receipt.uploadedBy || 'N/A'}</div>
            </div>
          )}

          {actionModal?.type === 'receipt' && (
            <div className="space-y-4">
              <p>Receipt for <strong>{actionModal.receipt.student}</strong></p>
              {actionModal.receipt.receiptDate ? (
                <div className="border-2 border-dashed border-gray-300 p-8 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Receipt document would be displayed here</p>
                  <p className="text-xs text-gray-400">Receipt #{actionModal.receipt.receiptNumber}</p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-red-300 p-8 text-center">
                  <Clock className="mx-auto h-12 w-12 text-red-400" />
                  <p className="mt-2 text-sm text-red-500">No receipt uploaded yet</p>
                </div>
              )}
              <Button className="w-full" variant="outline">Download Receipt</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}