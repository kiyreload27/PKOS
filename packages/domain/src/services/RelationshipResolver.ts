import { EntityRepository } from "../repositories/EntityRepository.js";
import { RelationshipRepository } from "../repositories/RelationshipRepository.js";
import { EntityId } from "../value-objects/EntityId.js";
import { Relationship } from "../interfaces/Relationship.js";
import { EntityNotFoundError } from "../errors/index.js";

/**
 * Orchestrates the discovery and resolution of relationships within the knowledge graph.
 * 
 * Why: Encapsulates cross-aggregate logic. Finding related entities requires querying
 * the RelationshipRepository, checking access rules, and fetching from the EntityRepository.
 * 
 * Invariants:
 * - Must throw EntityNotFoundError if the anchor entity does not exist.
 * - Only returns relationships that the current context/user is permitted to resolve (future policy).
 * 
 * Owner: The Domain Services layer.
 */
export class RelationshipResolver {
  constructor(
    private readonly entityRepo: EntityRepository,
    private readonly relationshipRepo: RelationshipRepository
  ) {}

  /**
   * Finds all outbound relationships from a given source entity.
   */
  public async getOutboundRelationships(sourceId: EntityId): Promise<Relationship[]> {
    const source = await this.entityRepo.findById(sourceId);
    if (!source) {
      throw new EntityNotFoundError(sourceId);
    }
    
    return this.relationshipRepo.findBySource(sourceId);
  }
}
