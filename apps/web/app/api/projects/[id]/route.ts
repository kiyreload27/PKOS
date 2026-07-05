import { NextResponse } from "next/server";
import { prisma } from "@pkos/database";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    await prisma.context.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Project Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
