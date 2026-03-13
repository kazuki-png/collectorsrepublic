# Collectors Republic - Deployment Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Solana CLI tools
- Stripe account

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Fill in all required variables in `.env`.

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with demo data
npm run db:seed
```

### 4. Solana Setup (Devnet)

```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"

# Generate platform wallet
solana-keygen new -o platform-wallet.json

# Set to devnet
solana config set --url devnet

# Airdrop SOL for testing
solana airdrop 5

# Set PLATFORM_WALLET_PRIVATE_KEY in .env with the contents of platform-wallet.json
# Set NEXT_PUBLIC_PLATFORM_WALLET_ADDRESS with the public key
```

### 5. Stripe Setup

```bash
# Install Stripe CLI for webhooks
stripe login
stripe listen --forward-to localhost:3000/api/payments/webhook
```

### 6. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                    Frontend                       │
│            Next.js + TypeScript + Tailwind        │
│     Solana Wallet Adapter (Phantom/Solflare)     │
├─────────────────────────────────────────────────┤
│                   API Layer                       │
│              Next.js API Routes                   │
│   /api/gacha  /api/marketplace  /api/buyback     │
│   /api/payments  /api/collection  /api/admin     │
├─────────────────────────────────────────────────┤
│               Business Logic                      │
│    Gacha Engine  │  Marketplace  │  Buyback       │
│    Price Oracle  │  Stripe      │  Metaplex       │
├─────────────────────────────────────────────────┤
│                  Data Layer                       │
│     PostgreSQL (Prisma)  │  Solana Blockchain     │
│     Cards, Users, Trades │  NFTs, USDC Transfers  │
└─────────────────────────────────────────────────┘
```

## Key Flows

### Gacha Pack Opening
1. User selects machine and connects wallet
2. Stripe checkout processes credit card payment
3. Webhook triggers gacha engine
4. Random card selected (weighted probability)
5. NFT minted via Metaplex and sent to user wallet
6. Records stored in database

### Marketplace Trade
1. Seller lists NFT with price
2. Buyer purchases (USDC transfer)
3. NFT ownership transferred on-chain
4. Database updated

### Buyback
1. User requests buyback quote (90% of market price)
2. NFT transferred to platform wallet
3. USDC sent to user wallet
4. Transaction recorded

## Solana Smart Contracts

The Anchor program is in `programs/trading_card_marketplace/`.

```bash
# Build (requires Anchor CLI)
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Update program ID in Anchor.toml and lib.rs
```

## Production Deployment

### Recommended Stack
- **Frontend**: Vercel
- **Database**: Supabase / Railway PostgreSQL
- **Blockchain**: Solana Mainnet (Helius/QuickNode RPC)
- **Payments**: Stripe Production

### Environment Variables for Production
- Switch `NEXT_PUBLIC_SOLANA_NETWORK` to `mainnet-beta`
- Use mainnet RPC URL (Helius recommended)
- Use mainnet USDC mint: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- Set production Stripe keys

## Security Considerations

- All gacha randomness should use VRF in production
- Rate limit API endpoints
- Validate NFT ownership on-chain before trades
- Implement proper authentication (JWT/session)
- Use signed transactions for all on-chain operations
- Regular vault inventory audits
