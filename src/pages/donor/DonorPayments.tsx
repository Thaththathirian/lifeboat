import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const payments = [
  { id: "PAY001", date: "2024-01-15", amount: 50000, type: "monthly", status: "completed" },
  { id: "PAY002", date: "2023-12-15", amount: 50000, type: "monthly", status: "completed" },
  { id: "PAY003", date: "2023-11-15", amount: 50000, type: "monthly", status: "completed" },
  { id: "PAY004", date: "2023-10-15", amount: 100000, type: "quarterly", status: "completed" },
  { id: "PAY005", date: "2023-09-15", amount: 50000, type: "monthly", status: "completed" }
];

export default function DonorPayments() {
  return (
    <div className="main-content-container">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Full ledger of your payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{payment.type}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 