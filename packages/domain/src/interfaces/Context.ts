import { EntityId } from "../value-objects/EntityId.js";
import { Timestamp } from "../value-objects/Timestamp.js";

/**
 * Represents a logical grouping or situational boundary (e.g., "Weekend Gaming").
 * 
 * Why: Drives recommendations and AI behavior by explicitly defining what the user
 * is currently focused on, instead of relying purely on implicit graph distance.
 * 
 * Invariants:
 * - A Context must have a defined type and name.
 * - `timeRange.end` cannot be earlier than `timeRange.start`.
 * 
 * Owner: The Context Engine / Recommendation System.
 */
export interface Context {
  readonly id: string;
  readonly name: string;
  readonly type: string; // e.g., 'Work Session', 'Research Sprint'
  readonly isActive: boolean;
  readonly participants: string[];
  readonly activeResources: string[];
  readonly relatedEntities: EntityId[];
  readonly timeRange?: {
    start: Timestamp;
    end?: Timestamp;
  };
}
