import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Users, Heart, DollarSign, CheckCircle, ArrowUp, ArrowDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const donors = [
  { id: "DON001", name: "Rajesh Kumar", amount: 100000, allocated: 50000, unallocated: 50000 },
  { id: "DON002", name: "Priya Sharma", amount: 75000, allocated: 25000, unallocated: 50000 },
  { id: "DON003", name: "Amit Patel", amount: 120000, allocated: 80000, unallocated: 40000 },
  { id: "DON004", name: "Vikram Singh", amount: 90000, allocated: 20000, unallocated: 70000 },
  { id: "DON005", name: "Meera Das", amount: 60000, allocated: 10000, unallocated: 50000 },
  { id: "DON006", name: "Rohit Sinha", amount: 150000, allocated: 120000, unallocated: 30000 },
  { id: "DON007", name: "Divya Nair", amount: 110000, allocated: 60000, unallocated: 50000 },
];

const eligibleStudents = [
  { id: "STU001", name: "Rohan Verma", college: "Mumbai University", course: "B.Com", semester: 3, status: "eligible" },
  { id: "STU002", name: "Sneha Gupta", college: "Delhi College", course: "BCA", semester: 2, status: "eligible" },
  { id: "STU003", name: "Arjun Singh", college: "Chennai College", course: "B.Com", semester: 4, status: "eligible" },
];

const previousAllocations = [
  { id: "ALLOC001", studentId: "STU001", studentName: "Rohan Verma", college: "Mumbai University", course: "B.Com", amount: 25000, totalAmount: 75000, date: "2024-01-15", status: "completed" },
  { id: "ALLOC002", studentId: "STU004", studentName: "Priya Singh", college: "Delhi College", course: "BCA", amount: 30000, totalAmount: 75000, date: "2024-01-15", status: "completed" },
  { id: "ALLOC003", studentId: "STU005", studentName: "Amit Kumar", college: "Mumbai University", course: "B.Tech", amount: 20000, totalAmount: 75000, date: "2024-01-15", status: "completed" },
  { id: "ALLOC004", studentId: "STU002", studentName: "Sneha Gupta", college: "Delhi College", course: "BCA", amount: 35000, totalAmount: 120000, date: "2024-02-10", status: "completed" },
  { id: "ALLOC005", studentId: "STU006", studentName: "Rajesh Patel", college: "Chennai College", course: "MBA", amount: 45000, totalAmount: 120000, date: "2024-02-10", status: "completed" },
  { id: "ALLOC006", studentId: "STU007", studentName: "Kavya Sharma", college: "Pune University", course: "B.Com", amount: 40000, totalAmount: 120000, date: "2024-02-10", status: "completed" },
  { id: "ALLOC007", studentId: "STU008", studentName: "Arjun Reddy", college: "Hyderabad College", course: "BBA", amount: 28000, totalAmount: 90000, date: "2024-03-05", status: "completed" },
  { id: "ALLOC008", studentId: "STU009", studentName: "Meera Das", college: "Kolkata University", course: "B.Sc", amount: 32000, totalAmount: 90000, date: "2024-03-05", status: "completed" },
  { id: "ALLOC009", studentId: "STU010", studentName: "Vikram Singh", college: "Mumbai University", course: "B.Tech", amount: 30000, totalAmount: 90000, date: "2024-03-05", status: "completed" },
];

export default function AdminPaymentAllotment() {
  const [selectedDonors, setSelectedDonors] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [allocations, setAllocations] = useState<{[key: string]: {amount: number, description: string}}>({});
  const [showAllotmentDialog, setShowAllotmentDialog] = useState(false);
  const [donorSortBy, setDonorSortBy] = useState('id');
  const [donorSortDir, setDonorSortDir] = useState<'asc' | 'desc'>('asc');
  const [studentSortBy, setStudentSortBy] = useState('id');
  const [studentSortDir, setStudentSortDir] = useState<'asc' | 'desc'>('asc');
  const [activeTab, setActiveTab] = useState('donors');
  const [cameFromSelectStudents, setCameFromSelectStudents] = useState(false);
  const [selectAllDonors, setSelectAllDonors] = useState(false);
  const [selectAllStudents, setSelectAllStudents] = useState(false);
  const [allocationSortBy, setAllocationSortBy] = useState('date');
  const [allocationSortDir, setAllocationSortDir] = useState<'asc' | 'desc'>('desc');
  const [allocationSearch, setAllocationSearch] = useState('');
  const [allocationStatusFilter, setAllocationStatusFilter] = useState('all');

  // Calculate current available donors, total available amount, and total allocated amount
  const currentAvailableDonors = donors.filter(d => d.unallocated > 0);
  const totalAvailableAmount = currentAvailableDonors.reduce((sum, d) => sum + d.unallocated, 0);
  const totalAllocatedAmount = donors.reduce((sum, d) => sum + d.allocated, 0);

  const handleDonorSelection = (donorId: string) => {
    setSelectedDonors(prev => 
      prev.includes(donorId) 
        ? prev.filter(id => id !== donorId)
        : [...prev, donorId]
    );
  };

  const handleSelectAllDonors = () => {
    if (selectAllDonors) {
      setSelectedDonors([]);
      setSelectAllDonors(false);
    } else {
      setSelectedDonors(sortedDonors.map(d => d.id));
      setSelectAllDonors(true);
    }
  };

  const handleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAllStudents = () => {
    if (selectAllStudents) {
      setSelectedStudents([]);
      setSelectAllStudents(false);
    } else {
      setSelectedStudents(sortedStudents.map(s => s.id));
      setSelectAllStudents(true);
    }
  };

  const handleAllocationChange = (studentId: string, amount: number, description: string) => {
    setAllocations(prev => ({
      ...prev,
      [studentId]: { amount, description }
    }));
  };

  const generateTransactionId = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 5);
    return `TXN-${timestamp}-${randomStr}`.toUpperCase();
  };

  const handleUpdateToPaid = () => {
    if (selectedStudents.length === 0) {
      alert("Please select students to update to paid status.");
      return;
    }

    const transactionIds = selectedStudents.map(studentId => {
      const student = sortedStudents.find(s => s.id === studentId);
      const transactionId = generateTransactionId();
      return { studentId, studentName: student?.name, transactionId };
    });

    console.log("Transaction IDs generated for students:", transactionIds);
    alert(`${selectedStudents.length} students updated to Paid status. Transaction IDs generated.`);
    
    // Clear selections after update
    setSelectedStudents([]);
    setSelectAllStudents(false);
  };

  const handleMakeAllotment = () => {
    const totalUnallocated = selectedDonors.reduce((sum, id) => {
      const donor = sortedDonors.find(d => d.id === id);
      return sum + (donor ? donor.unallocated : 0);
    }, 0);
    const totalAllocated = Object.values(allocations).reduce((sum, alloc) => sum + (alloc.amount || 0), 0);
    
    if (totalAllocated > totalUnallocated) {
      // Re-allocate excess to donor with maximum unallocated amount (name order for ties)
      const excess = totalAllocated - totalUnallocated;
      const selectedDonorsList = selectedDonors.map(id => sortedDonors.find(d => d.id === id)!).filter(Boolean);
      const maxUnallocated = Math.max(...selectedDonorsList.map(d => d.unallocated));
      const maxDonors = selectedDonorsList.filter(d => d.unallocated === maxUnallocated);
      const targetDonor = maxDonors.sort((a, b) => a.name.localeCompare(b.name))[0];
      
      // Update donor unallocated amount
      const updatedDonors = donors.map(d => 
        d.id === targetDonor.id ? { ...d, unallocated: d.unallocated + excess } : d
      );
      
      alert(`Excess amount of ₹${excess.toLocaleString()} has been re-allocated to ${targetDonor.name}'s unallocated funds.`);
    }
    setShowAllotmentDialog(true);
  };

  const handleDonorSort = (col: string) => {
    if (donorSortBy === col) {
      setDonorSortDir(donorSortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setDonorSortBy(col);
      setDonorSortDir('asc');
    }
  };
  const handleStudentSort = (col: string) => {
    if (studentSortBy === col) {
      setStudentSortDir(studentSortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setStudentSortBy(col);
      setStudentSortDir('asc');
    }
  };

  const handleAllocationSort = (col: string) => {
    if (allocationSortBy === col) {
      setAllocationSortDir(allocationSortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setAllocationSortBy(col);
      setAllocationSortDir('asc');
    }
  };

  const sortedDonors = [...donors].sort((a, b) => {
    let aVal = a[donorSortBy];
    let bVal = b[donorSortBy];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return donorSortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return donorSortDir === 'asc' ? 1 : -1;
    return 0;
  });
  const sortedStudents = [...eligibleStudents].sort((a, b) => {
    let aVal = a[studentSortBy];
    let bVal = b[studentSortBy];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return studentSortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return studentSortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Filter and sort allocations
  const filteredAllocations = previousAllocations.filter(allocation => {
    const searchTerm = allocationSearch.toLowerCase();
    const matchesSearch = !searchTerm || 
      allocation.studentName.toLowerCase().includes(searchTerm) ||
      allocation.studentId.toLowerCase().includes(searchTerm) ||
      allocation.college.toLowerCase().includes(searchTerm) ||
      allocation.course.toLowerCase().includes(searchTerm);
    
    const matchesStatus = allocationStatusFilter === 'all' || allocation.status === allocationStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedAllocations = [...filteredAllocations].sort((a, b) => {
    let aVal = a[allocationSortBy];
    let bVal = b[allocationSortBy];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return allocationSortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return allocationSortDir === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Add Payment Allotment title above summary cards */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Payment Allotment</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Available Donors</p>
                <p className="text-2xl font-bold">{currentAvailableDonors.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Donors with unallocated funds</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Available Amount</p>
                <p className="text-2xl font-bold">₹{totalAvailableAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Sum of all unallocated</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Allocated Amount</p>
                <p className="text-2xl font-bold">₹{totalAllocatedAmount.toLocaleString()}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Sum of all allocated</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        if (value === 'students' && activeTab !== 'students') {
          setCameFromSelectStudents(false);
        }
      }} className="space-y-4">
        <TabsList>
          <TabsTrigger value="donors">Select Donors</TabsTrigger>
          <TabsTrigger value="students">Allocate to Students</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
        </TabsList>

        <TabsContent value="donors" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gray-100 rounded px-6 py-3 text-lg font-semibold">
              Total Amount to Allocate: <span className="text-green-600">₹{selectedDonors.reduce((sum, id) => {
                const donor = sortedDonors.find(d => d.id === id);
                return sum + (donor ? donor.unallocated : 0);
              }, 0).toLocaleString()}</span>
            </div>
            <button
              className={`ml-4 px-6 py-2 rounded bg-blue-600 text-white font-semibold transition disabled:bg-gray-300 disabled:text-gray-500`}
              disabled={selectedDonors.length === 0}
              onClick={() => {
                setActiveTab('students');
                setCameFromSelectStudents(true);
              }}
            >
              Select Students
            </button>
          </div>
              <div className="flex flex-wrap gap-4 mb-4">
                <Input className="max-w-xs" placeholder="Search donors..." />
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">Donor ID</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="amount">Total Amount</SelectItem>
                    <SelectItem value="allocated">Allocated</SelectItem>
                    <SelectItem value="unallocated">Unallocated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectAllDonors}
                      onChange={handleSelectAllDonors}
                      className="rounded"
                    />
                    <span>Select All</span>
                  </div>
                </TableHead>
                <TableHead className="text-center cursor-pointer" onClick={() => handleDonorSort('id')}>Donor ID {donorSortBy === 'id' && (donorSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}</TableHead>
                <TableHead className="text-center cursor-pointer" onClick={() => handleDonorSort('name')}>Name {donorSortBy === 'name' && (donorSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}</TableHead>
                <TableHead className="text-center cursor-pointer" onClick={() => handleDonorSort('amount')}>Total Amount {donorSortBy === 'amount' && (donorSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}</TableHead>
                <TableHead className="text-center cursor-pointer" onClick={() => handleDonorSort('allocated')}>Allocated {donorSortBy === 'allocated' && (donorSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}</TableHead>
                <TableHead className="text-center cursor-pointer" onClick={() => handleDonorSort('unallocated')}>Unallocated {donorSortBy === 'unallocated' && (donorSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDonors.map((donor) => (
                <TableRow key={donor.id}>
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedDonors.includes(donor.id)}
                      onChange={() => handleDonorSelection(donor.id)}
                      className="rounded"
                    />
                  </TableCell>
                  <TableCell className="text-center font-medium">{donor.id}</TableCell>
                  <TableCell className="text-center">{donor.name}</TableCell>
                  <TableCell className="text-center">₹{donor.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-center">₹{donor.allocated.toLocaleString()}</TableCell>
                  <TableCell className="text-center font-semibold text-green-600">₹{donor.unallocated.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Eligible Students</CardTitle>
              <CardDescription>Allocate scholarship amounts to eligible students</CardDescription>
            </CardHeader>
            <CardContent>
              {cameFromSelectStudents && (
                <button
                  className="mb-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
                  onClick={() => {
                    setActiveTab('donors');
                    setCameFromSelectStudents(false);
                  }}
                >
                  ← Back to Donor Selection
                </button>
              )}
              
              <div className="mb-4 flex items-center gap-4">
                <div className="bg-blue-50 rounded px-4 py-2 text-sm font-medium">
                  Total Available: <span className="text-blue-600">₹{selectedDonors.reduce((sum, id) => {
                    const donor = sortedDonors.find(d => d.id === id);
                    return sum + (donor ? donor.unallocated : 0);
                  }, 0).toLocaleString()}</span>
                </div>
                {(() => {
                  const totalUnallocated = selectedDonors.reduce((sum, id) => {
                    const donor = sortedDonors.find(d => d.id === id);
                    return sum + (donor ? donor.unallocated : 0);
                  }, 0);
                  const totalAllocated = Object.values(allocations).reduce((sum, alloc) => sum + (alloc.amount || 0), 0);
                  const remaining = selectedDonors.length === 0 ? 0 : totalUnallocated - totalAllocated;
                  return (
                    <div className="bg-gray-50 rounded px-4 py-2 text-sm font-medium">
                      Remaining: <span style={{ color: selectedDonors.length === 0 ? '#6b7280' : (remaining < 0 ? '#dc2626' : '#059669') }}>
                        ₹{remaining.toLocaleString()}
                      </span>
                    </div>
                  );
                })()}
              </div>
              
              {selectedDonors.length === 0 && (
                <div className="mb-4 text-center text-yellow-600 font-medium">Please select at least one donor to allocate funds.</div>
              )}
              
              {sortedStudents.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectAllStudents}
                              onChange={handleSelectAllStudents}
                              className="rounded"
                              disabled={selectedDonors.length === 0}
                            />
                            <span>Select All</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-center cursor-pointer" onClick={() => handleStudentSort('id')}>Student ID {studentSortBy === 'id' && (studentSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}</TableHead>
                        <TableHead className="text-center cursor-pointer" onClick={() => handleStudentSort('name')}>Name {studentSortBy === 'name' && (studentSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}</TableHead>
                        <TableHead className="text-center cursor-pointer" onClick={() => handleStudentSort('college')}>College {studentSortBy === 'college' && (studentSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}</TableHead>
                        <TableHead className="text-center cursor-pointer" onClick={() => handleStudentSort('course')}>Course {studentSortBy === 'course' && (studentSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}</TableHead>
                        <TableHead className="text-center cursor-pointer" onClick={() => handleStudentSort('semester')}>Semester {studentSortBy === 'semester' && (studentSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}</TableHead>
                        <TableHead className="text-center">Amount</TableHead>
                        <TableHead className="text-center">Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="text-center">
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student.id)}
                              onChange={() => handleStudentSelection(student.id)}
                              className="rounded"
                              disabled={selectedDonors.length === 0}
                            />
                          </TableCell>
                          <TableCell className="text-center font-medium">{student.id}</TableCell>
                          <TableCell className="text-center">{student.name}</TableCell>
                          <TableCell className="text-center">{student.college}</TableCell>
                          <TableCell className="text-center">{student.course}</TableCell>
                          <TableCell className="text-center">{student.semester}</TableCell>
                          <TableCell className="text-center">
                            <Input
                              type="number"
                              placeholder="Amount"
                              className="w-24 mx-auto"
                              disabled={selectedDonors.length === 0 || !selectedStudents.includes(student.id)}
                              value={allocations[student.id]?.amount || ''}
                              onChange={(e) => handleAllocationChange(
                                student.id, 
                                parseInt(e.target.value) || 0, 
                                allocations[student.id]?.description || ''
                              )}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Input
                              placeholder="Description"
                              className="w-32 mx-auto"
                              disabled={selectedDonors.length === 0 || !selectedStudents.includes(student.id)}
                              value={allocations[student.id]?.description || ''}
                              onChange={(e) => handleAllocationChange(
                                student.id, 
                                allocations[student.id]?.amount || 0, 
                                e.target.value
                              )}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="flex justify-end mt-4 gap-2">
                    {(() => {
                      const totalUnallocated = selectedDonors.reduce((sum, id) => {
                        const donor = sortedDonors.find(d => d.id === id);
                        return sum + (donor ? donor.unallocated : 0);
                      }, 0);
                      const totalAllocated = Object.values(allocations).reduce((sum, alloc) => sum + (alloc.amount || 0), 0);
                      const remaining = selectedDonors.length === 0 ? 0 : totalUnallocated - totalAllocated;
                      
                      const isDisabled = selectedDonors.length === 0 || 
                                       selectedStudents.length === 0 || 
                                       remaining < 0 || 
                                       totalAllocated === 0;
                      
                      return (
                        <>
                          <Button 
                            variant="outline" 
                            onClick={handleUpdateToPaid}
                            disabled={selectedStudents.length === 0}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Update to Paid
                          </Button>
                          <Button onClick={handleMakeAllotment} disabled={isDisabled}>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Make Allotment
                          </Button>
                        </>
                      );
                    })()}
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-8 text-lg">No eligible students available for allocation.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Previous Allocations</CardTitle>
              <CardDescription>View all previous allocation records with sorting and filtering options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-4">
                <Input 
                  className="max-w-xs" 
                  placeholder="Search students, colleges, courses..." 
                  value={allocationSearch}
                  onChange={(e) => setAllocationSearch(e.target.value)}
                />
                <Select value={allocationStatusFilter} onValueChange={setAllocationStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {sortedAllocations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center cursor-pointer" onClick={() => handleAllocationSort('id')}>
                        Allocation ID {allocationSortBy === 'id' && (allocationSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                      </TableHead>
                      <TableHead className="text-center cursor-pointer" onClick={() => handleAllocationSort('studentId')}>
                        Student ID {allocationSortBy === 'studentId' && (allocationSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                      </TableHead>
                      <TableHead className="text-center cursor-pointer" onClick={() => handleAllocationSort('studentName')}>
                        Student Name {allocationSortBy === 'studentName' && (allocationSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                      </TableHead>
                      <TableHead className="text-center cursor-pointer" onClick={() => handleAllocationSort('college')}>
                        College {allocationSortBy === 'college' && (allocationSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                      </TableHead>
                      <TableHead className="text-center cursor-pointer" onClick={() => handleAllocationSort('course')}>
                        Course {allocationSortBy === 'course' && (allocationSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                      </TableHead>
                      <TableHead className="text-center cursor-pointer" onClick={() => handleAllocationSort('amount')}>
                        Allocated Amount {allocationSortBy === 'amount' && (allocationSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                      </TableHead>
                      <TableHead className="text-center cursor-pointer" onClick={() => handleAllocationSort('totalAmount')}>
                        Total Amount {allocationSortBy === 'totalAmount' && (allocationSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                      </TableHead>
                      <TableHead className="text-center cursor-pointer" onClick={() => handleAllocationSort('date')}>
                        Date {allocationSortBy === 'date' && (allocationSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                      </TableHead>
                      <TableHead className="text-center cursor-pointer" onClick={() => handleAllocationSort('status')}>
                        Status {allocationSortBy === 'status' && (allocationSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAllocations.map((allocation) => (
                      <TableRow key={allocation.id}>
                        <TableCell className="text-center font-medium">{allocation.id}</TableCell>
                        <TableCell className="text-center">{allocation.studentId}</TableCell>
                        <TableCell className="text-center">{allocation.studentName}</TableCell>
                        <TableCell className="text-center">{allocation.college}</TableCell>
                        <TableCell className="text-center">{allocation.course}</TableCell>
                        <TableCell className="text-center font-semibold text-green-600">₹{allocation.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-center">₹{allocation.totalAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-center">{new Date(allocation.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={allocation.status === 'completed' ? 'default' : allocation.status === 'pending' ? 'secondary' : 'destructive'}>
                            {allocation.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-gray-500 py-8 text-lg">No allocations found matching your criteria.</div>
              )}
              
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {sortedAllocations.length} of {previousAllocations.length} allocations
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showAllotmentDialog} onOpenChange={setShowAllotmentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment Allotment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>You are about to allocate ₹{totalAllocatedAmount.toLocaleString()} to {Object.keys(allocations).length} students.</p>
            <div className="border rounded p-4 space-y-2">
              <h4 className="font-semibold">Selected Donors:</h4>
              {selectedDonors.map(donorId => {
                const donor = donors.find(d => d.id === donorId);
                return <p key={donorId} className="text-sm">{donor?.name} - ₹{donor?.unallocated.toLocaleString()}</p>
              })}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAllotmentDialog(false)}>Cancel</Button>
              <Button onClick={() => {
                alert("Payment allotment confirmed! Students and donors will be notified.");
                setShowAllotmentDialog(false);
                setAllocations({});
                setSelectedDonors([]);
              }}>
                Confirm Allotment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}