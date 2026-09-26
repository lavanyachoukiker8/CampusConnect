# SQL Concepts and Queries

## DBMS Concepts Demonstrated
* **SELECT, INSERT, UPDATE, DELETE:** Standard CRUD operations.
* **WHERE, ORDER BY, GROUP BY, HAVING:** Filtering, sorting, and aggregating data.
* **JOINs:** Inner and Outer joins to connect tables (e.g., fetching a student's event registrations with event details).
* **Aggregate Functions:** COUNT(), AVG() for statistics (e.g., average feedback rating).
* **Constraints:** PRIMARY KEY, FOREIGN KEY, UNIQUE (e.g., email), NOT NULL, CHECK (capacity > 0), DEFAULT.
* **Referential Integrity:** Cascading updates or deletes where appropriate.
* **Transactions:** Ensuring multi-step processes like event registration are atomic.
* **Views & Indexes:** Optimizing queries and abstracting complex joins.

## Proposed Queries
* **Upcoming events:** Filters events where `event_date >= CURRENT_DATE`.
* **Students registered for an event:** Joins `event_registration` with `student`.
* **Most active clubs:** Groups by `club_id` and counts events.
* **Average event rating:** Aggregates `rating` from the `feedback` table using `AVG()`.
* **Venue utilization:** Joins `venue` and `event` to find booking frequency.

## Proposed Views
* `Upcoming Events View`
* `Event Registration Summary`
* `Student Participation History`

## Proposed Indexes
* `event_date` in `event` table.
* `student_id` in `event_registration` table.
* `club_id` in `event` table.
