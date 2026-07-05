import { EntityId } from "../value-objects/EntityId.js";
import { ResourceUri } from "../value-objects/ResourceUri.js";

/**
 * Represents external data and state mapped into the PKOS ecosystem.
 * 
 * Why: Defines the boundary between the internal knowledge graph (Entity) 
 * and external systems (GitHub, Docker, Filesystem).
 * 
 * Invariants:
 * - URI must be unique per provider.
 * - Must belong to exactly one Entity (EntityId).
 * - Must have exactly one Source defining provenance.
 * 
 * Owner: The Resource Aggregate / Integration Pipelines.
 */
export interface Resource {
  readonly id: string;
  readonly entityId: EntityId;
  readonly type: string;
  readonly uri: ResourceUri;
  readonly status: string;
  readonly health: number;
  readonly source: string;
  readonly rawMetadata: Record<string, unknown>;
}
