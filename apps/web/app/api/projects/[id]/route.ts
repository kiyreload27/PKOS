import { NextResponse } from "next/server";
import { prisma } from "@pkos/database";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.space.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Project Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
