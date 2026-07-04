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

    // Search across EntityState title and rawCapture
    const entities = await prisma.entityState.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { rawCapture: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      include: {
        entity: true,
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    });

    const results = entities.map((state: any) => ({
      id: state.entity.id,
      title: state.title || "Untitled Capture",
      type: state.entity.kind || "UNKNOWN",
      snippet: state.rawCapture ? state.rawCapture.substring(0, 100) : "",
      createdAt: state.createdAt,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
