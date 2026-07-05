/**
 * The base class for all domain-specific errors in PKOS.
 * 
 * Why: Ensures that we can distinguish business rule violations from 
 * unexpected runtime/infrastructure errors.
 * 
 * Invariant: Must extend the built-in Error class and provide a domain-specific message.
 * 
 * Owner: The core domain infrastructure.
 */
export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // Set the prototype explicitly to ensure instanceof works correctly when targeting ES5+
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
