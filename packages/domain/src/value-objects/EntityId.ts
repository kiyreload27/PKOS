/**
 * Represents the immutable identity anchor for an Entity.
 * 
 * Why: Ensures that an Entity identifier cannot be accidentally confused
 * with other UUIDs or string types (like RelationshipId).
 * 
 * Invariant: The value must be a non-empty string.
 * 
 * Owner: The core domain model.
 */
export class EntityId {
  public readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("EntityId cannot be empty.");
    }
    this.value = value;
  }

  public equals(other: EntityId): boolean {
    return this.value === other.value;
  }
}
