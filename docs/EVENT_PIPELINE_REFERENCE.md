# EVENT PIPELINE REFERENCE

## The Event Lifecycle

The entire system relies on asynchronous CQRS.

1. **User Action:** User pastes text on the `/capture` page.
2. **Web API (`apps/web`):** The Next.js route receives the text, generates a UUID, and immediately creates a `CAPTURE_RECEIVED` event in the database. It adds a job to the `pkos-workflows` BullMQ queue and returns `200 OK`.
3. **Queue Picking (`apps/worker`):** The worker picks up the job.
4. **Deterministic Parsing:** Converts the raw payload into structured Data. Emits `RESOURCE_PARSED`.
5. **Identity Resolution:** Checks if the entities already exist. If ambiguous, places it in the AI Inbox as a "Provisional Entity". Emits `ENTITY_CREATED` or `ENTITY_MERGE_PROPOSED`.
6. **Classification:** AI classifies the entity type. Emits `ENTITY_CLASSIFIED`.
7. **Relationship Discovery:** AI analyzes connections to other graph nodes. Emits `RELATIONSHIP_DISCOVERED`.
8. **Observation Generation:** AI extracts isolated facts. Emits `OBSERVATION_GENERATED`.
9. **Summary Generation:** Emits `SUMMARY_GENERATED`.
10. **Projection Materialization (`packages/projections`):** As the worker inserts these `PKOSEvent` rows into Postgres, independent event handlers (or triggers) read the log and mutate the fast-read tables (e.g., updating the `Timeline` table or the `Entity` read-model).
11. **UI Render:** The user visits `/timeline` and sees the new data, read exclusively from the materialized projection tables.

## Async Workers & Retries
- **Engine:** BullMQ + Redis.
- **Retries:** Standard exponential backoff is applied for transient errors (e.g., OpenAI rate limits). Poison pills are moved to the DLQ (Dead Letter Queue) and surface in the `/health` dashboard.
