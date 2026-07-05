import { Context } from "../interfaces/Context.js";

/**
 * Defines the transactional boundary for contextual states.
 * 
 * Why: Context changes frequently (e.g. user switches tabs, changes focus).
 * This aggregate ensures context updates don't require locking the actual entities
 * that happen to be active inside the context.
 * 
 * Invariants:
 * - Active resources must be valid resources.
 * 
 * Owner: The Context Engine layer.
 */
export interface ContextAggregate {
  readonly context: Context;
}
