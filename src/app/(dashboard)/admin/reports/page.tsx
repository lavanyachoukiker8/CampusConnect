"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Download } from 'lucide-react';
import { getClubs, getEvents, getAllRegistrations } from '@/services/api';
import type { Club, Event, EventRegistration } from '@/types';

type ReportType = 'club-events' | 'venue-utilization' | 'registration-stats';

export default function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [regs, setRegs] = useState<EventRegistration[]>([]);
  const [reportType, setReportType] = useState<ReportType>('club-events');

  useEffect(() => {
    Promise.all([getClubs(), getEvents(), getAllRegistrations()]).then(([cl, ev, rg]) => {
      setClubs(cl); setEvents(ev); setRegs(rg); setLoading(false);
    });
  }, []);

  const handleExport = () => {
    alert(`Downloading ${reportType}.pdf...\n(Mock Export)`);
  };

  const renderReport = () => {
    if (reportType === 'club-events') {
      const data = clubs.map(c => ({
        name: c.name,
        count: events.filter(e => e.clubId === c.id).length
      })).sort((a, b) => b.count - a.count);
      const max = Math.max(...data.map(d => d.count), 1);

      return (
        <div className="space-y-8">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Club-wise Event Count</h3>
            <div className="space-y-3">
              {data.map(d => (
                <div key={d.name} className="flex items-center gap-4">
                  <span className="w-32 text-sm text-gray-700 truncate">{d.name}</span>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(d.count / max) * 100}%` }} />
                  </div>
                  <span className="w-8 text-sm font-medium text-gray-900 text-right">{d.count}</span>
                </div>
              ))}
            </div>
          </Card>
          <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="w-full text-sm"><thead className="bg-gray-50 border-b"><tr><th className="px-4 py-3 text-left">Club</th><th className="px-4 py-3 text-right">Total Events</th></tr></thead>
            <tbody className="divide-y">{data.map(d => <tr key={d.name}><td className="px-4 py-3">{d.name}</td><td className="px-4 py-3 text-right">{d.count}</td></tr>)}</tbody></table>
          </div>
        </div>
      );
    }
    
    if (reportType === 'venue-utilization') {
      // Mock data processing for venue
      const venues = Array.from(new Set(events.map(e => e.venueId)));
      const data = venues.map(vId => ({
        name: vId,
        count: events.filter(e => e.venueId === vId).length
      }));
      const max = Math.max(...data.map(d => d.count), 1);

      return (
        <div className="space-y-8">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Venue Utilization (Event Count)</h3>
            <div className="space-y-3">
              {data.map(d => (
                <div key={d.name} className="flex items-center gap-4">
                  <span className="w-32 text-sm text-gray-700 truncate">{d.name}</span>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${(d.count / max) * 100}%` }} />
                  </div>
                  <span className="w-8 text-sm font-medium text-gray-900 text-right">{d.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      );
    }

    if (reportType === 'registration-stats') {
      const data = events.map(e => ({
        title: e.title,
        confirmed: regs.filter(r => r.eventId === e.id && r.status === 'confirmed').length,
        cancelled: regs.filter(r => r.eventId === e.id && r.status === 'cancelled').length
      })).slice(0, 10); // top 10 events

      return (
        <div className="space-y-8">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Registration Stats (Recent Events)</h3>
            <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr><th className="px-4 py-3 text-left">Event</th><th className="px-4 py-3 text-right">Confirmed</th><th className="px-4 py-3 text-right">Cancelled</th></tr>
                </thead>
                <tbody className="divide-y">
                  {data.map(d => (
                    <tr key={d.title}>
                      <td className="px-4 py-3 truncate max-w-[200px]">{d.title}</td>
                      <td className="px-4 py-3 text-right text-green-600 font-medium">{d.confirmed}</td>
                      <td className="px-4 py-3 text-right text-red-500">{d.cancelled}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      );
    }
  };

  return (
    <DashboardLayout role="admin">
      <PageHeader 
        title="Reports & Statistics" 
        description="Generate system-wide analytics." 
        action={
          <Button className="flex items-center gap-2" onClick={handleExport}>
            <Download size={16} /> Export PDF
          </Button>
        }
      />

      <div className="mb-6 max-w-sm">
        <Select value={reportType} onChange={e => setReportType(e.target.value as ReportType)}>
          <option value="club-events">Club-wise Event Count</option>
          <option value="venue-utilization">Venue Utilization</option>
          <option value="registration-stats">Event Registration Stats</option>
        </Select>
      </div>

      {loading ? <LoadingSkeleton lines={8} /> : renderReport()}
    </DashboardLayout>
  );
}
