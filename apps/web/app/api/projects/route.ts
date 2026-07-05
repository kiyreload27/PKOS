import { NextResponse } from "next/server";
import { prisma } from "@pkos/database";

export async function GET() {
  try {
    // Replaced legacy Space with Context
    const contexts = await prisma.context.findMany({
      orderBy: { createdAt: "desc" },
    });

    const results = contexts.map(c => ({
      id: c.id,
      name: c.name,
      description: c.type,
      itemCount: c.relatedEntities.length,
      createdAt: c.createdAt,
    }));

    return NextResponse.json({ projects: results });
  } catch (error) {
    console.error("GET Projects Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, description } = await req.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const context = await prisma.context.create({
      data: {
        id: crypto.randomUUID(),
        name: name.trim(),
        type: description || "Space",
        isActive: false,
        participants: [],
        activeResources: [],
        relatedEntities: [],
      },
    });

    return NextResponse.json(context, { status: 201 });
  } catch (error) {
    console.error("POST Project Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
