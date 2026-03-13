export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/admin/cards - Create a new card template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, setName, category, rarity, grade, imageUrl, marketPrice, description } = body;

    if (!name || !setName || !category || !rarity || !imageUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const card = await prisma.cardTemplate.create({
      data: {
        name,
        setName,
        category,
        rarity,
        grade,
        imageUrl,
        marketPrice: marketPrice || 0,
        description,
      },
    });

    return NextResponse.json({ success: true, card });
  } catch (error) {
    console.error("Failed to create card:", error);
    return NextResponse.json(
      { error: "Failed to create card template" },
      { status: 500 }
    );
  }
}

// GET /api/admin/cards - Get all card templates (including inactive)
export async function GET() {
  try {
    const cards = await prisma.cardTemplate.findMany({
      include: {
        _count: { select: { nftCards: true } },
        priceData: {
          orderBy: { lastUpdated: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
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
