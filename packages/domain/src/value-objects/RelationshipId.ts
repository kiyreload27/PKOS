/**
 * Represents the immutable identity of a specific relationship edge.
 * 
 * Why: Ensures that relationship edges have their own verifiable identity,
 * preventing accidental use of EntityIds when dealing with relationships.
 * 
 * Invariant: The value must be a non-empty string.
 * 
 * Owner: The Knowledge Graph.
 */
export class RelationshipId {
  public readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("RelationshipId cannot be empty.");
    }
    this.value = value;
  }

  public equals(other: RelationshipId): boolean {
    return this.value === other.value;
  }
}
