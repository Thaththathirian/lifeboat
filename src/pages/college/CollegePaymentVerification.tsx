import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

const payments = [
  { id: "PAY001", student: "Priya Sharma", amount: 25000, date: "2024-01-15", status: "Pending", remarks: "Awaiting receipt upload.", receiptUrl: "https://via.placeholder.com/300x200?text=Receipt+PAY001" },
  { id: "PAY002", student: "Rahul Kumar", amount: 25000, date: "2024-01-10", status: "Pending", remarks: "Check bank details.", receiptUrl: "https://via.placeholder.com/300x200?text=Receipt+PAY002" }
];

export default function CollegePaymentVerification() {
  const [openPayment, setOpenPayment] = useState(null);
  const [selected, setSelected] = useState([]);
  // Bulk actions
  const handleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const handleSelectAll = () => {
    if (selected.length === payments.length) setSelected([]);
    else setSelected(payments.map(p => p.id));
  };
  const bulkApprove = () => {
    // Implement bulk approve logic here
    alert(`Approved: ${selected.join(", ")}`);
    setSelected([]);
  };
  const bulkReject = () => {
    // Implement bulk reject logic here
    alert(`Rejected: ${selected.join(", ")}`);
    setSelected([]);
  };
  // Single approve/reject
  const singleApprove = (id) => {
    alert(`Approved: ${id}`);
  };
  const singleReject = (id) => {
    alert(`Rejected: ${id}`);
  };
  return (
    <div className="main-content-container">
      <h2 className="text-2xl font-bold mb-6">Payment Verification</h2>
      <div className="flex gap-2 mb-2">
        <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-white" disabled={!selected.length} onClick={bulkApprove}>Approve Selected</Button>
        <Button size="sm" variant="destructive" disabled={!selected.length} onClick={bulkReject}>Reject Selected</Button>
      </div>
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Pending Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Checkbox checked={selected.length === payments.length} onCheckedChange={handleSelectAll} /></TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell><Checkbox checked={selected.includes(payment.id)} onCheckedChange={() => handleSelect(payment.id)} /></TableCell>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.student}</TableCell>
                  <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.status}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => setOpenPayment(payment)}>View Receipt</Button>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-white mr-2" onClick={() => singleApprove(payment.id)}>Approve</Button>
                    <Button size="sm" variant="destructive" onClick={() => singleReject(payment.id)}>Reject</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={!!openPayment} onOpenChange={() => setOpenPayment(null)}>
        <DialogContent className="max-w-lg w-full p-6">
          {openPayment && (
            <>
              <DialogHeader>
                <DialogTitle>Payment Details ({openPayment.id})</DialogTitle>
              </DialogHeader>
              <div className="mb-2"><b>Student:</b> {openPayment.student}</div>
              <div className="mb-2"><b>Amount:</b> ₹{openPayment.amount.toLocaleString()}</div>
              <div className="mb-2"><b>Date:</b> {openPayment.date}</div>
              <div className="mb-2"><b>Status:</b> {openPayment.status}</div>
              <div className="mb-2"><b>Remarks:</b> {openPayment.remarks}</div>
              <div className="mb-4"><b>Receipt:</b><br /><img src={openPayment.receiptUrl} alt="Receipt" className="mt-2 rounded shadow max-w-full max-h-60" /></div>
              {/* No upload button for college */}
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-white mr-2" onClick={() => singleApprove(openPayment.id)}>Approve</Button>
                <Button size="sm" variant="destructive" onClick={() => singleReject(openPayment.id)}>Reject</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 