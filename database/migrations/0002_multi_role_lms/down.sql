ALTER TABLE "admissions"
  DROP COLUMN IF EXISTS "provisioned_user_id";

DROP INDEX IF EXISTS "materials_visibility_course_idx";

ALTER TABLE "materials"
  DROP COLUMN IF EXISTS "uploaded_by",
  DROP COLUMN IF EXISTS "visibility",
  DROP COLUMN IF EXISTS "course_id";

DROP TABLE IF EXISTS "notifications" CASCADE;
DROP TABLE IF EXISTS "exam_results" CASCADE;
DROP TABLE IF EXISTS "exams" CASCADE;
DROP TABLE IF EXISTS "syllabus_topics" CASCADE;
DROP TABLE IF EXISTS "enrollments" CASCADE;
DROP TABLE IF EXISTS "batches" CASCADE;
DROP TABLE IF EXISTS "sessions" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

