# Vercel Deployment Specification

## Purpose

Defines build, runtime packaging, serverless database connectivity, and edge asset routing requirements for deploying PAART Academy to Vercel via Pitlane and Nitro.

## Requirements

### Requirement: Nitro-Driven Vercel Build Output Generation

The system SHALL detect `VERCEL=1` during production builds and compile the Remix 3 application using Nitro into standard Vercel Functions and Edge static assets conforming to Vercel's Build Output API v3 specification without requiring manual framework preset overrides on Vercel.

#### Scenario: Production build on Vercel generates serverless build output

- **WHEN** `npm run build` runs in an environment where `VERCEL=1` is set
- **THEN** the build produces `.vercel/output/static` for public client assets and `.vercel/output/functions` for serverless route handling with exit code `0`

#### Scenario: Local production build preserves standard output

- **WHEN** `npm run build` runs in a local environment where `VERCEL=1` is not set
- **THEN** the build compiles `dist/client` and `dist/ssr` for standard Node.js server execution

### Requirement: Serverless PostgreSQL Pool Configuration

The system SHALL configure database connection pooling with bounded concurrency, connection acquisition timeouts, and SSL negotiation suited for serverless connection poolers (Neon, Supabase Supavisor, or AWS RDS Proxy), preventing database connection exhaustion during traffic bursts.

#### Scenario: Serverless function connects to pooled PostgreSQL database

- **WHEN** a serverless function processes an incoming request with a valid `DATABASE_URL` pointing to a pooled database endpoint
- **THEN** the system establishes a connection with a timeout of 5 seconds or less and closes or reuses pooled connections safely across invocations

#### Scenario: Connection pool limit respected in serverless runtime

- **WHEN** multiple concurrent serverless function instances handle traffic
- **THEN** each instance maintains a lean connection pool (`max` <= 5) to prevent overwhelming the upstream database server

### Requirement: Edge CDN Static Asset Delivery

The system SHALL serve static frontend bundles, fonts, images, and precompiled client scripts directly through Vercel's Edge CDN with immutable HTTP cache headers (`Cache-Control: public, max-age=31536000, immutable`), bypassing serverless function execution for static assets.

#### Scenario: Visitor requests a hashed client asset

- **WHEN** a browser requests a static bundle from `/assets/*` or a public image
- **THEN** the response is delivered directly from the Edge cache with HTTP `200` and an immutable cache header

### Requirement: Serverless Environment Variable and Secret Integration

The system SHALL resolve runtime secrets (`PAART_AUTH_SECRET`, `PAART_HONEYPOT_SECRET`, `DATABASE_URL`, `PAART_ADMIN_EMAIL`, `PAART_ADMIN_PASSWORD`, and SMTP credentials) from Vercel environment variables without requiring disk-based `.env` files in production.

#### Scenario: Serverless function initializes with platform environment variables

- **WHEN** a request executes inside a Vercel serverless function
- **THEN** `appConfig` validates and resolves all required configuration directly from `process.env` and handles authentication and signing securely
