import { Resource } from "../interfaces/Resource.js";
import { EntityId } from "../value-objects/EntityId.js";
import { ResourceUri } from "../value-objects/ResourceUri.js";
import { Repository } from "./Repository.js";

/**
 * The persistence contract for the Resource aggregate.
 * 
 * Why: Allows domain services to lookup resources by their external URIs or owning Entities
 * without coupling to the database schema.
 * 
 * Invariants:
 * - Must throw ResourceConflictError if attempting to save a Resource with a duplicate URI for the same provider.
 * 
 * Owner: The Core Domain, implemented by @pkos/database.
 */
export interface ResourceRepository extends Repository<Resource, string> {
  findByUri(uri: ResourceUri): Promise<Resource | null>;
  findByEntityId(entityId: EntityId): Promise<Resource[]>;
}
