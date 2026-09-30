import type {
  Student, Club, ClubCategory, ClubMembership, MembershipApplication,
  EventCategory, Venue, Event, EventRegistration, Attendance, Feedback, Certificate,
} from '../types';

// ─── Lookup data ─────────────────────────────────────────────────────────────
export const clubCategories: ClubCategory[] = [
  { id: 'cat-1', name: 'Technical',  icon: '💻' },
  { id: 'cat-2', name: 'Cultural',   icon: '🎭' },
  { id: 'cat-3', name: 'Sports',     icon: '⚽' },
  { id: 'cat-4', name: 'Literary',   icon: '📚' },
  { id: 'cat-5', name: 'Social',     icon: '🤝' },
  { id: 'cat-6', name: 'Arts',       icon: '🎨' },
];

export const eventCategories: EventCategory[] = [
  { id: 'ecat-1', name: 'Workshop',    icon: '🛠️' },
  { id: 'ecat-2', name: 'Competition', icon: '🏆' },
  { id: 'ecat-3', name: 'Seminar',     icon: '🎤' },
  { id: 'ecat-4', name: 'Cultural',    icon: '🎭' },
  { id: 'ecat-5', name: 'Sports',      icon: '⚽' },
  { id: 'ecat-6', name: 'Social',      icon: '🤝' },
];

// ─── Venues ──────────────────────────────────────────────────────────────────
export const mockVenues: Venue[] = [
  { id: 'v-1', name: 'Main Auditorium',   location: 'Block A, Ground Floor', capacity: 600, facilities: ['Projector', 'PA System', 'AC', 'Stage'] },
  { id: 'v-2', name: 'Seminar Hall 101',  location: 'Block B, 1st Floor',    capacity: 120, facilities: ['Projector', 'Whiteboard', 'AC'] },
  { id: 'v-3', name: 'Open Air Theatre',  location: 'Central Lawn',          capacity: 800, facilities: ['PA System', 'Stage', 'Lights'] },
  { id: 'v-4', name: 'Tech Lab A',        location: 'Block C, 2nd Floor',    capacity: 50,  facilities: ['Computers', 'Projector', 'AC'] },
  { id: 'v-5', name: 'Sports Complex',    location: 'Campus East Wing',      capacity: 300, facilities: ['Changing Rooms', 'Scoreboard', 'Floodlights'] },
];

// ─── Clubs ───────────────────────────────────────────────────────────────────
export const mockClubs: Club[] = [
  {
    id: 'club-1', name: 'CodeCraft Society', categoryId: 'cat-1',
    description: 'A hub for passionate coders. We run weekly coding challenges, hackathons, and open-source contribution drives. Members gain real-world project experience and mentorship from alumni in top tech companies.',
    coordinatorName: 'Prof. Ravi Shankar', coordinatorEmail: 'ravi.shankar@college.edu',
    facultyAdvisor: 'Dr. Priya Mehta', logoInitials: 'CC', color: 'bg-blue-600',
    memberCount: 87, requiresApplication: false, foundedYear: 2019,
  },
  {
    id: 'club-2', name: 'Robotics & Automation Club', categoryId: 'cat-1',
    description: 'Build, program and battle robots. From Arduino prototypes to full autonomous systems, this club is for those who love hardware meets software.',
    coordinatorName: 'Prof. Amit Joshi', coordinatorEmail: 'amit.joshi@college.edu',
    facultyAdvisor: 'Dr. Sunita Verma', logoInitials: 'RA', color: 'bg-orange-600',
    memberCount: 54, requiresApplication: true, foundedYear: 2020,
  },
  {
    id: 'club-3', name: 'Eloquence Debate Club', categoryId: 'cat-4',
    description: 'Master the art of persuasive speaking. We host inter-college debate championships, Model UN sessions, and public speaking workshops.',
    coordinatorName: 'Prof. Neha Gupta', coordinatorEmail: 'neha.gupta@college.edu',
    facultyAdvisor: 'Dr. Ramesh Iyer', logoInitials: 'ED', color: 'bg-purple-600',
    memberCount: 42, requiresApplication: false, foundedYear: 2017,
  },
  {
    id: 'club-4', name: 'Pixels & Frames Film Club', categoryId: 'cat-2',
    description: 'For aspiring filmmakers and cinema enthusiasts. We screen films, run filmmaking workshops, and host an annual short film festival.',
    coordinatorName: 'Prof. Anjali Singh', coordinatorEmail: 'anjali.singh@college.edu',
    facultyAdvisor: 'Dr. Kavitha Rao', logoInitials: 'PF', color: 'bg-red-600',
    memberCount: 38, requiresApplication: false, foundedYear: 2021,
  },
  {
    id: 'club-5', name: 'Harmony Music Society', categoryId: 'cat-2',
    description: 'A vibrant community of musicians spanning classical, fusion, and contemporary genres. Join us for jam sessions, live concerts, and inter-college music competitions.',
    coordinatorName: 'Prof. Vikram Nair', coordinatorEmail: 'vikram.nair@college.edu',
    facultyAdvisor: 'Dr. Leela Krishnan', logoInitials: 'HM', color: 'bg-pink-600',
    memberCount: 65, requiresApplication: true, foundedYear: 2016,
  },
  {
    id: 'club-6', name: 'Campus Sports Association', categoryId: 'cat-3',
    description: 'Representing the college in football, cricket, basketball and athletics at university and national levels. Open to all sports enthusiasts.',
    coordinatorName: 'Prof. Suresh Kumar', coordinatorEmail: 'suresh.kumar@college.edu',
    facultyAdvisor: 'Dr. Anand Pillai', logoInitials: 'CS', color: 'bg-green-600',
    memberCount: 110, requiresApplication: false, foundedYear: 2010,
  },
  {
    id: 'club-7', name: 'Social Outreach Cell', categoryId: 'cat-5',
    description: 'Driving community service, blood donation drives, environmental campaigns and rural education initiatives. Be the change you wish to see.',
    coordinatorName: 'Prof. Divya Sharma', coordinatorEmail: 'divya.sharma@college.edu',
    facultyAdvisor: 'Dr. Meera Nambiar', logoInitials: 'SO', color: 'bg-teal-600',
    memberCount: 93, requiresApplication: false, foundedYear: 2014,
  },
  {
    id: 'club-8', name: 'Canvas & Craft Arts Club', categoryId: 'cat-6',
    description: 'Celebrating visual arts — painting, sculpture, digital art, and illustration. We host exhibitions, live art sessions and collaborative art installations.',
    coordinatorName: 'Prof. Pooja Bhat', coordinatorEmail: 'pooja.bhat@college.edu',
    facultyAdvisor: 'Dr. Sanjay Kulkarni', logoInitials: 'CA', color: 'bg-yellow-600',
    memberCount: 47, requiresApplication: false, foundedYear: 2018,
  },
];

// ─── Events ──────────────────────────────────────────────────────────────────
export const mockEvents: Event[] = [
  // Upcoming / Open
  {
    id: 'evt-1', clubId: 'club-1', categoryId: 'ecat-2', venueId: 'v-4',
    title: '36-Hour Hackathon 2026', isFeatured: true,
    description: 'Build innovative solutions in 36 hours. Theme: Sustainable Technology. Teams of 2–4. Prizes worth ₹50,000.',
    date: '2026-10-18', startTime: '09:00', endTime: '21:00',
    registrationDeadline: '2026-10-14', status: 'open',
    totalSeats: 120, registeredCount: 78,
  },
  {
    id: 'evt-2', clubId: 'club-2', categoryId: 'ecat-2', venueId: 'v-5',
    title: 'Robot Wars Season 3', isFeatured: true,
    description: 'Annual autonomous robot battle competition. Categories: Line Follower, Maze Solver, Sumo Bot.',
    date: '2026-11-05', startTime: '10:00', endTime: '18:00',
    registrationDeadline: '2026-10-28', status: 'open',
    totalSeats: 80, registeredCount: 41,
  },
  {
    id: 'evt-3', clubId: 'club-3', categoryId: 'ecat-2', venueId: 'v-1',
    title: 'Inter-College Debate Championship', isFeatured: false,
    description: 'British Parliamentary format debate. Topic: "AI will replace human creativity." Open to all years.',
    date: '2026-11-22', startTime: '09:30', endTime: '17:00',
    registrationDeadline: '2026-11-15', status: 'open',
    totalSeats: 60, registeredCount: 55,
  },
  {
    id: 'evt-4', clubId: 'club-5', categoryId: 'ecat-4', venueId: 'v-3',
    title: 'Harmony Fest — Annual Music Night', isFeatured: true,
    description: 'An evening of live music performances. Classical, jazz, pop and fusion. Open for all to attend.',
    date: '2026-12-10', startTime: '18:00', endTime: '22:00',
    registrationDeadline: '2026-12-05', status: 'open',
    totalSeats: 400, registeredCount: 182,
  },
  {
    id: 'evt-5', clubId: 'club-1', categoryId: 'ecat-1', venueId: 'v-4',
    title: 'Python for Data Science Workshop', isFeatured: false,
    description: 'Hands-on 3-day workshop covering NumPy, Pandas, Matplotlib and Scikit-learn. Bring your laptop.',
    date: '2026-10-25', startTime: '10:00', endTime: '16:00',
    registrationDeadline: '2026-10-20', status: 'open',
    totalSeats: 50, registeredCount: 50, // FULL
  },
  {
    id: 'evt-6', clubId: 'club-7', categoryId: 'ecat-6', venueId: 'v-3',
    title: 'Campus Blood Donation Drive', isFeatured: false,
    description: 'Bi-annual blood donation camp in association with City General Hospital. Refreshments provided.',
    date: '2026-10-30', startTime: '09:00', endTime: '14:00',
    registrationDeadline: '2026-10-28', status: 'open',
    totalSeats: 200, registeredCount: 67,
  },
  {
    id: 'evt-7', clubId: 'club-6', categoryId: 'ecat-5', venueId: 'v-5',
    title: 'Inter-Department Football League', isFeatured: false,
    description: '7-a-side football tournament. Register your department team. 8 slots available.',
    date: '2026-11-15', startTime: '08:00', endTime: '17:00',
    registrationDeadline: '2026-11-10', status: 'full',
    totalSeats: 64, registeredCount: 64,
  },
  {
    id: 'evt-8', clubId: 'club-8', categoryId: 'ecat-4', venueId: 'v-1',
    title: 'ArtExpo 2026 — Annual Exhibition', isFeatured: false,
    description: 'Showcase your paintings, digital art, and sculptures. Submit your work for curation by Nov 20.',
    date: '2026-12-01', startTime: '10:00', endTime: '18:00',
    registrationDeadline: '2026-11-25', status: 'open',
    totalSeats: 150, registeredCount: 34,
  },
  // Past / Completed
  {
    id: 'evt-9', clubId: 'club-1', categoryId: 'ecat-1', venueId: 'v-4',
    title: 'Git & GitHub Bootcamp', isFeatured: false,
    description: 'A full-day workshop on version control with Git and collaborating on GitHub.',
    date: '2026-09-05', startTime: '10:00', endTime: '17:00',
    registrationDeadline: '2026-09-01', status: 'completed',
    totalSeats: 50, registeredCount: 48,
  },
  {
    id: 'evt-10', clubId: 'club-3', categoryId: 'ecat-3', venueId: 'v-2',
    title: 'Leadership & Communication Seminar', isFeatured: false,
    description: 'Industry speakers share insights on professional communication and leadership skills.',
    date: '2026-09-12', startTime: '14:00', endTime: '17:00',
    registrationDeadline: '2026-09-10', status: 'completed',
    totalSeats: 100, registeredCount: 92,
  },
  {
    id: 'evt-11', clubId: 'club-5', categoryId: 'ecat-4', venueId: 'v-3',
    title: 'Open Mic Night — September Edition', isFeatured: false,
    description: 'Monthly open-mic for singers, poets, stand-up comedians. No registration needed to watch.',
    date: '2026-09-20', startTime: '18:00', endTime: '21:00',
    registrationDeadline: '2026-09-18', status: 'completed',
    totalSeats: 300, registeredCount: 210,
  },
  {
    id: 'evt-12', clubId: 'club-6', categoryId: 'ecat-5', venueId: 'v-5',
    title: 'Annual Sports Day 2026', isFeatured: false,
    description: 'Track & field events, relay races and tug-of-war. College vs college challenge.',
    date: '2026-08-30', startTime: '07:00', endTime: '16:00',
    registrationDeadline: '2026-08-25', status: 'completed',
    totalSeats: 500, registeredCount: 450,
  },
  {
    id: 'evt-13', clubId: 'club-7', categoryId: 'ecat-6', venueId: 'v-3',
    title: 'Tree Plantation Drive', isFeatured: false,
    description: 'Campus greening initiative. 200 saplings to be planted across the campus.',
    date: '2026-09-03', startTime: '07:00', endTime: '10:00',
    registrationDeadline: '2026-09-01', status: 'completed',
    totalSeats: 100, registeredCount: 88,
  },
  {
    id: 'evt-14', clubId: 'club-2', categoryId: 'ecat-1', venueId: 'v-4',
    title: 'Arduino Crash Course', isFeatured: false,
    description: 'Hands-on intro to Arduino microcontrollers. Build your first sensor project.',
    date: '2026-08-20', startTime: '10:00', endTime: '15:00',
    registrationDeadline: '2026-08-16', status: 'completed',
    totalSeats: 40, registeredCount: 38,
  },
  {
    id: 'evt-15', clubId: 'club-4', categoryId: 'ecat-4', venueId: 'v-1',
    title: 'Short Film Screening Night', isFeatured: false,
    description: 'Annual screening of student short films. Best film award chosen by audience vote.',
    date: '2026-09-15', startTime: '18:30', endTime: '21:30',
    registrationDeadline: '2026-09-13', status: 'cancelled',
    totalSeats: 200, registeredCount: 120,
  },
];

// ─── Logged-in mock student ───────────────────────────────────────────────────
export const mockCurrentStudent: Student = {
  id: 'stu-1',
  name: 'Tanisha Vasa',
  enrollmentNo: 'CS2023041',
  email: 'tanisha.vasa@college.edu',
  department: 'Computer Science & Engineering',
  year: 3,
  avatarInitials: 'TV',
};

// ─── Student's memberships ───────────────────────────────────────────────────
export const mockMemberships: ClubMembership[] = [
  { id: 'mem-1', studentId: 'stu-1', clubId: 'club-1', role: 'member',   joinedAt: '2024-08-10' },
  { id: 'mem-2', studentId: 'stu-1', clubId: 'club-3', role: 'co-lead',  joinedAt: '2024-07-22' },
  { id: 'mem-3', studentId: 'stu-1', clubId: 'club-7', role: 'member',   joinedAt: '2025-01-15' },
];

// ─── Membership applications ─────────────────────────────────────────────────
export const mockApplications: MembershipApplication[] = [
  { id: 'app-1', studentId: 'stu-1', clubId: 'club-2', status: 'pending',  appliedAt: '2026-09-28', note: 'I am passionate about robotics and have built two Arduino projects.' },
  { id: 'app-2', studentId: 'stu-1', clubId: 'club-5', status: 'rejected', appliedAt: '2026-08-15', note: 'I play guitar and would love to contribute to the music society.' },
];

// ─── Event registrations ──────────────────────────────────────────────────────
export const mockRegistrations: EventRegistration[] = [
  // Upcoming
  { id: 'reg-1', eventId: 'evt-1',  studentId: 'stu-1', status: 'confirmed', registeredAt: '2026-09-25' },
  { id: 'reg-2', eventId: 'evt-3',  studentId: 'stu-1', status: 'confirmed', registeredAt: '2026-09-27' },
  // Past
  { id: 'reg-3', eventId: 'evt-9',  studentId: 'stu-1', status: 'confirmed', registeredAt: '2026-08-30' },
  { id: 'reg-4', eventId: 'evt-10', studentId: 'stu-1', status: 'confirmed', registeredAt: '2026-09-08' },
  { id: 'reg-5', eventId: 'evt-11', studentId: 'stu-1', status: 'confirmed', registeredAt: '2026-09-17' },
  { id: 'reg-6', eventId: 'evt-13', studentId: 'stu-1', status: 'confirmed', registeredAt: '2026-08-29' },
];

// ─── Attendance ───────────────────────────────────────────────────────────────
export const mockAttendance: Attendance[] = [
  { id: 'att-1', eventId: 'evt-9',  studentId: 'stu-1', status: 'present', markedAt: '2026-09-05T10:15:00' },
  { id: 'att-2', eventId: 'evt-10', studentId: 'stu-1', status: 'present', markedAt: '2026-09-12T14:05:00' },
  { id: 'att-3', eventId: 'evt-11', studentId: 'stu-1', status: 'absent',  markedAt: '2026-09-20T18:00:00' },
  { id: 'att-4', eventId: 'evt-13', studentId: 'stu-1', status: 'present', markedAt: '2026-09-03T07:10:00' },
];

// ─── Feedback ─────────────────────────────────────────────────────────────────
export const mockFeedback: Feedback[] = [
  { id: 'fb-1', eventId: 'evt-9',  studentId: 'stu-1', rating: 5, comment: 'Excellent workshop! The hands-on section was very helpful.', submittedAt: '2026-09-06' },
  { id: 'fb-2', eventId: 'evt-10', studentId: 'stu-1', rating: 4, comment: 'Great speakers. Could have been a bit longer.', submittedAt: '2026-09-13' },
];

// ─── Certificates ─────────────────────────────────────────────────────────────
export const mockCertificates: Certificate[] = [
  { id: 'cert-1', studentId: 'stu-1', eventId: 'evt-9',  type: 'participation', issuedAt: '2026-09-10' },
  { id: 'cert-2', studentId: 'stu-1', eventId: 'evt-10', type: 'participation', issuedAt: '2026-09-14' },
  { id: 'cert-3', studentId: 'stu-1', eventId: 'evt-13', type: 'volunteer',     issuedAt: '2026-09-06' },
];

export const mockCurrentCoordinator = {
  id: 'coord-1',
  name: 'Prof. Ravi Shankar',
  clubId: 'club-1',
};

export const mockVolunteers: import('../types').Volunteer[] = [];


// --- DYNAMIC PHASE 4 MOCK DATA EXTENSION ---
export const allStudents: Student[] = [mockCurrentStudent];
for (let i = 2; i <= 30; i++) {
  allStudents.push({
    id: 'stu-' + i,
    name: 'Mock Student ' + i,
    enrollmentNo: 'CS2023' + (i+40).toString().padStart(3, '0'),
    email: 'student' + i + '@college.edu',
    department: ['CS', 'IT', 'ECE', 'ME'][i % 4],
    year: (i % 4) + 1,
    avatarInitials: 'S' + i
  });
}

for (let i = 0; i < 50; i++) {
  const event = mockEvents[i % mockEvents.length];
  const student = allStudents[i % allStudents.length];
  const existingReg = mockRegistrations.find(r => r.eventId === event.id && r.studentId === student.id);
  if (existingReg) continue;

  mockRegistrations.push({
    id: 'reg-auto-' + i,
    eventId: event.id,
    studentId: student.id,
    status: 'confirmed',
    registeredAt: event.date
  });
  
  if (new Date(event.date) < new Date()) {
    const isPresent = i % 5 !== 0;
    mockAttendance.push({
      id: 'att-auto-' + i,
      eventId: event.id,
      studentId: student.id,
      status: isPresent ? 'present' : 'absent',
      markedAt: event.date
    });
    
    if (isPresent && i % 2 === 0) {
      mockFeedback.push({
        id: 'fb-auto-' + i,
        eventId: event.id,
        studentId: student.id,
        rating: 3 + (i % 3),
        comment: 'Great event!',
        submittedAt: event.date
      });
      mockCertificates.push({
        id: 'cert-auto-' + i,
        eventId: event.id,
        studentId: student.id,
        type: 'participation',
        issuedAt: event.date
      });
    }
  }
}
