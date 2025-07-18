import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const receipts = [
  { id: "REC001", student: "Priya Sharma", amount: 25000, date: "2024-01-20", status: "Pending", remarks: "Awaiting verification." },
  { id: "REC002", student: "Rahul Kumar", amount: 25000, date: "2024-01-15", status: "Verified", remarks: "Receipt verified by admin." }
];

export default function CollegeReceiptManagement() {
  const [openReceipt, setOpenReceipt] = useState(null);
  return (
    <div className="main-content-container">
      <h2 className="text-2xl font-bold mb-6">Receipt Management</h2>
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Receipts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-medium">{receipt.id}</TableCell>
                  <TableCell>{receipt.student}</TableCell>
                  <TableCell>₹{receipt.amount.toLocaleString()}</TableCell>
                  <TableCell>{receipt.date}</TableCell>
                  <TableCell>{receipt.status}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => setOpenReceipt(receipt)}><Eye className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={!!openReceipt} onOpenChange={() => setOpenReceipt(null)}>
        <DialogContent className="max-w-lg w-full p-6">
          {openReceipt && (
            <>
              <DialogHeader>
                <DialogTitle>Receipt Details ({openReceipt.id})</DialogTitle>
              </DialogHeader>
              <div className="mb-2"><b>Student:</b> {openReceipt.student}</div>
              <div className="mb-2"><b>Amount:</b> ₹{openReceipt.amount.toLocaleString()}</div>
              <div className="mb-2"><b>Date:</b> {openReceipt.date}</div>
              <div className="mb-2"><b>Status:</b> {openReceipt.status}</div>
              <div className="mb-2"><b>Remarks:</b> {openReceipt.remarks}</div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-white">Verify</Button>
                <Button size="sm" variant="destructive">Reject</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 