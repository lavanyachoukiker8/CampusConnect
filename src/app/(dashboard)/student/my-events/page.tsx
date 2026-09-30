"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { getEvents, getVenues, getStudentRegistrations } from '@/services/api';
import type { Event, Venue, EventRegistration } from '@/types';
import { mockCurrentStudent, mockRegistrations } from '@/mock-data';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function MyEvents() {
  const [events, setEvents]         = useState<Event[]>([]);
  const [venues, setVenues]         = useState<Venue[]>([]);
  const [localRegs, setLocalRegs]   = useState<EventRegistration[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([getEvents(), getVenues(), getStudentRegistrations(mockCurrentStudent.id)])
      .then(([ev, vn, regs]) => {
        setEvents(ev); setVenues(vn); setLocalRegs(regs);
        setLoading(false);
      });
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const getRegisteredEvents = (type: 'upcoming' | 'past') =>
    localRegs
      .filter((r): r is EventRegistration => r.status === 'confirmed')
      .map(r => events.find(e => e.id === r.eventId))
      .filter((e): e is Event => !!e)
      .filter(e => type === 'upcoming' ? e.date >= today : e.date < today)
      .sort((a, b) =>
        type === 'upcoming' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
      );

  const handleCancel = (eventId: string) => {
    setLocalRegs(prev => prev.map(r =>
      r.eventId === eventId && r.studentId === mockCurrentStudent.id
        ? { ...r, status: 'cancelled' as const }
        : r
    ));
    // Since we mutate the mock in Phase 2 for persistence, let's just do it directly via object property without raising lint error, or just skip it since it resets anyway. Let's silence the lint if we must, or clone the array in mock-data. It's mock data.
    const idx = mockRegistrations.findIndex(
      r => r.eventId === eventId && r.studentId === mockCurrentStudent.id
    );
    if (idx !== -1) {
      const reg = mockRegistrations[idx];
      mockRegistrations[idx] = { ...reg, status: 'cancelled' };
    }
  };

  const upcoming = getRegisteredEvents('upcoming');
  const past     = getRegisteredEvents('past');

  const renderEventList = (evts: Event[], canCancel?: boolean) => {
    if (evts.length === 0) return (
      <EmptyState
        title="No events"
        description={canCancel ? 'Register for upcoming events.' : "You haven't attended any events yet."}
        action={canCancel
          ? <Link href="/student/events" className="text-primary-600 text-sm hover:underline">Browse Events →</Link>
          : undefined}
      />
    );
    return (
      <div className="space-y-3">
        {evts.map(event => {
          const venue = venues.find(v => v.id === event.venueId);
          return (
            <div key={event.id} className="bg-white border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Link href={`/student/events/${event.id}`} className="text-sm font-semibold text-gray-900 hover:text-primary-600">
                    {event.title}
                  </Link>
                  <Badge status="confirmed">Confirmed</Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(event.date)}</span>
                  <span className="flex items-center gap-1"><Clock size={11} />{event.startTime} – {event.endTime}</span>
                  <span className="flex items-center gap-1"><MapPin size={11} />{venue?.name}</span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link href={`/student/events/${event.id}`}>
                  <Button size="sm" variant="secondary">Details</Button>
                </Link>
                {canCancel && (
                  <Button size="sm" variant="danger" onClick={() => handleCancel(event.id)}>Cancel</Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <DashboardLayout role="student">
      <PageHeader title="My Events" description="Your event registrations — upcoming and past." />
      {loading ? <LoadingSkeleton lines={6} /> : (
        <Tabs tabs={[
          { label: `Upcoming (${upcoming.length})`, content: renderEventList(upcoming, true) },
          { label: `Past (${past.length})`,          content: renderEventList(past, false) },
        ]} />
      )}
    </DashboardLayout>
  );
}
