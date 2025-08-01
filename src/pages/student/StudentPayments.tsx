import { useState } from "react";
import { useStudentStatus } from '@/components/layout/StudentStatusProvider';
import { CheckCircle, Upload } from 'lucide-react';
import { StudentStatus } from '@/types/student';

export const payments = [
  { date: "2024-01-15", amount: 10000, status: "Credited", remarks: "First Installment", donor: "John Donor" },
  { date: "2024-04-20", amount: 12000, status: "Credited", remarks: "Third Installment", donor: "Jane Donor" },
];

export function getTotalReceived() {
  return payments.filter(p => p.status === "Credited").reduce((sum, p) => sum + p.amount, 0);
}

export function getLastReceived() {
  const credited = payments.filter(p => p.status === "Credited");
  if (credited.length === 0) return null;
  return credited.reduce((latest, p) => new Date(p.date) > new Date(latest.date) ? p : latest, credited[0]);
}

export default function StudentPayments() {
  const { status } = useStudentStatus();
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptStatus, setReceiptStatus] = useState<'none' | 'pending' | 'verified'>('none');
  const [error, setError] = useState('');

  if (status === StudentStatus.BLOCKED) {
    return <div className="max-w-2xl mx-auto py-10 px-4 text-center text-red-600 font-bold text-xl">Your account has been blocked. Please contact support.</div>;
  }

  if (status === StudentStatus.PAYMENT_PENDING || status === StudentStatus.PAID) {
    return (
      <div className="max-w-full mx-auto py-10 min-h-[80vh] flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Scholarship Payments</h2>
        <div className="flex flex-col md:flex-row md:items-start md:gap-8 w-full max-w-3xl mx-auto mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex-1 mb-4 md:mb-0">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" /> Upload Fee Receipt
            </h3>
            <div className="text-xs text-gray-600 mb-2">Max file size: 10MB. Accepted: PDF, image.</div>
            {receiptStatus === 'verified' ? (
              <div className="flex items-center gap-2 text-green-700 font-semibold">
                <CheckCircle className="h-5 w-5" /> Receipt Verified
              </div>
            ) : receipt ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-700">{receipt.name}</span>
                <span className="text-yellow-600 font-semibold text-xs bg-yellow-100 rounded px-2 py-1">Pending Verification</span>
                <button
                  className="ml-2 text-xs text-red-500 underline"
                  onClick={() => { setReceipt(null); setReceiptStatus('none'); }}
                >Remove</button>
              </div>
            ) : (
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 10 * 1024 * 1024) {
                    setError('File too large (max 10MB)');
                    return;
                  }
                  setReceipt(file);
                  setReceiptStatus('pending');
                  setError('');
                }}
              />
            )}
            {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
          </div>
          <div className="flex-1 flex items-center md:items-start">
            <div className="max-w-xl text-sm text-blue-700 bg-blue-100 rounded p-4 w-full">
              {status === StudentStatus.PAYMENT_PENDING && (
                <>
                  <div>Your payment is being processed. Please upload your fee receipt once you receive the payment.</div>
                  {receipt && <div className="mt-2 text-yellow-700">Your receipt is pending verification by the college/admin.</div>}
                </>
              )}
              {status === StudentStatus.PAID && (
                <>
                  <div>Your payment has been credited. Please upload your fee receipt if not already done.</div>
                  {receiptStatus === 'pending' && <div className="mt-2 text-yellow-700">Your receipt is pending verification by the college/admin.</div>}
                  {receiptStatus === 'verified' && <div className="mt-2 text-green-700">Your receipt has been verified. Thank you!</div>}
                </>
              )}
            </div>
          </div>
        </div>
        {status === StudentStatus.PAID && (
          <div className="bg-white p-6 rounded-xl shadow-soft overflow-x-auto flex-1 mb-8">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 whitespace-nowrap">Date</th>
                  <th className="py-2 whitespace-nowrap">Amount</th>
                  <th className="py-2 whitespace-nowrap">Status</th>
                  <th className="py-2 whitespace-nowrap">Donor Name</th>
                  <th className="py-2 whitespace-nowrap">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="py-2 whitespace-nowrap">{p.date}</td>
                    <td className="py-2 whitespace-nowrap">₹{p.amount.toLocaleString()}</td>
                    <td className={`py-2 font-semibold ${p.status === "Credited" ? "text-green-600" : "text-blue-600"}`}>{p.status}</td>
                    <td className="py-2 whitespace-nowrap">{p.donor}</td>
                    <td className="py-2 whitespace-nowrap">{p.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

      // Show payment history for Paid and later statuses
    const summaryStatuses = [
      StudentStatus.PAID,
      StudentStatus.PAYMENT_VERIFIED,
      StudentStatus.RECEIPT_DOCUMENTS_SUBMITTED,
      StudentStatus.ALUMNI,
      StudentStatus.BLOCKED,
    ];
  if (summaryStatuses.includes(status)) {
    return (
      <div className="max-w-full mx-auto py-10 min-h-[80vh] flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Scholarship Payments</h2>
        <div className="bg-white p-6 rounded-xl shadow-soft overflow-x-auto flex-1 mb-8">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 whitespace-nowrap">Date</th>
                <th className="py-2 whitespace-nowrap">Amount</th>
                <th className="py-2 whitespace-nowrap">Status</th>
                <th className="py-2 whitespace-nowrap">Donor Name</th>
                <th className="py-2 whitespace-nowrap">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="py-2 whitespace-nowrap">{p.date}</td>
                  <td className="py-2 whitespace-nowrap">₹{p.amount.toLocaleString()}</td>
                  <td className={`py-2 font-semibold ${p.status === "Credited" ? "text-green-600" : "text-blue-600"}`}>{p.status}</td>
                  <td className="py-2 whitespace-nowrap">{p.donor}</td>
                  <td className="py-2 whitespace-nowrap">{p.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  if (status !== StudentStatus.PAYMENT_PENDING && status !== StudentStatus.PAID) {
    return <div className="max-w-2xl mx-auto py-10 px-4 text-center text-gray-600 font-bold text-xl">Payment information is not available at this stage.</div>;
  }

  return (
    <div className="max-w-full mx-auto py-10 min-h-[80vh] flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Scholarship Payments</h2>
      {/* Receipt Upload Section - moved to top */}
      <div className="bg-white p-6 rounded-xl shadow-soft overflow-x-auto flex-1 mb-8">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 whitespace-nowrap">Date</th>
              <th className="py-2 whitespace-nowrap">Amount</th>
              <th className="py-2 whitespace-nowrap">Status</th>
              <th className="py-2 whitespace-nowrap">Donor Name</th>
              <th className="py-2 whitespace-nowrap">Remarks</th>
              <th className="py-2 whitespace-nowrap">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr key={i} className="border-b last:border-b-0">
                <td className="py-2 whitespace-nowrap">{p.date}</td>
                <td className="py-2 whitespace-nowrap">₹{p.amount.toLocaleString()}</td>
                <td className={`py-2 font-semibold ${p.status === "Credited" ? "text-green-600" : "text-blue-600"}`}>{p.status}</td>
                <td className="py-2 whitespace-nowrap">{p.donor}</td>
                <td className="py-2 whitespace-nowrap">{p.remarks}</td>
                <td className="py-2 whitespace-nowrap">
                  {/* For testing: show view link and verified badge for both payments if receipt exists */}
                  {receipt ? (
                    <span className="flex items-center gap-2">
                      <a
                        href={URL.createObjectURL(receipt)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        View
                      </a>
                      <span className="inline-block px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded font-semibold">Verified</span>
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Notification/Info */}
      <div className="max-w-xl mx-auto text-sm text-blue-700 bg-blue-100 rounded p-4">
        {status === StudentStatus.PAYMENT_PENDING && (
          <>
            <div>Your payment is being processed. Please upload your fee receipt once you receive the payment.</div>
            {receipt && <div className="mt-2 text-yellow-700">Your receipt is pending verification by the college/admin.</div>}
          </>
        )}
        {status === StudentStatus.PAID && (
          <>
            <div>Your payment has been credited. Please upload your fee receipt if not already done.</div>
            {receiptStatus === 'pending' && <div className="mt-2 text-yellow-700">Your receipt is pending verification by the college/admin.</div>}
            {receiptStatus === 'verified' && <div className="mt-2 text-green-700">Your receipt has been verified. Thank you!</div>}
          </>
        )}
      </div>
    </div>
  );
}