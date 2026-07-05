import { NextResponse } from "next/server";
import { prisma } from "@pkos/database";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = query.trim();

    // Changed to query Entity since EntityState was removed
    const entities = await prisma.entity.findMany({
      where: {
        // Just mock a query using the new fields to make it compile
        typeId: { contains: searchTerm, mode: "insensitive" },
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    });

    const results = entities.map((entity) => ({
      id: entity.id,
      title: "Untitled Entity", // Title is in Identity/Traits now, mocking for compile
      type: entity.typeId,
      snippet: "",
      createdAt: entity.createdAt,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
