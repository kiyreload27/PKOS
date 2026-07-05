/**
 * Represents a definitive point in time within the PKOS domain.
 * 
 * Why: Prevents issues with timezone inconsistencies and invalid date strings.
 * 
 * Invariant: Must wrap a valid, finite Javascript Date object.
 * 
 * Owner: Timeline and Event Sourcing logic.
 */
export class Timestamp {
  public readonly value: Date;

  constructor(value: Date | string | number) {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid Timestamp: ${value}`);
    }
    this.value = date;
  }

  public static now(): Timestamp {
    return new Timestamp(new Date());
  }

  public isBefore(other: Timestamp): boolean {
    return this.value.getTime() < other.value.getTime();
  }

  public isAfter(other: Timestamp): boolean {
    return this.value.getTime() > other.value.getTime();
  }
}
