# Multi-Role Authentication Specification

## Purpose

Defines unified credential sign-in, revocable server-managed sessions, mandatory first-login password rotation, and role-based portal authorization across Administrator, Faculty, and Aspirant accounts.

## Requirements

### Requirement: Unified Credential Sign-In and Role Workspace Routing

The system SHALL authenticate users at `/login` using a normalized email address and password against active database user records, establish an authenticated session on valid credentials, and redirect the user to the workspace corresponding to their assigned role (`admin` to `/admin`, `faculty` to `/faculty`, `aspirant` to `/portal`). Requests to the legacy `/admin/sign-in` path SHALL redirect permanently or temporarily to `/login`.

#### Scenario: Administrator signs in and reaches admin console

- **WHEN** an active user with role `admin` submits valid email and password credentials to `POST /login`
- **THEN** the system creates a new server-side session, sets an `HttpOnly` signed session cookie, and redirects the response to `/admin`

#### Scenario: Faculty signs in with current password and reaches faculty workspace

- **WHEN** an active user with role `faculty` and `must_change_password = false` submits valid credentials to `POST /login`
- **THEN** the system establishes a new session and redirects the response to `/faculty`

#### Scenario: Aspirant signs in with current password and reaches aspirant portal

- **WHEN** an active user with role `aspirant` and `must_change_password = false` submits valid credentials to `POST /login`
- **THEN** the system establishes a new session and redirects the response to `/portal`

#### Scenario: Invalid credentials or suspended account rejected without enumeration

- **WHEN** a visitor submits an unknown email, an incorrect password, or credentials belonging to a `suspended` account to `POST /login`
- **THEN** the system responds with HTTP `422` (or re-renders `/login` with a generic authentication error), creates no session, and does not disclose whether the email address exists

#### Scenario: Legacy admin sign-in URL redirects to unified login

- **WHEN** a browser requests `GET /admin/sign-in`
- **THEN** the system redirects the client to `/login`

### Requirement: Revocable Server-Managed Sessions and Sign-Out

The system SHALL persist active sessions in the database keyed by a cryptographic token hash, rotate session identifiers upon authentication and password changes, and immediately invalidate sessions upon user sign-out (`POST /logout`), session expiration, or account suspension.

#### Scenario: Signed-in user signs out

- **WHEN** an authenticated user submits `POST /logout`
- **THEN** the system deletes or revokes the server-side session record, clears the session cookie, and redirects the user to `/login`

#### Scenario: Revoked or expired session cookie is rejected

- **WHEN** a request arrives carrying a session cookie whose server-side record is expired, deleted, or tied to a `suspended` user
- **THEN** the system treats the caller as unauthenticated, clears the stale cookie, and redirects protected portal requests to `/login`

### Requirement: Mandatory First-Login Password Change

The system SHALL require any authenticated user flagged with `must_change_password = true` to complete a password change at `/account/change-password` before accessing `/admin/*`, `/faculty/*`, or `/portal/*` workspace routes, enforcing password length/strength rules and rejecting reuse of the user's email/name identifiers or current temporary password.

#### Scenario: Provisioned user with temporary password is gated to password change

- **WHEN** a newly provisioned `faculty` or `aspirant` user with `must_change_password = true` signs in at `/login` or requests any route under `/faculty/*` or `/portal/*`
- **THEN** the system redirects the user to `/account/change-password` and blocks workspace access until a new password is saved

#### Scenario: Valid new password clears first-login gate and rotates session

- **WHEN** an authenticated user at `/account/change-password` submits their current password and a compliant new password that passes policy checks
- **THEN** the system updates the stored password hash, sets `must_change_password = false`, revokes prior sessions for that user while issuing a fresh session cookie, and redirects to the user's role workspace

#### Scenario: Weak or identifier-matching password rejected

- **WHEN** an authenticated user submits a new password shorter than the minimum policy length, matching disallowed common terms, matching their email/name identifiers, or identical to their current temporary password
- **THEN** the system rejects the submission with validation feedback and keeps `must_change_password = true`

### Requirement: Role-Based Workspace and Action Isolation

The system SHALL enforce role-based authorization on all `/admin/*`, `/faculty/*`, and `/portal/*` routes and form actions so that unauthenticated visitors are redirected to `/login` and authenticated users attempting to access another role's restricted routes receive HTTP `403 Forbidden`.

#### Scenario: Aspirant cannot access faculty or admin routes

- **WHEN** an authenticated user with role `aspirant` sends a `GET` or `POST` request to `/faculty/*` or `/admin/*`
- **THEN** the system denies the request with HTTP `403 Forbidden` without executing the controller handler

#### Scenario: Faculty cannot access admin-only user management routes

- **WHEN** an authenticated user with role `faculty` sends a `GET` or `POST` request to `/admin/*`
- **THEN** the system denies the request with HTTP `403 Forbidden`

#### Scenario: Public navigation reflects active session workspace

- **WHEN** an authenticated user visits any public marketing page (`/`, `/courses`, `/materials`, `/results`, `/about`, `/admissions`)
- **THEN** the public site header displays a direct workspace link to `/admin`, `/faculty`, or `/portal` matching the signed-in user's role
