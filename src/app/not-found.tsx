import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h2 className="text-4xl font-bold mb-4">404 - Not Found</h2>
      <p className="text-gray-600 mb-6">Could not find requested resource</p>
      <Link href="/" className="bg-primary-600 text-white px-4 py-2 rounded">Return Home</Link>
    </div>
  );
}