// ==========================================
// Core Types for Collectors Republic
// ==========================================

export type CardCategory = "POKEMON" | "ONE_PIECE";

export type GachaTier = "BASIC" | "ELITE" | "LEGENDARY";

export type RarityTier =
  | "COMMON"
  | "UNCOMMON"
  | "RARE"
  | "ULTRA_RARE"
  | "SECRET_RARE"
  | "CHASE";

export type ListingStatus = "ACTIVE" | "SOLD" | "CANCELLED";

export type RedemptionStatus = "VAULTED" | "REDEMPTION_REQUESTED" | "SHIPPED" | "DELIVERED";

export interface GachaMachine {
  id: string;
  category: CardCategory;
  tier: GachaTier;
  price: number; // in USD
  expectedValue: number; // 110% of price
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

export interface CardTemplate {
  id: string;
  name: string;
  setName: string;
  category: CardCategory;
  rarity: RarityTier;
  grade?: string;
  imageUrl: string;
  marketPrice: number;
  weight: number; // probability weight in gacha
}

export interface NFTCard {
  id: string;
  mintAddress: string;
  cardTemplateId: string;
  ownerId: string;
  vaultId: string;
  inventoryId: string;
  redemptionStatus: RedemptionStatus;
  cardName: string;
  setName: string;
  rarity: RarityTier;
  grade?: string;
  imageUrl: string;
  marketPrice: number;
  mintedAt: Date;
}

export interface MarketplaceListing {
  id: string;
  nftCardId: string;
  sellerId: string;
  price: number;
  status: ListingStatus;
  createdAt: Date;
  soldAt?: Date;
  buyerId?: string;
}

export interface GachaPull {
  id: string;
  userId: string;
  machineId: string;
  cardTemplateId: string;
  nftCardId: string;
  pricePaid: number;
  pulledAt: Date;
}

export interface User {
  id: string;
  walletAddress: string;
  email?: string;
  displayName?: string;
  createdAt: Date;
}

export interface PriceData {
  cardTemplateId: string;
  altPrice?: number;
  collectrPrice?: number;
  ebayPrice?: number;
  medianPrice: number;
  lastUpdated: Date;
}

export interface BuybackOffer {
  nftCardId: string;
  marketPrice: number;
  buybackPrice: number; // 90% of market price
  expiresAt: Date;
}

export interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  properties: {
    card_name: string;
    set_name: string;
    rarity: string;
    grade?: string;
    vault_id: string;
    inventory_id: string;
    redeemable_status: string;
    category: string;
  };
}

// Gacha configuration
export const GACHA_MACHINES: Record<CardCategory, Record<GachaTier, { price: number; ev: number }>> = {
  POKEMON: {
    BASIC: { price: 25, ev: 27.5 },
    ELITE: { price: 100, ev: 110 },
    LEGENDARY: { price: 500, ev: 550 },
  },
  ONE_PIECE: {
    BASIC: { price: 25, ev: 27.5 },
    ELITE: { price: 100, ev: 110 },
    LEGENDARY: { price: 500, ev: 550 },
  },
};

export const BUYBACK_RATE = 0.9; // 90%

export const RARITY_WEIGHTS: Record<GachaTier, Record<RarityTier, number>> = {
  BASIC: {
    COMMON: 50,
    UNCOMMON: 30,
    RARE: 15,
    ULTRA_RARE: 4,
    SECRET_RARE: 0.9,
    CHASE: 0.1,
  },
  ELITE: {
    COMMON: 20,
    UNCOMMON: 30,
    RARE: 30,
    ULTRA_RARE: 14,
    SECRET_RARE: 5,
    CHASE: 1,
  },
  LEGENDARY: {
    COMMON: 5,
    UNCOMMON: 15,
    RARE: 30,
    ULTRA_RARE: 30,
    SECRET_RARE: 15,
    CHASE: 5,
  },
};
