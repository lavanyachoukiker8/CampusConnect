"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { MapPin, Users, Edit2, Plus } from 'lucide-react';
import { getVenues, getEvents } from '@/services/api';
import type { Venue, Event } from '@/types';

export default function AdminVenues() {
  const [loading, setLoading] = useState(true);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [currentVenue, setCurrentVenue] = useState<Venue>({ id: '', name: '', capacity: 0, location: '', facilities: [] });

  useEffect(() => {
    Promise.all([getVenues(), getEvents()]).then(([vn, ev]) => {
      setVenues(vn); setEvents(ev); setLoading(false);
    });
  }, []);

  const openModal = (venue?: Venue) => {
    if (venue) {
      setCurrentVenue(venue);
      setModalMode('edit');
    } else {
      setCurrentVenue({ id: `v-${Date.now()}`, name: '', capacity: 100, location: '', facilities: [] });
      setModalMode('add');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      setVenues([...venues, currentVenue]);
    } else {
      setVenues(prev => prev.map(v => v.id === currentVenue.id ? currentVenue : v));
    }
    setModalMode(null);
  };

  // Utilization: just count events per venue
  const getUtilization = (venueId: string) => events.filter(e => e.venueId === venueId).length;

  return (
    <DashboardLayout role="admin">
      <PageHeader 
        title="Venues" 
        description="Manage campus venues and track utilization." 
        action={
          <Button className="flex items-center gap-2" onClick={() => openModal()}>
            <Plus size={16} /> Add Venue
          </Button>
        }
      />

      {loading ? <LoadingSkeleton lines={8} /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {venues.map(venue => (
            <div key={venue.id} className="bg-white border rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{venue.name}</h3>
                  <Button size="sm" variant="secondary" className="p-2" onClick={() => openModal(venue)}>
                    <Edit2 size={14} />
                  </Button>
                </div>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p className="flex items-center gap-2"><MapPin size={16} className="text-gray-400" /> {venue.location}</p>
                  <p className="flex items-center gap-2"><Users size={16} className="text-gray-400" /> Capacity: {venue.capacity}</p>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {venue.facilities.map(f => (
                    <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{f}</span>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t text-sm font-medium text-gray-900 flex justify-between">
                <span>Total Events Hosted</span>
                <span className="text-primary-600">{getUtilization(venue.id)} events</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!modalMode} onClose={() => setModalMode(null)} title={modalMode === 'add' ? 'Add Venue' : 'Edit Venue'}>
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Venue Name">
            <Input required value={currentVenue.name} onChange={e => setCurrentVenue({...currentVenue, name: e.target.value})} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Capacity">
              <Input type="number" required min="1" value={currentVenue.capacity} onChange={e => setCurrentVenue({...currentVenue, capacity: Number(e.target.value)})} />
            </FormField>
            <FormField label="Location">
              <Input required value={currentVenue.location} onChange={e => setCurrentVenue({...currentVenue, location: e.target.value})} />
            </FormField>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setModalMode(null)}>Cancel</Button>
            <Button type="submit">Save Venue</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
