"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import Link from 'next/link';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Building } from 'lucide-react';
import {
  getEventById, getClubById, getVenueById,
  getStudentRegistrations, getEventCategories,
} from '@/services/api';
import type { Event, Club, Venue, EventRegistration, EventCategory } from '@/types';
import { mockCurrentStudent, mockRegistrations } from '@/mock-data';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

type RegState = 'idle' | 'success' | 'duplicate' | 'full' | 'deadline' | 'cancelled_event';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent]         = useState<Event | null>(null);
  const [club, setClub]           = useState<Club | null>(null);
  const [venue, setVenue]         = useState<Venue | null>(null);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [localRegs, setLocalRegs] = useState<EventRegistration[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [regState, setRegState]   = useState<RegState>('idle');

  useEffect(() => {
    getEventById(id).then(ev => {
      if (!ev) { setLoading(false); return; }
      setEvent(ev);
      Promise.all([
        getClubById(ev.clubId),
        getVenueById(ev.venueId),
        getEventCategories(),
        getStudentRegistrations(mockCurrentStudent.id),
      ]).then(([cl, vn, cats, regs]) => {
        setClub(cl ?? null);
        setVenue(vn ?? null);
        setCategories(cats);
        setLocalRegs(regs);
        setLoading(false);
      });
    });
  }, [id]);

  const isRegistered = localRegs.some(r => r.eventId === id && r.status === 'confirmed');
  const today = new Date().toISOString().split('T')[0];

  const handleRegister = () => {
    if (!event) return;
    if (event.status === 'cancelled') { setRegState('cancelled_event'); setShowModal(true); return; }
    if (localRegs.some(r => r.eventId === id && r.status === 'confirmed')) { setRegState('duplicate'); setShowModal(true); return; }
    if (event.registeredCount >= event.totalSeats) { setRegState('full'); setShowModal(true); return; }
    if (today > event.registrationDeadline) { setRegState('deadline'); setShowModal(true); return; }

    const newReg: EventRegistration = {
      id: `reg-new-${id}`,
      eventId: id,
      studentId: mockCurrentStudent.id,
      status: 'confirmed',
      registeredAt: today,
    };
    setLocalRegs(prev => [...prev, newReg]);
    mockRegistrations.push(newReg);
    setEvent(prev => prev ? { ...prev, registeredCount: prev.registeredCount + 1 } : prev);
    setRegState('success');
    setShowModal(true);
  };

  const handleCancel = () => {
    setLocalRegs(prev => prev.map(r =>
      r.eventId === id && r.studentId === mockCurrentStudent.id ? { ...r, status: 'cancelled' as const } : r
    ));
    const idx = mockRegistrations.findIndex(r => r.eventId === id && r.studentId === mockCurrentStudent.id);
    if (idx !== -1) mockRegistrations[idx].status = 'cancelled';
    setEvent(prev => prev ? { ...prev, registeredCount: prev.registeredCount - 1 } : prev);
  };

  const cat       = categories.find(c => c.id === event?.categoryId);
  const seatsLeft = event ? event.totalSeats - event.registeredCount : 0;

  const modalContent = (): { title: string; body: string } => {
    switch (regState) {
      case 'success':         return { title: '🎉 Registered!', body: `You are confirmed for "${event?.title}". See you on ${formatDate(event?.date ?? '')}!` };
      case 'duplicate':       return { title: 'Already Registered', body: 'You are already registered for this event.' };
      case 'full':            return { title: 'Event Full', body: 'Sorry, all seats have been taken for this event.' };
      case 'deadline':        return { title: 'Registration Closed', body: `The registration deadline (${formatDate(event?.registrationDeadline ?? '')}) has passed.` };
      case 'cancelled_event': return { title: 'Event Cancelled', body: 'This event has been cancelled.' };
      default:                return { title: '', body: '' };
    }
  };

  const canRegister = event && event.status === 'open' && seatsLeft > 0 && today <= event.registrationDeadline;

  return (
    <DashboardLayout role="student">
      <Link href="/student/events" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-4">
        <ArrowLeft size={16} /> Back to Events
      </Link>

      {loading || !event ? <LoadingSkeleton lines={10} /> : (
        <>
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge status={event.status === 'open' && seatsLeft === 0 ? 'full' : event.status as 'open' | 'full' | 'cancelled'}>
                {event.status === 'open' && seatsLeft === 0 ? 'Full' : event.status}
              </Badge>
              {cat && <span className="text-sm text-gray-500">{cat.icon} {cat.name}</span>}
              {event.isFeatured && <span className="text-sm text-primary-600 font-medium">⭐ Featured</span>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{event.title}</h1>
            {club && (
              <Link href={`/student/clubs/${club.id}`} className="inline-flex items-center gap-2 text-sm text-primary-600 hover:underline">
                <div className={`w-5 h-5 rounded ${club.color} flex items-center justify-center text-white text-xs font-bold`}>{club.logoInitials}</div>
                {club.name}
              </Link>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <h2 className="font-semibold text-gray-900 mb-2">About this Event</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <dl className="space-y-3 text-sm">
                  <div className="flex gap-2 items-start"><Calendar size={15} className="text-primary-500 mt-0.5 flex-shrink-0" /><div><dt className="text-gray-500">Date</dt><dd className="font-medium text-gray-900">{formatDate(event.date)}</dd></div></div>
                  <div className="flex gap-2 items-start"><Clock size={15} className="text-primary-500 mt-0.5 flex-shrink-0" /><div><dt className="text-gray-500">Time</dt><dd className="font-medium text-gray-900">{event.startTime} – {event.endTime}</dd></div></div>
                  <div className="flex gap-2 items-start"><MapPin size={15} className="text-primary-500 mt-0.5 flex-shrink-0" /><div><dt className="text-gray-500">Venue</dt><dd className="font-medium text-gray-900">{venue?.name}</dd><dd className="text-gray-500 text-xs">{venue?.location}</dd></div></div>
                  <div className="flex gap-2 items-start"><Building size={15} className="text-primary-500 mt-0.5 flex-shrink-0" /><div><dt className="text-gray-500">Capacity</dt><dd className="font-medium text-gray-900">{venue?.capacity}</dd></div></div>
                  <div className="flex gap-2 items-start"><Users size={15} className="text-primary-500 mt-0.5 flex-shrink-0" /><div><dt className="text-gray-500">Seats</dt><dd className="font-medium text-gray-900">{event.registeredCount} / {event.totalSeats}</dd>{seatsLeft > 0 && seatsLeft <= 10 && <dd className="text-orange-600 text-xs font-medium">{seatsLeft} seats left!</dd>}</div></div>
                  <div className="flex gap-2 items-start"><Clock size={15} className="text-primary-500 mt-0.5 flex-shrink-0" /><div><dt className="text-gray-500">Register by</dt><dd className="font-medium text-gray-900">{formatDate(event.registrationDeadline)}</dd></div></div>
                </dl>

                <div className="mt-4 pt-4 border-t">
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{event.registeredCount} registered</span><span>{seatsLeft} left</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (event.registeredCount / event.totalSeats) * 100)}%` }} />
                    </div>
                  </div>

                  {isRegistered ? (
                    <div className="space-y-2">
                      <p className="text-sm text-green-700 font-medium bg-green-50 border border-green-200 rounded-lg p-2 text-center">✓ You are registered</p>
                      {event.date >= today && (
                        <Button variant="danger" className="w-full" onClick={handleCancel}>Cancel Registration</Button>
                      )}
                    </div>
                  ) : canRegister ? (
                    <Button className="w-full" onClick={handleRegister}>Register Now</Button>
                  ) : (
                    <Button className="w-full" disabled onClick={handleRegister}>
                      {event.status === 'cancelled' ? 'Event Cancelled'
                        : event.status === 'completed' ? 'Event Completed'
                        : today > event.registrationDeadline ? 'Registration Closed'
                        : 'No Seats Available'}
                    </Button>
                  )}
                </div>
              </Card>

              {venue?.facilities && venue.facilities.length > 0 && (
                <Card>
                  <h2 className="font-semibold text-gray-900 mb-2 text-sm">Venue Facilities</h2>
                  <div className="flex flex-wrap gap-1">
                    {venue.facilities.map(f => (
                      <span key={f} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{f}</span>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>

          <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={modalContent().title}>
            <p className="text-sm text-gray-600 mb-4">{modalContent().body}</p>
            <Button onClick={() => setShowModal(false)}>Close</Button>
          </Modal>
        </>
      )}
    </DashboardLayout>
  );
}
