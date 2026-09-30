"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {
  getCurrentCoordinator, getEventCategories, getVenues, getEvents
} from '@/services/api';
import type { EventCategory, Venue, Event } from '@/types';
import { mockEvents } from '@/mock-data';

export default function CreateEvent() {
  const router = useRouter();
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [clubId, setClubId] = useState('');
  
  const [form, setForm] = useState({
    title: '', description: '', categoryId: '', venueId: '',
    date: '', startTime: '', endTime: '', totalSeats: '100'
  });
  
  const [error, setError] = useState('');
  const [conflict, setConflict] = useState<Event | null>(null);

  useEffect(() => {
    Promise.all([
      getCurrentCoordinator(),
      getEventCategories(),
      getVenues(),
      getEvents()
    ]).then(([coord, cats, vns, evts]) => {
      setClubId(coord.clubId);
      setCategories(cats);
      setVenues(vns);
      setAllEvents(evts);
    });
  }, []);

  const handleChange = (field: string, val: string) => {
    setForm(prev => ({ ...prev, [field]: val }));
    setError('');
    setConflict(null);
  };

  const checkConflict = () => {
    if (!form.date || !form.startTime || !form.endTime || !form.venueId) return null;
    
    // Rule: existing.start < new.end AND existing.end > new.start
    // Since times are strings like "14:00", standard string comparison works.
    const conf = allEvents.find(e => 
      e.venueId === form.venueId && 
      e.date === form.date &&
      e.status !== 'cancelled' &&
      e.startTime < form.endTime &&
      e.endTime > form.startTime
    );
    return conf || null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setConflict(null);

    // Validation
    if (form.startTime >= form.endTime) {
      setError('End time must be after start time.');
      return;
    }
    if (Number(form.totalSeats) <= 0) {
      setError('Total seats must be greater than 0.');
      return;
    }

    // Venue conflict check
    const conf = checkConflict();
    if (conf) {
      setConflict(conf);
      return;
    }

    // Success -> Mutate mock array so it persists in the session
    const newEvent: Event = {
      id: `evt-new-${Date.now()}`,
      title: form.title,
      description: form.description,
      clubId,
      categoryId: form.categoryId,
      venueId: form.venueId,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      totalSeats: Number(form.totalSeats),
      registeredCount: 0,
      registrationDeadline: form.date, // defaults to event date
      status: 'pending', // Per instructions: "appears as pending admin approval"
      isFeatured: false
    };

    mockEvents.push(newEvent);
    router.push('/coordinator/events');
  };

  return (
    <DashboardLayout role="coordinator">
      <Link href="/coordinator/events" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-4">
        <ArrowLeft size={16} /> Back to Events
      </Link>
      
      <PageHeader title="Create Event" description="Propose a new event for admin approval." />
      
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Event Title">
            <Input required value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="e.g., Intro to Machine Learning" />
          </FormField>
          
          <FormField label="Description">
            <Textarea required rows={3} value={form.description} onChange={e => handleChange('description', e.target.value)} />
          </FormField>

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Category">
              <Select required value={form.categoryId} onChange={e => handleChange('categoryId', e.target.value)}>
                <option value="">Select a category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </FormField>
            
            <FormField label="Total Seats">
              <Input type="number" min="1" required value={form.totalSeats} onChange={e => handleChange('totalSeats', e.target.value)} />
            </FormField>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Time & Location</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Date">
                <Input type="date" required value={form.date} onChange={e => handleChange('date', e.target.value)} />
              </FormField>
              <FormField label="Venue">
                <Select required value={form.venueId} onChange={e => handleChange('venueId', e.target.value)}>
                  <option value="">Select a venue</option>
                  {venues.map(v => <option key={v.id} value={v.id}>{v.name} (Capacity: {v.capacity})</option>)}
                </Select>
              </FormField>
              <FormField label="Start Time">
                <Input type="time" required value={form.startTime} onChange={e => handleChange('startTime', e.target.value)} />
              </FormField>
              <FormField label="End Time">
                <Input type="time" required value={form.endTime} onChange={e => handleChange('endTime', e.target.value)} />
              </FormField>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm border border-red-100">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {conflict && (
            <div className="p-4 bg-orange-50 text-orange-800 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 font-medium mb-1">
                <AlertCircle size={18} className="text-orange-600" />
                Venue Conflict Detected
              </div>
              <p className="text-sm ml-7">
                The venue is already booked for "<strong>{conflict.title}</strong>" from {conflict.startTime} to {conflict.endTime} on this date. Please choose a different time or venue.
              </p>
            </div>
          )}

          <div className="pt-4">
            <Button type="submit" className="w-full sm:w-auto">Submit for Approval</Button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
}
