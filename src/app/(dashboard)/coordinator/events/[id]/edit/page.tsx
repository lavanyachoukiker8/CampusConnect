"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {
  getEventById, getEventCategories, getVenues, getEvents
} from '@/services/api';
import type { EventCategory, Venue, Event } from '@/types';

export default function EditEvent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  
  const [form, setForm] = useState({
    title: '', description: '', categoryId: '', venueId: '',
    date: '', startTime: '', endTime: '', totalSeats: ''
  });
  
  const [error, setError] = useState('');
  const [conflict, setConflict] = useState<Event | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    Promise.all([
      getEventById(id),
      getEventCategories(),
      getVenues(),
      getEvents()
    ]).then(([evt, cats, vns, evts]) => {
      if (evt) {
        setEvent(evt);
        setForm({
          title: evt.title, description: evt.description,
          categoryId: evt.categoryId, venueId: evt.venueId,
          date: evt.date, startTime: evt.startTime, endTime: evt.endTime,
          totalSeats: String(evt.totalSeats)
        });
      }
      setCategories(cats);
      setVenues(vns);
      setAllEvents(evts);
    });
  }, [id]);

  const handleChange = (field: string, val: string) => {
    setForm(prev => ({ ...prev, [field]: val }));
    setError('');
    setConflict(null);
  };

  const checkConflict = () => {
    if (!form.date || !form.startTime || !form.endTime || !form.venueId) return null;
    const conf = allEvents.find(e => 
      e.id !== id && // skip self
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
    setError(''); setConflict(null);

    if (form.startTime >= form.endTime) { setError('End time must be after start time.'); return; }
    if (Number(form.totalSeats) <= 0) { setError('Total seats must be greater than 0.'); return; }

    const conf = checkConflict();
    if (conf) { setConflict(conf); return; }

    if (event) {
      Object.assign(event, form, { totalSeats: Number(form.totalSeats) });
      router.push('/coordinator/events');
    }
  };

  const handleCancelEvent = () => {
    if (event) {
      event.status = 'cancelled';
      router.push('/coordinator/events');
    }
  };

  if (!event) return null;

  return (
    <DashboardLayout role="coordinator">
      <Link href="/coordinator/events" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-4">
        <ArrowLeft size={16} /> Back to Events
      </Link>
      
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <PageHeader title="Edit Event" description="Update details for your event." />
        <Button variant="danger" onClick={() => setShowCancelModal(true)}>Cancel Event</Button>
      </div>
      
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Event Title">
            <Input required value={form.title} onChange={e => handleChange('title', e.target.value)} />
          </FormField>
          
          <FormField label="Description">
            <Textarea required rows={3} value={form.description} onChange={e => handleChange('description', e.target.value)} />
          </FormField>

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Category">
              <Select required value={form.categoryId} onChange={e => handleChange('categoryId', e.target.value)}>
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
                  {venues.map(v => <option key={v.id} value={v.id}>{v.name} ({v.capacity})</option>)}
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

          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm"><AlertCircle size={16} /> {error}</div>}
          {conflict && (
            <div className="p-4 bg-orange-50 text-orange-800 rounded-lg">
              <div className="flex items-center gap-2 font-medium mb-1"><AlertCircle size={18} /> Venue Conflict Detected</div>
              <p className="text-sm ml-7">Already booked for "{conflict.title}" from {conflict.startTime} to {conflict.endTime}.</p>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <Button type="submit">Save Changes</Button>
            <Link href="/coordinator/events"><Button type="button" variant="secondary">Discard</Button></Link>
          </div>
        </form>
      </Card>

      <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} title="Cancel Event?">
        <p className="text-sm text-gray-600 mb-4">Are you sure you want to cancel this event? This action cannot be undone and will notify all registered students.</p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={handleCancelEvent}>Yes, Cancel Event</Button>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>No, Keep It</Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
