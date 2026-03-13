import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { getConnection, getPlatformKeypair } from "./solana";
import type { NFTMetadata } from "@/types";
import { PublicKey } from "@solana/web3.js";

export function getMetaplex(): Metaplex {
  const connection = getConnection();
  const platformKeypair = getPlatformKeypair();
  return Metaplex.make(connection).use(keypairIdentity(platformKeypair));
}

export async function mintNFT(
  metadata: NFTMetadata,
  recipientAddress: string
): Promise<{ mintAddress: string; txSignature: string }> {
  const metaplex = getMetaplex();
  const recipient = new PublicKey(recipientAddress);

  const { nft, response } = await metaplex.nfts().create({
    name: metadata.name,
    symbol: metadata.symbol,
    uri: "", // In production, upload metadata to Arweave/IPFS first
    sellerFeeBasisPoints: 500, // 5% royalty
    tokenOwner: recipient,
    creators: [
      {
        address: metaplex.identity().publicKey,
        share: 100,
      },
    ],
  });

  return {
    mintAddress: nft.address.toBase58(),
    txSignature: response.signature,
  };
}

export async function transferNFT(
  mintAddress: string,
  fromAddress: string,
  toAddress: string
): Promise<string> {
  const metaplex = getMetaplex();
  const mint = new PublicKey(mintAddress);
  const to = new PublicKey(toAddress);

  const nft = await metaplex.nfts().findByMint({ mintAddress: mint });

  const { response } = await metaplex.nfts().transfer({
    nftOrSft: nft,
    toOwner: to,
  });

  return response.signature;
}

export async function burnNFT(mintAddress: string): Promise<string> {
  const metaplex = getMetaplex();
  const mint = new PublicKey(mintAddress);

  const nft = await metaplex.nfts().findByMint({ mintAddress: mint });

  const { response } = await metaplex.nfts().delete({
    mintAddress: mint,
  });

  return response.signature;
}

export function buildNFTMetadata(card: {
  name: string;
  setName: string;
  rarity: string;
  grade?: string;
  imageUrl: string;
  vaultId: string;
  inventoryId: string;
  category: string;
}): NFTMetadata {
  return {
    name: card.name,
    symbol: "CREP",
    description: `${card.name} from ${card.setName} - Vaulted trading card NFT by Collectors Republic`,
    image: card.imageUrl,
    attributes: [
      { trait_type: "Set", value: card.setName },
      { trait_type: "Rarity", value: card.rarity },
      { trait_type: "Category", value: card.category },
      ...(card.grade ? [{ trait_type: "Grade", value: card.grade }] : []),
      { trait_type: "Vault ID", value: card.vaultId },
      { trait_type: "Status", value: "VAULTED" },
    ],
    properties: {
      card_name: card.name,
      set_name: card.setName,
      rarity: card.rarity,
      grade: card.grade,
      vault_id: card.vaultId,
      inventory_id: card.inventoryId,
      redeemable_status: "VAULTED",
      category: card.category,
    },
  };
}
