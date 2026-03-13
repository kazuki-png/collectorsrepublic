import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cards - Get card templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const rarity = searchParams.get("rarity");

    const where: Record<string, unknown> = { isActive: true };
    if (category) where.category = category;
    if (rarity) where.rarity = rarity;

    const cards = await prisma.cardTemplate.findMany({
      where,
      orderBy: { marketPrice: "desc" },
    });

    return NextResponse.json({ cards });
  } catch (error) {
    console.error("Failed to fetch cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 }
    );
  }
}
