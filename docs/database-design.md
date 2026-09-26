# Database Design
## Entities and Attributes
### Student
* student_id (PK)
* name
* email
* phone
* department
* semester
* password
* created_at
* status

### Club
* club_id (PK)
* club_name
* description
* category
* established_date
* status

### Club Membership
* membership_id (PK)
* student_id (FK)
* club_id (FK)
* join_date
* membership_status

### Club Coordinator
* coordinator_id (PK)
* club_id (FK)
* student_id (FK)
* start_date
* end_date
* status

### Venue
* venue_id (PK)
* venue_name
* location
* capacity
* status

### Event
* event_id (PK)
* club_id (FK)
* venue_id (FK)
* event_name
* description
* event_date
* start_time
* end_time
* capacity
* registration_deadline
* status

### Event Registration
* registration_id (PK)
* event_id (FK)
* student_id (FK)
* registration_date
* registration_status

### Attendance
* attendance_id (PK)
* registration_id (FK)
* attendance_status
* marked_at

### Feedback
* feedback_id (PK)
* event_id (FK)
* student_id (FK)
* rating
* comment
* submitted_at

### Volunteer
* volunteer_id (PK)
* student_id (FK)

### Event Volunteer
* event_volunteer_id (PK)
* event_id (FK)
* volunteer_id (FK)
* assigned_at
* role

### Certificate
* certificate_id (PK)
* student_id (FK)
* event_id (FK)
* certificate_type
* issue_date
* certificate_number
