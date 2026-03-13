import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-gray-950 to-accent-900/20" />
        <div className="relative mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Collectors Republic</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
            The global Web3 marketplace for real trading cards.
            Open gacha packs, collect NFTs, and trade on Solana.
          </p>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Every NFT represents a physical card stored in our secure vault.
            Trade globally, redeem physically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/gacha"
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              Open Gacha Packs
            </Link>
            <Link
              href="/marketplace"
              className="px-8 py-4 border border-gray-600 rounded-lg font-semibold text-lg hover:border-primary-400 transition-colors"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Open Gacha Packs",
                description:
                  "Choose from Pokemon or One Piece machines. Each pack has a 110% expected value. Pay with credit card.",
                icon: "🎰",
              },
              {
                title: "Collect & Trade NFTs",
                description:
                  "Every card is minted as an NFT on Solana following the Metaplex standard. Trade on our marketplace or hold.",
                icon: "💎",
              },
              {
                title: "Vault-Backed Cards",
                description:
                  "Physical cards are stored securely in our vault. Redeem anytime by burning your NFT for physical delivery.",
                icon: "🏦",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-gray-900 border border-gray-800 card-hover"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Gacha Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Pokemon",
                description:
                  "Classic Pokemon TCG cards from Base Set to modern expansions. Chase Charizards, Pikachus, and more.",
                machines: ["$25 Basic", "$100 Elite", "$500 Legendary"],
              },
              {
                name: "One Piece",
                description:
                  "One Piece Card Game treasures. Pull rare Luffys, Shanks, and alternate art cards.",
                machines: ["$25 Basic", "$100 Elite", "$500 Legendary"],
              },
            ].map((category) => (
              <div
                key={category.name}
                className="p-8 rounded-xl bg-gray-900 border border-gray-800 gacha-glow card-hover"
              >
                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-gray-400 mb-4">{category.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {category.machines.map((machine) => (
                    <span
                      key={machine}
                      className="px-3 py-1 bg-gray-800 rounded-full text-sm text-primary-300"
                    >
                      {machine}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buyback */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">90% Buyback Guarantee</h2>
          <p className="text-gray-400 text-lg mb-8">
            Not satisfied with your pull? Sell any card back to the platform
            instantly for 90% of its current market value, paid in USDC to
            your wallet.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
              <div className="text-2xl font-bold text-primary-400">110%</div>
              <div className="text-sm text-gray-400">Expected Value</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
              <div className="text-2xl font-bold text-accent-400">90%</div>
              <div className="text-sm text-gray-400">Buyback Rate</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
              <div className="text-2xl font-bold text-green-400">USDC</div>
              <div className="text-sm text-gray-400">Instant Payout</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
