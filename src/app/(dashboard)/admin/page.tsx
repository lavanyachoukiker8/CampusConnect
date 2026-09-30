"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import Link from 'next/link';
import { Users, Calendar, BookOpen, ClipboardList, AlertCircle, ArrowRight } from 'lucide-react';
import {
  getAllStudents, getClubs, getEvents, getAllRegistrations, getAllAttendance
} from '@/services/api';
import type { Student, Club, Event, EventRegistration, Attendance } from '@/types';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    Promise.all([
      getAllStudents(), getClubs(), getEvents(), getAllRegistrations(), getAllAttendance()
    ]).then(([st, cl, ev, re, at]) => {
      setStudents(st); setClubs(cl); setEvents(ev); setRegistrations(re); setAttendance(at);
      setLoading(false);
    });
  }, []);

  const pendingEvents = events.filter(e => e.status === 'pending');
  // Mocking "pending clubs" since club doesn't have a status in current types, we will pretend clubs with requiresApplication=false is pending for this UI, or just say 0 for now.
  // Actually, wait, let's just use pending events as primary approvals.

  const totalAttendance = attendance.length;
  const present = attendance.filter(a => a.status === 'present').length;
  const attPct = totalAttendance > 0 ? Math.round((present / totalAttendance) * 100) : 0;

  // Most popular events (by registration count)
  const popularEvents = [...events].sort((a, b) => b.registeredCount - a.registeredCount).slice(0, 3);
  
  // Most popular clubs (by event count for now)
  const popularClubs = [...clubs].sort((a, b) => {
    const aEvents = events.filter(e => e.clubId === a.id).length;
    const bEvents = events.filter(e => e.clubId === b.id).length;
    return bEvents - aEvents;
  }).slice(0, 3);

  return (
    <DashboardLayout role="admin">
      <PageHeader title="System Dashboard" description="Overview of CampusConnect operations." />

      {loading ? <LoadingSkeleton lines={8} /> : (
        <div className="space-y-6">
          {/* Top Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Students" value={students.length} icon={<Users size={22} />} />
            <StatCard title="Active Clubs" value={clubs.length} icon={<BookOpen size={22} />} />
            <StatCard title="Total Events" value={events.length} icon={<Calendar size={22} />} />
            <StatCard title="System Attendance" value={`${attPct}%`} icon={<ClipboardList size={22} />} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pending Approvals */}
            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-3 border-b bg-gray-50 flex justify-between items-center">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <AlertCircle size={18} className="text-orange-500" /> Pending Approvals
                </h2>
                <Link href="/admin/events" className="text-sm text-primary-600 hover:underline">View All →</Link>
              </div>
              <div className="divide-y">
                {pendingEvents.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500 text-center">No pending approvals.</p>
                ) : pendingEvents.slice(0, 4).map(e => (
                  <div key={e.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{e.title}</p>
                      <p className="text-xs text-gray-500">Event Approval</p>
                    </div>
                    <Link href={`/admin/events`}><Button size="sm">Review</Button></Link>
                  </div>
                ))}
              </div>
            </Card>

            {/* Popular Items */}
            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-3 border-b bg-gray-50">
                <h2 className="font-semibold text-gray-900">Most Popular Events</h2>
              </div>
              <div className="divide-y">
                {popularEvents.map(e => (
                  <div key={e.id} className="p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{e.title}</p>
                      <p className="text-xs text-gray-500">{e.registeredCount} / {e.totalSeats} registered</p>
                    </div>
                    <Badge status={e.status as any}>{e.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}