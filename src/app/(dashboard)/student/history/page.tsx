"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import Link from 'next/link';
import { Calendar, CheckCircle, XCircle, Star, Award, ArrowRight } from 'lucide-react';
import {
  getEvents, getStudentRegistrations, getStudentAttendance,
  getStudentFeedback, getStudentCertificates,
} from '@/services/api';
import type { Event, EventRegistration, Attendance, Feedback, Certificate } from '@/types';
import { mockCurrentStudent } from '@/mock-data';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface HistoryEntry {
  eventId: string;
  event: Event;
  registration: EventRegistration;
  attendance?: Attendance;
  feedback?: Feedback;
  certificate?: Certificate;
}

export default function ParticipationHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sid = mockCurrentStudent.id;
    Promise.all([
      getEvents(),
      getStudentRegistrations(sid),
      getStudentAttendance(sid),
      getStudentFeedback(sid),
      getStudentCertificates(sid),
    ]).then(([evts, regs, atts, fbs, certs]) => {
      const today = new Date().toISOString().split('T')[0];
      const hist: HistoryEntry[] = regs
        .filter(r => r.status === 'confirmed')
        .reduce<HistoryEntry[]>((acc, r) => {
          const event = evts.find(e => e.id === r.eventId);
          if (!event || event.date >= today) return acc;
          acc.push({
            eventId: r.eventId,
            event,
            registration: r,
            attendance:   atts.find(a => a.eventId === r.eventId),
            feedback:     fbs.find(f => f.eventId === r.eventId),
            certificate:  certs.find(c => c.eventId === r.eventId),
          });
          return acc;
        }, [])
        .sort((a, b) => b.event.date.localeCompare(a.event.date));

      setEntries(hist);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout role="student">
      <PageHeader title="Participation History" description="A complete timeline of all your past event activity." />
      {loading ? <LoadingSkeleton lines={8} /> : entries.length === 0 ? (
        <EmptyState
          title="No history yet"
          description="Your participation history will appear here after attending events."
        />
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 hidden sm:block" />
          <div className="space-y-6">
            {entries.map(entry => (
              <div key={entry.eventId} className="relative sm:pl-14">
                {/* Dot */}
                <div className={`hidden sm:flex absolute left-3 top-4 w-5 h-5 rounded-full border-2 border-white items-center justify-center ${entry.attendance?.status === 'present' ? 'bg-green-500' : 'bg-red-400'}`}>
                  {entry.attendance?.status === 'present'
                    ? <CheckCircle size={10} className="text-white" />
                    : <XCircle size={10} className="text-white" />}
                </div>

                <div className="bg-white border rounded-xl p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Link href={`/student/events/${entry.eventId}`} className="text-sm font-semibold text-gray-900 hover:text-primary-600">
                      {entry.event.title}
                    </Link>
                    {entry.certificate && <Badge status="approved">Certificate Earned</Badge>}
                  </div>
                  <p className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <Calendar size={11} /> {formatDate(entry.event.date)}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {/* Attendance */}
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${entry.attendance?.status === 'present' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {entry.attendance?.status === 'present' ? <CheckCircle size={11} /> : <XCircle size={11} />}
                      {entry.attendance?.status === 'present' ? 'Attended' : 'Absent'}
                    </span>

                    {/* Feedback */}
                    {entry.feedback ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-50 text-yellow-700">
                        <Star size={11} className="fill-yellow-400 text-yellow-400" />
                        Rated {entry.feedback.rating}/5
                      </span>
                    ) : entry.attendance?.status === 'present' && (
                      <Link href="/student/feedback" className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-gray-50 text-gray-500 hover:bg-primary-50 hover:text-primary-600 border">
                        <Star size={11} /> Give Feedback <ArrowRight size={10} />
                      </Link>
                    )}

                    {/* Certificate */}
                    {entry.certificate && (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700">
                        <Award size={11} /> {entry.certificate.type} certificate
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
