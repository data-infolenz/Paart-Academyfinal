CREATE TABLE IF NOT EXISTS "users" (
  "id" text PRIMARY KEY NOT NULL,
  "email" text NOT NULL UNIQUE,
  "full_name" text NOT NULL,
  "phone" text NOT NULL DEFAULT '',
  "department" text NOT NULL DEFAULT '',
  "role" text NOT NULL CHECK ("role" IN ('admin', 'faculty', 'aspirant')),
  "password_hash" text NOT NULL,
  "must_change_password" boolean NOT NULL DEFAULT true,
  "status" text NOT NULL DEFAULT 'active' CHECK ("status" IN ('active', 'suspended')),
  "last_login_at" timestamptz,
  "credentials_sent_at" timestamptz,
  "credentials_delivery_error" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "users_role_status_idx" ON "users" ("role", "status");

CREATE TABLE IF NOT EXISTS "sessions" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "token_hash" text NOT NULL UNIQUE,
  "ip_address" text NOT NULL DEFAULT '',
  "user_agent" text NOT NULL DEFAULT '',
  "expires_at" timestamptz NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "sessions_user_id_idx" ON "sessions" ("user_id");
CREATE INDEX IF NOT EXISTS "sessions_expires_at_idx" ON "sessions" ("expires_at");

CREATE TABLE IF NOT EXISTS "batches" (
  "id" text PRIMARY KEY NOT NULL,
  "course_id" text NOT NULL REFERENCES "courses"("id") ON DELETE RESTRICT,
  "faculty_id" text REFERENCES "users"("id") ON DELETE SET NULL,
  "name" text NOT NULL,
  "code" text NOT NULL UNIQUE,
  "schedule_label" text NOT NULL DEFAULT '',
  "starts_on" text NOT NULL DEFAULT '',
  "ends_on" text NOT NULL DEFAULT '',
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "batches_course_active_idx" ON "batches" ("course_id", "is_active");
CREATE INDEX IF NOT EXISTS "batches_faculty_idx" ON "batches" ("faculty_id");

CREATE TABLE IF NOT EXISTS "enrollments" (
  "id" text PRIMARY KEY NOT NULL,
  "batch_id" text NOT NULL REFERENCES "batches"("id") ON DELETE CASCADE,
  "aspirant_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "admission_id" text REFERENCES "admissions"("id") ON DELETE SET NULL,
  "roll_number" text NOT NULL,
  "status" text NOT NULL DEFAULT 'active' CHECK ("status" IN ('active', 'completed', 'dropped')),
  "enrolled_at" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "enrollments_batch_aspirant_uq" UNIQUE ("batch_id", "aspirant_id"),
  CONSTRAINT "enrollments_batch_roll_uq" UNIQUE ("batch_id", "roll_number")
);

CREATE INDEX IF NOT EXISTS "enrollments_aspirant_status_idx" ON "enrollments" ("aspirant_id", "status");

CREATE TABLE IF NOT EXISTS "syllabus_topics" (
  "id" text PRIMARY KEY NOT NULL,
  "batch_id" text NOT NULL REFERENCES "batches"("id") ON DELETE CASCADE,
  "unit_label" text NOT NULL DEFAULT 'Unit 1',
  "title" text NOT NULL,
  "sort_order" integer NOT NULL DEFAULT 0,
  "status" text NOT NULL DEFAULT 'pending' CHECK ("status" IN ('pending', 'in_progress', 'completed')),
  "completed_at" timestamptz,
  "updated_by" text REFERENCES "users"("id") ON DELETE SET NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "syllabus_topics_batch_order_idx" ON "syllabus_topics" ("batch_id", "sort_order");

CREATE TABLE IF NOT EXISTS "exams" (
  "id" text PRIMARY KEY NOT NULL,
  "batch_id" text NOT NULL REFERENCES "batches"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "exam_type" text NOT NULL DEFAULT 'weekly_mock' CHECK ("exam_type" IN ('weekly_mock', 'omr_revision', 'full_test')),
  "exam_date" text NOT NULL,
  "syllabus_notes" text NOT NULL DEFAULT '',
  "max_marks" numeric(6, 2) NOT NULL CHECK ("max_marks" > 0),
  "qualifying_marks" numeric(6, 2) NOT NULL CHECK ("qualifying_marks" >= 0 AND "qualifying_marks" <= "max_marks"),
  "status" text NOT NULL DEFAULT 'scheduled' CHECK ("status" IN ('scheduled', 'published')),
  "published_at" timestamptz,
  "created_by" text REFERENCES "users"("id") ON DELETE SET NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "exams_batch_date_idx" ON "exams" ("batch_id", "exam_date");

CREATE TABLE IF NOT EXISTS "exam_results" (
  "id" text PRIMARY KEY NOT NULL,
  "exam_id" text NOT NULL REFERENCES "exams"("id") ON DELETE CASCADE,
  "aspirant_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "attendance" text NOT NULL DEFAULT 'present' CHECK ("attendance" IN ('present', 'absent')),
  "marks_obtained" numeric(6, 2) NOT NULL DEFAULT 0 CHECK ("marks_obtained" >= 0),
  "rank" integer,
  "remarks" text NOT NULL DEFAULT '',
  "updated_by" text REFERENCES "users"("id") ON DELETE SET NULL,
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "exam_results_exam_aspirant_uq" UNIQUE ("exam_id", "aspirant_id")
);

CREATE INDEX IF NOT EXISTS "exam_results_aspirant_idx" ON "exam_results" ("aspirant_id");

CREATE TABLE IF NOT EXISTS "notifications" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "body" text NOT NULL,
  "category" text NOT NULL DEFAULT 'general' CHECK ("category" IN ('exam', 'material', 'schedule', 'general')),
  "target_scope" text NOT NULL DEFAULT 'all' CHECK ("target_scope" IN ('all', 'course', 'batch')),
  "target_course_id" text REFERENCES "courses"("id") ON DELETE CASCADE,
  "target_batch_id" text REFERENCES "batches"("id") ON DELETE CASCADE,
  "published_by" text REFERENCES "users"("id") ON DELETE SET NULL,
  "published_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "notifications_scope_published_idx" ON "notifications" ("target_scope", "published_at" DESC);

ALTER TABLE "materials"
  ADD COLUMN IF NOT EXISTS "course_id" text REFERENCES "courses"("id") ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS "visibility" text NOT NULL DEFAULT 'public' CHECK ("visibility" IN ('public', 'enrolled')),
  ADD COLUMN IF NOT EXISTS "uploaded_by" text REFERENCES "users"("id") ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS "materials_visibility_course_idx" ON "materials" ("visibility", "course_id");

ALTER TABLE "admissions"
  ADD COLUMN IF NOT EXISTS "provisioned_user_id" text REFERENCES "users"("id") ON DELETE SET NULL;

