// ─── Scalar union types ──────────────────────────────────────────────────────
export type Role = 'student' | 'coordinator' | 'admin';
export type MembershipStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type EventStatus = 'open' | 'full' | 'cancelled' | 'completed' | 'pending' | 'approved' | 'rejected';
export type RegistrationStatus = 'confirmed' | 'cancelled' | 'waitlisted';
export type AttendanceStatus = 'present' | 'absent';

// ─── Entities ────────────────────────────────────────────────────────────────
export interface Student {
  id: string;
  name: string;
  enrollmentNo: string;
  email: string;
  department: string;
  year: number;
  avatarInitials: string;
}

export interface ClubCategory {
  id: string;
  name: string;
  icon: string; // emoji
}

export interface Club {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  coordinatorName: string;
  coordinatorEmail: string;
  facultyAdvisor: string;
  logoInitials: string;
  color: string; // tailwind bg class e.g. "bg-blue-500"
  memberCount: number;
  requiresApplication: boolean;
  foundedYear: number;
}

export interface ClubMembership {
  id: string;
  studentId: string;
  clubId: string;
  role: 'member' | 'lead' | 'co-lead';
  joinedAt: string; // ISO date
}

export interface MembershipApplication {
  id: string;
  studentId: string;
  clubId: string;
  status: MembershipStatus;
  appliedAt: string;
  note: string;
}

export interface ClubCoordinator {
  id: string;
  name: string;
  clubId: string;
  email: string;
}

export interface EventCategory {
  id: string;
  name: string;
  icon: string;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
  facilities: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  clubId: string;
  categoryId: string;
  venueId: string;
  date: string;          // ISO date YYYY-MM-DD
  startTime: string;     // HH:MM
  endTime: string;
  registrationDeadline: string; // ISO date
  status: EventStatus;
  totalSeats: number;
  registeredCount: number;
  isFeatured: boolean;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  studentId: string;
  status: RegistrationStatus;
  registeredAt: string;
}

export interface Attendance {
  id: string;
  eventId: string;
  studentId: string;
  status: AttendanceStatus;
  markedAt: string;
}

export interface Feedback {
  id: string;
  eventId: string;
  studentId: string;
  rating: number; // 1–5
  comment: string;
  submittedAt: string;
}

export interface Certificate {
  id: string;
  studentId: string;
  eventId: string;
  issuedAt: string;
  type: 'participation' | 'volunteer' | 'winner';
}

export interface Volunteer {
  id: string;
  studentId: string;
  eventId: string;
  role: string;
}
