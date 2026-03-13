"use client";

import { useState } from "react";
import type { RarityTier } from "@/types";

interface GachaRevealProps {
  cardName: string;
  setName: string;
  rarity: RarityTier;
  imageUrl: string;
  marketPrice: number;
  onClose: () => void;
}

const rarityGradients: Record<RarityTier, string> = {
  COMMON: "from-gray-400 to-gray-600",
  UNCOMMON: "from-green-400 to-green-600",
  RARE: "from-blue-400 to-blue-600",
  ULTRA_RARE: "from-purple-400 to-purple-600",
  SECRET_RARE: "from-yellow-400 to-orange-500",
  CHASE: "from-red-400 to-pink-600",
};

export default function GachaReveal({
  cardName,
  setName,
  rarity,
  imageUrl,
  marketPrice,
  onClose,
}: GachaRevealProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="max-w-md w-full mx-4">
        {!revealed ? (
          <div className="text-center">
            <div
              className="w-64 h-96 mx-auto bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center cursor-pointer gacha-glow animate-pulse"
              onClick={() => setRevealed(true)}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">?</div>
                <p className="text-lg font-semibold">Tap to reveal!</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center animate-card-flip">
            {/* Card image */}
            <div
              className={`w-64 h-96 mx-auto rounded-xl border-4 overflow-hidden mb-4 ${
                rarity === "COMMON"
                  ? "border-gray-400"
                  : rarity === "UNCOMMON"
                  ? "border-green-400"
                  : rarity === "RARE"
                  ? "border-blue-400"
                  : rarity === "ULTRA_RARE"
                  ? "border-purple-400"
                  : rarity === "SECRET_RARE"
                  ? "border-yellow-400"
                  : "border-red-400"
              }`}
            >
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={cardName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="text-4xl mb-2">🃏</div>
                    <p className="text-sm text-gray-400">{cardName}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Card info */}
            <h3 className="text-2xl font-bold mb-1">{cardName}</h3>
            <p className="text-gray-400 mb-2">{setName}</p>

            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${rarityGradients[rarity]} mb-2`}
            >
              {rarity.replace("_", " ")}
            </span>

            <div className="text-xl font-bold text-green-400 mb-6">
              ${marketPrice.toFixed(2)}
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 bg-primary-600 rounded-lg font-semibold hover:bg-primary-500 transition-colors"
            >
              View in Collection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
