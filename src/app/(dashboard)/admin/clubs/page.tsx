"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { getClubs, getAllStudents } from '@/services/api';
import type { Club, Student } from '@/types';

// Extend Club mock type slightly for admin UI
type AdminClub = Club & { status: 'approved' | 'pending' | 'rejected' };

export default function AdminClubs() {
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState<AdminClub[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  
  // Coordinator change state
  const [coordModal, setCoordModal] = useState<{club: AdminClub, newCoordName: string} | null>(null);

  useEffect(() => {
    Promise.all([getClubs(), getAllStudents()]).then(([cl, st]) => {
      // Mocking club statuses since it's not strictly in the initial mock data
      const adminClubs: AdminClub[] = cl.map((c, i) => ({
        ...c,
        status: (i === cl.length - 1 ? 'pending' : 'approved') as 'pending' | 'approved'
      }));
      setClubs(adminClubs);
      setStudents(st);
      setLoading(false);
    });
  }, []);

  const handleStatus = (clubId: string, status: 'approved' | 'rejected') => {
    setClubs(prev => prev.map(c => c.id === clubId ? { ...c, status } : c));
  };

  const handleChangeCoord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coordModal) return;
    setClubs(prev => prev.map(c => 
      c.id === coordModal.club.id ? { ...c, coordinatorName: coordModal.newCoordName } : c
    ));
    setCoordModal(null);
  };

  if (loading) return <DashboardLayout role="admin"><LoadingSkeleton lines={8} /></DashboardLayout>;

  return (
    <DashboardLayout role="admin">
      <PageHeader title="Clubs & Coordinators" description="Manage clubs, their approval status, and faculty coordinators." />

      <Tabs tabs={[
        {
          label: 'Clubs',
          content: (
            <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500">Club</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 hidden md:table-cell">Members</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500">Status</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {clubs.map(club => (
                    <tr key={club.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${club.color} flex items-center justify-center text-white font-bold`}>
                            {club.logoInitials}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{club.name}</p>
                            <p className="text-xs text-gray-500">Since {club.foundedYear}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{club.memberCount} members</td>
                      <td className="px-4 py-3">
                        <Badge status={club.status}>{club.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {club.status === 'pending' ? (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleStatus(club.id, 'approved')}>Approve</Button>
                            <Button size="sm" variant="danger" onClick={() => handleStatus(club.id, 'rejected')}>Reject</Button>
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs italic">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        },
        {
          label: 'Coordinators',
          content: (
            <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500">Club</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500">Current Coordinator</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 hidden md:table-cell">Faculty Advisor</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {clubs.map(club => (
                    <tr key={club.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{club.name}</td>
                      <td className="px-4 py-3 text-gray-900">
                        {club.coordinatorName}
                        <p className="text-xs text-gray-500">{club.coordinatorEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{club.facultyAdvisor}</td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="secondary" onClick={() => setCoordModal({ club, newCoordName: club.coordinatorName })}>Reassign</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      ]} />

      <Modal isOpen={!!coordModal} onClose={() => setCoordModal(null)} title="Reassign Coordinator">
        {coordModal && (
          <form onSubmit={handleChangeCoord} className="space-y-4">
            <p className="text-sm text-gray-600">Select a new coordinator for <strong>{coordModal.club.name}</strong>.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Coordinator</label>
              <Select 
                value={coordModal.newCoordName} 
                onChange={e => setCoordModal({...coordModal, newCoordName: e.target.value})}
              >
                <option value={coordModal.club.coordinatorName}>{coordModal.club.coordinatorName} (Current)</option>
                {students.slice(0, 10).map(s => (
                  <option key={s.id} value={s.name}>{s.name} ({s.enrollmentNo})</option>
                ))}
              </Select>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setCoordModal(null)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>
    </DashboardLayout>
  );
}
