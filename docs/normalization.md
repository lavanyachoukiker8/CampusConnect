# Normalization

## UNF to 1NF
All multi-valued attributes are removed. For instance, if a student was in multiple clubs, we created a junction table `club_membership` instead of having an array of club IDs in the `student` table. All attributes are atomic.

## 1NF to 2NF
All non-key attributes are fully functionally dependent on the entire primary key. In `club_membership`, attributes like `join_date` depend on the composite of the transaction (represented by the surrogate key `membership_id` which uniquely identifies the `student_id` and `club_id` pairing). No partial dependencies exist.

## 2NF to 3NF
No transitive dependencies exist. For example, the `event` table does not store the `venue_name` alongside the `venue_id`. Instead, it only holds the foreign key `venue_id`. The `venue_name` is dependent on `venue_id`, ensuring the schema is in 3NF.
