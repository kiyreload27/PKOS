/**
 * Represents a URL-friendly, human-readable string identifier.
 * 
 * Why: Prevents invalid characters from entering routing and identity structures.
 * 
 * Invariant: The value must only contain lowercase alphanumeric characters and hyphens.
 * 
 * Owner: Identity resolution and routing.
 */
export class Slug {
  public readonly value: string;

  constructor(value: string) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
      throw new Error(`Invalid slug format: ${value}`);
    }
    this.value = value;
  }
}
