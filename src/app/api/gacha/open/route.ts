import { NextRequest, NextResponse } from "next/server";
import { openGacha } from "@/lib/gacha";

// POST /api/gacha/open - Open a gacha pack (after payment verified)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, machineId, walletAddress } = body;

    if (!userId || !machineId || !walletAddress) {
      return NextResponse.json(
        { error: "Missing required fields: userId, machineId, walletAddress" },
        { status: 400 }
      );
    }

    const result = await openGacha(userId, machineId, walletAddress);

    return NextResponse.json({
      success: true,
      card: result,
    });
  } catch (error) {
    console.error("Gacha open failed:", error);
    const message = error instanceof Error ? error.message : "Failed to open gacha";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
