import { PKOSEvent } from "@pkos/domain";
import { prisma } from "@pkos/database";
import { ProjectionHandler } from "../interfaces/ProjectionHandler.js";

export class CaptureProjectionHandler implements ProjectionHandler {
  readonly projectionName = "CaptureProjection";
  readonly version = 1;

  canHandle(event: PKOSEvent): boolean {
    return event.type.startsWith("CAPTURE_") || event.type === "ENRICHMENT_COMPLETED" || event.type === "ENRICHMENT_STARTED";
  }

  async handle(event: PKOSEvent): Promise<void> {
    const captureId = event.aggregateId;

    // We build a denormalized view of the capture to serve the UI instantly.
    let currentData: any = {};
    const existing = await prisma.captureProjection.findUnique({ where: { id: captureId }});
    if (existing && existing.data) {
      currentData = existing.data as any;
    } else {
      currentData = {
        id: captureId,
        history: [],
      };
    }

    // Apply Event
    currentData.status = this.mapEventToStatus(event.type);
    currentData.lastUpdate = event.timestamp;
    currentData.history.push({
      type: event.type,
      timestamp: event.timestamp,
      payload: event.payload
    });

    if (event.type === "CAPTURE_ANALYSED") {
      currentData.analysis = (event.payload as any).analysis;
    }

    await prisma.captureProjection.upsert({
      where: { id: captureId },
      update: {
        lastEventId: event.id,
        data: currentData
      },
      create: {
        id: captureId,
        projectionVersion: this.version,
        lastEventId: event.id,
        data: currentData
      }
    });
  }

  async reset(): Promise<void> {
    await prisma.captureProjection.deleteMany({});
  }

  private mapEventToStatus(eventType: string): string {
    switch (eventType) {
      case "CAPTURE_RECEIVED": return "Receiving";
      case "CAPTURE_ANALYSED": return "Analysing";
      case "ENRICHMENT_STARTED": return "Extracting";
      case "ENRICHMENT_COMPLETED": return "Completed";
      default: return "Processing";
    }
  }
}
