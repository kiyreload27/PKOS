/**
 * Represents a reusable business rule or policy within the domain.
 * 
 * Why: Prevents scattering business logic (if/else chains) throughout services
 * by encapsulating explicit rules into testable, composable objects.
 * 
 * Invariants:
 * - Must return a boolean indicating whether the candidate satisfies the rule.
 * 
 * Owner: The Core Domain Specifications layer.
 */
export interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean;
}
