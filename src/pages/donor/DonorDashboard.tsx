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
  Heart, 
  DollarSign, 
  Users, 
  TrendingUp,
  Calendar,
  CreditCard,
  Settings,
  Bell,
  MessageSquare,
  Download,
  Eye,
  Edit,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Gift,
  Star,
  MapPin,
  Building,
  GraduationCap
} from "lucide-react"
import { useNavigate } from "react-router-dom"

interface Donation {
  id: string
  amount: number
  date: string
  type: string
  status: string
  allocatedAmount: number
  unallocatedAmount: number
}

interface StudentMapping {
  id: string
  name: string
  college: string
  course: string
  semester: string
  allocatedAmount: number
  startDate: string
  endDate: string
  status: string
}

interface AutoPayment {
  enabled: boolean
  amount: number
  frequency: string
  nextDate: string
  reminderDays: number
}

export default function DonorDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")
  const [autoPayment, setAutoPayment] = useState<AutoPayment>({
    enabled: true,
    amount: 50000,
    frequency: "monthly",
    nextDate: "2024-02-15",
    reminderDays: 3
  })
  
  // Static data for demonstration
  const donorData = {
    name: "John Doe",
    donorId: "DON001",
    email: "john.doe@email.com",
    phone: "+91 9876543210",
    occupation: "Software Engineer",
    totalDonated: 500000,
    totalAllocated: 450000,
    totalUnallocated: 50000,
    activeStudents: 9,
    completedStudents: 3,
    donationCount: 12,
    lastDonation: "2024-01-15",
    nextDonation: "2024-02-15",
    autoDebitEnabled: true,
    stats: {
      monthlyAverage: 41667,
      growthRate: 15.5,
      successRate: 92,
      impactScore: 8.7
    }
  }

  const donations: Donation[] = [
    {
      id: "DON001",
      amount: 50000,
      date: "2024-01-15",
      type: "monthly",
      status: "completed",
      allocatedAmount: 50000,
      unallocatedAmount: 0
    },
    {
      id: "DON002",
      amount: 50000,
      date: "2023-12-15",
      type: "monthly",
      status: "completed",
      allocatedAmount: 50000,
      unallocatedAmount: 0
    },
    {
      id: "DON003",
      amount: 50000,
      date: "2023-11-15",
      type: "monthly",
      status: "completed",
      allocatedAmount: 50000,
      unallocatedAmount: 0
    },
    {
      id: "DON004",
      amount: 100000,
      date: "2023-10-15",
      type: "quarterly",
        status: "completed",
      allocatedAmount: 100000,
      unallocatedAmount: 0
    },
    {
      id: "DON005",
      amount: 50000,
      date: "2023-09-15",
      type: "monthly",
      status: "completed",
      allocatedAmount: 50000,
      unallocatedAmount: 0
    }
  ]

  const studentMappings: StudentMapping[] = [
    {
      id: "STU001",
      name: "Priya Sharma",
      college: "ABC Engineering College",
      course: "B.Tech Computer Science",
      semester: "3rd Semester",
      allocatedAmount: 50000,
      startDate: "2024-01-15",
      endDate: "2024-12-15",
      status: "active"
    },
    {
      id: "STU002",
      name: "Rahul Kumar",
      college: "XYZ Medical College",
      course: "MBBS",
      semester: "2nd Year",
      allocatedAmount: 50000,
      startDate: "2024-01-15",
      endDate: "2024-12-15",
      status: "active"
    },
    {
      id: "STU003",
      name: "Amit Patel",
      college: "DEF Business School",
      course: "B.Com",
      semester: "4th Semester",
      allocatedAmount: 50000,
      startDate: "2023-10-15",
      endDate: "2024-09-15",
      status: "completed"
    }
  ]

  const quickStats = [
    {
      title: "Total Donated",
      value: `₹${donorData.totalDonated.toLocaleString()}`,
      change: "+15%",
      changeType: "positive",
      icon: DollarSign
    },
    {
      title: "Active Students",
      value: donorData.activeStudents.toString(),
      change: "+2",
      changeType: "positive",
      icon: Users
    },
    {
      title: "Success Rate",
      value: `${donorData.stats.successRate}%`,
      change: "+3%",
      changeType: "positive",
      icon: TrendingUp
    },
    {
      title: "Next Donation",
      value: donorData.nextDonation,
      change: "Auto-debit enabled",
      changeType: "neutral",
      icon: Calendar
    }
  ]

  const renderOverview = () => (
      <div className="space-y-6">
      {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
        {quickStats.map((stat, index) => (
          <Card key={stat.title} className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-xs flex items-center gap-1 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-muted-foreground'
                  }`}>
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : stat.changeType === 'negative' ? (
                      <ArrowDownRight className="h-3 w-3" />
                    ) : null}
                    {stat.change}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-full">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Impact Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid lg:grid-cols-2 gap-6"
      >
          <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Your Impact
            </CardTitle>
            <CardDescription>Overview of your contribution and its impact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Donated</span>
                <span className="font-bold">₹{donorData.totalDonated.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Allocated to Students</span>
                <span className="font-bold text-green-600">₹{donorData.totalAllocated.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Unallocated Amount</span>
                <span className="font-bold text-orange-600">₹{donorData.totalUnallocated.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Allocation Progress</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round((donorData.totalAllocated / donorData.totalDonated) * 100)}%
                </span>
              </div>
              <Progress value={(donorData.totalAllocated / donorData.totalDonated) * 100} />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{donorData.activeStudents}</div>
                <div className="text-sm text-muted-foreground">Active Students</div>
                </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{donorData.completedStudents}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Auto-Payment Settings
            </CardTitle>
            <CardDescription>Manage your automatic donation settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Auto-Debit</div>
                <div className="text-sm text-muted-foreground">Enable automatic monthly donations</div>
              </div>
              <Switch
                checked={autoPayment.enabled}
                onCheckedChange={(checked) => setAutoPayment(prev => ({ ...prev, enabled: checked }))}
              />
            </div>

            {autoPayment.enabled && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Monthly Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={autoPayment.amount}
                    onChange={(e) => setAutoPayment(prev => ({ ...prev, amount: parseInt(e.target.value) }))}
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={autoPayment.frequency} onValueChange={(value) => setAutoPayment(prev => ({ ...prev, frequency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="half-yearly">Half Yearly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
              </div>

                <div>
                  <Label htmlFor="reminder">Reminder Days Before</Label>
                  <Input
                    id="reminder"
                    type="number"
                    value={autoPayment.reminderDays}
                    onChange={(e) => setAutoPayment(prev => ({ ...prev, reminderDays: parseInt(e.target.value) }))}
                    placeholder="Days before donation"
                  />
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm font-medium text-blue-800">Next Auto-Debit</div>
                  <div className="text-sm text-blue-600">{autoPayment.nextDate}</div>
                </div>
              </div>
            )}
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
            <CardDescription>Your latest donations and student updates</CardDescription>
              </CardHeader>
              <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-green-50 border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Monthly donation processed</div>
                  <div className="text-sm text-muted-foreground">₹50,000 allocated to 1 student</div>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">2 days ago</div>
        </div>

              <div className="flex items-center gap-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">New student assigned</div>
                  <div className="text-sm text-muted-foreground">Priya Sharma from ABC Engineering College</div>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">1 week ago</div>
              </div>
              
              <div className="flex items-center gap-4 p-3 rounded-lg bg-orange-50 border border-orange-200">
                <GraduationCap className="h-5 w-5 text-orange-600" />
                        <div>
                  <div className="font-medium">Student completed course</div>
                  <div className="text-sm text-muted-foreground">Amit Patel graduated from DEF Business School</div>
                        </div>
                <div className="ml-auto text-sm text-muted-foreground">2 weeks ago</div>
              </div>
            </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
  )

  return (
    <div className="main-content-container">
      {renderOverview()}
    </div>
  );
}