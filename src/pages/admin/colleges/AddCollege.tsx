import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function generateCollegeId() {
  const colleges = JSON.parse(localStorage.getItem('registeredColleges') || '[]');
  let maxNum = 100;
  colleges.forEach((c: any) => {
    const match = c.id && c.id.match(/^COL(\d{3,})$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  });
  return `COL${(maxNum + 1).toString().padStart(3, '0')}`;
}

export default function AddCollege() {
  const [form, setForm] = useState({ name: '', address: '', account: '', bank: '', branch: '', ifsc: '' });
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleAddCollege = () => {
    if (!form.name || !form.address) {
      setFormError('College Name and College Address are required.');
      return;
    }
    const colleges = JSON.parse(localStorage.getItem('registeredColleges') || '[]');
    if (colleges.some((c: any) => c.name.trim().toLowerCase() === form.name.trim().toLowerCase())) {
      setFormError('A college with this name already exists.');
      return;
    }
    if (form.account && colleges.some((c: any) => c.account && c.account === form.account)) {
      setFormError('A college with this account number already exists.');
      return;
    }
    const id = generateCollegeId();
    const newCollege = { id, ...form, students: 0, totalReceived: 0, status: 'Active' };
    colleges.push(newCollege);
    localStorage.setItem('registeredColleges', JSON.stringify(colleges));
    setSuccess(true);
    setTimeout(() => navigate('/admin/colleges/registered'), 1200);
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New College</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">College Name<span className="text-red-500">*</span></label>
              <Input placeholder="Enter college name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">College Address<span className="text-red-500">*</span></label>
              <Input placeholder="Enter college address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <Input placeholder="Enter account number" value={form.account} onChange={e => setForm(f => ({ ...f, account: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <Input placeholder="Enter bank name" value={form.bank} onChange={e => setForm(f => ({ ...f, bank: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
              <Input placeholder="Enter branch name" value={form.branch} onChange={e => setForm(f => ({ ...f, branch: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
              <Input placeholder="Enter IFSC code" value={form.ifsc} onChange={e => setForm(f => ({ ...f, ifsc: e.target.value }))} />
            </div>
          </div>
          {formError && <div className="text-red-500 text-sm mt-2">{formError}</div>}
          {success && <div className="text-green-600 text-sm mt-2">College added successfully!</div>}
          <div className="flex gap-2 mt-6">
            <Button onClick={handleAddCollege}>Add College</Button>
            <Button variant="ghost" onClick={() => navigate('/admin/colleges/registered')}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 