import { NextRequest, NextResponse } from "next/server";
import { buyNFT } from "@/lib/marketplace";

// POST /api/marketplace/buy - Buy a listed NFT
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listingId, buyerId, buyerWalletAddress } = body;

    if (!listingId || !buyerId || !buyerWalletAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await buyNFT(listingId, buyerId, buyerWalletAddress);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to buy NFT";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
