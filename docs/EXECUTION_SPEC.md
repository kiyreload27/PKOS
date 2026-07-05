# SYSTEM EXECUTION SPECIFICATION

This document fills the execution gaps required for deterministic AI reasoning and system implementation.

## 1. Full Event Schema Specification

All events follow the `PKOSEvent` base interface:
```typescript
interface PKOSEventBase {
  id: string; // UUID
  type: EventType; // Enum
  timestamp: string; // ISO-8601
  aggregateId: string; // The primary entity/context this event affects
  payload: unknown; // Event-specific data
}
```

### Event Payload Examples
**`CAPTURE_RECEIVED`**
```json
{
  "type": "CAPTURE_RECEIVED",
  "aggregateId": "capture-uuid",
  "payload": {
    "source": "user_input",
    "rawText": "Met with Sarah today about the redesign.",
    "contextId": "project-alpha-uuid" // Optional
  }
}
```

**`ENTITY_CREATED`**
```json
{
  "type": "ENTITY_CREATED",
  "aggregateId": "entity-uuid",
  "payload": {
    "name": "Sarah",
    "traits": ["Person", "Colleague"]
  }
}
```

**`RELATIONSHIP_DISCOVERED`**
```json
{
  "type": "RELATIONSHIP_DISCOVERED",
  "aggregateId": "entity-sarah-uuid",
  "payload": {
    "targetEntityId": "project-alpha-uuid",
    "relationshipType": "INVOLVED_IN",
    "confidence": 0.85
  }
}
```

## 2. Projection Update Matrix

| Event Type | Affected Projection Table | Mutation Logic |
|------------|---------------------------|----------------|
| `CAPTURE_RECEIVED` | `Timeline` | `INSERT` (Show raw capture entry) |
| `ENTITY_CREATED` | `Entity` | `INSERT` new row. |
| `ENTITY_UPDATED` | `Entity` | `UPDATE` existing row (merge traits/names). |
| `RELATIONSHIP_DISCOVERED` | `Relationship` | `INSERT` edge. Update `Entity.relationshipCount`. |
| `OBSERVATION_GENERATED` | `Observation` | `INSERT` row. |
| `MEMORY_CARD_EMERGED` | `MemoryCard` | `INSERT` row. Used to populate hybrid search. |

## 3. AI Boundary Rules (Strict)

**What AI CAN Create Automatically:**
- Unambiguous isolated facts (`OBSERVATION_GENERATED`).
- New standalone entities when there is absolutely zero risk of duplication.
- Relationships between existing entities.
- Textual summaries of Contexts or Entities.

**What AI MUST Propose (Inbox Gating):**
- **Merging Entities:** If the AI believes "Sarah (Designer)" and "Sarah Smith" are the same person, it CANNOT merge them. It must emit an `ENTITY_MERGE_PROPOSED` event, which surfaces in the UI Inbox.
- **Ambiguous Entities:** If the AI is unsure if an entity exists, it creates a "Provisional Entity" flagged for inbox review.
- **Destructive Actions:** AI is never allowed to delete anything.

## 4. Failure Modes & Recovery

**Worker Crash Mid-Pipeline:**
- BullMQ tracks active jobs. If the worker pod dies, the job times out and is returned to the queue (Wait status) to be picked up by another worker.
- *Idempotency Rule:* Event handlers must check if an event ID was already processed (using a processed_events table or unique constraints) to avoid duplicate projection writes on retry.

**Projection Materialization Failure:**
- If the event writes to Postgres successfully but the projection handler fails (e.g., transient DB lock), the event exists in the source of truth.
- *Recovery:* A replay script can stream events from the `PKOSEvent` table (filtered by timestamp or type) through the projection handlers to rebuild the read models.

**Poison Pills:**
- If an LLM returns malformed JSON repeatedly, BullMQ retries 3 times with exponential backoff.
- On final failure, the job moves to the Dead Letter Queue (DLQ) and increments the "Broken Worker Tasks" counter in the `/health` dashboard for manual developer intervention.
