const fs = require('fs');

const addition = `
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
`;
fs.appendFileSync('src/mock-data/index.ts', addition);
