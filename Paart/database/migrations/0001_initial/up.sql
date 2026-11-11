CREATE TABLE IF NOT EXISTS "courses" (
  "id" text PRIMARY KEY NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "title" text NOT NULL,
  "category" text NOT NULL,
  "short_description" text NOT NULL,
  "duration" text NOT NULL DEFAULT 'Flexible weekday & weekend batches',
  "eligibility" text NOT NULL DEFAULT 'As per official recruitment notification',
  "image" text NOT NULL DEFAULT '/images/course-exam-1.jpg',
  "features" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "exam_stages" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "details" jsonb,
  "enabled" boolean NOT NULL DEFAULT true,
  "display_order" integer NOT NULL DEFAULT 0,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "courses_category_idx" ON "courses" ("category");
CREATE INDEX IF NOT EXISTS "courses_enabled_order_idx" ON "courses" ("enabled", "display_order");

CREATE TABLE IF NOT EXISTS "materials" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "category" text NOT NULL DEFAULT 'Study Material',
  "description" text NOT NULL DEFAULT '',
  "file_url" text NOT NULL DEFAULT '',
  "external_url" text NOT NULL DEFAULT '',
  "published" boolean NOT NULL DEFAULT true,
  "display_order" integer NOT NULL DEFAULT 0,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "blogs" (
  "id" text PRIMARY KEY NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "title" text NOT NULL,
  "short_description" text NOT NULL DEFAULT '',
  "content" text NOT NULL DEFAULT '',
  "author" text NOT NULL DEFAULT 'PAART Academic Team',
  "published_date" text NOT NULL,
  "category" text NOT NULL DEFAULT 'TNPSC',
  "featured_image" text NOT NULL DEFAULT '/images/classroom-1.jpg',
  "seo_title" text NOT NULL DEFAULT '',
  "meta_description" text NOT NULL DEFAULT '',
  "published" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "gallery_items" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL DEFAULT '',
  "category" text NOT NULL DEFAULT 'Classroom',
  "image" text NOT NULL,
  "video_url" text,
  "display_order" integer NOT NULL DEFAULT 0,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "enquiries" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "phone" text NOT NULL,
  "email" text,
  "district" text,
  "course_interested" text NOT NULL,
  "message" text NOT NULL DEFAULT '',
  "status" text NOT NULL DEFAULT 'New',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "enquiries_status_created_idx" ON "enquiries" ("status", "created_at" DESC);

CREATE TABLE IF NOT EXISTS "admissions" (
  "id" text PRIMARY KEY NOT NULL,
  "application_id" text NOT NULL UNIQUE,
  "student_name" text NOT NULL,
  "parent_name" text NOT NULL DEFAULT '',
  "date_of_birth" text NOT NULL DEFAULT '',
  "gender" text NOT NULL DEFAULT '',
  "mobile" text NOT NULL,
  "whatsapp" text NOT NULL DEFAULT '',
  "email" text NOT NULL DEFAULT '',
  "address" text NOT NULL DEFAULT '',
  "city" text NOT NULL DEFAULT '',
  "district" text NOT NULL DEFAULT 'Tenkasi',
  "state" text NOT NULL DEFAULT 'Tamil Nadu',
  "pincode" text NOT NULL DEFAULT '',
  "course_interested" text NOT NULL,
  "previous_qualification" text NOT NULL DEFAULT '',
  "school_college_name" text NOT NULL DEFAULT '',
  "year_of_passing" text NOT NULL DEFAULT '',
  "marks_percentage" text NOT NULL DEFAULT '',
  "preferred_batch" text NOT NULL DEFAULT 'Regular Weekday',
  "message" text NOT NULL DEFAULT '',
  "photo_url" text,
  "document_url" text,
  "status" text NOT NULL DEFAULT 'New',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "admissions_status_created_idx" ON "admissions" ("status", "created_at" DESC);

CREATE TABLE IF NOT EXISTS "site_settings" (
  "id" text PRIMARY KEY NOT NULL,
  "site_name" text NOT NULL,
  "phone" text NOT NULL,
  "whatsapp" text NOT NULL,
  "email" text NOT NULL,
  "address_primary" text NOT NULL,
  "address_secondary" text NOT NULL DEFAULT '',
  "hours" text NOT NULL,
  "seo_title" text NOT NULL,
  "seo_description" text NOT NULL,
  "canonical_url" text NOT NULL,
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

