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
import { Search, Eye, DollarSign, Download, TrendingUp, Users, Calendar } from 'lucide-react';

// Mock data for scholarship accounts
const mockScholarshipAccounts = [
  { 
    id: 'COL001', 
    name: 'Mumbai University', 
    totalScholarship: 4500000,
    students: 45, 
    lastPayment: '2024-06-15',
    allocatedAmount: 3200000,
    remainingBudget: 1300000,
    monthlyAverage: 180000,
    accountNumber: '4500000',
    bankName: 'State Bank of India'
  },
  { 
    id: 'COL002', 
    name: 'Delhi College of Engineering', 
    totalScholarship: 3200000,
    students: 32, 
    lastPayment: '2024-06-20',
    allocatedAmount: 2800000,
    remainingBudget: 400000,
    monthlyAverage: 150000,
    accountNumber: '3200000',
    bankName: 'HDFC Bank'
  },
  { 
    id: 'COL003', 
    name: 'Chennai Medical College', 
    totalScholarship: 2800000,
    students: 28, 
    lastPayment: '2024-07-01',
    allocatedAmount: 2200000,
    remainingBudget: 600000,
    monthlyAverage: 120000,
    accountNumber: '2800000',
    bankName: 'ICICI Bank'
  }
];

export default function ScholarshipAccount() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('totalScholarship');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [actionModal, setActionModal] = useState<{ type: string, college: any } | null>(null);

  // Filter and sort
  const filtered = useMemo(() => {
    let data = mockScholarshipAccounts.filter(col =>
      col.name.toLowerCase().includes(search.toLowerCase()) ||
      col.id.toLowerCase().includes(search.toLowerCase())
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
      + "College ID,College Name,Total Scholarship,Active Students,Allocated Amount,Remaining Budget,Monthly Average,Last Payment,Account Number,Bank Name\n"
      + filtered.map(col => 
          `${col.id},${col.name},${col.totalScholarship},${col.students},${col.allocatedAmount},${col.remainingBudget},${col.monthlyAverage},${col.lastPayment},${col.accountNumber},${col.bankName}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "scholarship_accounts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalScholarshipSum = filtered.reduce((sum, col) => sum + col.totalScholarship, 0);
  const totalStudentsSum = filtered.reduce((sum, col) => sum + col.students, 0);
  const totalAllocatedSum = filtered.reduce((sum, col) => sum + col.allocatedAmount, 0);

  return (
    <div className="main-content-container">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold">Scholarship Account</h1>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Scholarship Fund</p>
              <p className="text-2xl font-bold">₹{totalScholarshipSum.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold">{totalStudentsSum}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Amount Allocated</p>
              <p className="text-2xl font-bold">₹{totalAllocatedSum.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('id')} className="cursor-pointer">College ID</TableHead>
            <TableHead onClick={() => handleSort('name')} className="cursor-pointer">College Name</TableHead>
            <TableHead onClick={() => handleSort('totalScholarship')} className="cursor-pointer">Total Scholarship</TableHead>
            <TableHead onClick={() => handleSort('students')} className="cursor-pointer">Active Students</TableHead>
            <TableHead onClick={() => handleSort('allocatedAmount')} className="cursor-pointer">Allocated Amount</TableHead>
            <TableHead onClick={() => handleSort('remainingBudget')} className="cursor-pointer">Remaining Budget</TableHead>
            <TableHead onClick={() => handleSort('lastPayment')} className="cursor-pointer">Last Payment</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map(col => (
            <TableRow key={col.id}>
              <TableCell>{col.id}</TableCell>
              <TableCell>{col.name}</TableCell>
              <TableCell>₹{col.totalScholarship.toLocaleString()}</TableCell>
              <TableCell>{col.students}</TableCell>
              <TableCell>₹{col.allocatedAmount.toLocaleString()}</TableCell>
              <TableCell>
                <span className={col.remainingBudget > 500000 ? 'text-green-600' : 'text-red-600'}>
                  ₹{col.remainingBudget.toLocaleString()}
                </span>
              </TableCell>
              <TableCell>{col.lastPayment}</TableCell>
              <TableCell>
                <div className="flex flex-row gap-1 items-center p-0 whitespace-nowrap">
                  <Button size="icon" variant="ghost" title="View Details" onClick={() => setActionModal({ type: 'view', college: col })}><Eye /></Button>
                  <Button size="icon" variant="ghost" title="Payment History" onClick={() => setActionModal({ type: 'payments', college: col })}><DollarSign /></Button>
                  <Button size="icon" variant="ghost" title="Analytics" onClick={() => setActionModal({ type: 'analytics', college: col })}><TrendingUp /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>Financial overview of scholarship accounts by college.</TableCaption>
      </Table>

      {/* Action Modals */}
      <Dialog open={!!actionModal} onOpenChange={v => !v && setActionModal(null)}>
        <DialogContent className="max-w-lg w-full p-6 rounded-xl shadow-2xl mx-auto bg-white">
          <DialogHeader>
            <DialogTitle>
              {actionModal?.type === 'view' && 'Account Details'}
              {actionModal?.type === 'payments' && 'Payment History'}
              {actionModal?.type === 'analytics' && 'Financial Analytics'}
            </DialogTitle>
          </DialogHeader>
          
          {actionModal?.type === 'view' && (
            <div className="space-y-3">
              <div><strong>College ID:</strong> {actionModal.college.id}</div>
              <div><strong>College Name:</strong> {actionModal.college.name}</div>
              <div><strong>Total Scholarship:</strong> ₹{actionModal.college.totalScholarship.toLocaleString()}</div>
              <div><strong>Active Students:</strong> {actionModal.college.students}</div>
              <div><strong>Allocated Amount:</strong> ₹{actionModal.college.allocatedAmount.toLocaleString()}</div>
              <div><strong>Remaining Budget:</strong> ₹{actionModal.college.remainingBudget.toLocaleString()}</div>
              <div><strong>Monthly Average:</strong> ₹{actionModal.college.monthlyAverage.toLocaleString()}</div>
              <div><strong>Account Number:</strong> {actionModal.college.accountNumber}</div>
              <div><strong>Bank Name:</strong> {actionModal.college.bankName}</div>
              <div><strong>Last Payment:</strong> {actionModal.college.lastPayment}</div>
            </div>
          )}

          {actionModal?.type === 'payments' && (
            <div className="space-y-4">
              <p>Payment History for <strong>{actionModal.college.name}</strong></p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>June 2024</span>
                  <span className="font-medium">₹150,000</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>May 2024</span>
                  <span className="font-medium">₹180,000</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>April 2024</span>
                  <span className="font-medium">₹165,000</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>March 2024</span>
                  <span className="font-medium">₹140,000</span>
                </div>
              </div>
              <Button className="w-full" variant="outline">Download Full History</Button>
            </div>
          )}

          {actionModal?.type === 'analytics' && (
            <div className="space-y-4">
              <p>Financial Analytics for <strong>{actionModal.college.name}</strong></p>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Budget Utilization</span>
                  <span className="font-medium">
                    {((actionModal.college.allocatedAmount / actionModal.college.totalScholarship) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cost per Student</span>
                  <span className="font-medium">
                    ₹{Math.round(actionModal.college.allocatedAmount / actionModal.college.students).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Burn Rate</span>
                  <span className="font-medium">₹{actionModal.college.monthlyAverage.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Projected Months Remaining</span>
                  <span className="font-medium">
                    {Math.round(actionModal.college.remainingBudget / actionModal.college.monthlyAverage)} months
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}