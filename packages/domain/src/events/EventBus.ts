import { PKOSEvent } from "./PKOSEvent.js";

/**
 * The abstraction layer over the system's message broker (e.g. BullMQ, Redis, Kafka).
 * 
 * Why: Allows domain logic to dispatch events without coupling to a specific 
 * transport or infrastructure mechanism.
 * 
 * Invariants:
 * - Must guarantee at-least-once delivery for dispatched events.
 * 
 * Owner: The Knowledge Pipeline.
 */
export interface EventBus {
  publish(event: PKOSEvent): Promise<void>;
  subscribe(eventType: string, handler: (event: PKOSEvent) => Promise<void>): void;
}
