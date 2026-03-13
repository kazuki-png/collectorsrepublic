export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { cancelListing } from "@/lib/marketplace";

// POST /api/marketplace/cancel - Cancel an active listing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listingId, userId } = body;

    if (!listingId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await cancelListing(listingId, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to cancel listing";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
