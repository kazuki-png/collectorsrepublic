export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold gradient-text mb-2">
              Collectors Republic
            </h3>
            <p className="text-sm text-gray-400">
              The global Web3 marketplace for tokenized trading cards.
              Physical cards vaulted securely, traded as NFTs on Solana.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Platform</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>Gacha Packs</li>
              <li>NFT Marketplace</li>
              <li>Collection Gallery</li>
              <li>Buyback Program</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Support</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>FAQ</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-800 text-center text-xs text-gray-500">
          Powered by Solana &middot; NFTs follow the Metaplex standard
        </div>
      </div>
    </footer>
  );
}
