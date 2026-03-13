export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getBuybackQuote, sellBackCard } from "@/lib/buyback";

// GET /api/buyback?nftCardId=...&userId=... - Get buyback quote
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nftCardId = searchParams.get("nftCardId");
    const userId = searchParams.get("userId");

    if (!nftCardId || !userId) {
      return NextResponse.json(
        { error: "Missing nftCardId or userId" },
        { status: 400 }
      );
    }

    const quote = await getBuybackQuote(nftCardId, userId);
    return NextResponse.json(quote);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get quote";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// POST /api/buyback - Execute buyback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nftCardId, userId } = body;

    if (!nftCardId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await sellBackCard(nftCardId, userId);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to execute buyback";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
