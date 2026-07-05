import { NextResponse } from "next/server";
import { prisma } from "@pkos/database";
import { Queue } from "bullmq";

const pkosQueue = new Queue("pkos-workflows", {
  connection: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const content = body.content || "Empty Capture";

    const entity = await prisma.entity.create({
      data: {
        id: crypto.randomUUID(),
        typeId: "Note",
        owner: "User",
        externalIds: [],
        aliases: [content.substring(0, 50)],
        traits: ["TextContent"],
        capabilities: ["Searchable"],
      },
    });

    await prisma.pKOSEvent.create({
      data: {
        id: crypto.randomUUID(),
        aggregateId: entity.id,
        type: "ENTITY_CREATED",
        version: 1,
        payload: { content },
      },
    });

    await pkosQueue.add("process-capture", {
      entityId: entity.id,
      content,
    });

    return NextResponse.json({ success: true, entityId: entity.id });
  } catch (error) {
    console.error("Capture Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
