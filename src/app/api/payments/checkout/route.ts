import { NextRequest, NextResponse } from "next/server";
import { createGachaCheckoutSession } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// POST /api/payments/checkout - Create Stripe checkout for gacha
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { machineId, userId, walletAddress } = body;

    if (!machineId || !userId || !walletAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const machine = await prisma.gachaMachine.findUnique({
      where: { id: machineId },
    });

    if (!machine || !machine.isActive) {
      return NextResponse.json(
        { error: "Machine not found or inactive" },
        { status: 404 }
      );
    }

    const checkoutUrl = await createGachaCheckoutSession({
      machineId,
      machineName: machine.name,
      price: machine.price,
      userId,
      walletAddress,
    });

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Checkout creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
