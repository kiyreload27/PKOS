import { Entity } from "../interfaces/Entity.js";
import { Specification } from "./Specification.js";

/**
 * Defines the business rules for when two entities can be safely merged.
 * 
 * Why: Prevents data loss or graph corruption by ensuring only logically compatible
 * entities are merged (e.g., they must belong to the same owner, and neither can be a system-locked node).
 * 
 * Invariants:
 * - `owner` must be identical for both entities.
 * - Cannot merge entities if their types are fundamentally incompatible (though type conversion may apply later).
 * 
 * Owner: The Entity Aggregate Lifecycle.
 */
export class CanMergeEntitiesSpecification implements Specification<{ source: Entity; target: Entity }> {
  public isSatisfiedBy(candidate: { source: Entity; target: Entity }): boolean {
    const { source, target } = candidate;
    
    if (source.id.equals(target.id)) {
      return false; // Cannot merge into itself
    }

    if (source.owner !== target.owner) {
      return false; // Cannot merge across owners
    }

    return true;
  }
}
