"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Modal } from '@/components/ui/Modal';
import { AlertCircle } from 'lucide-react';
import { getEvents, getClubs, getVenues } from '@/services/api';
import type { Event, Club, Venue } from '@/types';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminEvents() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    Promise.all([getEvents(), getClubs(), getVenues()]).then(([ev, cl, vn]) => {
      // Ensure there is at least one 'pending' event for the mockup
      const mockEv = ev.map((e, i) => i === 0 ? { ...e, status: 'pending' as const } : e);
      setEvents(mockEv);
      setClubs(cl);
      setVenues(vn);
      setLoading(false);
    });
  }, []);

  const handleStatus = (eventId: string, status: 'open' | 'rejected' | 'cancelled') => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status } : e));
  };

  const filtered = useMemo(() => 
    events.filter(e => !statusFilter || e.status === statusFilter),
    [events, statusFilter]
  );

  // Simple venue conflict check logic
  const getConflict = (event: Event) => {
    if (event.status === 'cancelled' || event.status === 'rejected') return null;
    return events.find(e => 
      e.id !== event.id &&
      e.venueId === event.venueId && 
      e.date === event.date &&
      e.status !== 'cancelled' &&
      e.status !== 'rejected' &&
      e.startTime < event.endTime &&
      e.endTime > event.startTime
    );
  };

  return (
    <DashboardLayout role="admin">
      <PageHeader title="Events" description="Review and manage all system events." />

      <div className="mb-6 max-w-xs">
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending Approval</option>
          <option value="open">Open</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </div>

      {loading ? <LoadingSkeleton lines={8} /> : (
        <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">Event</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500 hidden md:table-cell">Club</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">Date / Venue</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(event => {
                const club = clubs.find(c => c.id === event.clubId);
                const venue = venues.find(v => v.id === event.venueId);
                const conflict = getConflict(event);
                
                return (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{event.title}</p>
                      {conflict && (
                        <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                          <AlertCircle size={12} /> Conflict with {conflict.title}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-900 hidden md:table-cell">{club?.name}</td>
                    <td className="px-4 py-3 text-gray-500">
                      <p className="text-gray-900">{formatDate(event.date)}</p>
                      <p className="text-xs">{event.startTime} - {event.endTime} @ {venue?.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={event.status as any}>{event.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      {event.status === 'pending' && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleStatus(event.id, 'open')}>Approve</Button>
                          <Button size="sm" variant="danger" onClick={() => handleStatus(event.id, 'rejected')}>Reject</Button>
                        </>
                      )}
                      <Button size="sm" variant="secondary" onClick={() => setSelectedEvent(event)}>View</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="Event Details">
        {selectedEvent && (
          <div className="space-y-4 text-sm">
            <h3 className="text-lg font-bold text-gray-900">{selectedEvent.title}</h3>
            <p className="text-gray-600">{selectedEvent.description}</p>
            
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-gray-500 text-xs uppercase mb-1">Schedule</p>
                <p className="font-medium text-gray-900">{formatDate(selectedEvent.date)}</p>
                <p className="text-gray-600">{selectedEvent.startTime} - {selectedEvent.endTime}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase mb-1">Registration</p>
                <p className="font-medium text-gray-900">{selectedEvent.registeredCount} / {selectedEvent.totalSeats} full</p>
                <p className="text-gray-600">Deadline: {formatDate(selectedEvent.registrationDeadline)}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t">
              {selectedEvent.status === 'open' && (
                <Button variant="danger" onClick={() => { handleStatus(selectedEvent.id, 'cancelled'); setSelectedEvent(null); }}>
                  Cancel Event
                </Button>
              )}
              <Button onClick={() => setSelectedEvent(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
