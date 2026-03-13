export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/gacha - List all gacha machines
export async function GET() {
  try {
    const machines = await prisma.gachaMachine.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { gachaPulls: true } },
      },
      orderBy: [{ category: "asc" }, { price: "asc" }],
    });

    return NextResponse.json({ machines });
  } catch (error) {
    console.error("Failed to fetch gacha machines:", error);
    return NextResponse.json(
      { error: "Failed to fetch gacha machines" },
      { status: 500 }
    );
  }
}
