import { PKOSEvent } from "@pkos/domain";

export interface ProjectionHandler {
  readonly projectionName: string;
  readonly version: number;

  /**
   * Evaluates if this handler cares about the given event.
   */
  canHandle(event: PKOSEvent): boolean;

  /**
   * Processes the event and updates the underlying Read Model.
   */
  handle(event: PKOSEvent): Promise<void>;

  /**
   * Clears the read model completely. Used before replaying.
   */
  reset(): Promise<void>;
}
