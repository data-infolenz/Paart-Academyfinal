---
trigger: always_on
description: Real-time event architecture, WebSocket signaling, Redis pub/sub broadcasting, and resilient CacheStore patterns.
---

## Real-Time, Event & Cache Architecture

### 1. Event Flow Patterns
- **Chat Messages (Low Latency)**:
  `Client WS Send` $\rightarrow$ `API / DB Service` $\rightarrow$ `Redis Event Bus` $\rightarrow$ `WS Broadcast`
- **Other State Changes (Standard Mutation)**:
  `HTTP Request` $\rightarrow$ `API / DB Service` $\rightarrow$ `Redis Event Bus` $\rightarrow$ `WS Broadcast`
- **Ephemeral Signals (Typing indicators, presence pings)**:
  Direct WebSocket broadcast without persistence or Redis queuing.

### 2. WebSocket Host & Redis Event Subscriptions
- Shared WebSocket protocol, topics, and Redis fanout primitives live in `packages/realtime/` (`@jchat/realtime`).
- In `apps/chat-remix/`, WebSocket connections and room registries live under `apps/chat-remix/app/realtime/` and are served by `apps/chat-remix/wsserver.ts`.
- In `apps/chat/`, Redis events are subscribed under `apps/chat/api/events/`.
- Always guard outbound WebSocket sends and closes against non-open socket states (`ws.readyState === undefined || ws.readyState === 1`).
- Use atomic Lua scripts for high-frequency sliding-window counters (e.g. rate-limiting, flood checks, repeat detection) to eliminate race conditions and reduce network round-trips.
- Keep event payloads lean; reference IDs rather than embedding large nested data trees where possible.

### 3. Resilient Cache Layer (`@jchat/realtime` `CacheStore`)
- Use `RedisCacheStore` with `InMemoryCacheStore` fallback from `@jchat/realtime` (`apps/chat-remix/app/data/cache.ts`) for distributed key-value, hash, set, and counter caching.
- Prefer read-through `cache.fetch(key, loader, { ttlSeconds })` for entity lookups:
  - Automatically revives ISO 8601 UTC date strings back into native `Date` instances on Redis JSON reads (`reviveDates` / `isoDateReviver`) and isolates in-memory entries via `structuredClone`.
  - Never caches `null` or `undefined` loader results so missing/deleted records do not pollute Redis.
- Never store secrets (`SiteSettings`) in `CacheStore`. Always pair write mutations with explicit cache invalidation (`delete` / `deleteByPattern`).
