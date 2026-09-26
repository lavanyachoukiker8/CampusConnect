# Relational Schema

* `student` (**student_id**, name, email (UNIQUE), phone, department, semester, password, created_at, status)
* `club` (**club_id**, club_name (UNIQUE), description, category, established_date, status)
* `club_membership` (**membership_id**, *student_id*, *club_id*, join_date, membership_status)
* `club_coordinator` (**coordinator_id**, *club_id*, *student_id*, start_date, end_date, status)
* `venue` (**venue_id**, venue_name (UNIQUE), location, capacity, status)
* `event` (**event_id**, *club_id*, *venue_id*, event_name, description, event_date, start_time, end_time, capacity, registration_deadline, status)
* `event_registration` (**registration_id**, *event_id*, *student_id*, registration_date, registration_status)
* `attendance` (**attendance_id**, *registration_id*, attendance_status, marked_at)
* `feedback` (**feedback_id**, *event_id*, *student_id*, rating, comment, submitted_at)
* `volunteer` (**volunteer_id**, *student_id*)
* `event_volunteer` (**event_volunteer_id**, *event_id*, *volunteer_id*, assigned_at, role)
* `certificate` (**certificate_id**, *student_id*, *event_id*, certificate_type, issue_date, certificate_number (UNIQUE))
