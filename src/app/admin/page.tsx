"use client";

import { useState, useEffect } from "react";

interface CardTemplate {
  id: string;
  name: string;
  setName: string;
  category: string;
  rarity: string;
  grade?: string;
  imageUrl: string;
  marketPrice: number;
  isActive: boolean;
  _count: { nftCards: number };
}

interface GachaMachine {
  id: string;
  name: string;
  category: string;
  tier: string;
  price: number;
  expectedValue: number;
  isActive: boolean;
  _count: { gachaPulls: number };
  cards: { cardTemplate: CardTemplate; weight: number; quantity: number }[];
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"cards" | "gacha" | "pricing">(
    "cards"
  );
  const [cards, setCards] = useState<CardTemplate[]>([]);
  const [machines, setMachines] = useState<GachaMachine[]>([]);
  const [loading, setLoading] = useState(true);

  // Card form
  const [newCard, setNewCard] = useState({
    name: "",
    setName: "",
    category: "POKEMON",
    rarity: "COMMON",
    grade: "",
    imageUrl: "",
    marketPrice: 0,
    description: "",
  });

  // Gacha form
  const [newMachine, setNewMachine] = useState({
    name: "",
    category: "POKEMON",
    tier: "BASIC",
    price: 25,
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [cardsRes, machinesRes] = await Promise.all([
        fetch("/api/admin/cards"),
        fetch("/api/admin/gacha"),
      ]);
      const cardsData = await cardsRes.json();
      const machinesData = await machinesRes.json();
      setCards(cardsData.cards || []);
      setMachines(machinesData.machines || []);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCard(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard),
      });
      const data = await res.json();
      if (data.success) {
        setNewCard({
          name: "",
          setName: "",
          category: "POKEMON",
          rarity: "COMMON",
          grade: "",
          imageUrl: "",
          marketPrice: 0,
          description: "",
        });
        fetchData();
      }
    } catch (error) {
      console.error("Failed to create card:", error);
    }
  }

  async function handleCreateMachine(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/gacha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMachine),
      });
      const data = await res.json();
      if (data.success) {
        setNewMachine({
          name: "",
          category: "POKEMON",
          tier: "BASIC",
          price: 25,
          description: "",
          imageUrl: "",
        });
        fetchData();
      }
    } catch (error) {
      console.error("Failed to create machine:", error);
    }
  }

  async function handleUpdatePrices() {
    try {
      const res = await fetch("/api/price-oracle", { method: "POST" });
      const data = await res.json();
      alert(`Updated ${data.updatedCards} card prices`);
      fetchData();
    } catch (error) {
      console.error("Price update failed:", error);
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-2 gradient-text">
          Admin Dashboard
        </h1>
        <p className="text-gray-400 mb-8">
          Manage cards, gacha machines, and pricing.
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-800 pb-2">
          {(["cards", "gacha", "pricing"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards Tab */}
        {activeTab === "cards" && (
          <div className="space-y-8">
            <form
              onSubmit={handleCreateCard}
              className="p-6 bg-gray-900 rounded-xl border border-gray-800"
            >
              <h3 className="text-lg font-semibold mb-4">Add Card Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Card Name"
                  value={newCard.name}
                  onChange={(e) =>
                    setNewCard({ ...newCard, name: e.target.value })
                  }
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                  required
                />
                <input
                  placeholder="Set Name"
                  value={newCard.setName}
                  onChange={(e) =>
                    setNewCard({ ...newCard, setName: e.target.value })
                  }
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                  required
                />
                <select
                  value={newCard.category}
                  onChange={(e) =>
                    setNewCard({ ...newCard, category: e.target.value })
                  }
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                >
                  <option value="POKEMON">Pokemon</option>
                  <option value="ONE_PIECE">One Piece</option>
                </select>
                <select
                  value={newCard.rarity}
                  onChange={(e) =>
                    setNewCard({ ...newCard, rarity: e.target.value })
                  }
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                >
                  <option value="COMMON">Common</option>
                  <option value="UNCOMMON">Uncommon</option>
                  <option value="RARE">Rare</option>
                  <option value="ULTRA_RARE">Ultra Rare</option>
                  <option value="SECRET_RARE">Secret Rare</option>
                  <option value="CHASE">Chase</option>
                </select>
                <input
                  placeholder="Grade (optional)"
                  value={newCard.grade}
                  onChange={(e) =>
                    setNewCard({ ...newCard, grade: e.target.value })
                  }
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                />
                <input
                  placeholder="Image URL"
                  value={newCard.imageUrl}
                  onChange={(e) =>
                    setNewCard({ ...newCard, imageUrl: e.target.value })
                  }
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                  required
                />
                <input
                  type="number"
                  placeholder="Market Price"
                  value={newCard.marketPrice || ""}
                  onChange={(e) =>
                    setNewCard({
                      ...newCard,
                      marketPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                  step="0.01"
                />
              </div>
              <button
                type="submit"
                className="mt-4 px-6 py-2 bg-primary-600 rounded-lg font-medium hover:bg-primary-500"
              >
                Add Card
              </button>
            </form>

            {/* Cards list */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-800">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Set</th>
                    <th className="pb-2">Category</th>
                    <th className="pb-2">Rarity</th>
                    <th className="pb-2">Price</th>
                    <th className="pb-2">Minted</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((card) => (
                    <tr
                      key={card.id}
                      className="border-b border-gray-800/50 hover:bg-gray-900"
                    >
                      <td className="py-2">{card.name}</td>
                      <td className="py-2 text-gray-400">{card.setName}</td>
                      <td className="py-2 text-gray-400">{card.category}</td>
                      <td className="py-2">{card.rarity.replace("_", " ")}</td>
                      <td className="py-2 text-green-400">
                        ${card.marketPrice.toFixed(2)}
                      </td>
                      <td className="py-2 text-gray-400">
                        {card._count.nftCards}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {cards.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No cards yet. Add some above.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Gacha Tab */}
        {activeTab === "gacha" && (
          <div className="space-y-8">
            <form
              onSubmit={handleCreateMachine}
              className="p-6 bg-gray-900 rounded-xl border border-gray-800"
            >
              <h3 className="text-lg font-semibold mb-4">
                Create Gacha Machine
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Machine Name"
                  value={newMachine.name}
                  onChange={(e) =>
                    setNewMachine({ ...newMachine, name: e.target.value })
                  }
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                  required
                />
                <select
                  value={newMachine.category}
                  onChange={(e) =>
                    setNewMachine({ ...newMachine, category: e.target.value })
                  }
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                >
                  <option value="POKEMON">Pokemon</option>
                  <option value="ONE_PIECE">One Piece</option>
                </select>
                <select
                  value={newMachine.tier}
                  onChange={(e) =>
                    setNewMachine({ ...newMachine, tier: e.target.value })
                  }
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                >
                  <option value="BASIC">Basic ($25)</option>
                  <option value="ELITE">Elite ($100)</option>
                  <option value="LEGENDARY">Legendary ($500)</option>
                </select>
                <input
                  type="number"
                  placeholder="Price"
                  value={newMachine.price}
                  onChange={(e) =>
                    setNewMachine({
                      ...newMachine,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="mt-4 px-6 py-2 bg-primary-600 rounded-lg font-medium hover:bg-primary-500"
              >
                Create Machine
              </button>
            </form>

            {/* Machines list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {machines.map((machine) => (
                <div
                  key={machine.id}
                  className="p-4 bg-gray-900 rounded-xl border border-gray-800"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{machine.name}</h4>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        machine.isActive
                          ? "bg-green-600/20 text-green-400"
                          : "bg-red-600/20 text-red-400"
                      }`}
                    >
                      {machine.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {machine.category} &middot; {machine.tier} &middot; $
                    {machine.price}
                  </p>
                  <p className="text-sm text-gray-400">
                    EV: ${machine.expectedValue.toFixed(2)} &middot;{" "}
                    {machine._count.gachaPulls} pulls
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {machine.cards.length} cards in pool
                  </p>
                </div>
              ))}
              {machines.length === 0 && (
                <p className="text-gray-500 col-span-2 text-center py-8">
                  No machines yet. Create one above.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === "pricing" && (
          <div className="space-y-6">
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-2">Price Oracle</h3>
              <p className="text-gray-400 text-sm mb-4">
                Update card prices from market data sources (Alt, Collectr,
                eBay). Run daily for accurate pricing.
              </p>
              <button
                onClick={handleUpdatePrices}
                className="px-6 py-2 bg-accent-600 rounded-lg font-medium hover:bg-accent-500"
              >
                Update All Prices
              </button>
            </div>

            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Price Sources</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    name: "Alt",
                    status: process.env.NEXT_PUBLIC_ALT_API_KEY
                      ? "Connected"
                      : "Not configured",
                  },
                  {
                    name: "Collectr",
                    status: "Not configured",
                  },
                  {
                    name: "eBay",
                    status: "Not configured",
                  },
                ].map((source) => (
                  <div
                    key={source.name}
                    className="p-4 bg-gray-800 rounded-lg"
                  >
                    <h4 className="font-medium">{source.name}</h4>
                    <p className="text-sm text-gray-400">{source.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
