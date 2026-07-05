/**
 * Represents an explicit intent to change the state of the domain.
 * 
 * Why: Defines the "Write" side of the CQRS pattern. Commands represent what the user
 * or system *wants* to happen (e.g., RestartContainerCommand).
 * 
 * Invariants:
 * - Must be immutable once created.
 * - Must contain all data necessary for the handler to execute the intent.
 * 
 * Owner: The Domain CQRS boundary.
 */
export interface Command<T = unknown> {
  readonly type: string;
  readonly payload: T;
  readonly correlationId?: string;
}
