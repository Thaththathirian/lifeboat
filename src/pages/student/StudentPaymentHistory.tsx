import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CreditCard, User } from "lucide-react";

interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  type: 'scholarship' | 'fee_reimbursement';
  status: 'completed' | 'pending' | 'failed';
  description: string;
  donorName?: string;
}

export default function StudentPaymentHistory() {
  const paymentHistory: PaymentRecord[] = [
    {
      id: "PAY001",
      amount: 25000,
      date: "2024-01-15",
      type: "scholarship",
      status: "completed",
      description: "Scholarship Payment - Semester 1",
      donorName: "John Smith Foundation"
    },
    {
      id: "PAY002",
      amount: 30000,
      date: "2024-06-20",
      type: "scholarship",
      status: "completed",
      description: "Scholarship Payment - Semester 2",
      donorName: "Education Trust"
    },
    {
      id: "PAY003",
      amount: 15000,
      date: "2024-12-01",
      type: "fee_reimbursement",
      status: "pending",
      description: "Fee Reimbursement - Semester 3"
      // No donor name for this entry, will show "Trust" as fallback
    }
  ];

  // Filter only completed payments for the table
  const completedPayments = paymentHistory.filter(p => p.status === 'completed');

  const totalReceived = paymentHistory
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const getDonorDisplay = (donorName?: string) => {
    return donorName || "Trust";
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Payment History</h1>
        <p className="text-muted-foreground">View all your scholarship and fee reimbursement payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalReceived.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentHistory.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Description</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Donor</th>
                  <th className="text-right py-3 px-4 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {completedPayments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{payment.description}</div>
                      <div className="text-sm text-muted-foreground">ID: {payment.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(payment.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        {getDonorDisplay(payment.donorName)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="font-semibold">₹{payment.amount.toLocaleString()}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}