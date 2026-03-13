"use client";

interface ListingCardProps {
  id: string;
  cardName: string;
  setName: string;
  rarity: string;
  grade?: string;
  imageUrl: string;
  price: number;
  sellerAddress: string;
  onBuy: (listingId: string) => void;
  disabled?: boolean;
  isOwnListing?: boolean;
  onCancel?: (listingId: string) => void;
}

const rarityColors: Record<string, string> = {
  COMMON: "text-gray-400 bg-gray-800",
  UNCOMMON: "text-green-400 bg-green-900/30",
  RARE: "text-blue-400 bg-blue-900/30",
  ULTRA_RARE: "text-purple-400 bg-purple-900/30",
  SECRET_RARE: "text-yellow-400 bg-yellow-900/30",
  CHASE: "text-red-400 bg-red-900/30",
};

export default function ListingCard({
  id,
  cardName,
  setName,
  rarity,
  grade,
  imageUrl,
  price,
  sellerAddress,
  onBuy,
  disabled,
  isOwnListing,
  onCancel,
}: ListingCardProps) {
  const shortAddress = `${sellerAddress.slice(0, 4)}...${sellerAddress.slice(-4)}`;

  return (
    <div className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden card-hover">
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
            <div className="text-center">
              <div className="text-5xl mb-2">🃏</div>
              <p className="text-xs text-gray-500">{cardName}</p>
            </div>
          </div>
        )}
        {/* Rarity badge */}
        <span
          className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold ${
            rarityColors[rarity] || "text-gray-400 bg-gray-800"
          }`}
        >
          {rarity.replace("_", " ")}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold truncate">{cardName}</h3>
        <p className="text-xs text-gray-400 mb-1">{setName}</p>
        {grade && (
          <p className="text-xs text-primary-400 mb-2">Grade: {grade}</p>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-green-400">
            ${price.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">{shortAddress}</span>
        </div>

        {isOwnListing ? (
          <button
            onClick={() => onCancel?.(id)}
            className="w-full py-2 rounded-lg font-medium bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
          >
            Cancel Listing
          </button>
        ) : (
          <button
            onClick={() => onBuy(id)}
            disabled={disabled}
            className={`w-full py-2 rounded-lg font-medium transition-colors ${
              disabled
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-primary-600 hover:bg-primary-500"
            }`}
          >
            Buy Now
          </button>
        )}
      </div>
    </div>
  );
}
