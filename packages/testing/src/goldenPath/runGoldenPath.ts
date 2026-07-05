import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

import { DailyBriefingInputBuilder } from "@pkos/ranking/inputBuilder/dailyBriefingInputBuilder";

const db = new PrismaClient();

/**
 * Golden Path Event shape (loose validator for test ingestion)
 */
type RawEvent = {
  type: string;
  aggregateId?: string;
  timestamp?: string;
  payload: any;
};

export class GoldenPathRunner {
  constructor(
    private readonly db: PrismaClient,
    private readonly inputBuilder: DailyBriefingInputBuilder
  ) {}

  async run() {
    console.log("🚀 Starting Golden Path ingestion...");

    const events = this.loadGoldenPath();

    await this.ingestEvents(events);

    console.log("📦 Events ingested. Waiting for projections...");

    await this.waitForProjectionStabilization();

    console.log("🧠 Building Daily Briefing input...");

    const input = await this.inputBuilder.build(
      "context-alpha",
      new Date()
    );

    console.log("✅ DAILY BRIEFING INPUT READY");
    console.log({
      anchors: input.anchors.length,
      entities: input.entities.length,
      relationships: input.relationships.length,
      observations: input.observations.length,
      events: input.recentEvents.length
    });

    return input;
  }

  /**
   * Load deterministic dataset
   */
  private loadGoldenPath(): RawEvent[] {
    const filePath = path.join(
      process.cwd(),
      "tests/fixtures/golden-path.json"
    );

    return JSON.parse(readFileSync(filePath, "utf-8"));
  }

  /**
   * Step 1: Inject into Event Store
   */
  private async ingestEvents(events: RawEvent[]) {
    for (const event of events) {
      await this.db.pKOSEvent.create({
        data: {
          id: uuid(),
          type: event.type,
          timestamp: event.timestamp ?? new Date().toISOString(),
          aggregateId: event.aggregateId ?? uuid(),
          payload: event.payload,
          version: 1
        }
      });
    }
  }

  /**
   * Step 2: Allow async workers/projections to catch up
   */
  private async waitForProjectionStabilization() {
    // In dev: simple delay buffer
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

async function main() {
  const builder = new DailyBriefingInputBuilder(db);

  const runner = new GoldenPathRunner(db, builder);

  const result = await runner.run();

  console.log("\n📊 FINAL RESULT SNAPSHOT");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error("❌ Golden Path failed", err);
  process.exit(1);
});
