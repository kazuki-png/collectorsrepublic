"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

interface User {
  id: string;
  walletAddress: string;
  email?: string;
  displayName?: string;
  isAdmin: boolean;
}

export function useUser() {
  const { publicKey, connected } = useWallet();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      authenticateUser();
    } else {
      setUser(null);
    }
  }, [connected, publicKey]);

  async function authenticateUser() {
    if (!publicKey) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: publicKey.toBase58() }),
      });
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error("Auth failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return { user, loading, connected };
}
