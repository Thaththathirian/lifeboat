import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare, CheckCircle, Clock } from "lucide-react";

const students = [
  { id: "STU001", name: "Priya Sharma", semester: "3rd Semester", allocated: 50000, start: "2024-01-15", end: "2024-12-15", status: "active" },
  { id: "STU002", name: "Rahul Kumar", semester: "2nd Year", allocated: 50000, start: "2024-01-15", end: "2024-12-15", status: "active" },
  { id: "STU003", name: "Amit Patel", semester: "4th Semester", allocated: 50000, start: "2023-10-15", end: "2024-09-15", status: "completed" }
];

export default function DonorStudents() {
  return (
    <div className="main-content-container">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Sponsored Students</CardTitle>
          <CardDescription>View students you are currently supporting</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Allocated Amount</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.semester}</TableCell>
                  <TableCell>₹{student.allocated.toLocaleString()}</TableCell>
                  <TableCell>
                    {student.start} - {student.end}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 font-semibold ${student.status === 'active' ? 'text-blue-700' : 'text-green-700'}`}>
                      {student.status === 'active' ? <Clock className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      {student.status === 'active' ? 'Active' : 'Completed'}
                    </span>
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