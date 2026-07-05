import { Entity } from "../interfaces/Entity.js";
import { EntityId } from "../value-objects/EntityId.js";
import { Repository } from "./Repository.js";

/**
 * The persistence contract for the Entity aggregate.
 * 
 * Why: Defines exactly what queries and mutations the domain needs for Entities
 * without tying them to SQL, NoSQL, or Prisma logic.
 * 
 * Invariants:
 * - Must throw EntityNotFoundError if an entity is requested but does not exist.
 * - Must guarantee that `save` persists the Entity in its entirely.
 * 
 * Owner: The Core Domain, implemented by @pkos/database.
 */
export interface EntityRepository extends Repository<Entity, EntityId> {
  findByOwner(ownerId: string): Promise<Entity[]>;
  findByType(typeId: string): Promise<Entity[]>;
}
