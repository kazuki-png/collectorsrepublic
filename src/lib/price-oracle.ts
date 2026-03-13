import { prisma } from "./prisma";

interface PriceSource {
  source: string;
  price: number | null;
}

/**
 * Fetch card price from Alt.
 * In production, integrate with Alt's API.
 */
async function fetchAltPrice(cardName: string, setName: string): Promise<number | null> {
  // TODO: Integrate with Alt API
  // const response = await fetch(`https://api.alt.xyz/v1/cards?name=${cardName}&set=${setName}`, {
  //   headers: { Authorization: `Bearer ${process.env.ALT_API_KEY}` },
  // });
  return null;
}

/**
 * Fetch card price from Collectr.
 */
async function fetchCollectrPrice(cardName: string, setName: string): Promise<number | null> {
  // TODO: Integrate with Collectr API
  return null;
}

/**
 * Fetch card price from eBay sold listings.
 */
async function fetchEbayPrice(cardName: string, setName: string): Promise<number | null> {
  // TODO: Integrate with eBay Browse API
  // Search sold listings for the card and calculate median
  return null;
}

/**
 * Calculate median price from multiple sources.
 */
export function calculateMedianPrice(prices: (number | null)[]): number {
  const validPrices = prices.filter((p): p is number => p !== null);
  if (validPrices.length === 0) return 0;

  validPrices.sort((a, b) => a - b);
  const mid = Math.floor(validPrices.length / 2);

  if (validPrices.length % 2 === 0) {
    return (validPrices[mid - 1] + validPrices[mid]) / 2;
  }
  return validPrices[mid];
}

/**
 * Fetch and aggregate card price from all sources.
 */
export async function fetchCardPrice(
  cardName: string,
  setName: string
): Promise<{ prices: PriceSource[]; medianPrice: number }> {
  const [altPrice, collectrPrice, ebayPrice] = await Promise.all([
    fetchAltPrice(cardName, setName),
    fetchCollectrPrice(cardName, setName),
    fetchEbayPrice(cardName, setName),
  ]);

  const prices: PriceSource[] = [
    { source: "alt", price: altPrice },
    { source: "collectr", price: collectrPrice },
    { source: "ebay", price: ebayPrice },
  ];

  const medianPrice = calculateMedianPrice([altPrice, collectrPrice, ebayPrice]);

  return { prices, medianPrice };
}

/**
 * Update all card prices in the database.
 * Should be run as a daily cron job.
 */
export async function updateCardDatabase(): Promise<number> {
  const cards = await prisma.cardTemplate.findMany({
    where: { isActive: true },
  });

  let updated = 0;

  for (const card of cards) {
    try {
      const { prices, medianPrice } = await fetchCardPrice(card.name, card.setName);

      if (medianPrice > 0) {
        await prisma.cardTemplate.update({
          where: { id: card.id },
          data: { marketPrice: medianPrice },
        });

        await prisma.priceData.create({
          data: {
            cardTemplateId: card.id,
            altPrice: prices.find((p) => p.source === "alt")?.price,
            collectrPrice: prices.find((p) => p.source === "collectr")?.price,
            ebayPrice: prices.find((p) => p.source === "ebay")?.price,
            medianPrice,
          },
        });

        updated++;
      }
    } catch (error) {
      console.error(`Failed to update price for ${card.name}:`, error);
    }
  }

  return updated;
}
