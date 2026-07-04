import { NextResponse } from "next/server";
import { prisma } from "@pkos/database";
import { Queue } from "bullmq";
import Redis from "ioredis";

// Reuse the standard Redis connection
const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const workflowQueue = new Queue("pkos-workflows", { connection });

export async function POST(req: Request) {
  try {
    const { content, projectId } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // 1. Create the base Entity
    const entity = await prisma.entity.create({
      data: {
        kind: "UNKNOWN",
        owner: "system",
        spaceId: projectId || null,
      },
    });

    // 2. Create the mutable EntityState
    await prisma.entityState.create({
      data: {
        entityId: entity.id,
        title: content.substring(0, 50) + (content.length > 50 ? "..." : ""),
        status: "Captured",
        rawCapture: content,
      },
    });

    // 3. Emit Timeline Event
    await prisma.timelineEvent.create({
      data: {
        entityId: entity.id,
        type: "CAPTURE_RECEIVED",
        message: "New information captured via Universal Inbox",
      },
    });

    // 4. Dispatch to Background Worker
    await workflowQueue.add("process-entity", {
      entityId: entity.id,
      content,
    });

    return NextResponse.json({ success: true, entityId: entity.id });
  } catch (error) {
    console.error("Capture API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
