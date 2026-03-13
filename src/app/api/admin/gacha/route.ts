import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/admin/gacha - Create or update gacha machine
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, tier, price, name, description, imageUrl, cards } = body;

    if (!category || !tier || !price || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const expectedValue = price * 1.1; // 110% EV

    const machine = await prisma.gachaMachine.create({
      data: {
        category,
        tier,
        price,
        expectedValue,
        name,
        description,
        imageUrl,
      },
    });

    // Add cards to machine if provided
    if (cards && Array.isArray(cards)) {
      for (const card of cards) {
        await prisma.gachaMachineCard.create({
          data: {
            gachaMachineId: machine.id,
            cardTemplateId: card.cardTemplateId,
            weight: card.weight,
            quantity: card.quantity ?? -1,
          },
        });
      }
    }

    return NextResponse.json({ success: true, machine });
  } catch (error) {
    console.error("Failed to create gacha machine:", error);
    return NextResponse.json(
      { error: "Failed to create gacha machine" },
      { status: 500 }
    );
  }
}

// GET /api/admin/gacha - Get all gacha machines with stats
export async function GET() {
  try {
    const machines = await prisma.gachaMachine.findMany({
      include: {
        cards: {
          include: { cardTemplate: true },
        },
        _count: { select: { gachaPulls: true } },
      },
      orderBy: [{ category: "asc" }, { price: "asc" }],
    });

    return NextResponse.json({ machines });
  } catch (error) {
    console.error("Failed to fetch machines:", error);
    return NextResponse.json(
      { error: "Failed to fetch gacha machines" },
      { status: 500 }
    );
  }
}
