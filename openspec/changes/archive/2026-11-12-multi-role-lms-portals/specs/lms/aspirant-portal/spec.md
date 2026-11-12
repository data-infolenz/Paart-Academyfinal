# Aspirant Portal Specification

## Purpose

Defines the `/portal/*` workspace where enrolled aspirants monitor their syllabus progress and score trends, check upcoming exams, review published test marks and ranks, access enrolled study materials, and read targeted academy notifications.

## ADDED Requirements

### Requirement: Aspirant Progress and Performance Overview

The system SHALL render a personalized dashboard at `/portal` (and `/portal/progress`) for authenticated `aspirant` users showing their active course/batch enrollments, syllabus completion percentage and module checklist, completed test count, average test percentage, and chronological score progression across published exams.

#### Scenario: Enrolled aspirant views progress dashboard

- **WHEN** an authenticated `aspirant` with an active batch enrollment requests `GET /portal`
- **THEN** the system displays the aspirant's batch and course name, calculated syllabus completion percentage (`completed_topics / total_topics`), topic-by-topic completion statuses, summary KPIs from published exams, and a chronological score trend visual

#### Scenario: Newly provisioned aspirant with zero published exams views dashboard

- **WHEN** an authenticated `aspirant` who has no published exam results requests `GET /portal`
- **THEN** the system renders the enrolled batch syllabus progress alongside a clear empty state for exam scores without errors or division-by-zero artifacts

### Requirement: Upcoming Exam Schedule View

The system SHALL display at `/portal/exams` all upcoming and past scheduled exams belonging to the authenticated aspirant's enrolled batch(es), including exam date, course/batch, syllabus coverage notes, maximum marks, and qualifying marks.

#### Scenario: Aspirant views upcoming exams for enrolled batch only

- **WHEN** an authenticated `aspirant` requests `GET /portal/exams`
- **THEN** the system lists scheduled exams matching the aspirant's active batch/course enrollments ordered chronologically and excludes exams belonging to batches in which the aspirant is not enrolled

### Requirement: Published Test Marks and Scorecard History

The system SHALL display at `/portal/marks` only `published` exam results belonging to the authenticated aspirant, including marks obtained, maximum marks, percentage, qualify/pass status, computed batch rank, attendance status, and faculty remarks, while strictly isolating other aspirants' individual marks.

#### Scenario: Aspirant inspects published exam scorecards

- **WHEN** an authenticated `aspirant` requests `GET /portal/marks`
- **THEN** the system renders the aspirant's own results for exams in `published` status, showing marks, percentage, batch rank, qualify indicator, and faculty remarks, while omitting any `draft` exam scores

#### Scenario: Aspirant cannot view another aspirant's scorecard

- **WHEN** an authenticated `aspirant` requests `/portal/marks` or supplies query/path parameters referencing another aspirant's user or result identifier
- **THEN** the system scopes all database queries to the authenticated session user's ID and never returns another aspirant's marks or personal details

### Requirement: Enrolled and Public Study Materials Access

The system SHALL display at `/portal/materials` both general/`public` materials and `enrolled`-visibility materials matching the aspirant's active course enrollments, and SHALL prevent unauthenticated visitors or unenrolled aspirants from accessing `enrolled`-only material resources.

#### Scenario: Enrolled aspirant accesses course-restricted study materials

- **WHEN** an authenticated `aspirant` enrolled in Course A requests `GET /portal/materials`
- **THEN** the system lists published `enrolled` materials for Course A alongside general `public` materials, while excluding `enrolled` materials restricted solely to Course B

#### Scenario: Unauthenticated visitor does not see enrolled-only materials on public page

- **WHEN** an unauthenticated visitor requests `GET /materials`
- **THEN** the system returns only published materials marked with `visibility = 'public'`

### Requirement: Targeted Notifications Feed

The system SHALL display at `/portal/notifications` (and recent highlights on `/portal`) published notifications targeted to `all` aspirants, to any course in which the aspirant is enrolled, or to any batch in which the aspirant is enrolled, ordered newest-first.

#### Scenario: Aspirant views targeted notifications feed

- **WHEN** an authenticated `aspirant` enrolled in Batch X (Course Y) requests `GET /portal/notifications`
- **THEN** the system lists published notifications scoped to `all`, Course Y, or Batch X ordered from newest to oldest, and excludes notifications targeted to unrelated courses or batches
