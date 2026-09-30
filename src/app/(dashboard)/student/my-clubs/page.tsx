"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import Link from 'next/link';
import { getClubs, getStudentMemberships, getStudentApplications } from '@/services/api';
import type { Club, ClubMembership, MembershipApplication } from '@/types';
import { mockCurrentStudent } from '@/mock-data';

export default function MyClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [memberships, setMemberships] = useState<ClubMembership[]>([]);
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sid = mockCurrentStudent.id;
    Promise.all([getClubs(), getStudentMemberships(sid), getStudentApplications(sid)])
      .then(([cl, mem, app]) => {
        setClubs(cl); setMemberships(mem); setApplications(app);
        setLoading(false);
      });
  }, []);

  const joinedClubs = memberships
    .map(m => ({ club: clubs.find(c => c.id === m.clubId), mem: m }))
    .filter((x): x is { club: Club; mem: ClubMembership } => !!x.club);

  const pendingApps  = applications.filter(a => a.status === 'pending');
  const rejectedApps = applications.filter(a => a.status === 'rejected');

  return (
    <DashboardLayout role="student">
      <PageHeader title="My Clubs" description="Your club memberships and pending applications." />
      {loading ? <LoadingSkeleton lines={6} /> : (
        <div className="space-y-8">
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Active Memberships</h2>
            {joinedClubs.length === 0 ? (
              <EmptyState
                title="No memberships yet"
                description="Browse clubs and request to join."
                action={<Link href="/student/clubs" className="text-primary-600 text-sm hover:underline">Browse Clubs →</Link>}
              />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {joinedClubs.map(({ club, mem }) => (
                  <Link key={mem.id} href={`/student/clubs/${club.id}`}
                    className="bg-white border rounded-xl p-4 hover:shadow-sm transition-shadow flex items-center gap-3"
                  >
                    <div className={`w-12 h-12 rounded-xl ${club.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {club.logoInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{club.name}</p>
                      <p className="text-xs text-gray-500">
                        Joined {new Date(mem.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </p>
                      <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">
                        {mem.role}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {pendingApps.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-3">Pending Requests</h2>
              <div className="space-y-3">
                {pendingApps.map(app => {
                  const club = clubs.find(c => c.id === app.clubId);
                  return (
                    <div key={app.id} className="bg-white border border-yellow-200 rounded-xl p-4 flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${club?.color ?? 'bg-gray-400'} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {club?.logoInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{club?.name}</p>
                        <p className="text-xs text-gray-500">
                          Applied {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <Badge status="pending">Pending</Badge>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {rejectedApps.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-3">Rejected Applications</h2>
              <div className="space-y-3">
                {rejectedApps.map(app => {
                  const club = clubs.find(c => c.id === app.clubId);
                  return (
                    <div key={app.id} className="bg-white border border-red-100 rounded-xl p-4 flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${club?.color ?? 'bg-gray-400'} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {club?.logoInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{club?.name}</p>
                        <p className="text-xs text-gray-500">
                          Applied {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <Badge status="rejected">Rejected</Badge>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
