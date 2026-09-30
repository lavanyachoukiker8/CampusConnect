import { PublicLayout } from '../../components/layout/PublicLayout';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { mockClubs, clubCategories } from '../../mock-data';

export const metadata = { title: 'Clubs' };

export default function PublicClubs() {
  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Clubs</h1>
          <p className="text-gray-500">Discover what's happening on campus. <Link href="/signup" className="text-primary-600 hover:underline">Sign up</Link> to join.</p>
        </div>

        {/* Category groups */}
        {clubCategories.map(cat => {
          const clubs = mockClubs.filter(c => c.categoryId === cat.id);
          if (clubs.length === 0) return null;
          return (
            <section key={cat.id} className="mb-10">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">{cat.icon} {cat.name}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {clubs.map(club => (
                  <div key={club.id} className="bg-white border rounded-xl p-5 flex gap-3 items-start">
                    <div className={`w-12 h-12 rounded-xl ${club.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {club.logoInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{club.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><Users size={11} />{club.memberCount} members</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{club.description}</p>
                      <Link href="/signup" className="inline-block mt-2 text-xs text-primary-600 hover:underline font-medium">Join now →</Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <div className="text-center pt-4">
          <Link href="/demo" className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            Try the Student Dashboard →
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
