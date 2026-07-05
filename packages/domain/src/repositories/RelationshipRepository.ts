import { Relationship } from "../interfaces/Relationship.js";
import { EntityId } from "../value-objects/EntityId.js";
import { RelationshipId } from "../value-objects/RelationshipId.js";
import { Repository } from "./Repository.js";

/**
 * The persistence contract for the Relationship aggregate.
 * 
 * Why: Abstracts the complexities of graph traversal and storage. Allows the domain
 * to query neighbors without knowing if the database is Neo4j, Postgres, or memory.
 * 
 * Invariants:
 * - Must throw DuplicateRelationshipError if attempting to save an identical edge.
 * 
 * Owner: The Core Domain, implemented by @pkos/database.
 */
export interface RelationshipRepository extends Repository<Relationship, RelationshipId> {
  findBySource(sourceId: EntityId): Promise<Relationship[]>;
  findByTarget(targetId: EntityId): Promise<Relationship[]>;
  findByType(typeId: string): Promise<Relationship[]>;
}
