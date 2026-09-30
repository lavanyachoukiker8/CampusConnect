import type {
  Club, Event, Venue, Student, ClubMembership, MembershipApplication,
  EventRegistration, Attendance, Feedback, Certificate, ClubCategory, EventCategory,
} from '../types';
import {
  mockClubs, mockEvents, mockVenues, mockCurrentStudent,
  mockMemberships, mockApplications, mockRegistrations, mockAttendance,
  mockFeedback, mockCertificates, clubCategories, eventCategories, mockCurrentCoordinator
} from '../mock-data';

const delay = <T>(data: T, ms = 400): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), ms));

// ─── Lookup ───────────────────────────────────────────────────────────────────
export const getClubCategories = (): Promise<ClubCategory[]> => delay(clubCategories);
export const getEventCategories = (): Promise<EventCategory[]> => delay(eventCategories);

// ─── Clubs ────────────────────────────────────────────────────────────────────
export const getClubs = (): Promise<Club[]> => delay(mockClubs);
export const getClubById = (id: string): Promise<Club | undefined> =>
  delay(mockClubs.find(c => c.id === id));

// ─── Venues ───────────────────────────────────────────────────────────────────
export const getVenues = (): Promise<Venue[]> => delay(mockVenues);
export const getVenueById = (id: string): Promise<Venue | undefined> =>
  delay(mockVenues.find(v => v.id === id));

// ─── Events ───────────────────────────────────────────────────────────────────
export const getEvents = (): Promise<Event[]> => delay(mockEvents);
export const getEventById = (id: string): Promise<Event | undefined> =>
  delay(mockEvents.find(e => e.id === id));
export const getEventsByClub = (clubId: string): Promise<Event[]> =>
  delay(mockEvents.filter(e => e.clubId === clubId));

// ─── Student ──────────────────────────────────────────────────────────────────
export const getCurrentStudent = (): Promise<Student> => delay(mockCurrentStudent);

// ─── Memberships ──────────────────────────────────────────────────────────────
export const getStudentMemberships = (studentId: string): Promise<ClubMembership[]> =>
  delay(mockMemberships.filter(m => m.studentId === studentId));
export const getStudentApplications = (studentId: string): Promise<MembershipApplication[]> =>
  delay(mockApplications.filter(a => a.studentId === studentId));

// ─── Registrations ────────────────────────────────────────────────────────────
export const getStudentRegistrations = (studentId: string): Promise<EventRegistration[]> =>
  delay(mockRegistrations.filter(r => r.studentId === studentId));
export const getEventRegistrations = (eventId: string): Promise<EventRegistration[]> =>
  delay(mockRegistrations.filter(r => r.eventId === eventId));

// ─── Attendance ───────────────────────────────────────────────────────────────
export const getStudentAttendance = (studentId: string): Promise<Attendance[]> =>
  delay(mockAttendance.filter(a => a.studentId === studentId));

// ─── Feedback ─────────────────────────────────────────────────────────────────
export const getStudentFeedback = (studentId: string): Promise<Feedback[]> =>
  delay(mockFeedback.filter(f => f.studentId === studentId));
export const getEventFeedback = (eventId: string): Promise<Feedback[]> =>
  delay(mockFeedback.filter(f => f.eventId === eventId));

// ─── Certificates ─────────────────────────────────────────────────────────────
export const getStudentCertificates = (studentId: string): Promise<Certificate[]> =>
  delay(mockCertificates.filter(c => c.studentId === studentId));

export const getCurrentCoordinator = (): Promise<any> => delay(mockCurrentCoordinator);
export const getClubMemberships = (clubId: string): Promise<any[]> => delay(mockMemberships.filter(m => m.clubId === clubId));
export const getClubApplications = (clubId: string): Promise<any[]> => delay(mockApplications.filter(a => a.clubId === clubId));
export const getEventAttendance = (eventId: string): Promise<any[]> => delay(mockAttendance.filter(a => a.eventId === eventId));


export const getAllStudents = (): Promise<Student[]> => import('../mock-data').then(m => m.allStudents).then(data => delay(data));
export const getAllRegistrations = (): Promise<EventRegistration[]> => delay(mockRegistrations);
export const getAllAttendance = (): Promise<Attendance[]> => delay(mockAttendance);
export const getAllFeedback = (): Promise<Feedback[]> => delay(mockFeedback);
export const getAllCertificates = (): Promise<Certificate[]> => delay(mockCertificates);
export const getAllMemberships = (): Promise<ClubMembership[]> => delay(mockMemberships);
export const getAllApplications = (): Promise<MembershipApplication[]> => delay(mockApplications);

