"use client";
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { mockCurrentStudent } from '@/mock-data';
import { User, Mail, BookOpen, Hash } from 'lucide-react';

const depts = [
  'Computer Science & Engineering', 'Electronics & Communication',
  'Mechanical Engineering', 'Civil Engineering', 'Information Technology',
  'Chemical Engineering', 'Electrical Engineering',
];

export default function StudentProfile() {
  const s = mockCurrentStudent;
  const [form, setForm] = useState({
    name: s.name,
    enrollmentNo: s.enrollmentNo,
    department: s.department,
    year: String(s.year),
  });
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleChange = (field: string, val: string) => {
    setSaved(false);
    setForm(f => ({ ...f, [field]: val }));
  };

  const handleSave = () => { setSaved(true); setEditing(false); };

  return (
    <DashboardLayout role="student">
      <PageHeader title="My Profile" description="View and update your personal information." />
      <div className="max-w-2xl space-y-6">
        <Card className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {s.avatarInitials}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{form.name}</p>
            <p className="text-sm text-gray-500">{form.department} · Year {form.year}</p>
            <p className="text-sm text-gray-500">{s.email}</p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Personal Information</h2>
            {!editing && (
              <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>Edit</Button>
            )}
          </div>
          <div className="space-y-4">
            <FormField label="Full Name" icon={<User size={16} />}>
              <Input
                value={form.name}
                disabled={!editing}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)}
                placeholder="Your full name"
              />
            </FormField>
            <FormField label="Enrollment Number" icon={<Hash size={16} />}>
              <Input value={form.enrollmentNo} disabled placeholder="Read-only" />
            </FormField>
            <FormField label="Email Address" icon={<Mail size={16} />}>
              <Input value={s.email} disabled placeholder="Read-only" />
            </FormField>
            <FormField label="Department" icon={<BookOpen size={16} />}>
              <Select
                value={form.department}
                disabled={!editing}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('department', e.target.value)}
              >
                {depts.map(d => <option key={d} value={d}>{d}</option>)}
              </Select>
            </FormField>
            <FormField label="Year of Study">
              <Select
                value={form.year}
                disabled={!editing}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('year', e.target.value)}
              >
                {['1', '2', '3', '4'].map(y => <option key={y} value={y}>Year {y}</option>)}
              </Select>
            </FormField>
          </div>
          {editing && (
            <div className="flex gap-3 mt-6">
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          )}
          {saved && (
            <p className="mt-3 text-sm text-green-600 font-medium">✓ Profile updated successfully.</p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
