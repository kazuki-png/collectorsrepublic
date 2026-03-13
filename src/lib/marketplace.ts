import { prisma } from "./prisma";
import { transferNFT } from "./metaplex";

export async function listNFT(
  nftCardId: string,
  sellerId: string,
  price: number
): Promise<string> {
  // Verify ownership
  const nftCard = await prisma.nFTCard.findUnique({
    where: { id: nftCardId },
  });

  if (!nftCard || nftCard.ownerId !== sellerId) {
    throw new Error("You do not own this card");
  }

  if (nftCard.redemptionStatus !== "VAULTED") {
    throw new Error("Card must be vaulted to list on marketplace");
  }

  // Check for existing active listing
  const existingListing = await prisma.marketplaceListing.findFirst({
    where: { nftCardId, status: "ACTIVE" },
  });

  if (existingListing) {
    throw new Error("Card is already listed");
  }

  const listing = await prisma.marketplaceListing.create({
    data: {
      nftCardId,
      sellerId,
      price,
    },
  });

  return listing.id;
}

export async function buyNFT(
  listingId: string,
  buyerId: string,
  buyerWalletAddress: string
): Promise<{ txSignature: string }> {
  const listing = await prisma.marketplaceListing.findUnique({
    where: { id: listingId },
    include: { nftCard: true, seller: true },
  });

  if (!listing || listing.status !== "ACTIVE") {
    throw new Error("Listing not found or no longer active");
  }

  if (listing.sellerId === buyerId) {
    throw new Error("Cannot buy your own listing");
  }

  // Transfer NFT on-chain
  const txSignature = await transferNFT(
    listing.nftCard.mintAddress,
    listing.seller.walletAddress,
    buyerWalletAddress
  );

  // Update listing
  await prisma.marketplaceListing.update({
    where: { id: listingId },
    data: {
      status: "SOLD",
      buyerId,
      soldAt: new Date(),
    },
  });

  // Transfer ownership in DB
  await prisma.nFTCard.update({
    where: { id: listing.nftCardId },
    data: { ownerId: buyerId },
  });

  // Record transactions
  await prisma.transaction.createMany({
    data: [
      {
        userId: buyerId,
        type: "MARKETPLACE_BUY",
        amount: listing.price,
        txSignature,
        metadata: { listingId, nftCardId: listing.nftCardId },
      },
      {
        userId: listing.sellerId,
        type: "MARKETPLACE_SELL",
        amount: listing.price,
        metadata: { listingId, nftCardId: listing.nftCardId },
      },
    ],
  });

  return { txSignature };
}

export async function cancelListing(
  listingId: string,
  userId: string
): Promise<void> {
  const listing = await prisma.marketplaceListing.findUnique({
    where: { id: listingId },
  });

  if (!listing || listing.sellerId !== userId) {
    throw new Error("Listing not found or unauthorized");
  }

  if (listing.status !== "ACTIVE") {
    throw new Error("Listing is not active");
  }

  await prisma.marketplaceListing.update({
    where: { id: listingId },
    data: { status: "CANCELLED" },
  });
}

export async function getActiveListings(
  category?: string,
  page = 1,
  limit = 20
) {
  const where: Record<string, unknown> = { status: "ACTIVE" as const };

  if (category) {
    where.nftCard = {
      cardTemplate: { category },
    };
  }

  const [listings, total] = await Promise.all([
    prisma.marketplaceListing.findMany({
      where,
      include: {
        nftCard: {
          include: { cardTemplate: true },
        },
        seller: {
          select: { id: true, walletAddress: true, displayName: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.marketplaceListing.count({ where }),
  ]);

  return { listings, total, page, totalPages: Math.ceil(total / limit) };
}
