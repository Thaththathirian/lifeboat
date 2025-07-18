import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Download, Filter, TrendingUp, Users, DollarSign } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const mockDonationData = [
  { month: "Jan", amount: 450000, donors: 25 },
  { month: "Feb", amount: 520000, donors: 28 },
  { month: "Mar", amount: 680000, donors: 32 },
  { month: "Apr", amount: 590000, donors: 30 },
  { month: "May", amount: 720000, donors: 35 },
  { month: "Jun", amount: 850000, donors: 40 },
];

const mockDonorsByType = [
  { name: "Monthly", value: 45, amount: 2100000, color: "#8884d8" },
  { name: "Quarterly", value: 30, amount: 1200000, color: "#82ca9d" },
  { name: "Half Yearly", value: 15, amount: 800000, color: "#ffc658" },
  { name: "Annually", value: 10, amount: 600000, color: "#ff7300" },
];

const mockTopDonors = [
  { name: "John Doe", amount: 150000, donations: 12, type: "Monthly" },
  { name: "Sarah Wilson", amount: 120000, donations: 4, type: "Quarterly" },
  { name: "Priya Sharma", amount: 100000, donations: 10, type: "Monthly" },
  { name: "Vikram Singh", amount: 80000, donations: 8, type: "Monthly" },
  { name: "Divya Nair", amount: 75000, donations: 3, type: "Quarterly" },
];

const mockRecentTransactions = [
  { id: "TXN001", donor: "John Doe", amount: 10000, date: "2024-03-15", type: "Monthly", status: "Completed" },
  { id: "TXN002", donor: "Sarah Wilson", amount: 30000, date: "2024-03-14", type: "Quarterly", status: "Completed" },
  { id: "TXN003", donor: "Amit Patel", amount: 25000, date: "2024-03-13", type: "One-Time", status: "Pending" },
  { id: "TXN004", donor: "Priya Sharma", amount: 10000, date: "2024-03-12", type: "Monthly", status: "Completed" },
  { id: "TXN005", donor: "Rohit Sinha", amount: 15000, date: "2024-03-11", type: "Monthly", status: "Failed" },
];

export default function AdminDashboard() {
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const totalDonations = mockDonationData.reduce((sum, item) => sum + item.amount, 0);
  const totalDonors = Math.max(...mockDonationData.map(item => item.donors));
  const avgDonation = totalDonations / totalDonors;

  return (
    <div className="main-content-container">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => navigate('/admin/payments')} variant="default">
            Payment Allotment
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
                <p className="text-2xl font-bold">₹{totalDonations.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <span className="text-green-600 font-medium">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Donors</p>
                <p className="text-2xl font-bold">{totalDonors}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <span className="text-green-600 font-medium">+5</span> new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Donation</p>
                <p className="text-2xl font-bold">₹{avgDonation.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <span className="text-green-600 font-medium">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">₹{mockDonationData[mockDonationData.length - 1].amount.toLocaleString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <span className="text-green-600 font-medium">+18%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Donation Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockDonationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donors by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockDonorsByType}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {mockDonorsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Donors and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTopDonors.map((donor, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{donor.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {donor.donations} donations • {donor.type}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{donor.amount.toLocaleString()}</div>
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Txn ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRecentTransactions.map((txn, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 whitespace-nowrap">{txn.id}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{txn.donor}</td>
                      <td className="px-4 py-2 whitespace-nowrap">₹{txn.amount.toLocaleString()}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{txn.date}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{txn.type}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Badge variant={txn.status === "Completed" ? "default" : txn.status === "Pending" ? "secondary" : "destructive"}>{txn.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}