import React from 'react';
import { Logo } from '../ui/Logo';
import Link from 'next/link';

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b py-4 px-6 flex justify-between items-center sticky top-0 z-30">
        <Link href="/"><Logo /></Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href="/clubs" className="text-sm text-gray-600 hover:text-gray-900 hidden sm:inline">Clubs</Link>
          <Link href="/events" className="text-sm text-gray-600 hover:text-gray-900 hidden sm:inline">Events</Link>
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Login</Link>
          <Link href="/signup" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">Sign Up</Link>
        </nav>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-gray-800 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-semibold">CampusConnect</p>
            <p className="text-gray-400 text-sm mt-1">College Club & Event Management</p>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/clubs" className="hover:text-white">Clubs</Link>
            <Link href="/events" className="hover:text-white">Events</Link>
            <Link href="/demo" className="hover:text-white">Demo</Link>
          </div>
          <p className="text-gray-400 text-sm">© 2026 CampusConnect</p>
        </div>
      </footer>
    </div>
  );
};
