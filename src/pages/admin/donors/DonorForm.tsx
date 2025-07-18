import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Donor {
  id?: string;
  name: string;
  phone: string;
  occupation: string;
  address: string;
  dob: string;
  totalDonated: number;
  donationType: string;
  autoDebit: boolean;
  activeStudents: number;
  unallocatedAmount: number;
  status: string;
}

interface DonorFormProps {
  donor?: Donor;
  onSubmit: (donor: Donor) => void;
  mode: 'add' | 'edit';
}

const defaultDonor: Donor = {
  name: '',
  phone: '',
  occupation: '',
  address: '',
  dob: '',
  totalDonated: 0,
  donationType: 'Monthly',
  autoDebit: false,
  activeStudents: 0,
  unallocatedAmount: 0,
  status: 'Active',
};

const DonorForm: React.FC<DonorFormProps> = ({ donor, onSubmit, mode }) => {
  const [form, setForm] = useState<Donor>(donor || defaultDonor);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelect = (name: string, value: any) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-2xl p-0">
        <CardHeader>
          <CardTitle>{mode === 'add' ? 'Add New Donor' : 'Edit Donor'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 items-center">
              <label className="text-right font-medium">Name</label>
              <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />

              <label className="text-right font-medium">Phone</label>
              <Input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />

              <label className="text-right font-medium">Occupation</label>
              <Input name="occupation" placeholder="Occupation" value={form.occupation} onChange={handleChange} />

              <label className="text-right font-medium">Address</label>
              <Input name="address" placeholder="Address" value={form.address} onChange={handleChange} />

              <label className="text-right font-medium">Date of Birth</label>
              <Input name="dob" placeholder="Date of Birth" value={form.dob} onChange={handleChange} type="date" />

              <label className="text-right font-medium">Total Donated</label>
              <Input name="totalDonated" placeholder="Total Donated" value={form.totalDonated} onChange={handleChange} type="number" />

              <label className="text-right font-medium">Donation Type</label>
              <Select value={form.donationType} onValueChange={v => handleSelect('donationType', v)}>
                <SelectTrigger><SelectValue placeholder="Donation Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Half Yearly">Half Yearly</SelectItem>
                  <SelectItem value="Annually">Annually</SelectItem>
                  <SelectItem value="One-Time">One-Time</SelectItem>
                </SelectContent>
              </Select>

              <label className="text-right font-medium">Auto Debit</label>
              <Select value={form.autoDebit ? 'true' : 'false'} onValueChange={v => handleSelect('autoDebit', v === 'true')}>
                <SelectTrigger><SelectValue placeholder="Auto Debit" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>

              <label className="text-right font-medium">Active Students</label>
              <Input name="activeStudents" placeholder="Active Students" value={form.activeStudents} onChange={handleChange} type="number" />

              <label className="text-right font-medium">Unallocated Amount</label>
              <Input name="unallocatedAmount" placeholder="Unallocated Amount" value={form.unallocatedAmount} onChange={handleChange} type="number" />

              <label className="text-right font-medium">Status</label>
              <Select value={form.status} onValueChange={v => handleSelect('status', v)}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 mt-8">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/donors/all')}>Cancel</Button>
              <Button type="submit">{mode === 'add' ? 'Add Donor' : 'Save Changes'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonorForm; 