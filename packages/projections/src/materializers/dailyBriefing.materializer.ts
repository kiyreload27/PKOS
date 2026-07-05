import { PrismaClient } from "@prisma/client";
import { DailyBriefingInput } from "@pkos/ranking/inputBuilder/dailyBriefingInputBuilder";
import { rankDailyBriefing } from "@pkos/ranking/core/rankDailyBriefing";
import { v4 as uuid } from "uuid";

export class DailyBriefingMaterializer {
  constructor(private readonly db: PrismaClient) {}

  async materialize(input: DailyBriefingInput) {
    const snapshotId = uuid();

    const ranked = rankDailyBriefing(input);

    /**
     * 1. UPSERT SNAPSHOT
     */
    await this.db.dailyBriefingSnapshot.create({
      data: {
        id: snapshotId,
        contextId: input.contextId,
        date: new Date(),
        generatedAt: new Date(),
        totalItems: ranked.length,
        metadata: input.metadata as any
      }
    });

    /**
     * 2. WRITE ITEMS (idempotent batch insert)
     */
    await this.db.dailyBriefingItem.createMany({
      data: ranked.map(item => ({
        id: uuid(),
        snapshotId,
        entityId: item.entityId ?? null,
        type: item.type,
        title: item.title,
        subtitle: item.subtitle ?? null,
        rank: item.rank,
        category: item.category,
        payload: item.payload as any
      })),
      skipDuplicates: true
    });

    return {
      snapshotId,
      count: ranked.length
    };
  }
}
