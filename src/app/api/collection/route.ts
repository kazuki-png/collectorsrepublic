export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/collection?userId=... - Get user's NFT collection
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const cards = await prisma.nFTCard.findMany({
      where: { ownerId: userId },
      include: {
        cardTemplate: true,
        listings: {
          where: { status: "ACTIVE" },
        },
      },
      orderBy: { mintedAt: "desc" },
    });

    return NextResponse.json({ cards });
  } catch (error) {
    console.error("Failed to fetch collection:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}
