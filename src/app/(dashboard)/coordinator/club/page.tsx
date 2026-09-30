"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Check, X, FileText, User } from 'lucide-react';
import {
  getCurrentCoordinator, getClubById,
  getClubMemberships, getClubApplications,
} from '@/services/api';
import type { Club, ClubMembership, MembershipApplication } from '@/types';
import { mockCurrentStudent } from '@/mock-data';

export default function ClubOverview() {
  const [loading, setLoading] = useState(true);
  const [club, setClub] = useState<Club | null>(null);
  const [memberships, setMemberships] = useState<ClubMembership[]>([]);
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  
  // Edit form state
  const [editing, setEditing] = useState(false);
  const [desc, setDesc] = useState('');
  
  useEffect(() => {
    getCurrentCoordinator().then(coord => {
      const cid = coord.clubId;
      Promise.all([
        getClubById(cid),
        getClubMemberships(cid),
        getClubApplications(cid)
      ]).then(([cl, mems, apps]) => {
        if (cl) {
          setClub(cl);
          setDesc(cl.description);
        }
        setMemberships(mems);
        setApplications(apps);
        setLoading(false);
      });
    });
  }, []);

  const handleSave = () => {
    if (club) setClub({ ...club, description: desc });
    setEditing(false);
  };

  const handleApp = (appId: string, status: 'approved' | 'rejected') => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    // If approved, we'd add a membership. Mocking it here in local state.
    if (status === 'approved') {
      const app = applications.find(a => a.id === appId);
      if (app) {
        const newMem: ClubMembership = {
          id: `mem-new-${Date.now()}`,
          studentId: app.studentId,
          clubId: app.clubId,
          role: 'member',
          joinedAt: new Date().toISOString().split('T')[0]
        };
        setMemberships(prev => [...prev, newMem]);
      }
    }
  };

  const pendingApps = applications.filter(a => a.status === 'pending');
  const pastApps = applications.filter(a => a.status !== 'pending');

  if (loading || !club) {
    return (
      <DashboardLayout role="coordinator">
        <PageHeader title="Club Overview" description="Loading..." />
        <LoadingSkeleton lines={8} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="coordinator">
      <PageHeader
        title={club.name}
        description="Manage your club profile, members, and applications."
      />

      <Tabs tabs={[
        {
          label: 'Profile',
          content: (
            <Card className="max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Club Details</h2>
                {!editing && <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>Edit</Button>}
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-xl ${club.color} flex items-center justify-center text-white text-xl font-bold`}>
                    {club.logoInitials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Founded in {club.foundedYear}</p>
                    <p className="text-sm text-gray-500">Requires Application: {club.requiresApplication ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                <FormField label="Club Name">
                  <Input value={club.name} disabled />
                </FormField>
                <FormField label="Faculty Advisor">
                  <Input value={club.facultyAdvisor} disabled />
                </FormField>
                <FormField label="Description">
                  <Textarea
                    rows={4}
                    value={desc}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDesc(e.target.value)}
                    disabled={!editing}
                  />
                </FormField>
              </div>
              {editing && (
                <div className="flex gap-3 mt-6">
                  <Button onClick={handleSave}>Save Changes</Button>
                  <Button variant="secondary" onClick={() => { setEditing(false); setDesc(club.description); }}>Cancel</Button>
                </div>
              )}
            </Card>
          )
        },
        {
          label: `Members (${memberships.length})`,
          content: (
            <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500">Student ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500">Role</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {memberships.length === 0 ? (
                    <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-500">No members found.</td></tr>
                  ) : memberships.map(m => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                        <User size={14} className="text-gray-400" />
                        {m.studentId === mockCurrentStudent.id ? mockCurrentStudent.name : m.studentId}
                      </td>
                      <td className="px-4 py-3 capitalize">{m.role}</td>
                      <td className="px-4 py-3 text-gray-500">{new Date(m.joinedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        },
        {
          label: `Applications ${pendingApps.length > 0 ? `(${pendingApps.length})` : ''}`,
          content: (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Pending Requests</h3>
                {pendingApps.length === 0 ? (
                  <EmptyState title="No pending applications" description="All caught up!" />
                ) : (
                  <div className="space-y-3">
                    {pendingApps.map(app => (
                      <Card key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-yellow-200 bg-yellow-50/30">
                        <div>
                          <p className="font-medium text-gray-900">
                            Student: {app.studentId === mockCurrentStudent.id ? mockCurrentStudent.name : app.studentId}
                          </p>
                          <p className="text-xs text-gray-500 mb-2">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                          {app.note && (
                            <div className="flex gap-2 text-sm text-gray-700 bg-white p-2 rounded border">
                              <FileText size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                              <p>"{app.note}"</p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 focus:ring-green-500" onClick={() => handleApp(app.id, 'approved')}>
                            <Check size={16} className="mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => handleApp(app.id, 'rejected')}>
                            <X size={16} className="mr-1" /> Reject
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {pastApps.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Past Applications</h3>
                  <div className="space-y-3 opacity-75">
                    {pastApps.map(app => (
                      <div key={app.id} className="bg-white border rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {app.studentId === mockCurrentStudent.id ? mockCurrentStudent.name : app.studentId}
                          </p>
                          <p className="text-xs text-gray-500">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                        </div>
                        <Badge status={app.status as 'approved'|'rejected'}>{app.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        }
      ]} />
    </DashboardLayout>
  );
}
