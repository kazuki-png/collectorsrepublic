"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import CollectionCard from "@/components/collection/CollectionCard";

interface NFTCard {
  id: string;
  mintAddress: string;
  vaultId: string;
  inventoryId: string;
  redemptionStatus: string;
  cardTemplate: {
    name: string;
    setName: string;
    rarity: string;
    grade?: string;
    imageUrl: string;
    marketPrice: number;
    category: string;
  };
  listings: { id: string; status: string }[];
}

export default function CollectionPage() {
  const { publicKey, connected } = useWallet();
  const [cards, setCards] = useState<NFTCard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      fetchCollection();
    }
  }, [connected, publicKey]);

  async function fetchCollection() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/collection?userId=${publicKey!.toBase58()}`
      );
      const data = await res.json();
      setCards(data.cards || []);
    } catch (error) {
      console.error("Failed to fetch collection:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleList(nftCardId: string, price: number) {
    if (!publicKey) return;

    try {
      const res = await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nftCardId,
          sellerId: publicKey.toBase58(),
          price,
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchCollection();
      } else {
        alert(data.error || "Failed to list");
      }
    } catch (error) {
      console.error("List failed:", error);
    }
  }

  async function handleBuyback(nftCardId: string) {
    if (!publicKey) return;

    try {
      // Get quote first
      const quoteRes = await fetch(
        `/api/buyback?nftCardId=${nftCardId}&userId=${publicKey.toBase58()}`
      );
      const quote = await quoteRes.json();

      if (
        !confirm(
          `Sell back "${quote.cardName}" for $${quote.buybackPrice.toFixed(2)} USDC? (Market: $${quote.marketPrice.toFixed(2)})`
        )
      ) {
        return;
      }

      const res = await fetch("/api/buyback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nftCardId,
          userId: publicKey.toBase58(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Buyback complete! You received $${data.buybackPrice.toFixed(2)} USDC`);
        fetchCollection();
      } else {
        alert(data.error || "Buyback failed");
      }
    } catch (error) {
      console.error("Buyback failed:", error);
    }
  }

  async function handleRedeem(nftCardId: string) {
    alert(
      "Physical redemption coming soon! This will burn your NFT and ship the physical card to your address."
    );
  }

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎴</div>
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">
            Connect your Solana wallet to view your NFT collection.
          </p>
        </div>
      </div>
    );
  }

  const totalValue = cards.reduce(
    (sum, c) => sum + c.cardTemplate.marketPrice,
    0
  );

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text">My Collection</h1>
            <p className="text-gray-400 mt-1">
              {cards.length} cards &middot; Total value: $
              {totalValue.toFixed(2)}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/5] rounded-xl bg-gray-900 animate-pulse"
              />
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">No cards yet</h3>
            <p className="text-gray-400">
              Open some gacha packs to start your collection!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {cards.map((card) => (
              <CollectionCard
                key={card.id}
                id={card.id}
                mintAddress={card.mintAddress}
                cardName={card.cardTemplate.name}
                setName={card.cardTemplate.setName}
                rarity={card.cardTemplate.rarity}
                grade={card.cardTemplate.grade}
                imageUrl={card.cardTemplate.imageUrl}
                marketPrice={card.cardTemplate.marketPrice}
                vaultId={card.vaultId}
                redemptionStatus={card.redemptionStatus}
                isListed={card.listings.some((l) => l.status === "ACTIVE")}
                onList={handleList}
                onBuyback={handleBuyback}
                onRedeem={handleRedeem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
