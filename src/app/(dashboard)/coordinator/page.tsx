"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import Link from 'next/link';
import { Users, Calendar, ClipboardList, CheckCircle, Star, ArrowRight, Clock } from 'lucide-react';
import {
  getCurrentCoordinator, getClubById, getEventsByClub,
  getClubMemberships, getClubApplications,
  getEventRegistrations, getEventAttendance, getEventFeedback
} from '@/services/api';
import type { Club, Event, ClubMembership, MembershipApplication, EventRegistration, Attendance, Feedback } from '@/types';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function CoordinatorDashboard() {
  const [loading, setLoading] = useState(true);
  const [club, setClub] = useState<Club | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [memberships, setMemberships] = useState<ClubMembership[]>([]);
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  
  // Aggregate stats
  const [totalRegs, setTotalRegs] = useState(0);
  const [attendancePct, setAttendancePct] = useState(0);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    getCurrentCoordinator().then(coord => {
      const cid = coord.clubId;
      Promise.all([
        getClubById(cid), getEventsByClub(cid),
        getClubMemberships(cid), getClubApplications(cid)
      ]).then(async ([cl, evts, mems, apps]) => {
        setClub(cl ?? null);
        setEvents(evts);
        setMemberships(mems);
        setApplications(apps);

        // Fetch aggregate event stats
        let regs = 0;
        let present = 0;
        let totalAtt = 0;
        let totalRating = 0;
        let fbCount = 0;

        await Promise.all(evts.map(async e => {
          const [eRegs, eAtts, eFbs] = await Promise.all([
            getEventRegistrations(e.id),
            getEventAttendance(e.id),
            getEventFeedback(e.id)
          ]);
          regs += eRegs.length;
          totalAtt += eAtts.length;
          present += eAtts.filter(a => a.status === 'present').length;
          fbCount += eFbs.length;
          totalRating += eFbs.reduce((sum, f) => sum + f.rating, 0);
        }));

        setTotalRegs(regs);
        setAttendancePct(totalAtt > 0 ? Math.round((present / totalAtt) * 100) : 0);
        setAvgRating(fbCount > 0 ? Number((totalRating / fbCount).toFixed(1)) : 0);
        setLoading(false);
      });
    });
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const upcomingEvents = events
    .filter(e => e.date >= today && e.status !== 'cancelled')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);
  const pendingApps = applications.filter(a => a.status === 'pending');

  return (
    <DashboardLayout role="coordinator">
      <PageHeader
        title={`Coordinator Dashboard`}
        description={club ? `Managing ${club.name}` : 'Loading...'}
      />

      {loading || !club ? <LoadingSkeleton lines={8} /> : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Members"     value={memberships.length}  icon={<Users size={22} />} />
            <StatCard title="Total Registrations" value={totalRegs}           icon={<ClipboardList size={22} />} />
            <StatCard title="Avg Attendance"    value={`${attendancePct}%`}   icon={<CheckCircle size={22} />} />
            <StatCard title="Avg Feedback"      value={`${avgRating} / 5`}    icon={<Star size={22} />} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Upcoming Events</h2>
                <Link href="/coordinator/events" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                  Manage Events <ArrowRight size={14} />
                </Link>
              </div>
              <div className="divide-y">
                {upcomingEvents.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500">No upcoming events. <Link href="/coordinator/events/new" className="text-primary-600 hover:underline">Create one →</Link></p>
                ) : upcomingEvents.map(event => (
                  <Link key={event.id} href={`/coordinator/events/${event.id}`} className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <Calendar size={18} className="text-primary-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                        <Badge status={event.status as 'open'|'full'|'completed'}>{event.status}</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{formatDate(event.date)} · {event.registeredCount}/{event.totalSeats} registered</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="p-0 overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Pending Tasks</h2>
                <Link href="/coordinator/club" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                  View Applications <ArrowRight size={14} />
                </Link>
              </div>
              <div className="flex-1 p-4 bg-gray-50 flex flex-col justify-center">
                {pendingApps.length === 0 ? (
                  <div className="text-center text-gray-500">
                    <CheckCircle size={32} className="mx-auto mb-2 text-green-500 opacity-50" />
                    <p className="text-sm">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Clock size={32} className="mx-auto mb-2 text-yellow-500" />
                    <p className="text-lg font-bold text-gray-900">{pendingApps.length} pending</p>
                    <p className="text-sm text-gray-600 mb-4">Membership applications require your review.</p>
                    <Link href="/coordinator/club">
                      <Badge status="pending">Review Now</Badge>
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}