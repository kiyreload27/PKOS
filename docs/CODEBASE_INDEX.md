# CODEBASE INDEX

## `apps/web`
- **What it contains:** The Next.js 16 frontend application.
- **Key files:** 
  - `app/page.tsx` (Daily Briefing)
  - `app/capture/page.tsx` (Universal Capture UI)
  - `components/CommandPalette.tsx` (Global cmd+k search)
  - `components/layout/sidebar.tsx` (Project & navigation)
- **Responsibility:** Rendering projection data securely to the user, accepting inputs, and firing actions/events. Strictly isolated from pure domain logic.

## `apps/worker`
- **What it contains:** The BullMQ processing server.
- **Key files:** 
  - `src/index.ts` (Queue listener setup)
- **Responsibility:** Doing the heavy lifting asynchronously. It talks to LLMs, parses data, and writes the results back as PKOSEvents.

## `packages/domain`
- **What it contains:** Pure TypeScript modeling of the PKOS universe. Zero runtime dependencies.
- **Key files:**
  - `src/aggregates/Entity.ts`
  - `src/events/PKOSEvent.ts`
- **Responsibility:** Defining the ubiquitous language. If an object isn't defined here, it doesn't exist in PKOS.

## `packages/projections`
- **What it contains:** Event handlers for read-model materialization.
- **Key files:** 
  - Handlers mapping `PKOSEvent` to UI tables.
- **Responsibility:** Translating the immutable event log into fast, queryable SQL tables optimized for UI rendering.

## `packages/database`
- **What it contains:** Prisma schema and generated client.
- **Key files:** 
  - `prisma/schema.prisma`
- **Responsibility:** Managing the Postgres structure for both the Event Store and the Projections.

## `packages/validation`
- **What it contains:** Zod schemas.
- **Responsibility:** Validating data at the API boundaries to prevent malformed events from entering the domain.
