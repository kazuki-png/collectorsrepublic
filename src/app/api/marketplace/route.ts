import { NextRequest, NextResponse } from "next/server";
import { getActiveListings, listNFT } from "@/lib/marketplace";

// GET /api/marketplace - Get active listings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await getActiveListings(category, page, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

// POST /api/marketplace - Create a new listing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nftCardId, sellerId, price } = body;

    if (!nftCardId || !sellerId || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: "Price must be greater than 0" },
        { status: 400 }
      );
    }

    const listingId = await listNFT(nftCardId, sellerId, price);
    return NextResponse.json({ success: true, listingId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create listing";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
