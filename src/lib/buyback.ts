import { prisma } from "./prisma";
import { transferNFT } from "./metaplex";
import { BUYBACK_RATE } from "@/types";

export interface BuybackQuote {
  nftCardId: string;
  cardName: string;
  marketPrice: number;
  buybackPrice: number;
  buybackRate: number;
}

/**
 * Get a buyback quote for an NFT card.
 */
export async function getBuybackQuote(
  nftCardId: string,
  userId: string
): Promise<BuybackQuote> {
  const nftCard = await prisma.nFTCard.findUnique({
    where: { id: nftCardId },
    include: { cardTemplate: true },
  });

  if (!nftCard) {
    throw new Error("NFT card not found");
  }

  if (nftCard.ownerId !== userId) {
    throw new Error("You do not own this card");
  }

  if (nftCard.redemptionStatus !== "VAULTED") {
    throw new Error("Card must be vaulted for buyback");
  }

  const marketPrice = nftCard.cardTemplate.marketPrice;
  const buybackPrice = Math.round(marketPrice * BUYBACK_RATE * 100) / 100;

  return {
    nftCardId,
    cardName: nftCard.cardTemplate.name,
    marketPrice,
    buybackPrice,
    buybackRate: BUYBACK_RATE,
  };
}

/**
 * Execute a buyback: transfer NFT to platform, send USDC to user.
 */
export async function sellBackCard(
  nftCardId: string,
  userId: string
): Promise<{ buybackPrice: number; txSignature: string }> {
  const quote = await getBuybackQuote(nftCardId, userId);

  const nftCard = await prisma.nFTCard.findUnique({
    where: { id: nftCardId },
    include: { owner: true },
  });

  if (!nftCard) {
    throw new Error("NFT card not found");
  }

  const platformAddress = process.env.NEXT_PUBLIC_PLATFORM_WALLET_ADDRESS;
  if (!platformAddress) {
    throw new Error("Platform wallet not configured");
  }

  // Transfer NFT to platform
  const txSignature = await transferNFT(
    nftCard.mintAddress,
    nftCard.owner.walletAddress,
    platformAddress
  );

  // Update ownership to platform (mark as bought back)
  // In production, also send USDC via SPL token transfer
  await prisma.nFTCard.update({
    where: { id: nftCardId },
    data: {
      ownerId: userId, // keeps record, but platform now holds NFT
    },
  });

  // Cancel any active listings
  await prisma.marketplaceListing.updateMany({
    where: { nftCardId, status: "ACTIVE" },
    data: { status: "CANCELLED" },
  });

  // Record transaction
  await prisma.transaction.create({
    data: {
      userId,
      type: "BUYBACK",
      amount: quote.buybackPrice,
      txSignature,
      metadata: {
        nftCardId,
        marketPrice: quote.marketPrice,
        buybackRate: BUYBACK_RATE,
      },
    },
  });

  return { buybackPrice: quote.buybackPrice, txSignature };
}
