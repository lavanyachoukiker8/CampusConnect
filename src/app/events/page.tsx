import { PublicLayout } from '../../components/layout/PublicLayout';
import Link from 'next/link';
import { Calendar, MapPin, Users } from 'lucide-react';
import { mockEvents, mockClubs, mockVenues } from '../../mock-data';

export const metadata = { title: 'Events' };

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const statusColors: Record<string, string> = {
  open:      'bg-blue-100 text-blue-700',
  full:      'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-green-100 text-green-700',
};

export default function PublicEvents() {
  const today = new Date().toISOString().split('T')[0];
  const upcoming = mockEvents
    .filter(e => e.date >= today && e.status !== 'cancelled')
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = mockEvents
    .filter(e => e.date < today || e.status === 'completed' || e.status === 'cancelled')
    .sort((a, b) => b.date.localeCompare(a.date));

  const EventCard = ({ e }: { e: typeof mockEvents[0] }) => {
    const club = mockClubs.find(c => c.id === e.clubId);
    const venue = mockVenues.find(v => v.id === e.venueId);
    const seatsLeft = e.totalSeats - e.registeredCount;
    return (
      <div className="bg-white border rounded-xl p-4 flex flex-col gap-3">
        {e.isFeatured && <div className="text-xs font-medium text-primary-600">⭐ Featured</div>}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900 leading-snug">{e.title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusColors[e.status] ?? ''}`}>
            {e.status}
          </span>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">{e.description}</p>
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-1"><Calendar size={11} />{formatDate(e.date)} · {e.startTime}</div>
          <div className="flex items-center gap-1"><MapPin size={11} />{venue?.name}</div>
          <div className="flex items-center gap-1"><Users size={11} />{seatsLeft > 0 ? `${seatsLeft} seats left` : 'Full'}</div>
        </div>
        <div className="flex items-center justify-between pt-1 border-t">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded ${club?.color ?? 'bg-gray-400'} flex items-center justify-center text-white text-xs font-bold`}>{club?.logoInitials}</div>
            <span className="text-xs text-gray-500 truncate max-w-[140px]">{club?.name}</span>
          </div>
          <Link href="/signup" className="text-xs text-primary-600 hover:underline font-medium">Register →</Link>
        </div>
      </div>
    );
  };

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Campus Events</h1>
          <p className="text-gray-500"><Link href="/signup" className="text-primary-600 hover:underline">Sign up</Link> to register for events.</p>
        </div>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📅 Upcoming Events</h2>
          {upcoming.length === 0 ? <p className="text-gray-500 text-sm">No upcoming events at the moment.</p> : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.map(e => <EventCard key={e.id} e={e} />)}
            </div>
          )}
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">🕐 Past Events</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {past.map(e => <EventCard key={e.id} e={e} />)}
          </div>
        </section>

        <div className="text-center pt-4">
          <Link href="/demo" className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            Try the Student Dashboard →
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
