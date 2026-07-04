import { Worker } from "bullmq";
import Redis from "ioredis";
import { prisma } from "@pkos/database";

const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

console.log("🚀 Background Worker starting...");

const worker = new Worker(
  "pkos-workflows",
  async (job) => {
    const { entityId, content } = job.data;
    console.log(`[Job ${job.id}] Processing Entity: ${entityId}`);

    // Simulate AI Work
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update entity
    await prisma.entityState.updateMany({
      where: { entityId },
      data: {
        title: "Processed Capture",
        status: "Enriched",
      },
    });

    // Add Timeline Event
    await prisma.timelineEvent.create({
      data: {
        entityId,
        type: "PROCESSING_COMPLETE",
        message: "AI background workflow completed successfully.",
      },
    });

    console.log(`[Job ${job.id}] Finished processing ${entityId}`);
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed.`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err?.message);
});
