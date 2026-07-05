import { PKOSEvent } from "../events/PKOSEvent.js";
import { EntityId } from "../value-objects/EntityId.js";

/**
 * Defines the boundary for entity versioning and event history.
 * 
 * Why: History is append-only and grows infinitely. It must be separated from the 
 * hot-path Entity queries.
 * 
 * Invariants:
 * - Events are strictly immutable.
 * - Snapshots must reflect the exact state at the given event timestamp.
 * 
 * Owner: The Event Sourcing and Timeline layers.
 */
export interface HistoryAggregate {
  readonly entityId: EntityId;
  readonly events: PKOSEvent[];
  
  readonly versions: Array<{
    versionNumber: number;
    snapshot: Record<string, unknown>;
    reason: string;
    createdAt: Date;
  }>;
}
