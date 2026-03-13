"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import GachaMachineCard from "@/components/gacha/GachaMachineCard";
import GachaReveal from "@/components/gacha/GachaReveal";

interface Machine {
  id: string;
  name: string;
  category: "POKEMON" | "ONE_PIECE";
  tier: "BASIC" | "ELITE" | "LEGENDARY";
  price: number;
  expectedValue: number;
  _count: { gachaPulls: number };
}

interface GachaResult {
  cardName: string;
  setName: string;
  rarity: "COMMON" | "UNCOMMON" | "RARE" | "ULTRA_RARE" | "SECRET_RARE" | "CHASE";
  imageUrl: string;
  marketPrice: number;
}

export default function GachaPage() {
  const { publicKey, connected } = useWallet();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [activeCategory, setActiveCategory] = useState<"POKEMON" | "ONE_PIECE">("POKEMON");
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);
  const [result, setResult] = useState<GachaResult | null>(null);

  useEffect(() => {
    fetchMachines();
  }, []);

  async function fetchMachines() {
    try {
      const res = await fetch("/api/gacha");
      const data = await res.json();
      setMachines(data.machines || []);
    } catch (error) {
      console.error("Failed to fetch machines:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleOpenPack(machineId: string) {
    if (!connected || !publicKey) return;

    setOpening(true);
    try {
      // In production, redirect to Stripe checkout first
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          machineId,
          userId: publicKey.toBase58(), // simplified; use auth system
          walletAddress: publicKey.toBase58(),
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Failed to open pack:", error);
    } finally {
      setOpening(false);
    }
  }

  const filteredMachines = machines.filter(
    (m) => m.category === activeCategory
  );

  // Demo machines when DB is empty
  const demoMachines: Machine[] =
    filteredMachines.length > 0
      ? filteredMachines
      : [
          {
            id: "demo-basic",
            name: `${activeCategory === "POKEMON" ? "Pokemon" : "One Piece"} Basic`,
            category: activeCategory,
            tier: "BASIC",
            price: 25,
            expectedValue: 27.5,
            _count: { gachaPulls: 0 },
          },
          {
            id: "demo-elite",
            name: `${activeCategory === "POKEMON" ? "Pokemon" : "One Piece"} Elite`,
            category: activeCategory,
            tier: "ELITE",
            price: 100,
            expectedValue: 110,
            _count: { gachaPulls: 0 },
          },
          {
            id: "demo-legendary",
            name: `${activeCategory === "POKEMON" ? "Pokemon" : "One Piece"} Legendary`,
            category: activeCategory,
            tier: "LEGENDARY",
            price: 500,
            expectedValue: 550,
            _count: { gachaPulls: 0 },
          },
        ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-2 gradient-text">Gacha Packs</h1>
        <p className="text-gray-400 mb-8">
          Open packs to pull trading cards. Each pack has a 110% expected value.
        </p>

        {/* Category tabs */}
        <div className="flex gap-2 mb-8">
          {(["POKEMON", "ONE_PIECE"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {cat === "ONE_PIECE" ? "One Piece" : "Pokemon"}
            </button>
          ))}
        </div>

        {/* Machines grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-gray-900 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoMachines.map((machine) => (
              <GachaMachineCard
                key={machine.id}
                id={machine.id}
                name={machine.name}
                category={machine.category}
                tier={machine.tier}
                price={machine.price}
                expectedValue={machine.expectedValue}
                pullCount={machine._count.gachaPulls}
                onOpen={handleOpenPack}
                disabled={!connected || opening}
              />
            ))}
          </div>
        )}

        {/* Info */}
        <div className="mt-12 p-6 rounded-xl bg-gray-900 border border-gray-800">
          <h3 className="text-xl font-bold mb-4">How Gacha Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
            <div>
              <h4 className="font-semibold text-white mb-1">Expected Value</h4>
              <p>
                Every machine is designed with a 110% expected value. A $100
                pack has an average return of $110 in card value.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Rarity Tiers</h4>
              <p>
                Cards range from Common to Chase rarity. Higher tier machines
                have better odds of pulling rare and ultra-rare cards.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">NFT Minting</h4>
              <p>
                When you pull a card, an NFT is minted on Solana using the
                Metaplex standard and sent directly to your wallet.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Buyback</h4>
              <p>
                Not happy with your pull? Sell it back to the platform
                instantly for 90% of market value, paid in USDC.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reveal modal */}
      {result && (
        <GachaReveal
          cardName={result.cardName}
          setName={result.setName}
          rarity={result.rarity}
          imageUrl={result.imageUrl}
          marketPrice={result.marketPrice}
          onClose={() => setResult(null)}
        />
      )}
    </div>
  );
}
