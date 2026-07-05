# ARCHITECTURE MAP

## System Map

```text
apps/web (Next.js UI)
  │
  ├── Reads from -> packages/database (Projection Tables)
  │
  └── Writes to -> packages/api (Capture Routes)
                      │
                      └── Emits -> PKOSEvent (PostgreSQL)
                            │
                            └── Dispatches to -> Redis Queue (pkos-workflows)

apps/worker (BullMQ Background Processor)
  │
  ├── Consumes from -> Redis Queue
  │
  ├── Uses -> packages/workers (Enrichment Pipelines)
  │           ├── Identity Engine
  │           ├── Classification Engine
  │           ├── Relationship Engine
  │           ├── Observation Engine
  │           └── Summary Engine
  │
  ├── Executes -> AI API Calls (OpenAI/Claude)
  │
  └── Emits -> New PKOSEvents (PostgreSQL)

packages/projections (Asynchronous Materializers)
  │
  ├── Listens for -> PKOSEvents
  │
  └── Writes directly to -> packages/database (Projection Tables)
```

## Where Things Happen

- **Where AI is used:** Only inside `apps/worker` via the `packages/workers` pipelines. AI is used strictly for parsing, summarizing, and suggesting connections. It is never used synchronously in the web application.
- **Where async processing happens:** All logic after the initial `CAPTURE_RECEIVED` event happens asynchronously in `apps/worker` using BullMQ.
- **Where state is stored:** 
  - **Canonical State:** The `PKOSEvent` append-only table in PostgreSQL (`packages/database`).
  - **Derived State:** The Projection tables in PostgreSQL (e.g., `Entity`, `Observation`) which are continuously rebuilt from events.
