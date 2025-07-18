import { useState } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { 
  Building2, 
  GraduationCap, 
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Download,
  Upload,
  MessageSquare,
  Settings,
  FileText,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  BarChart3
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"

interface Student {
  id: string
  name: string
  course: string
  semester: string
  status: string
  allocatedAmount: number
  paymentStatus: string
  receiptStatus: string
  lastPayment: string
  nextPayment: string
}

interface Payment {
  id: string
  studentId: string
  studentName: string
  amount: number
  date: string
  status: string
  receiptUploaded: boolean
  receiptVerified: boolean
  donorName: string
}

interface Receipt {
  id: string
  studentId: string
  studentName: string
  amount: number
  uploadDate: string
  status: string
  fileUrl: string
  verifiedBy: string
  verifiedDate: string
}

const stats = [
  { label: "Registered Students", value: 120, icon: <Users className="h-6 w-6 text-blue-600" /> },
  { label: "Active Students", value: 98, icon: <CheckCircle className="h-6 w-6 text-green-600" /> },
  { label: "Total Scholarship Received", value: "₹12,50,000", icon: <CreditCard className="h-6 w-6 text-purple-600" /> },
  { label: "Pending Verifications", value: 7, icon: <Clock className="h-6 w-6 text-orange-600" /> }
];

const recentStudents = [
  { name: "Priya Sharma", status: "Profile Updated", date: "2024-01-20" },
  { name: "Rahul Kumar", status: "Documents Submitted", date: "2024-01-18" },
  { name: "Amit Patel", status: "Eligible for Scholarship", date: "2024-01-15" }
];

const payments = [
  { 
    id: "PAY001", 
    student: "Priya Sharma", 
    studentName: "Priya Sharma", 
    amount: 25000, 
    status: "pending",
    date: "2024-01-15",
    donorName: "Rajesh Kumar",
    receiptUploaded: true,
    receiptVerified: false
  },
  { 
    id: "PAY002", 
    student: "Rahul Kumar", 
    studentName: "Rahul Kumar", 
    amount: 25000, 
    status: "completed",
    date: "2024-01-10",
    donorName: "Priya Sharma",
    receiptUploaded: true,
    receiptVerified: true
  }
];

const receipts = [
  {
    id: "REC001",
    studentId: "STU001",
    studentName: "Priya Sharma",
    amount: 25000,
    uploadDate: "2024-01-15",
    status: "verified",
    fileUrl: "/receipts/REC001.pdf",
    verifiedBy: "Admin",
    verifiedDate: "2024-01-16"
  },
  {
    id: "REC002", 
    studentId: "STU002",
    studentName: "Rahul Kumar",
    amount: 25000,
    uploadDate: "2024-01-10",
    status: "pending",
    fileUrl: "/receipts/REC002.pdf",
    verifiedBy: "",
    verifiedDate: ""
  }
];

// Chart data
const scholarshipTrends = [
  { month: "Jan", amount: 200000 },
  { month: "Feb", amount: 250000 },
  { month: "Mar", amount: 180000 },
  { month: "Apr", amount: 220000 },
  { month: "May", amount: 210000 },
  { month: "Jun", amount: 240000 },
];
const statusData = [
  { name: "Active", value: 98 },
  { name: "Alumni", value: 12 },
  { name: "Applied", value: 10 },
];
const statusColors = ["#2563eb", "#22c55e", "#f59e42"];

export default function CollegeDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  
  // Static data for demonstration
  const collegeData = {
    name: "ABC Engineering College",
    collegeId: "COL001",
    email: "admin@abcengineering.edu",
    phone: "+91 9876543210",
    address: "123 Education Street, Mumbai, Maharashtra",
    totalStudents: 45,
    activeStudents: 42,
    completedStudents: 3,
    totalAmountReceived: 2250000,
    pendingAmount: 150000,
    lastPayment: "2024-01-15",
    nextPayment: "2024-02-15",
    stats: {
      monthlyAverage: 187500,
      growthRate: 8.5,
      successRate: 93,
      completionRate: 87
    }
  }

  const students: Student[] = [
      {
        id: "LBFS071",
        name: "Priya Sharma",
      course: "B.Tech Computer Science",
      semester: "3rd Semester",
      status: "active",
      allocatedAmount: 50000,
      paymentStatus: "paid",
      receiptStatus: "verified",
      lastPayment: "2024-01-15",
      nextPayment: "2024-02-15"
      },
      {
        id: "LBFS072",
        name: "Rahul Kumar", 
      course: "B.Tech Mechanical",
      semester: "4th Semester",
      status: "active",
      allocatedAmount: 50000,
      paymentStatus: "pending",
      receiptStatus: "pending",
      lastPayment: "2023-12-15",
      nextPayment: "2024-01-15"
      },
      {
        id: "LBFS073",
      name: "Amit Patel",
      course: "B.Tech Electrical",
      semester: "5th Semester",
      status: "active",
      allocatedAmount: 50000,
      paymentStatus: "paid",
      receiptStatus: "uploaded",
      lastPayment: "2024-01-15",
      nextPayment: "2024-02-15"
    },
    {
      id: "LBFS074",
      name: "Sneha Reddy",
      course: "B.Tech Civil",
      semester: "6th Semester",
      status: "completed",
      allocatedAmount: 50000,
      paymentStatus: "completed",
      receiptStatus: "verified",
      lastPayment: "2023-12-15",
      nextPayment: "N/A"
    }
  ]

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || student.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <Card key={stat.label} className="shadow-soft flex flex-row items-center gap-4 p-4">
            <div>{stat.icon}</div>
          <div>
              <div className="text-base font-medium text-muted-foreground">{stat.label}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
          </div>
          </Card>
        ))}
      </motion.div>
      {/* Student Overview and Financial Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid lg:grid-cols-2 gap-6"
      >
        <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Student Overview
          </CardTitle>
          <CardDescription>Current student status and progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Students</span>
              <span className="font-bold">{collegeData.totalStudents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Active Students</span>
              <span className="font-bold text-green-600">{collegeData.activeStudents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Completed Students</span>
              <span className="font-bold text-blue-600">{collegeData.completedStudents}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Success Rate</span>
              <span className="text-sm text-muted-foreground">{collegeData.stats.successRate}%</span>
            </div>
            <Progress value={collegeData.stats.successRate} />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{collegeData.stats.completionRate}%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{collegeData.stats.growthRate}%</div>
              <div className="text-sm text-muted-foreground">Growth Rate</div>
            </div>
            </div>
          </CardContent>
        </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Financial Overview
          </CardTitle>
          <CardDescription>Payment and receipt management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Amount Received</span>
              <span className="font-bold">₹{collegeData.totalAmountReceived.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Pending Amount</span>
              <span className="font-bold text-orange-600">₹{collegeData.pendingAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Monthly Average</span>
              <span className="font-bold text-blue-600">₹{collegeData.stats.monthlyAverage.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Payment Progress</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(((collegeData.totalAmountReceived - collegeData.pendingAmount) / collegeData.totalAmountReceived) * 100)}%
              </span>
            </div>
            <Progress value={((collegeData.totalAmountReceived - collegeData.pendingAmount) / collegeData.totalAmountReceived) * 100} />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{payments.filter(p => p.status === 'completed').length}</div>
              <div className="text-sm text-muted-foreground">Completed Payments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{payments.filter(p => p.status === 'pending').length}</div>
              <div className="text-sm text-muted-foreground">Pending Payments</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    {/* Recent Activity */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
        <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest payments and student updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">Payment received for Priya Sharma</div>
                <div className="text-sm text-muted-foreground">₹50,000 from John Doe</div>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">2 days ago</div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Upload className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium">Receipt uploaded by Amit Patel</div>
                <div className="text-sm text-muted-foreground">Fee receipt for ₹50,000</div>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">3 days ago</div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-lg bg-orange-50 border border-orange-200">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <div className="font-medium">Payment pending for Rahul Kumar</div>
                <div className="text-sm text-muted-foreground">₹50,000 from Jane Smith</div>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">1 week ago</div>
            </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      {/* Charts Grid - moved here */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Scholarship Trends Chart */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Scholarship Trends</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scholarshipTrends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={v => `₹${(v/1000).toLocaleString()}k`} />
                <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
                <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Student Status Distribution Chart */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Student Status Distribution</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {statusData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={statusColors[idx % statusColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderStudentsTab = () => (
    <div className="space-y-6">
      {/* Filters */}
            <Card className="shadow-soft">
              <CardHeader>
          <CardTitle>Student Management</CardTitle>
          <CardDescription>Manage students and their scholarship status</CardDescription>
              </CardHeader>
              <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by name, course, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="shadow-soft">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Allocated Amount</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Receipt Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>{student.semester}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{student.allocatedAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={student.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                      {student.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      student.receiptStatus === 'verified' ? 'default' : 
                      student.receiptStatus === 'uploaded' ? 'secondary' : 'outline'
                    }>
                      {student.receiptStatus}
                        </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                  ))}
            </TableBody>
          </Table>
              </CardContent>
            </Card>
    </div>
  )

  const renderPaymentsTab = () => (
    <div className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
          <CardTitle>Payment Management</CardTitle>
          <CardDescription>Track and verify student payments</CardDescription>
              </CardHeader>
              <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.studentName}</TableCell>
                  <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.donorName}</TableCell>
                  <TableCell>
                    <Badge variant={payment.status === 'completed' ? 'default' : 'destructive'}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {payment.receiptUploaded ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-orange-600" />
                      )}
                      {payment.receiptVerified ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Verified
                        </Badge>
                      ) : payment.receiptUploaded ? (
                        <Badge variant="secondary">Pending</Badge>
                      ) : (
                        <Badge variant="outline">Not Uploaded</Badge>
                      )}
                      </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {payment.status === 'pending' && (
                        <Button size="sm">Verify</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderReceiptsTab = () => (
    <div className="space-y-6">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Receipt Management</CardTitle>
          <CardDescription>Verify and manage student fee receipts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-medium">{receipt.id}</TableCell>
                  <TableCell>{receipt.studentName}</TableCell>
                  <TableCell>₹{receipt.amount.toLocaleString()}</TableCell>
                  <TableCell>{receipt.uploadDate}</TableCell>
                  <TableCell>
                    <Badge variant={receipt.status === 'verified' ? 'default' : 'secondary'}>
                      {receipt.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{receipt.verifiedBy || 'Not verified'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      {receipt.status === 'pending' && (
                        <Button size="sm">Verify</Button>
                      )}
                </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
              </CardContent>
            </Card>
        </div>
  )

  const renderSettingsTab = () => (
    <div className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
          <CardTitle>College Settings</CardTitle>
          <CardDescription>Manage college information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">College Name</Label>
              <Input id="name" defaultValue={collegeData.name} />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={collegeData.email} />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue={collegeData.phone} />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue={collegeData.address} />
            </div>
          </div>
          
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-muted-foreground">Receive payment and student updates</div>
              </div>
              <Switch defaultChecked />
                      </div>
            
            <div className="flex items-center justify-between">
                      <div>
                <div className="font-medium">SMS Notifications</div>
                <div className="text-sm text-muted-foreground">Get SMS alerts for important updates</div>
                      </div>
              <Switch defaultChecked />
                    </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Auto Receipt Verification</div>
                <div className="text-sm text-muted-foreground">Automatically verify uploaded receipts</div>
                      </div>
              <Switch />
                    </div>
                  </div>
          
          <div className="flex justify-end">
            <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
      </div>
  )

  return (
    <div className="main-content-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">College Dashboard</h1>
        <p className="text-muted-foreground">Welcome! Here you can manage students, verify payments, and view scholarship stats for your institution.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-soft flex flex-row items-center gap-4 p-4">
            <div>{stat.icon}</div>
            <div>
              <div className="text-base font-medium text-muted-foreground">{stat.label}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Student Activity */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Recent Student Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-200">
              {recentStudents.map((s, i) => (
                <li key={i} className="py-2 flex flex-col">
                  <span className="font-semibold">{s.name}</span>
                  <span className="text-sm text-muted-foreground">{s.status} &middot; {s.date}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        {/* Payment Status */}
          <Card className="shadow-soft">
            <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{p.student}</TableCell>
                    <TableCell>₹{p.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      {p.status === "Verified" ? (
                        <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
                          <CheckCircle className="h-4 w-4" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-orange-700 font-semibold">
                          <Clock className="h-4 w-4" /> Pending
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
                </div>
      {/* Chart Placeholder */}
      <div className="mt-10">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <CardTitle>Scholarship Trends (Chart Placeholder)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 flex items-center justify-center text-muted-foreground">[Chart will appear here]</div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}