import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ApplyForNext() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    idNo: "LBFS856",
    phone: "",
    passed: "",
    marksheets: [] as File[],
  });
  const [status, setStatus] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleFile = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 5);
    if (arr.some(f => f.size > 10 * 1024 * 1024)) {
      setStatus("File too large (max 10MB)");
      setForm(f => ({ ...f, marksheets: [] }));
      return;
    }
    setForm(f => ({ ...f, marksheets: arr }));
    setStatus("");
  };

  const isValid = form.phone.trim() && form.passed && form.marksheets.length > 0 && !status;

  if (submitted) {
    return (
      <div className="flex flex-col items-center w-full min-h-[calc(100vh-4rem)] py-8 px-2">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="font-bold text-lg mb-4 text-green-700">Application Submitted!</div>
          <div className="mb-4 text-gray-700">Your application for the next semester has been submitted successfully. You will be notified once it is reviewed.</div>
          <button className="bg-blue-600 text-white rounded px-6 py-2 mt-2" onClick={() => navigate('/student')}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full min-h-[calc(100vh-4rem)] py-8 px-2">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="font-bold text-lg mb-4">Apply for Next</div>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); if (isValid) setSubmitted(true); }}>
          <div>
            <label className="block text-sm font-medium mb-1">ID No</label>
            <input className="w-full bg-gray-100 rounded px-3 py-2" value={form.idNo} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number<span className="text-red-500">*</span></label>
            <input className="w-full rounded px-3 py-2 border" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Have you passed all Subjects with nil Arrears?<span className="text-red-500">*</span></label>
            <select className="w-full rounded px-3 py-2 border" value={form.passed} onChange={e => setForm(f => ({ ...f, passed: e.target.value }))} required>
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Upload Last semester/Quarterly/Half yearly/Annual Exam mark sheet <span className="text-red-500">*</span> (max 5 files, each max 10MB)</label>
            <input type="file" multiple accept="application/pdf,image/*" className="w-full" onChange={e => handleFile(e.target.files)} />
            {status && <div className="text-xs text-red-500 mt-1">{status}</div>}
            {form.marksheets.length > 0 && <div className="text-xs text-green-600 mt-1">{form.marksheets.length} file(s) selected</div>}
          </div>
          <div className="flex gap-2 mt-6">
            <button type="button" className="w-1/2 bg-gray-200 text-gray-700 rounded py-2" onClick={() => navigate('/student')}>Cancel</button>
            <button type="submit" className="w-1/2 bg-blue-600 text-white rounded py-2" disabled={!isValid}>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
} 