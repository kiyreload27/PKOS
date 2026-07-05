import { Resource } from "../interfaces/Resource.js";
import { SyncState } from "../interfaces/SyncState.js";

/**
 * Defines the transactional consistency boundary for an external Resource.
 * 
 * Why: Keeps synchronization state and provenance tightly coupled to the resource,
 * ensuring that a sync update doesn't lock the broader Entity graph.
 * 
 * Invariants:
 * - SyncState must exist if the resource is capable of being synchronized.
 * 
 * Owner: The Resource Integration Aggregate layer.
 */
export interface ResourceAggregate {
  readonly resource: Resource;
  readonly syncState: SyncState;
  readonly provenance: {
    source: string;
    evidenceLinks: string[];
  };
}
