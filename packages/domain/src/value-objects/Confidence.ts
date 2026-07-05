/**
 * Represents the AI or system's certainty regarding an observation or relationship.
 * 
 * Why: Prevents invalid confidence scores (e.g. 100 instead of 1.0) and centralizes
 * logic for thresholds (e.g., isHigh()).
 * 
 * Invariant: The value must be a number strictly between 0 and 1 inclusive.
 * 
 * Owner: The Knowledge Pipeline and Observation Lifecycle.
 */
export class Confidence {
  public readonly value: number;

  constructor(value: number) {
    if (value < 0 || value > 1) {
      throw new Error("Confidence must be between 0 and 1.");
    }
    this.value = value;
  }

  public isHigh(): boolean {
    return this.value >= 0.85;
  }

  public isLow(): boolean {
    return this.value <= 0.3;
  }
}
