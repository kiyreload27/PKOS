import { EntityId } from "../value-objects/EntityId.js";
import { Timestamp } from "../value-objects/Timestamp.js";

/**
 * Represents the immutable identity anchor for all knowledge
 * within PKOS.
 *
 * Why: Entities intentionally contain very little state. 
 * They exist solely to act as a universal node that other domain objects 
 * (Resources, Traits, Capabilities, Relationships) can attach to.
 * 
 * Invariants:
 * - ID is immutable.
 * - Type cannot change after creation.
 * - Every Entity belongs to exactly one owner.
 *
 * Owner: The Core Domain boundary.
 */
export interface Entity {
  readonly id: EntityId;
  readonly typeId: string;
  readonly owner: string;
  readonly spaceId?: string;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}
