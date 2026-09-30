"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { getStudentFeedback, getStudentAttendance, getEvents } from '@/services/api';
import type { Feedback, Attendance, Event } from '@/types';
import { mockCurrentStudent, mockFeedback } from '@/mock-data';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StarRating({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          className={`${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          <Star size={20} className={n <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
        </button>
      ))}
    </div>
  );
}

export default function FeedbackPage() {
  const [feedback, setFeedback]     = useState<Feedback[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [events, setEvents]         = useState<Event[]>([]);
  const [loading, setLoading]       = useState(true);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [rating, setRating]         = useState(5);
  const [comment, setComment]       = useState('');
  const [submitted, setSubmitted]   = useState(false);

  useEffect(() => {
    const sid = mockCurrentStudent.id;
    Promise.all([getStudentFeedback(sid), getStudentAttendance(sid), getEvents()])
      .then(([fb, att, evts]) => {
        setFeedback(fb); setAttendance(att); setEvents(evts);
        setLoading(false);
      });
  }, []);

  const attendedIds    = attendance.filter(a => a.status === 'present').map(a => a.eventId);
  const givenFeedbackIds = feedback.map(f => f.eventId);
  const eligibleEvents = events.filter(e => attendedIds.includes(e.id) && !givenFeedbackIds.includes(e.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) return;
    const newFb: Feedback = {
      id: `fb-new-${Date.now()}`,
      eventId: selectedEventId,
      studentId: mockCurrentStudent.id,
      rating,
      comment,
      submittedAt: new Date().toISOString().split('T')[0],
    };
    setFeedback(prev => [newFb, ...prev]);
    mockFeedback.push(newFb);
    setSelectedEventId('');
    setRating(5);
    setComment('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <DashboardLayout role="student">
      <PageHeader title="Feedback" description="Rate and review events you have attended." />
      {loading ? <LoadingSkeleton lines={6} /> : (
        <div className="space-y-8">
          {eligibleEvents.length > 0 && (
            <div className="bg-white border rounded-xl p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Submit Feedback</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Event</label>
                  <select
                    required
                    value={selectedEventId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedEventId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="">Choose an event…</option>
                    {eligibleEvents.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <StarRating value={rating} onChange={setRating} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                    placeholder="Share your experience…"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <Button type="submit">Submit Feedback</Button>
                {submitted && (
                  <p className="text-sm text-green-600 font-medium">✓ Feedback submitted. Thank you!</p>
                )}
              </form>
            </div>
          )}

          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Your Submitted Feedback</h2>
            {feedback.length === 0 ? (
              <EmptyState title="No feedback yet" description="Attend events and share your thoughts." />
            ) : (
              <div className="space-y-3">
                {feedback.map(fb => {
                  const event = events.find(e => e.id === fb.eventId);
                  return (
                    <div key={fb.id} className="bg-white border rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Link href={`/student/events/${fb.eventId}`} className="text-sm font-semibold text-gray-900 hover:text-primary-600">
                          {event?.title ?? fb.eventId}
                        </Link>
                        <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(fb.submittedAt)}</span>
                      </div>
                      <StarRating value={fb.rating} />
                      {fb.comment && <p className="text-sm text-gray-600 mt-2">{fb.comment}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
