# RUNTIME BEHAVIOR

## What Happens When a User Submits a Capture
1. The Next.js API immediately validates the payload using `@pkos/validation`.
2. It inserts a `CAPTURE_RECEIVED` row into the `PKOSEvent` table via Prisma.
3. It enqueues a job on Redis via BullMQ.
4. It returns `200 OK` to the browser, which updates the UI optimistically to show "Capturing..."

## What Happens When Worker Processes Run
1. `apps/worker` pulls the job from Redis.
2. It executes the Deterministic parser (e.g., markdown extractor).
3. It calls the AI enrichment pipelines.
4. Each successful stage of the pipeline writes a new `PKOSEvent` to Postgres.
5. If an AI call fails, the worker throws an error, and BullMQ retries the job later.

## What Happens When the UI Loads the Timeline
1. The browser requests `/timeline`.
2. Next.js queries the `Timeline` projection table via Prisma (which was populated asynchronously by the projection materializers).
3. It renders the narrative list of events. It DOES NOT query the `PKOSEvent` table directly and attempt to parse raw JSON on the fly.

## What Happens When AI Enrichment Runs
1. The AI receives a constrained prompt and the raw capture string.
2. It outputs structured JSON.
3. The worker parses the JSON, validates it against expected rules, and creates specific events (like `OBSERVATION_GENERATED` or `RELATIONSHIP_DISCOVERED`).
4. If the AI suggests a destructive or high-risk merge, the worker instead creates a "Provisional" event, which waits for human approval in the AI Inbox.
