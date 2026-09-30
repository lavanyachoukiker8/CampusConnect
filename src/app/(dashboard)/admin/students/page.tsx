"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { User, Mail, BookOpen, Calendar } from 'lucide-react';
import { getAllStudents, getStudentRegistrations, getStudentMemberships } from '@/services/api';
import type { Student, EventRegistration, ClubMembership } from '@/types';

export default function AdminStudents() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentDetails, setStudentDetails] = useState<{regs: EventRegistration[], mems: ClubMembership[]} | null>(null);

  useEffect(() => {
    getAllStudents().then(st => {
      setStudents(st);
      setLoading(false);
    });
  }, []);

  const openStudentModal = async (student: Student) => {
    setSelectedStudent(student);
    setStudentDetails(null);
    const [regs, mems] = await Promise.all([
      getStudentRegistrations(student.id),
      getStudentMemberships(student.id)
    ]);
    setStudentDetails({ regs, mems });
  };

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.enrollmentNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <PageHeader title="Students" description="Manage and view student records across the system." />

      <div className="mb-6 max-w-md">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or enrollment number..." />
      </div>

      {loading ? <LoadingSkeleton lines={8} /> : (
        <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">Student</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">Enrollment No</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500 hidden md:table-cell">Department</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(student => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                        {student.avatarInitials}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{student.enrollmentNo}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {student.department} (Year {student.year})
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="secondary" onClick={() => openStudentModal(student)}>View Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)} title="Student Details">
        {selectedStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 border-b pb-4">
               <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xl">
                  {selectedStudent.avatarInitials}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedStudent.name}</h3>
                  <p className="text-sm text-gray-500">{selectedStudent.enrollmentNo}</p>
                </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-gray-600"><Mail size={16} /> {selectedStudent.email}</p>
              <p className="flex items-center gap-2 text-gray-600"><BookOpen size={16} /> {selectedStudent.department}, Year {selectedStudent.year}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex justify-around mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">{studentDetails ? studentDetails.mems.length : '...'}</p>
                <p className="text-xs text-gray-500 uppercase">Clubs Joined</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">{studentDetails ? studentDetails.regs.length : '...'}</p>
                <p className="text-xs text-gray-500 uppercase">Events Registered</p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <Button onClick={() => setSelectedStudent(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
