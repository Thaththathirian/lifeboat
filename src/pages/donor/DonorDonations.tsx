import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle } from "lucide-react";

const donations = [
  { id: "DON001", date: "2024-01-15", amount: 50000, type: "monthly", allocated: 50000, unallocated: 0, status: "completed" },
  { id: "DON002", date: "2023-12-15", amount: 50000, type: "monthly", allocated: 50000, unallocated: 0, status: "completed" },
  { id: "DON003", date: "2023-11-15", amount: 50000, type: "monthly", allocated: 50000, unallocated: 0, status: "completed" },
  { id: "DON004", date: "2023-10-15", amount: 100000, type: "quarterly", allocated: 100000, unallocated: 0, status: "completed" },
  { id: "DON005", date: "2023-09-15", amount: 50000, type: "monthly", allocated: 50000, unallocated: 0, status: "completed" }
];

export default function DonorDonations() {
  return (
    <div className="main-content-container">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>My Donations</CardTitle>
          <CardDescription>Track all your donations and their allocation status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donation ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Allocated</TableHead>
                <TableHead>Unallocated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-medium">{donation.id}</TableCell>
                  <TableCell>{donation.date}</TableCell>
                  <TableCell>₹{donation.amount.toLocaleString()}</TableCell>
                  <TableCell>{donation.type}</TableCell>
                  <TableCell className="text-green-600">₹{donation.allocated.toLocaleString()}</TableCell>
                  <TableCell className="text-orange-600">₹{donation.unallocated.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
                      <CheckCircle className="h-4 w-4" /> Completed
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