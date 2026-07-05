import { EntityId } from "../value-objects/EntityId.js";
import { RelationshipId } from "../value-objects/RelationshipId.js";
import { Confidence } from "../value-objects/Confidence.js";
import { Timestamp } from "../value-objects/Timestamp.js";

/**
 * Represents a structured, typed edge between two entities in the knowledge graph.
 * 
 * Why: Transforms isolated entities into a traversable graph. By attaching confidence
 * and provenance, relationships can represent AI hypotheses or definitive user facts.
 * 
 * Invariants:
 * - Cannot reference itself (sourceId !== targetId) unless explicitly allowed by the RelationshipType.
 * - Must reference two existing Entities.
 * - Confidence must be a valid Confidence value.
 * - RelationshipType must exist in the registry.
 * 
 * Owner: The Knowledge Aggregate / RelationshipResolver.
 */
export interface Relationship {
  readonly id: RelationshipId;
  readonly sourceId: EntityId;
  readonly targetId: EntityId;
  readonly typeId: string;
  readonly confidence: Confidence;
  readonly reason?: string;
  readonly provenanceSource: string; // e.g., 'AI', 'User', 'Plugin'
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}
