# SYSTEM CONSTRAINTS

## Strict Rules extracted from the Codebase

1. **NO BYPASSING THE EVENT BUS:**
   - Any mutation in the system MUST result in a `PKOSEvent` being written to the Event Store. The web API cannot update a read model directly.

2. **NO DIRECT DB WRITES TO PROJECTIONS (FROM WEB):**
   - The Next.js frontend (`apps/web`) is strictly forbidden from executing `UPDATE` or `INSERT` queries on projection tables (like `Entity`, `MemoryCard`, or `Timeline`). Projection tables are ONLY written to by the asynchronous Projection Materializers listening to the event log.

3. **SOURCE OF TRUTH:**
   - The `PKOSEvent` table is the sole source of truth in the system. Everything else can be destroyed and rebuilt.

4. **DERIVED STATE:**
   - All tables other than the Event Store are derived state. They are heavily denormalized to make UI queries fast.

5. **ASYNCHRONOUS BY DEFAULT:**
   - All AI processing is strictly asynchronous. A user action must never block on a synchronous call to an LLM provider (e.g., OpenAI).

6. **PURE DOMAIN:**
   - `packages/domain` MUST NOT import `packages/database`, `packages/validation`, or any React/Next.js code. It is environment-agnostic pure logic.
