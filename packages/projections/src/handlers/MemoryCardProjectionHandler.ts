import { ProjectionHandler } from "../interfaces/ProjectionHandler.js";
import { prisma } from "@pkos/database";
import { PKOSEvent } from "@pkos/domain";

export class MemoryCardProjectionHandler implements ProjectionHandler {
  readonly projectionName = "MemoryCardProjection";
  readonly version = 1;

  canHandle(event: PKOSEvent): boolean {
    return event.type === "MEMORY_CARD_CREATED" || event.type === "MEMORY_SURFACED" || event.type === "MEMORY_USED";
  }

  async reset(): Promise<void> {
    await prisma.memoryCardProjection.deleteMany({});
  }

  async handle(event: PKOSEvent): Promise<void> {
    if (!this.canHandle(event)) return;

    if (event.type === "MEMORY_CARD_CREATED") {
      const payload = event.payload as any;
      await prisma.memoryCardProjection.upsert({
        where: { id: event.aggregateId },
        create: {
          id: event.aggregateId,
          projectionVersion: this.version,
          lastEventId: event.id,
          data: {
            ...payload,
            surfacedCount: 0,
            usedCount: 0,
            lastSurfacedAt: null,
            lastUsedAt: null,
          }
        },
        update: {
          lastEventId: event.id,
          data: {
            ...payload // In a real system, we'd deep merge
          }
        }
      });
    } else if (event.type === "MEMORY_SURFACED" || event.type === "MEMORY_USED") {
      const existing = await prisma.memoryCardProjection.findUnique({
        where: { id: event.aggregateId }
      });
      if (existing && existing.data) {
        const data = existing.data as any;
        if (event.type === "MEMORY_SURFACED") {
          data.surfacedCount = (data.surfacedCount || 0) + 1;
          data.lastSurfacedAt = event.timestamp;
        } else if (event.type === "MEMORY_USED") {
          data.usedCount = (data.usedCount || 0) + 1;
          data.lastUsedAt = event.timestamp;
        }
        await prisma.memoryCardProjection.update({
          where: { id: event.aggregateId },
          data: {
            lastEventId: event.id,
            data
          }
        });
      }
    }
  }
}
