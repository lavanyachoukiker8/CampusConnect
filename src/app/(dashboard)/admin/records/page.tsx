"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Tabs } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Star, CheckCircle, XCircle } from 'lucide-react';
import {
  getAllRegistrations, getAllAttendance, getAllFeedback, getAllCertificates,
  getEvents, getAllStudents
} from '@/services/api';
import type { EventRegistration, Attendance, Feedback, Certificate, Event, Student } from '@/types';

export default function AdminRecords() {
  const [loading, setLoading] = useState(true);
  const [regs, setRegs] = useState<EventRegistration[]>([]);
  const [atts, setAtts] = useState<Attendance[]>([]);
  const [fbs, setFbs] = useState<Feedback[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    Promise.all([
      getAllRegistrations(), getAllAttendance(), getAllFeedback(), getAllCertificates(),
      getEvents(), getAllStudents()
    ]).then(([r, a, f, c, ev, st]) => {
      setRegs(r); setAtts(a); setFbs(f); setCerts(c); setEvents(ev); setStudents(st);
      setLoading(false);
    });
  }, []);

  const getStudentName = (id: string) => students.find(s => s.id === id)?.name || id;
  const getEventName = (id: string) => events.find(e => e.id === id)?.title || id;

  if (loading) return <DashboardLayout role="admin"><LoadingSkeleton lines={8} /></DashboardLayout>;

  return (
    <DashboardLayout role="admin">
      <PageHeader title="System Logs" description="Global view of all user interactions and records." />

      <Tabs tabs={[
        {
          label: `Registrations (${regs.length})`,
          content: (
            <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr><th className="px-4 py-3 text-left font-semibold text-gray-500">Student</th><th className="px-4 py-3 text-left font-semibold text-gray-500">Event</th><th className="px-4 py-3 text-left font-semibold text-gray-500">Date</th><th className="px-4 py-3 text-left font-semibold text-gray-500">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {regs.slice(0, 50).map(r => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{getStudentName(r.studentId)}</td>
                      <td className="px-4 py-3 text-gray-500">{getEventName(r.eventId)}</td>
                      <td className="px-4 py-3 text-gray-500">{new Date(r.registeredAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3"><Badge status={r.status as any}>{r.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-3 text-center text-xs text-gray-500 border-t">Showing recent 50 records</div>
            </div>
          )
        },
        {
          label: `Attendance (${atts.length})`,
          content: (
            <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr><th className="px-4 py-3 text-left font-semibold text-gray-500">Student</th><th className="px-4 py-3 text-left font-semibold text-gray-500">Event</th><th className="px-4 py-3 text-left font-semibold text-gray-500">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {atts.slice(0, 50).map(a => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{getStudentName(a.studentId)}</td>
                      <td className="px-4 py-3 text-gray-500">{getEventName(a.eventId)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${a.status === 'present' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                          {a.status === 'present' ? <CheckCircle size={12} /> : <XCircle size={12} />} {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        },
        {
          label: `Feedback (${fbs.length})`,
          content: (
            <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr><th className="px-4 py-3 text-left font-semibold text-gray-500">Student</th><th className="px-4 py-3 text-left font-semibold text-gray-500">Event</th><th className="px-4 py-3 text-left font-semibold text-gray-500">Rating</th><th className="px-4 py-3 text-left font-semibold text-gray-500">Comment</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {fbs.slice(0, 50).map(f => (
                    <tr key={f.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{getStudentName(f.studentId)}</td>
                      <td className="px-4 py-3 text-gray-500">{getEventName(f.eventId)}</td>
                      <td className="px-4 py-3 flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < f.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                        ))}
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{f.comment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        },
        {
          label: `Certificates (${certs.length})`,
          content: (
            <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr><th className="px-4 py-3 text-left font-semibold text-gray-500">Student</th><th className="px-4 py-3 text-left font-semibold text-gray-500">Event</th><th className="px-4 py-3 text-left font-semibold text-gray-500">Type</th><th className="px-4 py-3 text-left font-semibold text-gray-500">Issued</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {certs.slice(0, 50).map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{getStudentName(c.studentId)}</td>
                      <td className="px-4 py-3 text-gray-500">{getEventName(c.eventId)}</td>
                      <td className="px-4 py-3 capitalize"><span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{c.type}</span></td>
                      <td className="px-4 py-3 text-gray-500">{new Date(c.issuedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      ]} />
    </DashboardLayout>
  );
}
