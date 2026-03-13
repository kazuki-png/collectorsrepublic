import { prisma } from "./prisma";
import { mintNFT, buildNFTMetadata } from "./metaplex";
import { v4 as uuidv4 } from "uuid";
import type { GachaTier, RarityTier } from "@/types";
import { RARITY_WEIGHTS } from "@/types";

interface GachaResult {
  nftCardId: string;
  mintAddress: string;
  cardName: string;
  setName: string;
  rarity: RarityTier;
  imageUrl: string;
  marketPrice: number;
}

/**
 * Select a random card from the gacha machine based on weighted probabilities.
 */
export async function selectRandomCard(machineId: string): Promise<string> {
  const machineCards = await prisma.gachaMachineCard.findMany({
    where: { gachaMachineId: machineId },
    include: { cardTemplate: true },
  });

  if (machineCards.length === 0) {
    throw new Error("No cards available in this gacha machine");
  }

  // Filter out cards with 0 quantity
  const availableCards = machineCards.filter(
    (mc) => mc.quantity === -1 || mc.quantity > 0
  );

  if (availableCards.length === 0) {
    throw new Error("All cards in this machine are sold out");
  }

  // Weighted random selection
  const totalWeight = availableCards.reduce((sum, mc) => sum + mc.weight, 0);
  let random = Math.random() * totalWeight;

  for (const mc of availableCards) {
    random -= mc.weight;
    if (random <= 0) {
      // Decrement quantity if not unlimited
      if (mc.quantity > 0) {
        await prisma.gachaMachineCard.update({
          where: { id: mc.id },
          data: { quantity: mc.quantity - 1 },
        });
      }
      return mc.cardTemplateId;
    }
  }

  // Fallback to last card
  return availableCards[availableCards.length - 1].cardTemplateId;
}

/**
 * Open a gacha pack: select card, mint NFT, return result.
 */
export async function openGacha(
  userId: string,
  machineId: string,
  walletAddress: string
): Promise<GachaResult> {
  // Verify machine exists and is active
  const machine = await prisma.gachaMachine.findUnique({
    where: { id: machineId },
  });

  if (!machine || !machine.isActive) {
    throw new Error("Gacha machine not found or inactive");
  }

  // Select random card
  const cardTemplateId = await selectRandomCard(machineId);

  const cardTemplate = await prisma.cardTemplate.findUnique({
    where: { id: cardTemplateId },
  });

  if (!cardTemplate) {
    throw new Error("Card template not found");
  }

  // Generate vault and inventory IDs
  const vaultId = `VAULT-${uuidv4().slice(0, 8).toUpperCase()}`;
  const inventoryId = `INV-${uuidv4().slice(0, 12).toUpperCase()}`;

  // Build metadata and mint NFT
  const metadata = buildNFTMetadata({
    name: cardTemplate.name,
    setName: cardTemplate.setName,
    rarity: cardTemplate.rarity,
    grade: cardTemplate.grade ?? undefined,
    imageUrl: cardTemplate.imageUrl,
    vaultId,
    inventoryId,
    category: cardTemplate.category,
  });

  const { mintAddress, txSignature } = await mintNFT(metadata, walletAddress);

  // Create NFT card record
  const nftCard = await prisma.nFTCard.create({
    data: {
      mintAddress,
      cardTemplateId,
      ownerId: userId,
      vaultId,
      inventoryId,
    },
  });

  // Create gacha pull record
  await prisma.gachaPull.create({
    data: {
      userId,
      machineId,
      cardTemplateId,
      nftCardId: nftCard.id,
      pricePaid: machine.price,
    },
  });

  // Record transaction
  await prisma.transaction.create({
    data: {
      userId,
      type: "GACHA_PURCHASE",
      amount: machine.price,
      txSignature,
      metadata: {
        machineId,
        cardTemplateId,
        mintAddress,
      },
    },
  });

  return {
    nftCardId: nftCard.id,
    mintAddress,
    cardName: cardTemplate.name,
    setName: cardTemplate.setName,
    rarity: cardTemplate.rarity as RarityTier,
    imageUrl: cardTemplate.imageUrl,
    marketPrice: cardTemplate.marketPrice,
  };
}

/**
 * Get rarity weights for a given gacha tier.
 */
export function getRarityWeights(tier: GachaTier): Record<RarityTier, number> {
  return RARITY_WEIGHTS[tier];
}
