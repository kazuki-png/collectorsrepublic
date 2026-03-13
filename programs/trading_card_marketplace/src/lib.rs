use anchor_lang::prelude::*;

declare_id!("CRepXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

#[program]
pub mod trading_card_marketplace {
    use super::*;

    /// Initialize the marketplace with a platform authority.
    pub fn initialize(ctx: Context<Initialize>, platform_fee_bps: u16) -> Result<()> {
        let marketplace = &mut ctx.accounts.marketplace;
        marketplace.authority = ctx.accounts.authority.key();
        marketplace.platform_fee_bps = platform_fee_bps;
        marketplace.total_listings = 0;
        marketplace.total_trades = 0;
        Ok(())
    }

    /// List an NFT for sale on the marketplace.
    pub fn list_nft(ctx: Context<ListNft>, price: u64) -> Result<()> {
        require!(price > 0, MarketplaceError::InvalidPrice);

        let listing = &mut ctx.accounts.listing;
        listing.seller = ctx.accounts.seller.key();
        listing.mint = ctx.accounts.nft_mint.key();
        listing.price = price;
        listing.is_active = true;
        listing.created_at = Clock::get()?.unix_timestamp;

        let marketplace = &mut ctx.accounts.marketplace;
        marketplace.total_listings += 1;

        Ok(())
    }

    /// Buy a listed NFT.
    pub fn buy_nft(ctx: Context<BuyNft>) -> Result<()> {
        let listing = &mut ctx.accounts.listing;
        require!(listing.is_active, MarketplaceError::ListingNotActive);
        require!(
            ctx.accounts.buyer.key() != listing.seller,
            MarketplaceError::CannotBuySelf
        );

        listing.is_active = false;

        let marketplace = &mut ctx.accounts.marketplace;
        marketplace.total_trades += 1;

        // Transfer USDC from buyer to seller (handled off-chain or via CPI)
        // Transfer NFT from escrow to buyer (handled via CPI)

        Ok(())
    }

    /// Cancel an active listing.
    pub fn cancel_listing(ctx: Context<CancelListing>) -> Result<()> {
        let listing = &mut ctx.accounts.listing;
        require!(listing.is_active, MarketplaceError::ListingNotActive);
        require!(
            ctx.accounts.seller.key() == listing.seller,
            MarketplaceError::Unauthorized
        );

        listing.is_active = false;
        Ok(())
    }

    /// Process a buyback: transfer NFT to platform, record USDC payout.
    pub fn process_buyback(ctx: Context<ProcessBuyback>, buyback_amount: u64) -> Result<()> {
        let buyback = &mut ctx.accounts.buyback_record;
        buyback.seller = ctx.accounts.seller.key();
        buyback.mint = ctx.accounts.nft_mint.key();
        buyback.amount = buyback_amount;
        buyback.processed_at = Clock::get()?.unix_timestamp;

        Ok(())
    }

    /// Burn NFT for physical card redemption.
    pub fn redeem_card(ctx: Context<RedeemCard>) -> Result<()> {
        let redemption = &mut ctx.accounts.redemption;
        redemption.owner = ctx.accounts.owner.key();
        redemption.mint = ctx.accounts.nft_mint.key();
        redemption.redeemed_at = Clock::get()?.unix_timestamp;
        redemption.is_shipped = false;

        // Burn NFT (handled via CPI to token program)

        Ok(())
    }
}

// ==================== Accounts ====================

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Marketplace::SPACE
    )]
    pub marketplace: Account<'info, Marketplace>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ListNft<'info> {
    #[account(mut)]
    pub marketplace: Account<'info, Marketplace>,
    #[account(
        init,
        payer = seller,
        space = 8 + Listing::SPACE
    )]
    pub listing: Account<'info, Listing>,
    #[account(mut)]
    pub seller: Signer<'info>,
    /// CHECK: NFT mint account
    pub nft_mint: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyNft<'info> {
    #[account(mut)]
    pub marketplace: Account<'info, Marketplace>,
    #[account(mut)]
    pub listing: Account<'info, Listing>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelListing<'info> {
    #[account(mut)]
    pub listing: Account<'info, Listing>,
    pub seller: Signer<'info>,
}

#[derive(Accounts)]
pub struct ProcessBuyback<'info> {
    #[account(
        init,
        payer = seller,
        space = 8 + BuybackRecord::SPACE
    )]
    pub buyback_record: Account<'info, BuybackRecord>,
    #[account(mut)]
    pub seller: Signer<'info>,
    /// CHECK: NFT mint account
    pub nft_mint: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RedeemCard<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + Redemption::SPACE
    )]
    pub redemption: Account<'info, Redemption>,
    #[account(mut)]
    pub owner: Signer<'info>,
    /// CHECK: NFT mint account
    pub nft_mint: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

// ==================== State ====================

#[account]
pub struct Marketplace {
    pub authority: Pubkey,
    pub platform_fee_bps: u16,
    pub total_listings: u64,
    pub total_trades: u64,
}

impl Marketplace {
    pub const SPACE: usize = 32 + 2 + 8 + 8;
}

#[account]
pub struct Listing {
    pub seller: Pubkey,
    pub mint: Pubkey,
    pub price: u64,
    pub is_active: bool,
    pub created_at: i64,
}

impl Listing {
    pub const SPACE: usize = 32 + 32 + 8 + 1 + 8;
}

#[account]
pub struct BuybackRecord {
    pub seller: Pubkey,
    pub mint: Pubkey,
    pub amount: u64,
    pub processed_at: i64,
}

impl BuybackRecord {
    pub const SPACE: usize = 32 + 32 + 8 + 8;
}

#[account]
pub struct Redemption {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub redeemed_at: i64,
    pub is_shipped: bool,
}

impl Redemption {
    pub const SPACE: usize = 32 + 32 + 8 + 1;
}

// ==================== Errors ====================

#[error_code]
pub enum MarketplaceError {
    #[msg("Invalid price")]
    InvalidPrice,
    #[msg("Listing is not active")]
    ListingNotActive,
    #[msg("Cannot buy your own listing")]
    CannotBuySelf,
    #[msg("Unauthorized")]
    Unauthorized,
}
