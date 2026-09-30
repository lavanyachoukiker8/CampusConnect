"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Award, Download } from 'lucide-react';
import { getStudentCertificates, getEvents } from '@/services/api';
import type { Certificate, Event } from '@/types';
import { mockCurrentStudent } from '@/mock-data';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

const certTypeColors: Record<string, string> = {
  participation: 'bg-blue-100 text-blue-700',
  volunteer:     'bg-green-100 text-green-700',
  winner:        'bg-yellow-100 text-yellow-800',
};

export default function CertificatesPage() {
  const [certs, setCerts]   = useState<Certificate[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStudentCertificates(mockCurrentStudent.id), getEvents()])
      .then(([c, e]) => { setCerts(c); setEvents(e); setLoading(false); });
  }, []);

  const handleDownload = (cert: Certificate, event: Event | undefined) => {
    alert(
      `📜 Certificate Download (Mock)\n\nType: ${cert.type.charAt(0).toUpperCase() + cert.type.slice(1)}\nEvent: ${event?.title}\nIssued: ${formatDate(cert.issuedAt)}\nStudent: ${mockCurrentStudent.name}\n\nIn production, this would download a real PDF.`
    );
  };

  return (
    <DashboardLayout role="student">
      <PageHeader
        title="My Certificates"
        description="Download certificates for events you participated in."
      />
      {loading ? <LoadingSkeleton lines={6} /> : certs.length === 0 ? (
        <EmptyState
          title="No certificates yet"
          description="Attend events to earn participation and volunteer certificates."
          action={<Link href="/student/events" className="text-primary-600 text-sm hover:underline">Browse Events →</Link>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map(cert => {
            const event = events.find(e => e.id === cert.eventId);
            return (
              <div key={cert.id} className="bg-white border rounded-xl p-5 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Award size={24} className="text-primary-600" />
                  </div>
                  <div className="min-w-0">
                    <Link href={`/student/events/${cert.eventId}`} className="text-sm font-semibold text-gray-900 hover:text-primary-600 leading-snug block">
                      {event?.title ?? cert.eventId}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">Issued {formatDate(cert.issuedAt)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${certTypeColors[cert.type] ?? 'bg-gray-100 text-gray-700'}`}>
                    {cert.type}
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDownload(cert, event)}
                    className="flex items-center gap-1"
                  >
                    <Download size={14} /> Download
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
