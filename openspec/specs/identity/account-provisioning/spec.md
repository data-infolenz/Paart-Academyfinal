# Account Provisioning Specification

## Purpose

Defines closed Administrator-only user creation, temporary password generation, SMTP email delivery, credential re-issuance, admissions-to-aspirant conversion, and account suspension lifecycle controls.

## Requirements

### Requirement: Closed Administrator-Only Account Creation

The system SHALL restrict creation of `faculty` and `aspirant` accounts exclusively to authenticated `admin` users (exposing no public self-registration endpoint), normalizing recipient email addresses, enforcing email uniqueness, generating a high-entropy random temporary password, and marking newly created accounts with `must_change_password = true`.

#### Scenario: Administrator provisions a new faculty account

- **WHEN** an authenticated `admin` submits `POST /admin/users` with role `faculty`, a unique valid email address, full name, and optional phone/department details
- **THEN** the system creates an active `users` record with role `faculty`, stores only the cryptographic hash of the generated temporary password, sets `must_change_password = true`, and initiates credential email delivery

#### Scenario: Administrator provisions an aspirant with batch enrollment

- **WHEN** an authenticated `admin` submits `POST /admin/users` with role `aspirant`, a unique valid email address, full name, and a selected course/batch
- **THEN** the system creates the `aspirant` user record with `must_change_password = true` and creates an active enrollment linking the aspirant to the selected batch and course

#### Scenario: Duplicate email address rejected during provisioning

- **WHEN** an authenticated `admin` attempts to create an account using an email address that already exists after case and whitespace normalization
- **THEN** the system rejects the request with a validation error without overwriting the existing user or sending credentials

### Requirement: SMTP Welcome Email and Credential Re-Issuance

The system SHALL send newly generated temporary credentials to the user's email address over SMTP using a formatted transactional email containing the user's role, sign-in URL, email address, and temporary password, and SHALL allow an Administrator to rotate a user's temporary password and resend credentials on demand.

#### Scenario: Welcome email sent over SMTP on user creation

- **WHEN** a new `faculty` or `aspirant` account is created by an Administrator
- **THEN** the system dispatches a multipart HTML and plain-text welcome email via the configured SMTP transport containing the login URL and temporary password, and records the credential delivery timestamp/status on the user management view

#### Scenario: SMTP delivery failure handled gracefully without losing account state

- **WHEN** the SMTP server is unreachable or rejects delivery during user creation or credential reset
- **THEN** the system logs the transport error without exposing stack traces or plaintext secrets in the browser, surfaces a clear warning banner to the Administrator that email delivery failed, and allows the Administrator to retry via "Reset & Resend Credentials"

#### Scenario: Administrator resets and resends credentials for locked-out user

- **WHEN** an authenticated `admin` triggers `POST /admin/users/:id/resend-credentials` for a `faculty` or `aspirant` user
- **THEN** the system generates a fresh random temporary password, updates the stored password hash, sets `must_change_password = true`, revokes all existing sessions for that user, and sends a new SMTP credential email

### Requirement: One-Click Aspirant Provisioning from Admissions

The system SHALL allow an Administrator reviewing an admission inquiry in `/admin/admissions` to provision an `aspirant` account and batch enrollment directly from the applicant's submitted name, email, phone, and target course.

#### Scenario: Approved admission applicant converted into enrolled aspirant

- **WHEN** an authenticated `admin` submits the provision-aspirant action on an `/admin/admissions` application with a valid email address and target batch
- **THEN** the system creates (or links if requested explicitly) the `aspirant` user account, enrolls the aspirant in the selected batch, marks the admission status as `enrolled`, and dispatches the SMTP welcome email with temporary login credentials

### Requirement: Account Suspension and Reactivation

The system SHALL allow an Administrator to suspend or reactivate `faculty` and `aspirant` accounts while preventing Administrators from suspending their own active account.

#### Scenario: Administrator suspends an active faculty or aspirant account

- **WHEN** an authenticated `admin` submits `POST /admin/users/:id/status` setting status to `suspended` for another user
- **THEN** the system updates the user's status to `suspended` and immediately deletes/revokes all active sessions belonging to that user

#### Scenario: Administrator prevented from self-suspension

- **WHEN** an authenticated `admin` attempts to suspend their own user ID
- **THEN** the system rejects the mutation with HTTP `422` and preserves the Administrator's active status
