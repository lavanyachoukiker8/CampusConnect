"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import Link from 'next/link';
import { Plus, Edit2, LayoutDashboard } from 'lucide-react';
import { getCurrentCoordinator, getEventsByClub, getVenues } from '@/services/api';
import type { Event, Venue } from '@/types';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function CoordinatorEvents() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);

  useEffect(() => {
    getCurrentCoordinator().then(coord => {
      Promise.all([
        getEventsByClub(coord.clubId),
        getVenues()
      ]).then(([evts, vns]) => {
        // Sort upcoming first, then by date descending
        const sorted = evts.sort((a, b) => {
          const aPast = new Date(a.date) < new Date();
          const bPast = new Date(b.date) < new Date();
          if (aPast === bPast) return b.date.localeCompare(a.date);
          return aPast ? 1 : -1;
        });
        setEvents(sorted);
        setVenues(vns);
        setLoading(false);
      });
    });
  }, []);

  return (
    <DashboardLayout role="coordinator">
      <PageHeader
        title="Event Management"
        description="Create and manage your club's events."
        action={
          <Link href="/coordinator/events/new">
            <Button className="flex items-center gap-2">
              <Plus size={16} /> Create Event
            </Button>
          </Link>
        }
      />

      {loading ? <LoadingSkeleton lines={8} /> : events.length === 0 ? (
        <EmptyState
          title="No events found"
          description="You haven't created any events yet."
          action={
            <Link href="/coordinator/events/new">
              <Button>Create your first event</Button>
            </Link>
          }
        />
      ) : (
        <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">Event</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500 hidden sm:table-cell">Date & Time</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500 hidden md:table-cell">Venue</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map(event => {
                const venue = venues.find(v => v.id === event.venueId);
                const isPast = new Date(event.date) < new Date();
                return (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 min-w-[200px]">
                      <p className="font-semibold text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{event.registeredCount} / {event.totalSeats} registered</p>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell whitespace-nowrap">
                      <p className="text-gray-900">{formatDate(event.date)}</p>
                      <p className="text-xs text-gray-500">{event.startTime} - {event.endTime}</p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <p className="text-gray-900 truncate max-w-[150px]">{venue?.name}</p>
                    </td>
                    <td className="px-4 py-4">
                      <Badge status={event.status as 'open'|'full'|'completed'|'cancelled'|'pending'|'approved'|'rejected'}>
                        {isPast && event.status === 'open' ? 'Completed' : event.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/coordinator/events/${event.id}/edit`}>
                          <Button size="sm" variant="secondary" className="p-2" title="Edit Event" disabled={isPast || event.status === 'cancelled'}>
                            <Edit2 size={16} />
                          </Button>
                        </Link>
                        <Link href={`/coordinator/events/${event.id}`}>
                          <Button size="sm" className="flex items-center gap-1">
                            <LayoutDashboard size={14} /> <span className="hidden sm:inline">Manage</span>
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
