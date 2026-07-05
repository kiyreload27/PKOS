import { Worker } from "bullmq";
import { Redis } from "ioredis";
import { prisma } from "@pkos/database";

// Create a standard Redis instance
const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

console.log("🚀 Background Worker starting...");

// We will use the new PKOSEvent stream or Commands later.
// For now, we mock the worker to just log and not crash since we stripped out legacy Prisma models.

const worker = new Worker(
  "pkos-workflows",
  async (job) => {
    console.log(`[Job ${job.id}] Processing Job: ${job.name}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`[Job ${job.id}] Finished processing ${job.name}`);
  },
  { connection: connection as any }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed.`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err?.message);
});
