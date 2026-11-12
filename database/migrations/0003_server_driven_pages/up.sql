CREATE TABLE IF NOT EXISTS "pages" (
  "id" text PRIMARY KEY NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "title" text NOT NULL,
  "kind" text NOT NULL DEFAULT 'static_page' CHECK ("kind" IN ('static_page', 'collection_template')),
  "status" text NOT NULL DEFAULT 'draft' CHECK ("status" IN ('draft', 'published')),
  "is_system" boolean NOT NULL DEFAULT false,
  "draft_blocks" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "published_blocks" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "seo" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "version" integer NOT NULL DEFAULT 1,
  "published_version" integer NOT NULL DEFAULT 0,
  "updated_by" text REFERENCES "users"("id") ON DELETE SET NULL,
  "published_by" text REFERENCES "users"("id") ON DELETE SET NULL,
  "published_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "pages_kind_status_idx" ON "pages" ("kind", "status");

CREATE TABLE IF NOT EXISTS "page_revisions" (
  "id" text PRIMARY KEY NOT NULL,
  "page_id" text NOT NULL REFERENCES "pages"("id") ON DELETE CASCADE,
  "version" integer NOT NULL,
  "blocks" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "seo" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "diff_patch" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "note" text NOT NULL DEFAULT '',
  "created_by" text REFERENCES "users"("id") ON DELETE SET NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "page_revisions_page_version_idx" ON "page_revisions" ("page_id", "version" DESC);

CREATE TABLE IF NOT EXISTS "site_chrome" (
  "id" text PRIMARY KEY NOT NULL,
  "utility_bar" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "header_nav" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "header_ctas" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "footer_columns" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "trust_profile" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "version" integer NOT NULL DEFAULT 1,
  "updated_by" text REFERENCES "users"("id") ON DELETE SET NULL,
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

