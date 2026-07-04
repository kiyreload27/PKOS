import { NextResponse } from "next/server";
import { prisma } from "@pkos/database";

export async function GET() {
  try {
    const spaces = await prisma.space.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ projects: spaces });
  } catch (error) {
    console.error("GET Projects Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, icon } = await req.json();
    
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    
    const space = await prisma.space.create({
      data: {
        name,
        icon: icon || "Folder",
      },
    });
    
    return NextResponse.json({ project: space }, { status: 201 });
  } catch (error) {
    console.error("POST Project Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
