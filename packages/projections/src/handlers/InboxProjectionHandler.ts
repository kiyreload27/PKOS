import { ProjectionHandler } from "../interfaces/ProjectionHandler.js";
import { prisma } from "@pkos/database";
import { PKOSEvent } from "@pkos/domain";

export class InboxProjectionHandler implements ProjectionHandler {
  readonly projectionName = "InboxProjection";
  readonly version = 1;

  private inboxRelevantEvents = [
    "MERGE_SUGGESTION_CREATED",
    "OBSERVATION_GENERATED",
    "RELATIONSHIP_DISCOVERED",
    "SUMMARY_STALE",
    "ENTITY_OUTDATED",
    "MEMORY_RECALLED"
  ];

  canHandle(event: PKOSEvent): boolean {
    return this.inboxRelevantEvents.includes(event.type);
  }

  async reset(): Promise<void> {
    await prisma.inboxProjection.deleteMany({});
  }

  async handle(event: PKOSEvent): Promise<void> {
    if (!this.canHandle(event)) return;

    // Upsert into InboxProjection
    // The InboxProjection is just a list of items to review. We'll store it by event ID so it acts like a queue
    
    await prisma.inboxProjection.upsert({
      where: { id: event.id },
      create: {
        id: event.id,
        projectionVersion: 1,
        lastEventId: event.id,
        data: {
          aggregateId: event.aggregateId,
          type: event.type,
          timestamp: (event.timestamp as any).value || event.timestamp,
          payload: event.payload as any
        }
      },
      update: {
        data: {
          aggregateId: event.aggregateId,
          type: event.type,
          timestamp: (event.timestamp as any).value || event.timestamp,
          payload: event.payload as any
        }
      }
    });
  }
}
