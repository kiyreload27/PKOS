import { Relationship } from "../interfaces/Relationship.js";

/**
 * Defines the transactional boundary for knowledge graph structures.
 * 
 * Why: Isolates graph complexity from simple identity operations. AI inferences,
 * facts, and relationships update independently from the raw Entity.
 * 
 * Invariants:
 * - Observations must have a defined lifecycle state (Hypothesis -> Fact).
 * 
 * Owner: The Knowledge Pipeline and Inference layers.
 */
export interface KnowledgeAggregate {
  readonly relationships: Relationship[];
  
  readonly observations: Array<{
    id: string;
    statement: string;
    state: 'HYPOTHESIS' | 'FACT' | 'DISPROVEN' | 'EXPIRED';
    confidenceValue: number;
  }>;
  
  readonly embeddings: Array<{
    vector: number[];
    model: string;
  }>;
}
