"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { getClubs, getClubCategories, getStudentMemberships, getStudentApplications } from '@/services/api';
import type { Club, ClubCategory, ClubMembership, MembershipApplication } from '@/types';
import { mockCurrentStudent } from '@/mock-data';

export default function BrowseClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [categories, setCategories] = useState<ClubCategory[]>([]);
  const [memberships, setMemberships] = useState<ClubMembership[]>([]);
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getClubs(), getClubCategories(),
      getStudentMemberships(mockCurrentStudent.id),
      getStudentApplications(mockCurrentStudent.id),
    ]).then(([cl, cats, mem, app]) => {
      setClubs(cl); setCategories(cats); setMemberships(mem); setApplications(app);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => clubs.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || c.categoryId === catFilter;
    return matchSearch && matchCat;
  }), [clubs, search, catFilter]);

  const getMemberStatus = (clubId: string) => {
    if (memberships.find(m => m.clubId === clubId)) return 'member';
    const app = applications.find(a => a.clubId === clubId);
    if (app) return app.status;
    return null;
  };

  return (
    <DashboardLayout role="student">
      <PageHeader title="Browse Clubs" description="Discover and join clubs that match your interests." />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search clubs..." />
        </div>
        <select
          value={catFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCatFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      {loading ? <LoadingSkeleton lines={8} /> : filtered.length === 0 ? (
        <EmptyState title="No clubs found" description="Try adjusting your search or filter." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(club => {
            const cat = categories.find(c => c.id === club.categoryId);
            const status = getMemberStatus(club.id);
            return (
              <Link
                key={club.id}
                href={`/student/clubs/${club.id}`}
                className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl ${club.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {club.logoInitials}
                  </div>
                  {status === 'member'   && <Badge status="approved">Member</Badge>}
                  {status === 'pending'  && <Badge status="pending">Requested</Badge>}
                  {status === 'rejected' && <Badge status="rejected">Rejected</Badge>}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{club.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{cat?.icon} {cat?.name}</p>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 flex-1">{club.description}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users size={12} />
                  <span>{club.memberCount} members</span>
                  {club.requiresApplication && (
                    <span className="ml-2 text-orange-500">· Application required</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
