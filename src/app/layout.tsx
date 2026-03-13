import type { Metadata } from "next";
import "./globals.css";
import WalletProvider from "@/components/wallet/WalletProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Collectors Republic - Web3 Trading Card Marketplace",
  description:
    "Open gacha packs, collect NFT trading cards, and trade on the Solana blockchain. Physical cards stored in a secure vault.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-950 text-white">
        <WalletProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
