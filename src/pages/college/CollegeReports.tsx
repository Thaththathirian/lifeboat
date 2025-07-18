import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, TrendingUp, Users, DollarSign, GraduationCap, Calendar, Search, ArrowUp, ArrowDown } from "lucide-react";

const reports = [
  { title: "Total Scholarship Received", desc: "Summary of all scholarship funds received by your college.", file: "scholarship-total.pdf", icon: DollarSign },
  { title: "Scholarship Per Student", desc: "Detailed report of scholarship amount per student.", file: "scholarship-student.pdf", icon: Users },
  { title: "Scholarship Per Year", desc: "Year-wise breakdown of scholarships.", file: "scholarship-year.pdf", icon: Calendar },
  { title: "Scholarship Per Batch", desc: "Batch-wise scholarship distribution.", file: "scholarship-batch.pdf", icon: GraduationCap },
  { title: "Pass/Fail List", desc: "List of students who passed or failed.", file: "pass-fail-list.pdf", icon: TrendingUp },
  { title: "Student Performance Report", desc: "Academic performance analysis of scholarship recipients.", file: "performance-report.pdf", icon: FileText }
];

const scholarshipSummary = [
  { id: "STU001", name: "Amit Kumar", course: "B.Tech", year: "2024", semester: "3", totalReceived: 150000, lastPayment: "2024-03-15", status: "Active" },
  { id: "STU002", name: "Priya Sharma", course: "BCA", year: "2024", semester: "2", totalReceived: 75000, lastPayment: "2024-03-10", status: "Active" },
  { id: "STU003", name: "Rahul Singh", course: "MBA", year: "2024", semester: "1", totalReceived: 200000, lastPayment: "2024-03-20", status: "Active" },
  { id: "STU004", name: "Sonal Mehta", course: "B.Com", year: "2023", semester: "6", totalReceived: 100000, lastPayment: "2024-02-28", status: "Graduated" },
  { id: "STU005", name: "Vikram Patel", course: "B.Sc", year: "2024", semester: "4", totalReceived: 120000, lastPayment: "2024-03-05", status: "Active" },
];

const paymentSummary = [
  { id: "PAY001", student: "Priya Sharma", studentId: "STU002", amount: 25000, date: "2024-03-15", semester: "Semester 2", status: "Verified", verifiedBy: "Admin" },
  { id: "PAY002", student: "Rahul Kumar", studentId: "STU001", amount: 25000, date: "2024-03-10", semester: "Semester 3", status: "Pending", verifiedBy: "-" },
  { id: "PAY003", student: "Amit Singh", studentId: "STU003", amount: 30000, date: "2024-03-20", semester: "Semester 1", status: "Verified", verifiedBy: "College" },
  { id: "PAY004", student: "Neha Gupta", studentId: "STU004", amount: 20000, date: "2024-03-08", semester: "Semester 4", status: "Rejected", verifiedBy: "Admin" },
  { id: "PAY005", student: "Karan Mehta", studentId: "STU005", amount: 35000, date: "2024-03-25", semester: "Semester 2", status: "Verified", verifiedBy: "College" },
];

const batchWiseData = [
  { batch: "2024", totalStudents: 45, scholarshipStudents: 15, totalAmount: 750000, averageAmount: 50000, passRate: 85 },
  { batch: "2023", totalStudents: 50, scholarshipStudents: 18, totalAmount: 900000, averageAmount: 50000, passRate: 88 },
  { batch: "2022", totalStudents: 48, scholarshipStudents: 20, totalAmount: 1000000, averageAmount: 50000, passRate: 90 },
  { batch: "2021", totalStudents: 52, scholarshipStudents: 22, totalAmount: 1100000, averageAmount: 50000, passRate: 92 },
];

export default function CollegeReports() {
  const [activeTab, setActiveTab] = useState('overview');
  const [scholarshipSearch, setScholarshipSearch] = useState('');
  const [scholarshipSortBy, setScholarshipSortBy] = useState('name');
  const [scholarshipSortDir, setScholarshipSortDir] = useState<'asc' | 'desc'>('asc');
  const [scholarshipStatusFilter, setScholarshipStatusFilter] = useState('all');
  
  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentSortBy, setPaymentSortBy] = useState('date');
  const [paymentSortDir, setPaymentSortDir] = useState<'asc' | 'desc'>('desc');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');

  const [batchSortBy, setBatchSortBy] = useState('batch');
  const [batchSortDir, setBatchSortDir] = useState<'asc' | 'desc'>('desc');

  const handleScholarshipSort = (col: string) => {
    if (scholarshipSortBy === col) {
      setScholarshipSortDir(scholarshipSortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setScholarshipSortBy(col);
      setScholarshipSortDir('asc');
    }
  };

  const handlePaymentSort = (col: string) => {
    if (paymentSortBy === col) {
      setPaymentSortDir(paymentSortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setPaymentSortBy(col);
      setPaymentSortDir('asc');
    }
  };

  const handleBatchSort = (col: string) => {
    if (batchSortBy === col) {
      setBatchSortDir(batchSortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setBatchSortBy(col);
      setBatchSortDir('asc');
    }
  };

  // Filter and sort scholarship data
  const filteredScholarships = scholarshipSummary.filter(student => {
    const matchesSearch = !scholarshipSearch || 
      student.name.toLowerCase().includes(scholarshipSearch.toLowerCase()) ||
      student.id.toLowerCase().includes(scholarshipSearch.toLowerCase()) ||
      student.course.toLowerCase().includes(scholarshipSearch.toLowerCase());
    
    const matchesStatus = scholarshipStatusFilter === 'all' || student.status === scholarshipStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedScholarships = [...filteredScholarships].sort((a, b) => {
    let aVal = a[scholarshipSortBy];
    let bVal = b[scholarshipSortBy];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return scholarshipSortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return scholarshipSortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Filter and sort payment data
  const filteredPayments = paymentSummary.filter(payment => {
    const matchesSearch = !paymentSearch || 
      payment.student.toLowerCase().includes(paymentSearch.toLowerCase()) ||
      payment.studentId.toLowerCase().includes(paymentSearch.toLowerCase()) ||
      payment.id.toLowerCase().includes(paymentSearch.toLowerCase());
    
    const matchesStatus = paymentStatusFilter === 'all' || payment.status === paymentStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    let aVal = a[paymentSortBy];
    let bVal = b[paymentSortBy];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return paymentSortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return paymentSortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Sort batch data
  const sortedBatchData = [...batchWiseData].sort((a, b) => {
    let aVal = a[batchSortBy];
    let bVal = b[batchSortBy];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return batchSortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return batchSortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDownload = (filename: string) => {
    // Mock download functionality
    const link = document.createElement('a');
    link.href = `/reports/${filename}`;
    link.download = filename;
    link.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-2">Comprehensive reports and analytics for your college</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="batch-wise">Batch Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.title} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <report.icon className="h-8 w-8 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{report.desc}</CardDescription>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownload(report.file)}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold">195</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Scholarship Students</p>
                    <p className="text-2xl font-bold">75</p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">₹37.5L</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pass Rate</p>
                    <p className="text-2xl font-bold">89%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scholarships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scholarship Recipients</CardTitle>
              <CardDescription>Detailed information about all scholarship recipients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <Input 
                    placeholder="Search students..." 
                    value={scholarshipSearch}
                    onChange={(e) => setScholarshipSearch(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
                <Select value={scholarshipStatusFilter} onValueChange={setScholarshipStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Graduated">Graduated</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center cursor-pointer" onClick={() => handleScholarshipSort('id')}>
                      Student ID {scholarshipSortBy === 'id' && (scholarshipSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                    </TableHead>
                    <TableHead className="text-center cursor-pointer" onClick={() => handleScholarshipSort('name')}>
                      Name {scholarshipSortBy === 'name' && (scholarshipSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                    </TableHead>
                    <TableHead className="text-center cursor-pointer" onClick={() => handleScholarshipSort('course')}>
                      Course {scholarshipSortBy === 'course' && (scholarshipSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                    </TableHead>
                    <TableHead className="text-center cursor-pointer" onClick={() => handleScholarshipSort('year')}>
                      Year {scholarshipSortBy === 'year' && (scholarshipSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                    </TableHead>
                    <TableHead className="text-center cursor-pointer" onClick={() => handleScholarshipSort('semester')}>
                      Semester {scholarshipSortBy === 'semester' && (scholarshipSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                    </TableHead>
                    <TableHead className="text-center cursor-pointer" onClick={() => handleScholarshipSort('totalReceived')}>
                      Total Received {scholarshipSortBy === 'totalReceived' && (scholarshipSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                    </TableHead>
                    <TableHead className="text-center cursor-pointer" onClick={() => handleScholarshipSort('lastPayment')}>
                      Last Payment {scholarshipSortBy === 'lastPayment' && (scholarshipSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                    </TableHead>
                    <TableHead className="text-center cursor-pointer" onClick={() => handleScholarshipSort('status')}>
                      Status {scholarshipSortBy === 'status' && (scholarshipSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedScholarships.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="text-center font-medium">{student.id}</TableCell>
                      <TableCell className="text-center">{student.name}</TableCell>
                      <TableCell className="text-center">{student.course}</TableCell>
                      <TableCell className="text-center">{student.year}</TableCell>
                      <TableCell className="text-center">{student.semester}</TableCell>
                      <TableCell className="text-center font-semibold text-green-600">₹{student.totalReceived.toLocaleString()}</TableCell>
                      <TableCell className="text-center">{student.lastPayment}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={student.status === 'Active' ? 'default' : student.status === 'Graduated' ? 'secondary' : 'destructive'}>
                          {student.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {sortedScholarships.length} of {scholarshipSummary.length} students
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Verifications</CardTitle>
              <CardDescription>Recent payment verifications and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <Input 
                    placeholder="Search payments..." 
                    value={paymentSearch}
                    onChange={(e) => setPaymentSearch(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
                <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Verified">Verified</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center cursor-pointer" onClick={() => handlePaymentSort('id')}>
                      Payment ID {paymentSortBy === 'id' && (paymentSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                    </TableHead>
                    <TableHead className="text-center cursor-pointer" onClick={() => handlePaymentSort('student')}>
                      Student {paymentSortBy === 'student' && (paymentSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                    </TableHead>
                    <TableHead className="text-center cursor-pointer" onClick={() => handlePaymentSort('amount')}>
                      Amount {paymentSortBy === 'amount' && (paymentSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                    </TableHead>
                    <TableHead className="text-center cursor-pointer" onClick={() => handlePaymentSort('date')}>
                      Date {paymentSortBy === 'date' && (paymentSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                    </TableHead>
                    <TableHead className="text-center cursor-pointer" onClick={() => handlePaymentSort('semester')}>
                      Semester {paymentSortBy === 'semester' && (paymentSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                    </TableHead>
                    <TableHead className="text-center cursor-pointer" onClick={() => handlePaymentSort('status')}>
                      Status {paymentSortBy === 'status' && (paymentSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                    </TableHead>
                    <TableHead className="text-center cursor-pointer" onClick={() => handlePaymentSort('verifiedBy')}>
                      Verified By {paymentSortBy === 'verifiedBy' && (paymentSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="text-center font-medium">{payment.id}</TableCell>
                      <TableCell className="text-center">
                        <div>
                          <div className="font-medium">{payment.student}</div>
                          <div className="text-sm text-muted-foreground">{payment.studentId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-semibold">₹{payment.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-center">{payment.date}</TableCell>
                      <TableCell className="text-center">{payment.semester}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={payment.status === 'Verified' ? 'default' : payment.status === 'Pending' ? 'secondary' : 'destructive'}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{payment.verifiedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {sortedPayments.length} of {paymentSummary.length} payments
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch-wise" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Batch-wise Analysis</CardTitle>
              <CardDescription>Year-wise breakdown of scholarship distribution and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center cursor-pointer" onClick={() => handleBatchSort('batch')}>
                      Batch Year {batchSortBy === 'batch' && (batchSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                    </TableHead>
                    <TableHead className="text-center cursor-pointer" onClick={() => handleBatchSort('totalStudents')}>
                      Total Students {batchSortBy === 'totalStudents' && (batchSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                    </TableHead>
                    <TableHead className="text-center cursor-pointer" onClick={() => handleBatchSort('scholarshipStudents')}>
                      Scholarship Students {batchSortBy === 'scholarshipStudents' && (batchSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                    </TableHead>
                    <TableHead className="text-center cursor-pointer" onClick={() => handleBatchSort('totalAmount')}>
                      Total Amount {batchSortBy === 'totalAmount' && (batchSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                    </TableHead>
                    <TableHead className="text-center cursor-pointer" onClick={() => handleBatchSort('averageAmount')}>
                      Average Amount {batchSortBy === 'averageAmount' && (batchSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                    </TableHead>
                    <TableHead className="text-center cursor-pointer" onClick={() => handleBatchSort('passRate')}>
                      Pass Rate {batchSortBy === 'passRate' && (batchSortDir === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedBatchData.map((batch) => (
                    <TableRow key={batch.batch}>
                      <TableCell className="text-center font-medium">{batch.batch}</TableCell>
                      <TableCell className="text-center">{batch.totalStudents}</TableCell>
                      <TableCell className="text-center font-semibold text-blue-600">{batch.scholarshipStudents}</TableCell>
                      <TableCell className="text-center font-semibold text-green-600">₹{batch.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-center">₹{batch.averageAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={batch.passRate >= 90 ? 'default' : batch.passRate >= 80 ? 'secondary' : 'destructive'}>
                          {batch.passRate}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}