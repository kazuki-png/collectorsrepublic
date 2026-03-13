import {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";

export function getConnection(): Connection {
  const rpcUrl =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl("devnet");
  return new Connection(rpcUrl, "confirmed");
}

export function getPlatformKeypair(): Keypair {
  const privateKey = process.env.PLATFORM_WALLET_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PLATFORM_WALLET_PRIVATE_KEY not set");
  }
  const secretKey = Uint8Array.from(JSON.parse(privateKey));
  return Keypair.fromSecretKey(secretKey);
}

export function getPlatformPublicKey(): PublicKey {
  const address = process.env.NEXT_PUBLIC_PLATFORM_WALLET_ADDRESS;
  if (!address) {
    throw new Error("NEXT_PUBLIC_PLATFORM_WALLET_ADDRESS not set");
  }
  return new PublicKey(address);
}

export function getUsdcMint(): PublicKey {
  const mint = process.env.NEXT_PUBLIC_USDC_MINT;
  if (!mint) {
    throw new Error("NEXT_PUBLIC_USDC_MINT not set");
  }
  return new PublicKey(mint);
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function lamportsToSol(lamports: number): number {
  return lamports / 1_000_000_000;
}
