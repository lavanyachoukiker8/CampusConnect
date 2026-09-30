import { PublicLayout } from '../../components/layout/PublicLayout';
import Link from 'next/link';

export default function DemoPicker() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto mt-20 text-center">
        <h2 className="text-3xl font-bold mb-8">Select a Role to Demo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/student" className="block p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Student</h3>
            <p className="text-gray-600">Browse clubs, register for events, manage profile.</p>
          </Link>
          <Link href="/coordinator" className="block p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Coordinator</h3>
            <p className="text-gray-600">Manage club details, create events, approve members.</p>
          </Link>
          <Link href="/admin" className="block p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Admin</h3>
            <p className="text-gray-600">System overview, approve clubs, manage users.</p>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}