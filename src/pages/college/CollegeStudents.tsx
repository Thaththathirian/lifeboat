import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Eye, ArrowUp, ArrowDown, Search, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const receivedStudents = [
  { id: "STU001", name: "Priya Sharma", status: "Active", semester: "3rd", grade: "B.Tech CSE", amount: 50000, mobile: "9876543210", email: "priya@email.com", documents: ["Request Letter", "ID Card", "10th Marksheet"], statusBar: ["Profile Updated", "Interview Scheduled", "Documents Submitted", "Eligible for Scholarship", "Paid"], alumni: false },
  { id: "STU002", name: "Rahul Kumar", status: "Active", semester: "2nd", grade: "B.Com", amount: 50000, mobile: "9876543211", email: "rahul@email.com", documents: ["Request Letter", "ID Card"], statusBar: ["Profile Updated", "Interview Scheduled", "Paid"], alumni: false },
  { id: "STU005", name: "Neha Gupta", status: "Active", semester: "4th", grade: "BCA", amount: 30000, mobile: "9876543215", email: "neha@email.com", documents: ["Request Letter", "ID Card", "10th Marksheet"], statusBar: ["Profile Updated", "Interview Scheduled", "Documents Submitted", "Eligible for Scholarship", "Paid"], alumni: false },
  { id: "STU006", name: "Karan Singh", status: "Active", semester: "1st", grade: "MBA", amount: 75000, mobile: "9876543216", email: "karan@email.com", documents: ["Request Letter", "ID Card", "10th Marksheet", "12th Marksheet"], statusBar: ["Profile Updated", "Interview Scheduled", "Documents Submitted", "Eligible for Scholarship", "Paid"], alumni: false }
];

const appliedStudents = [
  { id: "STU003", name: "Amit Patel", status: "Applied", semester: "4th", grade: "BCA", amount: 0, mobile: "9876543212", email: "amit@email.com", documents: ["Request Letter", "ID Card", "10th Marksheet", "12th Marksheet"], statusBar: ["Profile Updated", "Interview Scheduled", "Documents Submitted"], alumni: false },
  { id: "STU007", name: "Divya Nair", status: "Applied", semester: "2nd", grade: "B.Sc", amount: 0, mobile: "9876543217", email: "divya@email.com", documents: ["Request Letter", "ID Card"], statusBar: ["Profile Updated", "Interview Scheduled"], alumni: false },
  { id: "STU008", name: "Vikram Mehta", status: "Applied", semester: "3rd", grade: "B.Tech", amount: 0, mobile: "9876543218", email: "vikram@email.com", documents: ["Request Letter", "ID Card", "10th Marksheet"], statusBar: ["Profile Updated"], alumni: false }
];

const alumniStudents = [
  {
    id: "STU004",
    name: "Sonal Mehta",
    status: "Alumni",
    semester: "Completed",
    grade: "B.Sc",
    amount: 100000,
    mobile: "9876543213",
    email: "sonal@email.com",
    documents: ["Request Letter", "ID Card", "10th Marksheet", "12th Marksheet", "Degree Certificate"],
    statusBar: ["Profile Updated", "Interview Scheduled", "Documents Submitted", "Eligible for Scholarship", "Paid", "Alumni"],
    alumni: true,
    receivedAmountsBySemester: [
      { semester: "1st", amount: 20000 },
      { semester: "2nd", amount: 20000 },
      { semester: "3rd", amount: 30000 },
      { semester: "4th", amount: 30000 },
    ],
  },
  {
    id: "STU009",
    name: "Rohit Sharma",
    status: "Alumni",
    semester: "Completed",
    grade: "B.Com",
    amount: 80000,
    mobile: "9876543219",
    email: "rohit@email.com",
    documents: ["Request Letter", "ID Card", "10th Marksheet", "12th Marksheet", "Degree Certificate"],
    statusBar: ["Profile Updated", "Interview Scheduled", "Documents Submitted", "Eligible for Scholarship", "Paid", "Alumni"],
    alumni: true,
    receivedAmountsBySemester: [
      { semester: "1st", amount: 20000 },
      { semester: "2nd", amount: 20000 },
      { semester: "3rd", amount: 20000 },
      { semester: "4th", amount: 20000 },
    ],
  }
];

export default function CollegeStudents() {
  const [openStudent, setOpenStudent] = useState(null);
  const [tab, setTab] = useState('received');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  };

  const getCurrentStudents = () => {
    switch (tab) {
      case 'received': return receivedStudents;
      case 'applied': return appliedStudents;
      case 'alumni': return alumniStudents;
      default: return [];
    }
  };

  const getUniqueGrades = () => {
    const currentStudents = getCurrentStudents();
    return [...new Set(currentStudents.map(s => s.grade))];
  };

  const getUniqueStatuses = () => {
    const currentStudents = getCurrentStudents();
    return [...new Set(currentStudents.map(s => s.status))];
  };

  // Filter and sort students
  const filteredStudents = getCurrentStudents().filter(student => {
    const matchesSearch = !search || 
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.id.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase()) ||
      student.mobile.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesGrade = gradeFilter === 'all' || student.grade === gradeFilter;
    
    return matchesSearch && matchesStatus && matchesGrade;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const allStudents = [...receivedStudents, ...appliedStudents, ...alumniStudents];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground mt-2">Manage students across different categories</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download List
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{allStudents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Received Students</p>
                <p className="text-2xl font-bold text-green-600">{receivedStudents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Applied Students</p>
                <p className="text-2xl font-bold text-blue-600">{appliedStudents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alumni</p>
                <p className="text-2xl font-bold text-purple-600">{alumniStudents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button variant={tab === 'received' ? 'default' : 'outline'} onClick={() => setTab('received')}>
          Received Students ({receivedStudents.length})
        </Button>
        <Button variant={tab === 'applied' ? 'default' : 'outline'} onClick={() => setTab('applied')}>
          Applied Students ({appliedStudents.length})
        </Button>
        <Button variant={tab === 'alumni' ? 'default' : 'outline'} onClick={() => setTab('alumni')}>
          Alumni ({alumniStudents.length})
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {tab === 'received' ? 'Received Students' : 
             tab === 'applied' ? 'Applied Students (Not Received)' : 
             'Alumni Students'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <Input 
                placeholder="Search students..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-xs"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {getUniqueStatuses().map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {getUniqueGrades().map(grade => (
                  <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center cursor-pointer" onClick={() => handleSort('id')}>
                  Student ID {sortBy === 'id' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                </TableHead>
                <TableHead className="text-center cursor-pointer" onClick={() => handleSort('name')}>
                  Name {sortBy === 'name' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                </TableHead>
                <TableHead className="text-center cursor-pointer" onClick={() => handleSort('status')}>
                  Status {sortBy === 'status' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                </TableHead>
                <TableHead className="text-center cursor-pointer" onClick={() => handleSort('semester')}>
                  Semester {sortBy === 'semester' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                </TableHead>
                <TableHead className="text-center cursor-pointer" onClick={() => handleSort('grade')}>
                  Grade {sortBy === 'grade' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                </TableHead>
                <TableHead className="text-center cursor-pointer" onClick={() => handleSort('amount')}>
                  Scholarship Amount {sortBy === 'amount' && (sortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                </TableHead>
                {tab === 'alumni' && (
                  <TableHead className="text-center">Total Amount Received</TableHead>
                )}
                <TableHead className="text-center">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="text-center font-medium">{student.id}</TableCell>
                  <TableCell className="text-center">
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={student.status === 'Active' ? 'default' : student.status === 'Alumni' ? 'secondary' : 'outline'}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{student.semester}</TableCell>
                  <TableCell className="text-center">{student.grade}</TableCell>
                  <TableCell className="text-center font-semibold text-green-600">
                    ₹{student.amount.toLocaleString()}
                  </TableCell>
                  {tab === 'alumni' && (
                    <TableCell className="text-center font-semibold text-purple-600">
                      ₹{(student as any).receivedAmountsBySemester?.reduce((sum, s) => sum + s.amount, 0).toLocaleString() || '0'}
                    </TableCell>
                  )}
                  <TableCell className="text-center">
                    <Button variant="ghost" size="sm" onClick={() => setOpenStudent(student)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {sortedStudents.length} of {getCurrentStudents().length} students
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!openStudent} onOpenChange={() => setOpenStudent(null)}>
        <DialogContent className="max-w-lg w-full p-6">
          {openStudent && (
            <>
              <DialogHeader>
                <DialogTitle>{openStudent.name} ({openStudent.id})</DialogTitle>
              </DialogHeader>
              <div className="mb-4 flex flex-wrap gap-2">
                {openStudent.statusBar.map((status, idx) => (
                  <span key={idx} className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-semibold">{status}</span>
                ))}
              </div>
              <div className="space-y-2">
                <div><strong>Semester:</strong> {openStudent.semester}</div>
                <div><strong>Grade:</strong> {openStudent.grade}</div>
                <div><strong>Mobile:</strong> {openStudent.mobile}</div>
                <div><strong>Email:</strong> {openStudent.email}</div>
                <div><strong>Scholarship Amount:</strong> ₹{openStudent.amount.toLocaleString()}</div>
                <div><strong>Documents:</strong> {openStudent.documents.join(", ")}</div>
              </div>
              {openStudent.alumni && openStudent.receivedAmountsBySemester && (
                <div className="mt-4">
                  <strong>Amount Received Per Semester:</strong>
                  <Table className="mt-2">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">Semester</TableHead>
                        <TableHead className="text-center">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {openStudent.receivedAmountsBySemester.map((s, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="text-center">{s.semester}</TableCell>
                          <TableCell className="text-center">₹{s.amount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell className="text-center font-bold">Total</TableCell>
                        <TableCell className="text-center font-bold">₹{openStudent.receivedAmountsBySemester.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}