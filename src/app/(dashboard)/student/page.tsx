"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import Link from 'next/link';
import { Calendar, Users, Award, CheckCircle, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import {
  getEvents, getClubs, getStudentRegistrations, getStudentMemberships,
  getStudentApplications, getStudentAttendance, getStudentCertificates,
} from '@/services/api';
import type { Event, Club, EventRegistration, ClubMembership, MembershipApplication, Attendance, Certificate } from '@/types';
import { mockCurrentStudent } from '@/mock-data';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [memberships, setMemberships] = useState<ClubMembership[]>([]);
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    const sid = mockCurrentStudent.id;
    Promise.all([
      getEvents(), getClubs(),
      getStudentRegistrations(sid), getStudentMemberships(sid),
      getStudentApplications(sid), getStudentAttendance(sid),
      getStudentCertificates(sid),
    ]).then(([ev, cl, reg, mem, app, att, cert]) => {
      setEvents(ev); setClubs(cl); setRegistrations(reg);
      setMemberships(mem); setApplications(app); setAttendance(att);
      setCertificates(cert);
      setLoading(false);
    });
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const upcomingRegs = registrations
    .filter(r => r.status === 'confirmed')
    .map(r => events.find(e => e.id === r.eventId))
    .filter((e): e is Event => !!e && e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const joinedClubs = memberships
    .map(m => clubs.find(c => c.id === m.clubId))
    .filter((c): c is Club => !!c);

  const pendingApps = applications.filter(a => a.status === 'pending');
  const presentCount = attendance.filter(a => a.status === 'present').length;
  const attendancePct = attendance.length > 0
    ? Math.round((presentCount / attendance.length) * 100) : 0;

  return (
    <DashboardLayout role="student">
      <PageHeader
        title={`Welcome back, ${mockCurrentStudent.name.split(' ')[0]}! 👋`}
        description="Here's an overview of your campus activity."
      />
      {loading ? <LoadingSkeleton lines={6} /> : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Clubs Joined"      value={joinedClubs.length}   icon={<Users size={22} />} />
            <StatCard title="Events Registered" value={registrations.length} icon={<Calendar size={22} />} />
            <StatCard title="Attendance Rate"   value={`${attendancePct}%`}  icon={<CheckCircle size={22} />} />
            <StatCard title="Certificates"      value={certificates.length}  icon={<Award size={22} />} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Upcoming Events</h2>
                <Link href="/student/my-events" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              <div className="divide-y">
                {upcomingRegs.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500">No upcoming events. <Link href="/student/events" className="text-primary-600 hover:underline">Browse events →</Link></p>
                ) : upcomingRegs.map(event => (
                  <Link key={event.id} href={`/student/events/${event.id}`} className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <Calendar size={18} className="text-primary-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{formatDate(event.date)} · {event.startTime}</p>
                    </div>
                    <Badge status="confirmed">Registered</Badge>
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">My Clubs</h2>
                <Link href="/student/my-clubs" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              <div className="divide-y">
                {joinedClubs.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500">No clubs yet. <Link href="/student/clubs" className="text-primary-600 hover:underline">Browse clubs →</Link></p>
                ) : joinedClubs.map(club => {
                  const mem = memberships.find(m => m.clubId === club.id)!;
                  return (
                    <Link key={club.id} href={`/student/clubs/${club.id}`} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                      <div className={`w-10 h-10 rounded-lg ${club.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {club.logoInitials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{club.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{mem.role}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card>
          </div>

          {pendingApps.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={18} className="text-yellow-500" />
                <h2 className="font-semibold text-gray-900">Pending Membership Requests</h2>
              </div>
              <div className="space-y-2">
                {pendingApps.map(app => {
                  const club = clubs.find(c => c.id === app.clubId);
                  return (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${club?.color ?? 'bg-gray-400'} flex items-center justify-center text-white text-xs font-bold`}>
                          {club?.logoInitials}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{club?.name}</p>
                          <p className="text-xs text-gray-500">Applied {formatDate(app.appliedAt)}</p>
                        </div>
                      </div>
                      <Badge status="pending">Pending</Badge>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Browse Events', href: '/student/events',       icon: <Calendar size={18} />, color: 'text-blue-600 bg-blue-50' },
              { label: 'Browse Clubs',  href: '/student/clubs',        icon: <Users size={18} />,    color: 'text-purple-600 bg-purple-50' },
              { label: 'My History',    href: '/student/history',      icon: <TrendingUp size={18} />, color: 'text-green-600 bg-green-50' },
              { label: 'Certificates',  href: '/student/certificates', icon: <Award size={18} />,    color: 'text-orange-600 bg-orange-50' },
            ].map(q => (
              <Link key={q.label} href={q.href}
                className="flex flex-col items-center gap-2 p-4 bg-white border rounded-xl hover:shadow-sm transition-shadow text-center"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${q.color}`}>{q.icon}</div>
                <span className="text-xs font-medium text-gray-700">{q.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}