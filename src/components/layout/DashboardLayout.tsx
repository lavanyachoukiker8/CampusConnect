"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../ui/Logo';
import {
  Menu, X, User, LayoutDashboard, BookOpen, Calendar,
  Users, Award, ClipboardList, MessageSquare, History, LogOut, MapPin, FileText
} from 'lucide-react';

type Role = 'student' | 'coordinator' | 'admin';

interface NavLink { label: string; href: string; icon: React.ReactNode; }

const roleConfig: Record<Role, NavLink[]> = {
  student: [
    { label: 'Dashboard',           href: '/student',              icon: <LayoutDashboard size={18} /> },
    { label: 'Browse Clubs',        href: '/student/clubs',        icon: <Users size={18} /> },
    { label: 'My Clubs',            href: '/student/my-clubs',     icon: <BookOpen size={18} /> },
    { label: 'Browse Events',       href: '/student/events',       icon: <Calendar size={18} /> },
    { label: 'My Events',           href: '/student/my-events',    icon: <ClipboardList size={18} /> },
    { label: 'Attendance',          href: '/student/attendance',   icon: <ClipboardList size={18} /> },
    { label: 'Feedback',            href: '/student/feedback',     icon: <MessageSquare size={18} /> },
    { label: 'Certificates',        href: '/student/certificates', icon: <Award size={18} /> },
    { label: 'History',             href: '/student/history',      icon: <History size={18} /> },
    { label: 'Profile',             href: '/student/profile',      icon: <User size={18} /> },
  ],
  coordinator: [
    { label: 'Dashboard',      href: '/coordinator',          icon: <LayoutDashboard size={18} /> },
    { label: 'Club Overview',  href: '/coordinator/club',     icon: <Users size={18} /> },
    { label: 'Event Management', href: '/coordinator/events', icon: <Calendar size={18} /> },
  ],
  admin: [
    { label: 'Dashboard',    href: '/admin',              icon: <LayoutDashboard size={18} /> },
    { label: 'Students',     href: '/admin/students',     icon: <Users size={18} /> },
    { label: 'Clubs',        href: '/admin/clubs',        icon: <BookOpen size={18} /> },
    { label: 'Events',       href: '/admin/events',       icon: <Calendar size={18} /> },
    { label: 'Venues',       href: '/admin/venues',       icon: <MapPin size={18} /> },
    { label: 'System Logs',  href: '/admin/records',      icon: <ClipboardList size={18} /> },
    { label: 'Reports',      href: '/admin/reports',      icon: <FileText size={18} /> },
  ],
};

const userLabels: Record<Role, { name: string; sub: string }> = {
  student:     { name: 'Tanisha Vasa', sub: 'CS2023041 · Year 3' },
  coordinator: { name: 'Prof. Ravi Shankar', sub: 'Club Coordinator' },
  admin:       { name: 'Admin User', sub: 'System Administrator' },
};

export const DashboardLayout = ({
  children, role,
}: { children: React.ReactNode; role: Role }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const links = roleConfig[role] ?? [];
  const user = userLabels[role];



  return (
    <div className="min-h-screen flex bg-gray-50">
      <title>{`${role.charAt(0).toUpperCase() + role.slice(1)} Portal | CampusConnect`}</title>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r flex flex-col transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        aria-label="Sidebar Navigation"
      >
        <div className="p-4 border-b flex items-center justify-between">
          <Logo />
          <button 
            className="md:hidden p-2 -mr-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg" 
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {links.map(link => {
            const isActive = pathname === link.href || (link.href !== `/${role}` && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={isActive ? 'text-primary-600' : 'text-gray-400'}>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.sub}</p>
            </div>
          </div>
          <Link
            href="/demo"
            className="mt-2 flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Switch Role
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 md:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b px-4 py-3 flex items-center gap-4 sticky top-0 z-30">
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
            aria-expanded={isSidebarOpen}
            aria-label="Open sidebar"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-sm text-gray-600">{user.name}</span>
            <div 
              className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold"
              aria-hidden="true"
            >
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};
