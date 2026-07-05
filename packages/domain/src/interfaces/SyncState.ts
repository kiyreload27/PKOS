import { Timestamp } from "../value-objects/Timestamp.js";

/**
 * Tracks the synchronization lifecycle of an external Resource.
 * 
 * Why: Separates the immutable identity/URI of a resource from its highly mutable
 * synchronization status (polling, webhooks, error states).
 * 
 * Invariants:
 * - If syncStatus is 'ERROR', lastError must be populated.
 * - nextSync cannot be earlier than lastSync.
 * 
 * Owner: The Integration/Sync Service.
 */
export interface SyncState {
  readonly resourceId: string;
  readonly lastSync: Timestamp;
  readonly nextSync?: Timestamp;
  readonly syncStatus: 'IDLE' | 'SYNCING' | 'ERROR' | 'DISABLED';
  readonly lastError?: string;
  readonly providerVersion?: string;
  readonly checksum?: string;
}
