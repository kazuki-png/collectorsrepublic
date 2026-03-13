"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import ListingCard from "@/components/marketplace/ListingCard";

interface Listing {
  id: string;
  price: number;
  nftCard: {
    id: string;
    mintAddress: string;
    cardTemplate: {
      name: string;
      setName: string;
      rarity: string;
      grade?: string;
      imageUrl: string;
      category: string;
    };
  };
  seller: {
    id: string;
    walletAddress: string;
    displayName?: string;
  };
}

export default function MarketplacePage() {
  const { publicKey, connected } = useWallet();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchListings();
  }, [category, page]);

  async function fetchListings() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      params.set("page", page.toString());

      const res = await fetch(`/api/marketplace?${params}`);
      const data = await res.json();
      setListings(data.listings || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleBuy(listingId: string) {
    if (!connected || !publicKey) return;

    try {
      const res = await fetch("/api/marketplace/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          buyerId: publicKey.toBase58(),
          buyerWalletAddress: publicKey.toBase58(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchListings();
      } else {
        alert(data.error || "Purchase failed");
      }
    } catch (error) {
      console.error("Buy failed:", error);
    }
  }

  async function handleCancel(listingId: string) {
    if (!publicKey) return;

    try {
      const res = await fetch("/api/marketplace/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          userId: publicKey.toBase58(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchListings();
      }
    } catch (error) {
      console.error("Cancel failed:", error);
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold mb-2 gradient-text">Marketplace</h1>
        <p className="text-gray-400 mb-8">
          Buy and sell NFT trading cards. All cards are backed by physical
          cards in our vault.
        </p>

        {/* Filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => {
              setCategory("");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !category
                ? "bg-primary-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            All
          </button>
          {["POKEMON", "ONE_PIECE"].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-primary-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {cat === "ONE_PIECE" ? "One Piece" : "Pokemon"}
            </button>
          ))}
        </div>

        {/* Listings grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/5] rounded-xl bg-gray-900 animate-pulse"
              />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
            <p className="text-gray-400">
              Be the first to list a card on the marketplace!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  cardName={listing.nftCard.cardTemplate.name}
                  setName={listing.nftCard.cardTemplate.setName}
                  rarity={listing.nftCard.cardTemplate.rarity}
                  grade={listing.nftCard.cardTemplate.grade}
                  imageUrl={listing.nftCard.cardTemplate.imageUrl}
                  price={listing.price}
                  sellerAddress={listing.seller.walletAddress}
                  onBuy={handleBuy}
                  disabled={!connected}
                  isOwnListing={
                    publicKey?.toBase58() === listing.seller.walletAddress
                  }
                  onCancel={handleCancel}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-400">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
