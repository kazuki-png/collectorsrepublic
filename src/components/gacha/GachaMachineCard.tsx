"use client";

import type { GachaTier, CardCategory } from "@/types";

interface GachaMachineCardProps {
  id: string;
  name: string;
  category: CardCategory;
  tier: GachaTier;
  price: number;
  expectedValue: number;
  pullCount: number;
  onOpen: (machineId: string) => void;
  disabled?: boolean;
}

const tierColors: Record<GachaTier, string> = {
  BASIC: "from-blue-600 to-blue-400",
  ELITE: "from-purple-600 to-purple-400",
  LEGENDARY: "from-yellow-600 to-orange-400",
};

const tierBorders: Record<GachaTier, string> = {
  BASIC: "border-blue-500/30",
  ELITE: "border-purple-500/30",
  LEGENDARY: "border-yellow-500/30",
};

export default function GachaMachineCard({
  id,
  name,
  category,
  tier,
  price,
  expectedValue,
  pullCount,
  onOpen,
  disabled,
}: GachaMachineCardProps) {
  return (
    <div
      className={`relative p-6 rounded-2xl bg-gray-900 border-2 ${tierBorders[tier]} card-hover overflow-hidden`}
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${tierColors[tier]} opacity-5`}
      />

      <div className="relative">
        {/* Tier badge */}
        <div
          className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${tierColors[tier]} mb-4`}
        >
          {tier}
        </div>

        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-sm text-gray-400 mb-4">{category}</p>

        {/* Price */}
        <div className="text-3xl font-bold mb-1">${price}</div>
        <div className="text-sm text-green-400 mb-4">
          EV: ${expectedValue.toFixed(2)} (110%)
        </div>

        {/* Stats */}
        <div className="text-xs text-gray-500 mb-4">
          {pullCount.toLocaleString()} packs opened
        </div>

        {/* Open button */}
        <button
          onClick={() => onOpen(id)}
          disabled={disabled}
          className={`w-full py-3 rounded-lg font-semibold text-lg transition-all ${
            disabled
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : `bg-gradient-to-r ${tierColors[tier]} hover:opacity-90 active:scale-95`
          }`}
        >
          {disabled ? "Connect Wallet" : "Open Pack"}
        </button>
      </div>
    </div>
  );
}
