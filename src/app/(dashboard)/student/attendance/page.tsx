"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import Link from 'next/link';
import { CheckCircle, XCircle, Calendar } from 'lucide-react';
import { getStudentAttendance, getEvents } from '@/services/api';
import type { Attendance, Event } from '@/types';
import { mockCurrentStudent } from '@/mock-data';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [events, setEvents]         = useState<Event[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([getStudentAttendance(mockCurrentStudent.id), getEvents()])
      .then(([att, evts]) => { setAttendance(att); setEvents(evts); setLoading(false); });
  }, []);

  const presentCount = attendance.filter(a => a.status === 'present').length;
  const absentCount  = attendance.filter(a => a.status === 'absent').length;
  const pct = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;

  return (
    <DashboardLayout role="student">
      <PageHeader title="Attendance Record" description="Your event attendance history." />
      {loading ? <LoadingSkeleton lines={6} /> : (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <StatCard title="Attended"     value={presentCount} icon={<CheckCircle size={20} className="text-green-500" />} />
            <StatCard title="Missed"       value={absentCount}  icon={<XCircle size={20} className="text-red-400" />} />
            <StatCard title="Attendance %" value={`${pct}%`}    icon={<Calendar size={20} />} />
          </div>

          {attendance.length > 0 && (
            <div className="bg-white border rounded-xl p-4">
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Overall Attendance</span>
                <span className={pct >= 75 ? 'text-green-600' : 'text-red-600'}>{pct}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${pct >= 75 ? 'bg-green-500' : 'bg-red-400'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              {pct < 75 && <p className="text-xs text-red-600 mt-1">⚠️ Your attendance is below 75%.</p>}
            </div>
          )}

          {attendance.length === 0 ? (
            <EmptyState title="No attendance records" description="Attend events to build your record." />
          ) : (
            <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Event</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendance.map(att => {
                    const event = events.find(e => e.id === att.eventId);
                    return (
                      <tr key={att.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <Link href={`/student/events/${att.eventId}`} className="text-primary-600 hover:underline font-medium">
                            {event?.title ?? att.eventId}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{event ? formatDate(event.date) : '—'}</td>
                        <td className="px-4 py-3">
                          {att.status === 'present'
                            ? <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium"><CheckCircle size={12} /> Present</span>
                            : <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded-full text-xs font-medium"><XCircle size={12} /> Absent</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
