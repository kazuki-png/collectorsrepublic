"use client";

import { useState } from "react";

interface CollectionCardProps {
  id: string;
  mintAddress: string;
  cardName: string;
  setName: string;
  rarity: string;
  grade?: string;
  imageUrl: string;
  marketPrice: number;
  vaultId: string;
  redemptionStatus: string;
  isListed: boolean;
  onList: (nftCardId: string, price: number) => void;
  onBuyback: (nftCardId: string) => void;
  onRedeem: (nftCardId: string) => void;
}

const rarityBorders: Record<string, string> = {
  COMMON: "border-gray-500",
  UNCOMMON: "border-green-500",
  RARE: "border-blue-500",
  ULTRA_RARE: "border-purple-500",
  SECRET_RARE: "border-yellow-500",
  CHASE: "border-red-500",
};

export default function CollectionCard({
  id,
  mintAddress,
  cardName,
  setName,
  rarity,
  grade,
  imageUrl,
  marketPrice,
  vaultId,
  redemptionStatus,
  isListed,
  onList,
  onBuyback,
  onRedeem,
}: CollectionCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [listPrice, setListPrice] = useState(marketPrice.toString());

  const shortMint = `${mintAddress.slice(0, 4)}...${mintAddress.slice(-4)}`;

  return (
    <div
      className={`rounded-xl bg-gray-900 border-2 ${
        rarityBorders[rarity] || "border-gray-700"
      } overflow-hidden card-hover`}
    >
      {/* Card image */}
      <div className="aspect-[3/4] bg-gray-800 relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={cardName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-5xl">🃏</div>
          </div>
        )}

        {/* Status badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isListed && (
            <span className="px-2 py-0.5 bg-green-600 rounded text-xs font-bold">
              LISTED
            </span>
          )}
          {redemptionStatus !== "VAULTED" && (
            <span className="px-2 py-0.5 bg-orange-600 rounded text-xs font-bold">
              {redemptionStatus.replace("_", " ")}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate">{cardName}</h3>
        <p className="text-xs text-gray-400">{setName}</p>

        <div className="flex items-center justify-between mt-2 mb-1">
          <span className="text-xs text-gray-500">
            {rarity.replace("_", " ")}
          </span>
          {grade && (
            <span className="text-xs text-primary-400">Grade: {grade}</span>
          )}
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-green-400">
            ${marketPrice.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">{shortMint}</span>
        </div>

        <div className="text-xs text-gray-500 mb-3">Vault: {vaultId}</div>

        {/* Actions */}
        {redemptionStatus === "VAULTED" && !isListed && (
          <>
            <button
              onClick={() => setShowActions(!showActions)}
              className="w-full py-2 rounded-lg text-sm font-medium bg-gray-800 hover:bg-gray-700 transition-colors mb-2"
            >
              {showActions ? "Hide Actions" : "Actions"}
            </button>

            {showActions && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={listPrice}
                    onChange={(e) => setListPrice(e.target.value)}
                    className="flex-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                    placeholder="Price"
                    step="0.01"
                  />
                  <button
                    onClick={() => onList(id, parseFloat(listPrice))}
                    className="px-3 py-1 bg-primary-600 rounded text-sm font-medium hover:bg-primary-500"
                  >
                    List
                  </button>
                </div>
                <button
                  onClick={() => onBuyback(id)}
                  className="w-full py-1.5 rounded text-sm font-medium bg-accent-600/20 text-accent-400 hover:bg-accent-600/30"
                >
                  Sell Back (90%)
                </button>
                <button
                  onClick={() => onRedeem(id)}
                  className="w-full py-1.5 rounded text-sm font-medium bg-orange-600/20 text-orange-400 hover:bg-orange-600/30"
                >
                  Redeem Physical
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
