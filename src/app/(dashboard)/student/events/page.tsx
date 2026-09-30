"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import Link from 'next/link';
import { Calendar, MapPin, Users } from 'lucide-react';
import { getEvents, getClubs, getEventCategories, getVenues } from '@/services/api';
import type { Event, Club, EventCategory, Venue } from '@/types';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BrowseEvents() {
  const [events, setEvents]       = useState<Event[]>([]);
  const [clubs, setClubs]         = useState<Club[]>([]);
  const [categories, setCats]     = useState<EventCategory[]>([]);
  const [venues, setVenues]       = useState<Venue[]>([]);
  const [search, setSearch]       = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [clubFilter, setClubFilter] = useState('');
  const [statusFilter, setStatus] = useState('');
  const [dateFrom, setDateFrom]   = useState('');
  const [dateTo, setDateTo]       = useState('');
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([getEvents(), getClubs(), getEventCategories(), getVenues()])
      .then(([ev, cl, cats, vn]) => {
        setEvents(ev); setClubs(cl); setCats(cats); setVenues(vn);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => events.filter(e => {
    const q = search.toLowerCase();
    const matchSearch  = e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q);
    const matchCat     = !catFilter    || e.categoryId === catFilter;
    const matchClub    = !clubFilter   || e.clubId === clubFilter;
    const matchStatus  = !statusFilter || e.status === statusFilter;
    const matchFrom    = !dateFrom     || e.date >= dateFrom;
    const matchTo      = !dateTo       || e.date <= dateTo;
    return matchSearch && matchCat && matchClub && matchStatus && matchFrom && matchTo;
  }).sort((a, b) => b.date.localeCompare(a.date)), [events, search, catFilter, clubFilter, statusFilter, dateFrom, dateTo]);

  return (
    <DashboardLayout role="student">
      <PageHeader title="Browse Events" description="Find and register for upcoming campus events." />

      <div className="bg-white border rounded-xl p-4 mb-6 space-y-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search events..." />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <select value={catFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCatFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
          <select value={clubFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setClubFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
            <option value="">All Clubs</option>
            {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={statusFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="full">Full</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="flex gap-2">
            <input type="date" value={dateFrom} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateFrom(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500" title="From date" />
            <input type="date" value={dateTo} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateTo(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500" title="To date" />
          </div>
        </div>
      </div>

      {loading ? <LoadingSkeleton lines={8} /> : filtered.length === 0 ? (
        <EmptyState title="No events found" description="Try adjusting your filters." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(event => {
            const club  = clubs.find(c => c.id === event.clubId);
            const venue = venues.find(v => v.id === event.venueId);
            const today = new Date().toISOString().split('T')[0];
            const seats = event.totalSeats - event.registeredCount;
            return (
              <Link key={event.id} href={`/student/events/${event.id}`}
                className={`bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col ${event.status === 'cancelled' ? 'opacity-60' : ''}`}
              >
                {event.isFeatured && (
                  <div className="bg-primary-600 text-white text-xs font-medium px-3 py-1">⭐ Featured</div>
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug">{event.title}</h3>
                    <Badge status={event.status === 'open' && seats === 0 ? 'full' : event.status as 'open' | 'full' | 'cancelled'}>
                      {event.status === 'open' && seats === 0 ? 'Full' : event.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 flex-1 mb-3">{event.description}</p>
                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1"><Calendar size={12} />{formatDate(event.date)} · {event.startTime}</div>
                    <div className="flex items-center gap-1"><MapPin size={12} />{venue?.name}</div>
                    <div className="flex items-center gap-1"><Users size={12} />
                      {event.status === 'open'
                        ? <span className={seats <= 10 ? 'text-orange-600 font-medium' : ''}>{seats} seats left</span>
                        : <span>{event.registeredCount} registered</span>}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t flex items-center gap-2">
                    <div className={`w-5 h-5 rounded ${club?.color ?? 'bg-gray-400'} flex items-center justify-center text-white text-xs font-bold`}>
                      {club?.logoInitials}
                    </div>
                    <span className="text-xs text-gray-500 truncate">{club?.name}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
