"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { SearchBar } from '@/components/ui/SearchBar';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowLeft, Check, X, Star, Users, ClipboardList, Shield } from 'lucide-react';
import Link from 'next/link';
import {
  getEventById, getEventRegistrations, getEventAttendance, getEventFeedback
} from '@/services/api';
import type { Event, EventRegistration, Attendance, Feedback, Volunteer } from '@/types';
import { mockCurrentStudent } from '@/mock-data';

export default function EventDashboard() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  
  // Search states
  const [regSearch, setRegSearch] = useState('');
  
  useEffect(() => {
    Promise.all([
      getEventById(id),
      getEventRegistrations(id),
      getEventAttendance(id),
      getEventFeedback(id)
    ]).then(([evt, regs, atts, fbs]) => {
      setEvent(evt ?? null);
      setRegistrations(regs);
      setAttendance(atts);
      setFeedback(fbs);
      setLoading(false);
    });
  }, [id]);

  // Registrations Handlers
  const handleRegStatus = (regId: string, status: 'confirmed' | 'cancelled') => {
    setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status } : r));
  };

  const filteredRegs = registrations.filter(r => 
    r.studentId.toLowerCase().includes(regSearch.toLowerCase()) ||
    (r.studentId === mockCurrentStudent.id && mockCurrentStudent.name.toLowerCase().includes(regSearch.toLowerCase()))
  );

  // Attendance Handlers
  const handleMarkAttendance = (studentId: string, status: 'present' | 'absent') => {
    setAttendance(prev => {
      const existing = prev.find(a => a.studentId === studentId);
      if (existing) {
        return prev.map(a => a.studentId === studentId ? { ...a, status } : a);
      } else {
        return [...prev, {
          id: `att-new-${Date.now()}`,
          eventId: id,
          studentId,
          status,
          markedAt: new Date().toISOString()
        }];
      }
    });
  };

  // Volunteer Handlers
  const handleAssignVolunteer = (studentId: string) => {
    if (volunteers.some(v => v.studentId === studentId)) return;
    setVolunteers(prev => [...prev, {
      id: `vol-new-${Date.now()}`,
      eventId: id,
      studentId,
      role: 'event_staff',
      assignedAt: new Date().toISOString()
    }]);
  };

  const handleRemoveVolunteer = (volId: string) => {
    setVolunteers(prev => prev.filter(v => v.id !== volId));
  };

  if (loading || !event) {
    return (
      <DashboardLayout role="coordinator">
        <PageHeader title="Event Dashboard" description="Loading..." />
        <LoadingSkeleton lines={8} />
      </DashboardLayout>
    );
  }

  // Calculate Statistics
  const confirmedRegs = registrations.filter(r => r.status === 'confirmed').length;
  const presentCount = attendance.filter(a => a.status === 'present').length;
  const attendancePct = confirmedRegs > 0 ? Math.round((presentCount / confirmedRegs) * 100) : 0;
  
  const avgRating = feedback.length > 0 
    ? Number((feedback.reduce((acc, f) => acc + f.rating, 0) / feedback.length).toFixed(1)) 
    : 0;

  const ratingDist = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: feedback.filter(f => f.rating === stars).length
  }));

  return (
    <DashboardLayout role="coordinator">
      <Link href="/coordinator/events" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-4">
        <ArrowLeft size={16} /> Back to Events
      </Link>
      
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
            <Badge status={event.status as any}>{event.status}</Badge>
          </div>
          <p className="text-gray-500 text-sm">Event Dashboard & Management</p>
        </div>
        <Link href={`/coordinator/events/${event.id}/edit`}>
          <Button variant="secondary">Edit Details</Button>
        </Link>
      </div>

      <Tabs tabs={[
        {
          label: 'Statistics',
          content: (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card className="flex flex-col items-center justify-center py-6">
                  <ClipboardList size={32} className="text-primary-500 mb-2" />
                  <p className="text-3xl font-bold text-gray-900">{confirmedRegs}</p>
                  <p className="text-sm text-gray-500 mt-1">Confirmed Registrations</p>
                </Card>
                <Card className="flex flex-col items-center justify-center py-6">
                  <Users size={32} className="text-green-500 mb-2" />
                  <p className="text-3xl font-bold text-gray-900">{attendancePct}%</p>
                  <p className="text-sm text-gray-500 mt-1">Attendance Rate</p>
                </Card>
                <Card className="flex flex-col items-center justify-center py-6">
                  <Star size={32} className="text-yellow-400 mb-2 fill-yellow-400" />
                  <p className="text-3xl font-bold text-gray-900">{avgRating} / 5</p>
                  <p className="text-sm text-gray-500 mt-1">Average Feedback</p>
                </Card>
              </div>

              {/* Pure Tailwind Feedback Chart */}
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">Feedback Distribution</h3>
                {feedback.length === 0 ? (
                  <EmptyState title="No feedback yet" description="Feedback will appear after the event." />
                ) : (
                  <div className="space-y-2 max-w-md">
                    {ratingDist.map(dist => (
                      <div key={dist.stars} className="flex items-center gap-3">
                        <span className="w-12 text-sm text-gray-600">{dist.stars} Stars</span>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-400 rounded-full"
                            style={{ width: `${(dist.count / feedback.length) * 100}%` }}
                          />
                        </div>
                        <span className="w-8 text-sm text-right text-gray-500">{dist.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )
        },
        {
          label: `Registrations (${registrations.length})`,
          content: (
            <div className="space-y-4">
              <div className="max-w-md">
                <SearchBar value={regSearch} onChange={setRegSearch} placeholder="Search students..." />
              </div>
              <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500">Student</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500">Date Registered</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500">Status</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRegs.map(reg => (
                      <tr key={reg.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {reg.studentId === mockCurrentStudent.id ? mockCurrentStudent.name : reg.studentId}
                        </td>
                        <td className="px-4 py-3 text-gray-500">{new Date(reg.registeredAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <Badge status={reg.status as 'confirmed'|'cancelled'}>{reg.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {reg.status === 'confirmed' ? (
                            <Button size="sm" variant="danger" onClick={() => handleRegStatus(reg.id, 'cancelled')}>Cancel</Button>
                          ) : (
                            <Button size="sm" variant="secondary" onClick={() => handleRegStatus(reg.id, 'confirmed')}>Restore</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        },
        {
          label: 'Attendance',
          content: (
            <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500">Student (Confirmed Only)</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500">Status</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-500">Mark Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {registrations.filter(r => r.status === 'confirmed').map(reg => {
                    const att = attendance.find(a => a.studentId === reg.studentId);
                    return (
                      <tr key={reg.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {reg.studentId === mockCurrentStudent.id ? mockCurrentStudent.name : reg.studentId}
                        </td>
                        <td className="px-4 py-3">
                          {att ? (
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${att.status === 'present' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                              {att.status === 'present' ? <Check size={12} /> : <X size={12} />}
                              {att.status === 'present' ? 'Present' : 'Absent'}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleMarkAttendance(reg.studentId, 'present')}>Present</Button>
                          <Button size="sm" variant="danger" onClick={() => handleMarkAttendance(reg.studentId, 'absent')}>Absent</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        },
        {
          label: 'Volunteers',
          content: (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">Assigned Volunteers</h3>
                {volunteers.length === 0 ? (
                  <EmptyState title="No volunteers" description="Assign students to help out." />
                ) : (
                  <div className="space-y-3">
                    {volunteers.map(vol => (
                      <div key={vol.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <Shield size={16} className="text-primary-600" />
                          <span className="font-medium text-sm text-gray-900">
                            {vol.studentId === mockCurrentStudent.id ? mockCurrentStudent.name : vol.studentId}
                          </span>
                        </div>
                        <Button size="sm" variant="danger" onClick={() => handleRemoveVolunteer(vol.id)}>Remove</Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">Assign from Registrations</h3>
                <div className="space-y-2">
                  {registrations.filter(r => r.status === 'confirmed').map(reg => {
                    const isVol = volunteers.some(v => v.studentId === reg.studentId);
                    if (isVol) return null;
                    return (
                      <div key={reg.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <span className="text-sm text-gray-900">
                          {reg.studentId === mockCurrentStudent.id ? mockCurrentStudent.name : reg.studentId}
                        </span>
                        <Button size="sm" variant="secondary" onClick={() => handleAssignVolunteer(reg.studentId)}>Assign</Button>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )
        },
        {
          label: 'Feedback',
          content: (
            <div className="space-y-4">
              {feedback.length === 0 ? (
                <EmptyState title="No feedback yet" description="Wait for attendees to submit their reviews." />
              ) : (
                feedback.map(fb => (
                  <Card key={fb.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-gray-900">
                        {fb.studentId === mockCurrentStudent.id ? mockCurrentStudent.name : fb.studentId}
                      </span>
                      <span className="text-xs text-gray-400">{new Date(fb.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map(n => (
                        <Star key={n} size={14} className={n <= fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">{fb.comment}</p>
                  </Card>
                ))
              )}
            </div>
          )
        }
      ]} />
    </DashboardLayout>
  );
}
