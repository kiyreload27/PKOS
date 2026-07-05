# PKOS AI Handover Document

This document is designed to give an LLM (like GPT) complete context on the PKOS (Personal Knowledge Operating System) codebase. It covers the architecture, the technology stack, the UI flow, and the backend domain model.

## 1. Executive Summary & Vision
**PKOS** is an intelligent, universally composable Knowledge Graph. It acts as an "operating system" for a user's knowledge, replacing traditional folder structures with a highly interconnected semantic graph.

**Core Philosophy:**
- **Zero-Dependency Domain:** The core logic of the application lives in `@pkos/domain`, which is pure TypeScript with zero runtime dependencies (no Prisma, no Zod, no framework). It models the ubiquitous language of the system using Domain-Driven Design (DDD).
- **Infinite Composability:** Everything in PKOS revolves around a lightweight `Entity` object. An Entity is just an identity anchor. Semantic meaning, resources, traits, capabilities, and observations are attached to Entities, never baked into them.
- **CQRS & Event-Driven:** Every mutation emits an event (e.g., `ENTITY_CREATED`) on an `EventBus`. Background workers process these events asynchronously (using BullMQ and Redis) to classify, summarize, embed, and discover relationships.

## 2. Technology Stack & Infrastructure
- **Monorepo:** Turborepo + pnpm
- **Frontend:** Next.js 16 (App Router, Turbopack, Tailwind CSS, Lucide Icons)
- **Database:** PostgreSQL 16 (Managed via Prisma)
- **Background Tasks:** Redis 7 + BullMQ
- **Validation:** Zod (Isolated in `@pkos/validation`)

## 3. Monorepo Structure
The repository is split into distinct packages enforcing separation of concerns:

```text
apps/
  ├── web/           (Next.js frontend. Projections and Actions)
  ├── worker/        (BullMQ background processor. Consumes the EventBus)
packages/
  ├── domain/        (Pure TS: Interfaces, Value Objects, Domain Services, Aggregates)
  ├── database/      (Prisma schema, Prisma client, Repository implementations)
  ├── validation/    (Zod schemas for API boundary validation)
```

**Architectural Rule:** `apps/web` and `apps/worker` may import from `database`, `validation`, and `domain`. `database` and `validation` import from `domain`. `domain` imports NOTHING.

## 4. The Domain Model (DDD Aggregates)
The database is strictly modeled around DDD Aggregates.

1. **Entity Aggregate:**
   - `Entity`: The anchor. Contains an ID, TypeId, and an Owner.
   - `Identity`: External IDs and Aliases.
   - `Traits` & `Capabilities`: String arrays defining what the entity IS and what it CAN DO.
2. **Context Aggregate (`Context`):**
   - Represents a workspace, project, or scope (e.g., "Alpha Project").
   - Groups related entities and tracks active participants/resources.
3. **Resource Aggregate (`Resource`, `SyncState`):**
   - Represents an external file, URI, or block of data.
   - Tied to an Entity. Tracks sync status with external providers (e.g., GitHub, Google Drive).
4. **Knowledge Aggregate (`Relationship`, `Observation`):**
   - `Relationship`: Directed edges between Entities (e.g., `Entity A --[REFERENCES]--> Entity B`).
   - `Observation`: AI-generated insights or conclusions drawn from Entities.
5. **History Aggregate (`PKOSEvent`):**
   - An append-only log of every mutation in the system. Used for event sourcing, timeline projections, and undo/redo capabilities.

## 5. UI Walkthrough & Application Flow
The frontend (`apps/web`) running on `http://localhost:3000` features a modern, dark-themed (neutral-950) dashboard interface.

- **Sidebar Navigation:**
  - **Universal Capture (Home - `/`)**: The central interaction point. Features a text area where users dump unstructured thought. Real-time background tasks (shown via a ticker) parse the input, identify confidence levels (e.g., "Text Note 45%"), and asynchronously route it through the knowledge pipeline.
  - **Projects Sidebar**: Users can click a `+` icon to dynamically create a `Context` (project). Projects appear instantly in the sidebar and link to `/projects/[uuid]`.
  - **Timeline (`/timeline`)**: A reverse-chronological feed projecting the `PKOSEvent` table. It displays exactly when an Entity was created, updated, or classified, including the raw JSON payload of the event.
  - **Settings & Graph**: Placeholders for future projections.

**The Knowledge Pipeline Flow:**
1. User types in the Universal Capture box on `/` and hits Save.
2. The Next.js API (`POST /api/capture`) inserts an `Entity` and a `PKOSEvent` into PostgreSQL.
3. The API drops a job onto the `pkos-workflows` BullMQ queue in Redis.
4. `apps/worker` picks up the job. In a fully implemented state, it runs the pipeline: `Normalisation -> Classification -> Embedding -> Relationship Discovery -> Observation Generation`.

## 6. Current Implementation State
- **Phase 0 (Completed):** Complete rewrite of the architectural foundation to support DDD. The `domain`, `validation`, and `database` packages are built and compiled.
- **Phase 1 (Completed):** Infrastructure successfully provisioned. Docker containers (Postgres, Redis) are running. The legacy API routes in the Next.js app were stubbed out so the UI successfully builds against the new Prisma schema. The application is officially running locally.
- **Phase 2 (Upcoming):** Building the robust Capture Engine in `apps/worker` to fully realize the Knowledge Pipeline.

---
*End of Handover Document. AI Agents reading this should adhere strictly to the Domain-Driven Design rules specified in Section 3 and 4.*
