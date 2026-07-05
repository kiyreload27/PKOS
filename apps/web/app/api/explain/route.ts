import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ExplainabilityBuilder } from "@pkos/ranking/explainability/buildExplanationTrace";

const db = new PrismaClient();
const builder = new ExplainabilityBuilder(db);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("itemId");

  if (!itemId) {
    return NextResponse.json(
      { error: "itemId required" },
      { status: 400 }
    );
  }

  const item = await db.dailyBriefingItem.findUnique({
    where: { id: itemId }
  });

  if (!item) {
    return NextResponse.json(
      { error: "item not found" },
      { status: 404 }
    );
  }

  const explanation = await builder.build(item);

  return NextResponse.json(explanation);
}
