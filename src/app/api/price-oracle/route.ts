export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { updateCardDatabase } from "@/lib/price-oracle";

// POST /api/price-oracle - Trigger price update for all cards
export async function POST() {
  try {
    const updatedCount = await updateCardDatabase();
    return NextResponse.json({
      success: true,
      updatedCards: updatedCount,
    });
  } catch (error) {
    console.error("Price oracle update failed:", error);
    return NextResponse.json(
      { error: "Failed to update prices" },
      { status: 500 }
    );
  }
}
