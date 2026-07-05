import { Timestamp } from "../value-objects/Timestamp.js";

/**
 * Represents a historical fact that has occurred within the system.
 * 
 * Why: The foundation of Event Sourcing and the Read Model projections.
 * Events are the immutable source of truth describing what *did* happen.
 * 
 * Invariants:
 * - Must be strictly immutable.
 * - Must contain a timestamp of occurrence and a version for schema evolution.
 * 
 * Owner: The Event Bus / Knowledge Pipeline.
 */
export interface PKOSEvent<T = unknown> {
  readonly id: string;
  readonly type: string;
  readonly aggregateId: string;
  readonly version: number;
  readonly payload: T;
  
  readonly timestamp: Timestamp;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly captureId?: string;
  readonly actor: string;
  readonly source: string;
}
