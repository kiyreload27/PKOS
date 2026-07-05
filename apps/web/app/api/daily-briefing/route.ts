import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/**
 * Returns the latest snapshot + items for a context
 * No ranking, no computation, no AI.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const contextId = searchParams.get("contextId");

  if (!contextId) {
    return NextResponse.json(
      { error: "contextId is required" },
      { status: 400 }
    );
  }

  /**
   * 1. Get latest snapshot
   */
  const snapshot = await db.dailyBriefingSnapshot.findFirst({
    where: { contextId },
    orderBy: { generatedAt: "desc" }
  });

  if (!snapshot) {
    return NextResponse.json({
      snapshot: null,
      items: []
    });
  }

  /**
   * 2. Get ranked items (already materialized)
   */
  const items = await db.dailyBriefingItem.findMany({
    where: { snapshotId: snapshot.id },
    orderBy: { rank: "desc" }
  });

  return NextResponse.json({
    snapshot,
    items
  });
}
