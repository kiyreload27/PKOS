import { Entity } from "../interfaces/Entity.js";

/**
 * Defines the transactional consistency boundary for an Entity.
 * 
 * Why: Prevents loading the entire graph when updating a core entity property.
 * Groups the identity anchor with its direct intrinsic properties (traits/capabilities)
 * while excluding external relationships or resources.
 * 
 * Invariants:
 * - Changes to traits or capabilities must be transactionally committed with the Entity.
 * 
 * Owner: The Core Domain Aggregate layer.
 */
export interface EntityAggregate {
  readonly entity: Entity;
  
  // Identity layer (external IDs, aliases)
  readonly identity: {
    externalIds: string[];
    aliases: string[];
  };
  
  // Intrinsic capabilities
  readonly traits: string[];
  readonly capabilities: string[];
}
