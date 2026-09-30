import { PublicLayout } from '../components/layout/PublicLayout';
import Link from 'next/link';
import { Users, Calendar, Award, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: <Users size={28} className="text-primary-600" />,
    title: 'Discover & Join Clubs',
    desc: 'Browse 40+ clubs across technical, cultural, sports, and social categories. Request membership in one click.',
    href: '/clubs',
  },
  {
    icon: <Calendar size={28} className="text-primary-600" />,
    title: 'Register for Events',
    desc: 'Never miss a hackathon, concert, or sports day. Real-time seat availability and instant confirmation.',
    href: '/events',
  },
  {
    icon: <Award size={28} className="text-primary-600" />,
    title: 'Track & Earn Certificates',
    desc: 'Your attendance, feedback, and participation history in one place. Download certificates instantly.',
    href: '/demo',
  },
];

export default function HomePage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full mb-6">
            🎓 College Club & Event Management
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
            Your Campus Life,{' '}
            <span className="text-primary-200">All in One Place</span>
          </h1>
          <p className="text-lg sm:text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            CampusConnect brings together clubs, events, and student participation — making college life more organised, exciting, and rewarding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Try the Demo <ArrowRight size={18} />
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-b">
        <div className="max-w-4xl mx-auto py-8 px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '40+', label: 'Active Clubs' },
            { value: '200+', label: 'Events / Year' },
            { value: '5,000+', label: 'Students' },
            { value: '1,200+', label: 'Certificates Issued' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-primary-600">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Everything you need</h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            One platform for students, club coordinators, and administrators.
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            {features.map(f => (
              <Link key={f.title} href={f.href} className="group bg-white rounded-xl p-6 border hover:shadow-md transition-shadow">
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary-700 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to explore?</h2>
        <p className="text-primary-200 mb-8 max-w-md mx-auto">
          Sign up with your college email and get started in under a minute.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="bg-white text-primary-700 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors">
            Create Account
          </Link>
          <Link href="/login" className="border-2 border-white/60 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
            Sign In
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}