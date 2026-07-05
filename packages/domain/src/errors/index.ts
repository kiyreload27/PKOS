import { DomainError } from "./DomainError.js";
import { EntityId } from "../value-objects/EntityId.js";

/**
 * Thrown when an Entity cannot be found in a repository or aggregate boundary.
 * 
 * Why: Prevents operations on non-existent knowledge nodes.
 * Invariant: Operations requiring an Entity must fail if it does not exist.
 * Owner: Repository implementations.
 */
export class EntityNotFoundError extends DomainError {
  constructor(entityId: EntityId) {
    super(`Entity with ID ${entityId.value} was not found.`);
  }
}

/**
 * Thrown when attempting to create a relationship that already exists.
 * 
 * Why: Prevents knowledge graph duplication.
 * Invariant: Relationships between the same source, target, and type must be unique.
 * Owner: Relationship and Graph Aggregates.
 */
export class DuplicateRelationshipError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Thrown when trying to apply a capability that an entity does not possess.
 * 
 * Why: Enforces the capability boundary (e.g. you cannot "Run" a text note).
 * Invariant: Actions can only be executed if the entity has the required capability.
 * Owner: The Capabilities registry / Action execution layer.
 */
export class InvalidCapabilityError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Thrown when an AI Observation has expired and cannot be promoted to a Fact.
 * 
 * Why: Ensures that stale hypotheses do not accidentally pollute the knowledge graph.
 * Invariant: Observations must be verified before their expiration date.
 * Owner: Observation Lifecycle logic.
 */
export class ObservationExpiredError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Thrown when a cyclical dependency or logic loop is detected in the knowledge graph.
 * 
 * Why: Prevents infinite recursion during automation or relationship mapping.
 * Invariant: The knowledge graph must remain a directed graph without invalid cycles where restricted.
 * Owner: Knowledge Graph orchestration.
 */
export class KnowledgeCycleError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export { DomainError };
