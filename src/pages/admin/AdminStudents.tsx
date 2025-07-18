import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, UserCheck, Ban, LogIn, ArrowUp, ArrowDown, Filter, Info, CheckCircle, XCircle, Square, CheckSquare } from "lucide-react";

const statusColors = {
  "Applied": "bg-blue-100 text-blue-800",
  "Profile Update": "bg-gray-100 text-gray-800",
  "Schedule Interview": "bg-purple-100 text-purple-800",
  "Upload Documents": "bg-yellow-100 text-yellow-800",
  "Documents Submitted": "bg-indigo-100 text-indigo-800",
  "Approved": "bg-green-100 text-green-800",
  "Alumni": "bg-teal-100 text-teal-800",
  "Blocked": "bg-red-100 text-red-800",
  "Eligible for Scholarship": "bg-green-200 text-green-900",
  "Payment Pending": "bg-orange-100 text-orange-800",
  "Paid": "bg-green-300 text-green-900",
  "Academic Results Pending": "bg-cyan-100 text-cyan-800",
  "Academic verification pending": "bg-cyan-200 text-cyan-900",
  "Apply for Next": "bg-pink-100 text-pink-800"
};

const allStatuses = [
  "Applied", "Profile Update", "Schedule Interview", "Upload Documents", "Documents Submitted", "Approved", "Alumni", "Blocked", "Eligible for Scholarship", "Payment Pending", "Paid", "Academic Results Pending", "Academic verification pending", "Apply for Next"
];

const statusSteps = [
  "Applied", "Profile Update", "Schedule Interview", "Upload Documents", "Documents Submitted", "Approved", "Eligible for Scholarship", "Payment Pending", "Paid", "Academic Results Pending", "Academic verification pending", "Alumni", "Apply for Next"
];

const mockStudents = [
  { id: "LBFS001", name: "Priya Sharma", status: "Applied", appliedDate: "2024-01-20", email: "priya@email.com", mobile: "9876543201", college: "ABC Engineering", scholarship: 50000, currentStatus: "Applied", statusBar: ["Applied"], interviewCompleted: false, documentsVerified: false },
  { id: "LBFS002", name: "Rahul Kumar", status: "Profile Update", appliedDate: "2024-01-19", email: "rahul@email.com", mobile: "9876543202", college: "XYZ Medical", scholarship: 0, currentStatus: "Profile Update", statusBar: ["Applied", "Profile Update"], interviewCompleted: false, documentsVerified: false },
  { id: "LBFS003", name: "Amit Patel", status: "Schedule Interview", appliedDate: "2024-01-18", email: "amit@email.com", mobile: "9876543203", college: "DEF Business School", scholarship: 100000, currentStatus: "Schedule Interview", statusBar: ["Applied", "Profile Update", "Schedule Interview"], interviewCompleted: false, documentsVerified: false },
  { id: "LBFS004", name: "Sneha Reddy", status: "Upload Documents", appliedDate: "2024-01-17", email: "sneha@email.com", mobile: "9876543204", college: "GHI Arts College", scholarship: 0, currentStatus: "Upload Documents", statusBar: ["Applied", "Profile Update", "Schedule Interview", "Upload Documents"], interviewCompleted: true, documentsVerified: false },
  { id: "LBFS005", name: "Vikram Singh", status: "Documents Submitted", appliedDate: "2024-01-16", email: "vikram@email.com", mobile: "9876543205", college: "JKL Commerce", scholarship: 0, currentStatus: "Documents Submitted", statusBar: ["Applied", "Profile Update", "Schedule Interview", "Upload Documents", "Documents Submitted"], interviewCompleted: true, documentsVerified: true },
  { id: "LBFS006", name: "Meera Das", status: "Approved", appliedDate: "2024-01-15", email: "meera@email.com", mobile: "9876543206", college: "MNO Law College", scholarship: 25000, currentStatus: "Approved", statusBar: ["Applied", "Profile Update", "Schedule Interview", "Upload Documents", "Documents Submitted", "Approved"], interviewCompleted: true, documentsVerified: true },
  { id: "LBFS007", name: "Arjun Verma", status: "Alumni", appliedDate: "2024-01-14", email: "arjun@email.com", mobile: "9876543207", college: "PQR Science College", scholarship: 30000, currentStatus: "Alumni", statusBar: statusSteps, interviewCompleted: true, documentsVerified: true },
  { id: "LBFS008", name: "Divya Nair", status: "Blocked", appliedDate: "2024-01-13", email: "divya@email.com", mobile: "9876543208", college: "STU Polytechnic", scholarship: 0, currentStatus: "Blocked", statusBar: ["Applied", "Blocked"], interviewCompleted: false, documentsVerified: false },
  { id: "LBFS009", name: "Karan Mehta", status: "Eligible for Scholarship", appliedDate: "2024-01-12", email: "karan@email.com", mobile: "9876543209", college: "VWX Law College", scholarship: 40000, currentStatus: "Eligible for Scholarship", statusBar: ["Applied", "Profile Update", "Schedule Interview", "Upload Documents", "Documents Submitted", "Approved", "Eligible for Scholarship"], interviewCompleted: true, documentsVerified: true },
  { id: "LBFS010", name: "Neha Gupta", status: "Payment Pending", appliedDate: "2024-01-11", email: "neha@email.com", mobile: "9876543210", college: "YZA Commerce", scholarship: 0, currentStatus: "Payment Pending", statusBar: ["Applied", "Profile Update", "Schedule Interview", "Upload Documents", "Documents Submitted", "Approved", "Eligible for Scholarship", "Payment Pending"], interviewCompleted: true, documentsVerified: true },
  { id: "LBFS011", name: "Rohit Sinha", status: "Paid", appliedDate: "2024-01-10", email: "rohit@email.com", mobile: "9876543211", college: "BCD Engineering", scholarship: 60000, currentStatus: "Paid", statusBar: ["Applied", "Profile Update", "Schedule Interview", "Upload Documents", "Documents Submitted", "Approved", "Eligible for Scholarship", "Payment Pending", "Paid"], interviewCompleted: true, documentsVerified: true },
  { id: "LBFS012", name: "Sonal Jain", status: "Academic Results Pending", appliedDate: "2024-01-09", email: "sonal@email.com", mobile: "9876543212", college: "EFG Medical", scholarship: 0, currentStatus: "Academic Results Pending", statusBar: ["Applied", "Profile Update", "Schedule Interview", "Upload Documents", "Documents Submitted", "Approved", "Eligible for Scholarship", "Payment Pending", "Paid", "Academic Results Pending"], interviewCompleted: true, documentsVerified: true },
  { id: "LBFS013", name: "Manish Tiwari", status: "Academic verification pending", appliedDate: "2024-01-08", email: "manish@email.com", mobile: "9876543213", college: "HIJ Business School", scholarship: 0, currentStatus: "Academic verification pending", statusBar: ["Applied", "Profile Update", "Schedule Interview", "Upload Documents", "Documents Submitted", "Approved", "Eligible for Scholarship", "Payment Pending", "Paid", "Academic Results Pending", "Academic verification pending"], interviewCompleted: true, documentsVerified: true },
  { id: "LBFS014", name: "Asha Rao", status: "Apply for Next", appliedDate: "2024-01-07", email: "asha@email.com", mobile: "9876543214", college: "KLM Arts College", scholarship: 0, currentStatus: "Apply for Next", statusBar: ["Applied", "Profile Update", "Schedule Interview", "Upload Documents", "Documents Submitted", "Approved", "Eligible for Scholarship", "Payment Pending", "Paid", "Academic Results Pending", "Academic verification pending", "Apply for Next"], interviewCompleted: true, documentsVerified: true },
  { id: "LBFS015", name: "Deepak Joshi", status: "Applied", appliedDate: "2024-01-06", email: "deepak@email.com", mobile: "9876543215", college: "NOP Science College", scholarship: 0, currentStatus: "Applied", statusBar: ["Applied"], interviewCompleted: false, documentsVerified: false },
  { id: "LBFS016", name: "Ritu Singh", status: "Profile Update", appliedDate: "2024-01-05", email: "ritu@email.com", mobile: "9876543216", college: "QRS Polytechnic", scholarship: 0, currentStatus: "Profile Update", statusBar: ["Applied", "Profile Update"], interviewCompleted: false, documentsVerified: false },
  { id: "LBFS017", name: "Suresh Kumar", status: "Schedule Interview", appliedDate: "2024-01-04", email: "suresh@email.com", mobile: "9876543217", college: "TUV Law College", scholarship: 0, currentStatus: "Schedule Interview", statusBar: ["Applied", "Profile Update", "Schedule Interview"], interviewCompleted: false, documentsVerified: false },
  { id: "LBFS018", name: "Pooja Mehta", status: "Upload Documents", appliedDate: "2024-01-03", email: "pooja@email.com", mobile: "9876543218", college: "WXY Commerce", scholarship: 0, currentStatus: "Upload Documents", statusBar: ["Applied", "Profile Update", "Schedule Interview", "Upload Documents"], interviewCompleted: true, documentsVerified: false },
  { id: "LBFS019", name: "Anil Kapoor", status: "Documents Submitted", appliedDate: "2024-01-02", email: "anil@email.com", mobile: "9876543219", college: "ZAB Engineering", scholarship: 0, currentStatus: "Documents Submitted", statusBar: ["Applied", "Profile Update", "Schedule Interview", "Upload Documents", "Documents Submitted"], interviewCompleted: true, documentsVerified: true },
  { id: "LBFS020", name: "Kavita Desai", status: "Approved", appliedDate: "2024-01-01", email: "kavita@email.com", mobile: "9876543220", college: "CDE Medical", scholarship: 0, currentStatus: "Approved", statusBar: ["Applied", "Profile Update", "Schedule Interview", "Upload Documents", "Documents Submitted", "Approved"], interviewCompleted: true, documentsVerified: true }
];

function getValidNextStatuses(student) {
  // Remove Active/Inactive from valid statuses
  const base = [
    "Applied", "Profile Update", "Schedule Interview", "Upload Documents", "Documents Submitted", "Approved", "Alumni", "Blocked", "Payment Pending", "Paid", "Academic Results Pending", "Academic verification pending", "Apply for Next"
  ];
  let valid = base;
  if (!(student.interviewCompleted && student.documentsVerified)) {
    valid = valid.filter(s => s !== "Eligible for Scholarship");
  } else {
    valid = [...valid, "Eligible for Scholarship"];
  }
  return valid;
}

export default function AdminStudents({ initialTab = "active" }) {
  const [tab, setTab] = useState(initialTab);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [openStudent, setOpenStudent] = useState(null);
  const [statusModal, setStatusModal] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [selected, setSelected] = useState([]);
  const [bulkStatusModal, setBulkStatusModal] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("");

  let filtered = mockStudents.filter(s =>
    (tab === "all" || s.status.toLowerCase() === tab) &&
    (!statusFilter || s.status === statusFilter) &&
    (s.name.toLowerCase().includes(filter.toLowerCase()) || s.id.toLowerCase().includes(filter.toLowerCase()) || s.college.toLowerCase().includes(filter.toLowerCase()))
  );

  filtered = filtered.sort((a, b) => {
    if (sortBy === "id") return sortDir === "asc" ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
    if (sortBy === "name") return sortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    if (sortBy === "status") return sortDir === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
    if (sortBy === "college") return sortDir === "asc" ? a.college.localeCompare(b.college) : b.college.localeCompare(a.college);
    if (sortBy === "scholarship") return sortDir === "asc" ? a.scholarship - b.scholarship : b.scholarship - a.scholarship;
    return 0;
  });

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
  };

  const generateTransactionId = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 5);
    return `TXN-${timestamp}-${randomStr}`.toUpperCase();
  };

  const handleChangeStatus = () => {
    if (newStatus === "Paid") {
      const transactionId = generateTransactionId();
      console.log(`Transaction ID generated for student ${selectedStudent?.id}: ${transactionId}`);
      // Store transaction ID - this would be saved to database in real implementation
      alert(`Status updated to Paid. Transaction ID: ${transactionId}`);
    }
    setStatusModal(false);
  };

  const handleBlock = () => {
    setBlockModal(false);
  };

  const handleBulkStatus = () => {
    if (bulkStatus === "Paid") {
      const transactionIds = selected.map(studentId => {
        const transactionId = generateTransactionId();
        return { studentId, transactionId };
      });
      console.log("Bulk transaction IDs generated:", transactionIds);
      alert(`Bulk status updated to Paid. ${transactionIds.length} transaction IDs generated.`);
    }
    setBulkStatusModal(false);
  };

  const allSelected = selected.length === filtered.length && filtered.length > 0;
  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(filtered.map(s => s.id));
  };
  // For bulk, only show statuses allowed for all selected students
  const validBulkStatuses = selected.length > 0
    ? allStatuses.filter(status =>
        filtered.filter(s => selected.includes(s.id)).every(stu => getValidNextStatuses(stu).includes(status))
      )
    : [];

  return (
    <div className="main-content-container">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Student Management</h2>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline">Download List</Button>
          <Button variant="default" disabled={selected.length === 0} onClick={() => setBulkStatusModal(true)}>
            <UserCheck className="inline h-4 w-4 mr-2" />Bulk Status Change
          </Button>
        </div>
      </div>
      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="applied">Applied</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="alumni">Alumni</TabsTrigger>
          <TabsTrigger value="blocked">Blocked</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex flex-col md:flex-row gap-2 mb-4 w-full">
        <Input
          className="max-w-xs"
          placeholder="Filter by name, ID, or college..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            className="border rounded px-2 py-1 text-sm"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {allStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>
      <Card className="shadow-soft overflow-x-auto">
        <CardHeader>
          <CardTitle>{tab.charAt(0).toUpperCase() + tab.slice(1)} Students</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer w-8" onClick={toggleSelectAll} title={allSelected ? 'Deselect All' : 'Select All'}>
                  {allSelected ? <CheckSquare className="h-5 w-5 text-blue-600 mx-auto" /> : <Square className="h-5 w-5 text-gray-400 mx-auto" />}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>Student ID {sortBy === "id" && (sortDir === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>Name {sortBy === "name" && (sortDir === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>Status {sortBy === "status" && (sortDir === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("college")}>College {sortBy === "college" && (sortDir === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("scholarship")}>Scholarship {sortBy === "scholarship" && (sortDir === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(student => (
                <TableRow key={student.id} className="hover:bg-gray-50">
                  <TableCell className="w-8">
                    <Button size="icon" variant="ghost" onClick={() => toggleSelect(student.id)} title={selected.includes(student.id) ? 'Deselect' : 'Select'}>
                      {selected.includes(student.id) ? <CheckSquare className="h-5 w-5 text-blue-600 mx-auto" /> : <Square className="h-5 w-5 text-gray-400 mx-auto" />}
                    </Button>
                  </TableCell>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[student.status] || 'bg-gray-200 text-gray-700'}`}>{student.status}</span>
                  </TableCell>
                  <TableCell>{student.college}</TableCell>
                  <TableCell>₹{student.scholarship.toLocaleString()}</TableCell>
                  <TableCell className="align-middle">
                    <div className="flex flex-row gap-1 justify-center items-center">
                      <Button size="icon" variant="ghost" title="View" onClick={() => setOpenStudent(student)}><Eye className="h-4 w-4 text-blue-600" /></Button>
                      <Button size="icon" variant="ghost" title="Change Status" onClick={() => { setSelectedStudent(student); setStatusModal(true); setNewStatus(student.status); }}><UserCheck className="h-4 w-4 text-green-600" /></Button>
                      <Button size="icon" variant="ghost" title="Block" onClick={() => { setSelectedStudent(student); setBlockModal(true); }}><Ban className="h-4 w-4 text-red-600" /></Button>
                      <Button size="icon" variant="ghost" title="Login as User" onClick={() => {}}><LogIn className="h-4 w-4 text-gray-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Student Details Modal */}
      <Dialog open={!!openStudent} onOpenChange={() => setOpenStudent(null)}>
        <DialogContent className="max-w-md w-full p-8 rounded-xl shadow-2xl mx-auto text-center bg-white flex flex-col items-center justify-center">
          {openStudent && (
            <>
              <DialogHeader>
                <DialogTitle>{openStudent.name} ({openStudent.id})</DialogTitle>
              </DialogHeader>
              <div className="mb-2"><b>Email:</b> {openStudent.email}</div>
              <div className="mb-2"><b>Mobile:</b> {openStudent.mobile}</div>
              <div className="mb-2"><b>College:</b> {openStudent.college}</div>
              <div className="mb-2"><b>Status:</b> <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[openStudent.status] || 'bg-gray-200 text-gray-700'} mx-auto block text-center`}>{openStudent.status}</span></div>
              <div className="mb-2"><b>Scholarship:</b> ₹{openStudent.scholarship.toLocaleString()}</div>
              <div className="mb-4 flex flex-wrap gap-2 justify-center">
                {statusSteps.map((step, idx) => (
                  <span key={idx} className={`px-2 py-1 rounded text-xs font-semibold ${openStudent.statusBar.includes(step) ? statusColors[step] || 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-400'}`}>{step}</span>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* Status Change Modal */}
      <Dialog open={statusModal} onOpenChange={() => setStatusModal(false)}>
        <DialogContent className="max-w-md w-full p-8 rounded-xl shadow-2xl mx-auto text-center bg-white flex flex-col items-center justify-center">
          {selectedStudent && (
            <>
              <DialogHeader>
                <DialogTitle>Change Status for {selectedStudent.name} ({selectedStudent.id})</DialogTitle>
              </DialogHeader>
              <div className="mb-4 flex items-center gap-2 text-red-600"><Info className="h-4 w-4" /> Warning: This action will be logged with your admin ID (ADM001).</div>
              <select className="w-full border rounded p-2 mb-4" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                {getValidNextStatuses(selectedStudent).map(status => (
                  <option key={status} value={status} className={statusColors[status] || ''}>{status}</option>
                ))}
              </select>
              <Button variant="default" className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleChangeStatus}><CheckCircle className="inline h-4 w-4 mr-2" />Confirm Status Change</Button>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* Bulk Status Change Modal */}
      <Dialog open={bulkStatusModal} onOpenChange={() => setBulkStatusModal(false)}>
        <DialogContent className="max-w-md w-full p-8 rounded-xl shadow-2xl mx-auto text-center bg-white flex flex-col items-center justify-center">
          {selected.length > 0 && (
            <>
              <DialogHeader>
                <DialogTitle>Bulk Status Change ({selected.length} students)</DialogTitle>
              </DialogHeader>
              <div className="mb-4 flex items-center gap-2 text-red-600"><Info className="h-4 w-4" /> Warning: This action will be logged with your admin ID (ADM001).</div>
              <select className="w-full border rounded p-2 mb-4" value={bulkStatus} onChange={e => setBulkStatus(e.target.value)}>
                {validBulkStatuses.map(status => (
                  <option key={status} value={status} className={statusColors[status] || ''}>{status}</option>
                ))}
              </select>
              <Button variant="default" className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleBulkStatus}><CheckCircle className="inline h-4 w-4 mr-2" />Confirm Bulk Status Change</Button>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* Block User Modal */}
      <Dialog open={blockModal} onOpenChange={() => setBlockModal(false)}>
        <DialogContent className="max-w-md w-full p-8 rounded-xl shadow-2xl mx-auto text-center bg-white flex flex-col items-center justify-center">
          {selectedStudent && (
            <>
              <DialogHeader>
                <DialogTitle>Block {selectedStudent.name} ({selectedStudent.id})</DialogTitle>
              </DialogHeader>
              <div className="mb-4 flex items-center gap-2 text-red-600"><XCircle className="h-4 w-4" /> Are you sure you want to block this user? This action will be logged with your admin ID (ADM001).</div>
              <Button variant="destructive" className="w-full" onClick={handleBlock}><Ban className="inline h-4 w-4 mr-2" />Confirm Block</Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 