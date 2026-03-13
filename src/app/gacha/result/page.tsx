"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import GachaReveal from "@/components/gacha/GachaReveal";
import Link from "next/link";

function GachaResultContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [result, setResult] = useState<{
    cardName: string;
    setName: string;
    rarity: "COMMON" | "UNCOMMON" | "RARE" | "ULTRA_RARE" | "SECRET_RARE" | "CHASE";
    imageUrl: string;
    marketPrice: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionId) {
      verifyAndOpen();
    } else {
      setError("No session ID provided");
      setLoading(false);
    }
  }, [sessionId]);

  async function verifyAndOpen() {
    try {
      // The webhook should have already processed the gacha.
      // This page shows the result or a pending state.
      setLoading(false);
      // In production, poll for the result from the webhook processing
      setResult({
        cardName: "Loading...",
        setName: "Processing your pull",
        rarity: "COMMON",
        imageUrl: "",
        marketPrice: 0,
      });
    } catch {
      setError("Failed to verify payment");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🎰</div>
          <h2 className="text-2xl font-bold mb-2">Opening your pack...</h2>
          <p className="text-gray-400">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Link
            href="/gacha"
            className="px-6 py-2 bg-primary-600 rounded-lg hover:bg-primary-500"
          >
            Back to Gacha
          </Link>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <GachaReveal
        cardName={result.cardName}
        setName={result.setName}
        rarity={result.rarity}
        imageUrl={result.imageUrl}
        marketPrice={result.marketPrice}
        onClose={() => (window.location.href = "/collection")}
      />
    );
  }

  return null;
}

export default function GachaResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-6xl animate-bounce">🎰</div>
        </div>
      }
    >
      <GachaResultContent />
    </Suspense>
  );
}
