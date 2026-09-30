"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import Link from 'next/link';
import { Users, Calendar, Mail, BookOpen, ArrowLeft } from 'lucide-react';
import {
  getClubById, getClubCategories, getEventsByClub,
  getStudentMemberships, getStudentApplications,
} from '@/services/api';
import type { Club, ClubCategory, Event, ClubMembership, MembershipApplication } from '@/types';
import { mockCurrentStudent, mockApplications } from '@/mock-data';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ClubDetail() {
  const { id } = useParams<{ id: string }>();
  const [club, setClub] = useState<Club | null>(null);
  const [categories, setCategories] = useState<ClubCategory[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [memberships, setMemberships] = useState<ClubMembership[]>([]);
  const [localApps, setLocalApps] = useState<MembershipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    Promise.all([
      getClubById(id), getClubCategories(), getEventsByClub(id),
      getStudentMemberships(mockCurrentStudent.id),
      getStudentApplications(mockCurrentStudent.id),
    ]).then(([cl, cats, evts, mem, app]) => {
      setClub(cl ?? null);
      setCategories(cats);
      setEvents(evts);
      setMemberships(mem);
      setLocalApps(app);
      setLoading(false);
    });
  }, [id]);

  const isMember = memberships.some(m => m.clubId === id);
  const existingApp = localApps.find(a => a.clubId === id);
  const today = new Date().toISOString().split('T')[0];
  const upcomingEvents = events.filter(e => e.date >= today && e.status !== 'cancelled');
  const cat = categories.find(c => c.id === club?.categoryId);

  const handleRequest = () => {
    const newApp: MembershipApplication = {
      id: `app-new-${id}`,
      studentId: mockCurrentStudent.id,
      clubId: id,
      status: 'pending',
      appliedAt: today,
      note,
    };
    setLocalApps(prev => [...prev, newApp]);
    mockApplications.push(newApp);
    setShowModal(false);
    setNote('');
  };

  const membershipBadge = () => {
    if (isMember) return <Badge status="approved">You are a member</Badge>;
    if (!existingApp) return null;
    if (existingApp.status === 'pending')  return <Badge status="pending">Request Pending</Badge>;
    if (existingApp.status === 'rejected') return <Badge status="rejected">Request Rejected</Badge>;
    return <Badge status="approved">Approved</Badge>;
  };

  return (
    <DashboardLayout role="student">
      <Link href="/student/clubs" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-4">
        <ArrowLeft size={16} /> Back to Clubs
      </Link>

      {loading || !club ? <LoadingSkeleton lines={8} /> : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl ${club.color} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>
                {club.logoInitials}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{club.name}</h1>
                <p className="text-sm text-gray-500">{cat?.icon} {cat?.name} · Founded {club.foundedYear}</p>
                <div className="mt-1">{membershipBadge()}</div>
              </div>
            </div>
            {!isMember && !existingApp && (
              <Button onClick={() => setShowModal(true)}>Request Membership</Button>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <h2 className="font-semibold text-gray-900 mb-2">About</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{club.description}</p>
              </Card>

              <Card className="p-0 overflow-hidden">
                <div className="px-4 py-3 border-b">
                  <h2 className="font-semibold text-gray-900">Upcoming Events</h2>
                </div>
                {upcomingEvents.length === 0 ? (
                  <div className="p-4">
                    <EmptyState title="No upcoming events" description="Check back later." />
                  </div>
                ) : (
                  <div className="divide-y">
                    {upcomingEvents.map(e => (
                      <Link key={e.id} href={`/student/events/${e.id}`} className="flex items-center gap-3 p-4 hover:bg-gray-50">
                        <Calendar size={16} className="text-primary-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{e.title}</p>
                          <p className="text-xs text-gray-500">{formatDate(e.date)} · {e.startTime}</p>
                        </div>
                        <Badge status={e.status === 'full' ? 'full' : 'open'}>{e.status}</Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <h2 className="font-semibold text-gray-900 mb-3">Club Details</h2>
                <dl className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <Users size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div><dt className="text-gray-500">Members</dt><dd className="font-medium text-gray-900">{club.memberCount}</dd></div>
                  </div>
                  <div className="flex gap-2">
                    <BookOpen size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div><dt className="text-gray-500">Faculty Advisor</dt><dd className="font-medium text-gray-900">{club.facultyAdvisor}</dd></div>
                  </div>
                  <div className="flex gap-2">
                    <Mail size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <dt className="text-gray-500">Coordinator</dt>
                      <dd className="font-medium text-gray-900">{club.coordinatorName}</dd>
                      <dd className="text-primary-600 text-xs">{club.coordinatorEmail}</dd>
                    </div>
                  </div>
                </dl>
              </Card>
              {club.requiresApplication && (
                <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg text-sm text-orange-700">
                  ℹ️ This club requires an application note when requesting membership.
                </div>
              )}
            </div>
          </div>

          <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Request to join ${club.name}`}>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Your request will be reviewed by the club coordinator.</p>
              {club.requiresApplication && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Note *</label>
                  <textarea
                    rows={4}
                    value={note}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
                    placeholder="Tell the coordinator why you want to join..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}
              <div className="flex gap-3">
                <Button onClick={handleRequest} disabled={club.requiresApplication && !note.trim()}>
                  Send Request
                </Button>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </DashboardLayout>
  );
}
