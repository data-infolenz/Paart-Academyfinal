# Faculty Workspace Specification

## Purpose

Defines the `/faculty/*` workspace enabling teaching faculty and administrators to schedule mock and OMR exams, record or CSV-import aspirant test marks, update batch syllabus progress, publish visibility-scoped study materials, and broadcast academic notifications.

## ADDED Requirements

### Requirement: Mock and OMR Exam Scheduling

The system SHALL allow authenticated `faculty` (for their assigned batches/courses, or all active batches when granted academy-wide faculty access) and `admin` users to create and update scheduled exams specifying title, batch/course, exam date, syllabus coverage notes, maximum marks, and qualifying marks.

#### Scenario: Faculty schedules an upcoming batch exam

- **WHEN** an authenticated `faculty` user submits `POST /faculty/exams` with a valid batch, title, exam date, maximum marks (`> 0`), and qualifying marks (`<= max_marks`)
- **THEN** the system persists the exam record in `scheduled` state and makes it visible on upcoming exam lists for aspirants enrolled in that batch

#### Scenario: Invalid qualifying marks rejected

- **WHEN** an authenticated `faculty` user submits an exam where qualifying marks exceed maximum marks or maximum marks are zero/negative
- **THEN** the system rejects the request with validation errors and does not save the exam

### Requirement: Aspirant Exam Marks Entry, CSV Import, and Result Publication

The system SHALL allow `faculty` and `admin` users to enter or bulk-import (`CSV`) exam marks, attendance status (`present` or `absent`), and per-aspirant remarks for enrolled aspirants in an exam's batch, keep draft marks hidden from aspirants until published, and compute batch ranks upon publication.

#### Scenario: Faculty saves draft marks without exposing them to aspirants

- **WHEN** an authenticated `faculty` user saves aspirant scores on `POST /faculty/exams/:id/marks` with publication status left as `draft`
- **THEN** the system persists each aspirant's marks and remarks, validates that marks fall between `0` and the exam's `max_marks`, and keeps the results hidden from `/portal/*` aspirant views

#### Scenario: Faculty imports marks from CSV file

- **WHEN** an authenticated `faculty` user uploads a valid CSV containing aspirant email (or roll identifier), marks obtained, attendance status, and remarks to `POST /faculty/exams/:id/marks/import`
- **THEN** the system validates all rows against enrolled aspirants in that batch and `max_marks`, upserts matching exam result rows, and reports any unmatched or out-of-range rows clearly without partial silent corruption

#### Scenario: Faculty publishes exam results to enrolled aspirants

- **WHEN** an authenticated `faculty` user triggers result publication on `/faculty/exams/:id/publish`
- **THEN** the system marks the exam as `published`, computes deterministic rank order among present aspirants in the batch, and makes individual scorecards immediately visible in each aspirant's portal

### Requirement: Batch Syllabus Progress Tracking

The system SHALL allow `faculty` and `admin` users to manage syllabus modules/topics for a batch or course and update each topic's completion status (`pending`, `in_progress`, `completed`) so enrolled aspirants see accurate syllabus completion percentages.

#### Scenario: Faculty marks syllabus topic completed

- **WHEN** an authenticated `faculty` user updates a batch syllabus topic status to `completed` via `POST /faculty/batches/:id/syllabus`
- **THEN** the system records the completion status and completion timestamp and recalculates the overall syllabus completion percentage displayed to enrolled aspirants

### Requirement: Visibility-Scoped Study Material Publishing

The system SHALL allow `faculty` and `admin` users to create and manage study materials scoped to a course and tagged with visibility `public` (accessible on public `/materials` and in `/portal/materials`) or `enrolled` (accessible only to authenticated staff and aspirants enrolled in that course).

#### Scenario: Faculty publishes enrolled-only study material

- **WHEN** an authenticated `faculty` user submits `POST /faculty/materials` with title, subject, course, resource URL/file metadata, and visibility `enrolled`
- **THEN** the system saves the material record so it appears in `/portal/materials` for aspirants enrolled in that course and is excluded from the unauthenticated public `/materials` catalog

### Requirement: Targeted Academic Notifications

The system SHALL allow `faculty` and `admin` users to publish announcements and exam alerts targeted to all aspirants (`all`), a specific course (`course`), or a specific batch (`batch`).

#### Scenario: Faculty posts batch-targeted exam notification

- **WHEN** an authenticated `faculty` user submits `POST /faculty/notifications` with a title, message body, category, and target batch
- **THEN** the system stores the notification with its publication timestamp and surfaces it in `/portal/notifications` and `/portal` dashboard feeds only for aspirants enrolled in that target batch (plus staff views)
