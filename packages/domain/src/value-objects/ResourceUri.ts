/**
 * Represents the universal locator for an external Resource.
 * 
 * Why: Ensures that all resources have a valid, well-formed URI format.
 * Prevents stringly-typed inputs from introducing malformed URLs into the system.
 * 
 * Invariant: The value must be a valid, parsable URI.
 * 
 * Owner: The Resource System.
 */
export class ResourceUri {
  public readonly value: string;

  constructor(value: string) {
    try {
      // Use the built-in URL constructor to validate the URI structure
      new URL(value);
      this.value = value;
    } catch {
      throw new Error(`Invalid ResourceUri: ${value}`);
    }
  }

  public get protocol(): string {
    return new URL(this.value).protocol;
  }
}
