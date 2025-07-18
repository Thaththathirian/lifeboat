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
import { Search, Eye, LogIn, Edit, Ban, MessageSquare, DollarSign, Plus, Download, Square, CheckSquare, Filter, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data for colleges and students
const mockColleges = [
  { id: 'COL001', name: 'Mumbai University', account: '4500000', students: 45, scholarship: 4500000, status: 'Active' },
  { id: 'COL002', name: 'Delhi College of Engineering', account: '3200000', students: 32, scholarship: 3200000, status: 'Active' },
  { id: 'COL003', name: 'Chennai Medical College', account: '2800000', students: 28, scholarship: 2800000, status: 'Active' },
];
const mockStudents = [
  { id: 'STU001', name: 'Amit Kumar', collegeId: 'COL001', received: 100000 },
  { id: 'STU002', name: 'Priya Singh', collegeId: 'COL001', received: 120000 },
  { id: 'STU003', name: 'Rahul Sharma', collegeId: 'COL002', received: 90000 },
  { id: 'STU004', name: 'Sneha Patel', collegeId: 'COL003', received: 110000 },
];

const statusOptions = ['Active', 'Inactive'];

export default function RegisteredColleges() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [addOpen, setAddOpen] = useState(false);
  const [actionModal, setActionModal] = useState<{ type: string, college: any } | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();

  // Read registered colleges from localStorage if available
  const collegesWithTotal = useMemo(() => {
    const localColleges = JSON.parse(localStorage.getItem('registeredColleges') || 'null');
    const base = localColleges && Array.isArray(localColleges) && localColleges.length > 0 ? localColleges : mockColleges;
    return base.map(col => ({
      ...col,
      totalReceived: typeof col.totalReceived === 'number' ? col.totalReceived : 0,
      students: typeof col.students === 'number' ? col.students : 0,
    }));
  }, []);

  // Filter and sort
  const filtered = useMemo(() => {
    let data = collegesWithTotal.filter(col =>
      (col.name.toLowerCase().includes(search.toLowerCase()) ||
      col.id.toLowerCase().includes(search.toLowerCase())) &&
      (!statusFilter || col.status === statusFilter)
    );
    data = [...data].sort((a, b) => {
      if (a.status === b.status) {
        if (a[sortKey] < b[sortKey]) return sortDir === 'asc' ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortDir === 'asc' ? 1 : -1;
        return 0;
      }
      return a.status === 'Active' ? -1 : 1;
    });
    return data;
  }, [search, statusFilter, sortKey, sortDir, collegesWithTotal]);

  const allSelected = selected.length === filtered.length && filtered.length > 0;
  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(filtered.map(col => col.id));
  };

  // Add College form state
  const [form, setForm] = useState({ id: '', name: '', account: '', students: '', scholarship: '', status: 'Active' });
  const [formError, setFormError] = useState('');

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const handleAddCollege = () => {
    if (!form.id || !form.name || !form.account) {
      setFormError('All required fields must be filled.');
      return;
    }
    // Mock add logic
    setAddOpen(false);
    setForm({ id: '', name: '', account: '', students: '', scholarship: '', status: 'Active' });
    setFormError('');
    // In real app, update data source
    alert('College added (mock)!');
  };

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "College ID,College Name,Account Number,Active Students,Total Received,Total Scholarship,Status\n"
      + filtered.map(col => 
          `${col.id},${col.name},${col.account},${col.students},${col.totalReceived},${col.scholarship},${col.status}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "registered_colleges.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Change status icon to toggle status directly, and sort active before inactive
  const handleToggleStatus = (collegeId: string) => {
    const colleges = JSON.parse(localStorage.getItem('registeredColleges') || '[]');
    const updated = colleges.map((c: any) =>
      c.id === collegeId ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c
    );
    localStorage.setItem('registeredColleges', JSON.stringify(updated));
    window.location.reload(); // quick refresh for demo; ideally use state
  };

  return (
    <div className="main-content-container">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold">Registered Colleges</h1>
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search colleges..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-48"
          />
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="border rounded px-2 py-1 text-sm"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="mr-1" />Download
          </Button>
          <Button variant="default" size="sm" onClick={() => navigate('/admin/colleges/add')}><Plus className="mr-1" />Add New College</Button>
        </div>
      </div>
      <div className="flex gap-2 mb-2">
        <Button variant="outline" disabled={selected.length === 0} onClick={() => alert('Bulk Block (mock)')}>Block Selected</Button>
        <Button variant="outline" disabled={selected.length === 0} onClick={() => alert('Bulk Message (mock)')}>Message Selected</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8 align-middle text-center justify-center cursor-pointer" style={{verticalAlign: 'middle', textAlign: 'center'}} onClick={toggleSelectAll} title={allSelected ? 'Deselect All' : 'Select All'}>
              {allSelected ? <CheckSquare className="h-5 w-5 text-blue-600 mx-auto" /> : <Square className="h-5 w-5 text-gray-400 mx-auto" />}
            </TableHead>
            <TableHead onClick={() => handleSort('id')} className="cursor-pointer text-center">College ID {sortKey === 'id' && (sortDir === 'asc' ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
            <TableHead onClick={() => handleSort('name')} className="cursor-pointer text-center">College Name {sortKey === 'name' && (sortDir === 'asc' ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
            <TableHead onClick={() => handleSort('account')} className="cursor-pointer text-center">Account Number {sortKey === 'account' && (sortDir === 'asc' ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
            <TableHead onClick={() => handleSort('students')} className="cursor-pointer text-center">Active Students {sortKey === 'students' && (sortDir === 'asc' ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
            <TableHead onClick={() => handleSort('totalReceived')} className="cursor-pointer text-center">Total Payment {sortKey === 'totalReceived' && (sortDir === 'asc' ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
            <TableHead onClick={() => handleSort('status')} className="cursor-pointer text-center">Status {sortKey === 'status' && (sortDir === 'asc' ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map(col => (
            <TableRow key={col.id}>
              <TableCell className="w-8 align-middle text-center justify-center">
                <Button size="icon" variant="ghost" onClick={() => toggleSelect(col.id)} title={selected.includes(col.id) ? 'Deselect' : 'Select'}>
                  {selected.includes(col.id) ? <CheckSquare className="h-5 w-5 text-blue-600 mx-auto" /> : <Square className="h-5 w-5 text-gray-400 mx-auto" />}
                </Button>
              </TableCell>
              <TableCell className="text-center">{col.id}</TableCell>
              <TableCell className="text-center">{col.name}</TableCell>
              <TableCell className="text-center">{col.account}</TableCell>
              <TableCell className="text-center">{col.students}</TableCell>
              <TableCell className="text-center">₹{col.totalReceived.toLocaleString()}</TableCell>
              <TableCell className="text-center">
                <Badge className={col.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                  {col.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex flex-row gap-1 items-center p-0 whitespace-nowrap">
                  <Button size="icon" variant="ghost" title="View" onClick={() => setActionModal({ type: 'view', college: col })}><Eye /></Button>
                  <Button size="icon" variant="ghost" title="Login as College" onClick={() => setActionModal({ type: 'login', college: col })}><LogIn /></Button>
                  <Button size="icon" variant="ghost" title="Edit" onClick={() => navigate(`/admin/colleges/edit/${col.id}`)}><Edit /></Button>
                  <Button size="icon" variant="ghost" title="Toggle Status" onClick={() => handleToggleStatus(col.id)}>
                    {col.status === 'Active' ? <ArrowUpDown className="text-green-600" /> : <ArrowUpDown className="text-red-600" />}
                  </Button>
                  <Button size="icon" variant="ghost" title="Message" onClick={() => setActionModal({ type: 'message', college: col })}><MessageSquare /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>All verified and active college partners.</TableCaption>
      </Table>
      {/* Action Modals */}
      <Dialog open={!!actionModal} onOpenChange={v => !v && setActionModal(null)}>
        <DialogContent className="max-w-xs w-full p-6 rounded-xl shadow-2xl mx-auto text-center bg-white flex flex-col items-center justify-center">
          <DialogHeader>
            <DialogTitle>{actionModal?.type === 'view' && 'College Details'}
              {actionModal?.type === 'login' && 'Login as College'}
              {actionModal?.type === 'edit' && 'Edit College'}
              {actionModal?.type === 'block' && 'Block College'}
              {actionModal?.type === 'message' && 'Send Message'}
              {actionModal?.type === 'payment' && 'Make Payment for Student'}
              {actionModal?.type === 'status' && 'Change College Status'}
            </DialogTitle>
          </DialogHeader>
          {actionModal?.type === 'view' && actionModal.college && (
            <div className="w-full">
              <div className="bg-gray-50 rounded-lg p-4 shadow flex flex-col gap-2 items-start">
                <div className="text-lg font-semibold mb-2">College Details</div>
                <div><span className="font-semibold">ID:</span> {actionModal.college.id}</div>
                <div><span className="font-semibold">Name:</span> {actionModal.college.name}</div>
                <div><span className="font-semibold">Account:</span> {actionModal.college.account}</div>
                <div><span className="font-semibold">Address:</span> {actionModal.college.address}</div>
                <div><span className="font-semibold">Bank:</span> {actionModal.college.bank}</div>
                <div><span className="font-semibold">Branch:</span> {actionModal.college.branch}</div>
                <div><span className="font-semibold">IFSC:</span> {actionModal.college.ifsc}</div>
                <div><span className="font-semibold">Active Students:</span> {actionModal.college.students}</div>
                <div><span className="font-semibold">Total Payment:</span> ₹{actionModal.college.totalReceived?.toLocaleString()}</div>
                <div><span className="font-semibold">Status:</span> {actionModal.college.status}</div>
              </div>
            </div>
          )}
          {actionModal?.type === 'login' && (
            <div>Simulating login as <b>{actionModal.college.name}</b> (mock action).</div>
          )}
          {actionModal?.type === 'block' && (
            <div>Are you sure you want to block <b>{actionModal.college.name}</b>? <Button variant="destructive" className="ml-2">Block</Button></div>
          )}
          {actionModal?.type === 'message' && (
            <div className="w-full">
              <textarea className="w-full border rounded p-2 mb-4" placeholder="Type your message..." rows={4} />
              <Button className="w-full">Send</Button>
            </div>
          )}
          {actionModal?.type === 'payment' && (
            <div>
              <div>Select student and enter amount (mock):</div>
              <select className="w-full border rounded p-2 my-2">
                {mockStudents.filter(s => s.collegeId === actionModal.college.id).map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                ))}
              </select>
              <Input placeholder="Amount" type="number" />
              <Button className="mt-2">Make Payment</Button>
            </div>
          )}
          {actionModal?.type === 'status' && (
            <div className="w-full">
              <div className="text-lg font-semibold mb-4">Change College Status</div>
              <select
                className="w-full border rounded p-2 mb-4"
                value={actionModal.college.status}
                onChange={e => setActionModal({ ...actionModal, college: { ...actionModal.college, status: e.target.value } })}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <Button className="w-full">Save Status</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 