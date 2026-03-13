import { PrismaClient, type RarityTier, type CardCategory } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create Pokemon card templates
  const pokemonCards = [
    { name: "Charizard ex", setName: "Obsidian Flames", rarity: "ULTRA_RARE" as RarityTier, marketPrice: 45.00, imageUrl: "" },
    { name: "Pikachu VMAX", setName: "Vivid Voltage", rarity: "SECRET_RARE" as RarityTier, marketPrice: 120.00, imageUrl: "" },
    { name: "Mewtwo GX", setName: "Shining Legends", rarity: "ULTRA_RARE" as RarityTier, marketPrice: 35.00, imageUrl: "" },
    { name: "Lugia V Alt Art", setName: "Silver Tempest", rarity: "SECRET_RARE" as RarityTier, marketPrice: 250.00, imageUrl: "" },
    { name: "Umbreon VMAX Alt Art", setName: "Evolving Skies", rarity: "CHASE" as RarityTier, marketPrice: 500.00, imageUrl: "" },
    { name: "Charizard Base Set", setName: "Base Set", rarity: "CHASE" as RarityTier, marketPrice: 1500.00, imageUrl: "" },
    { name: "Gengar ex", setName: "151", rarity: "RARE" as RarityTier, marketPrice: 12.00, imageUrl: "" },
    { name: "Eevee", setName: "Evolving Skies", rarity: "COMMON" as RarityTier, marketPrice: 2.00, imageUrl: "" },
    { name: "Bulbasaur", setName: "151", rarity: "COMMON" as RarityTier, marketPrice: 1.50, imageUrl: "" },
    { name: "Gardevoir ex", setName: "Paldea Evolved", rarity: "RARE" as RarityTier, marketPrice: 8.00, imageUrl: "" },
    { name: "Mew VMAX", setName: "Fusion Strike", rarity: "ULTRA_RARE" as RarityTier, marketPrice: 25.00, imageUrl: "" },
    { name: "Rayquaza VMAX Alt Art", setName: "Evolving Skies", rarity: "SECRET_RARE" as RarityTier, marketPrice: 350.00, imageUrl: "" },
    { name: "Squirtle", setName: "151", rarity: "COMMON" as RarityTier, marketPrice: 1.00, imageUrl: "" },
    { name: "Dragonite V", setName: "Pokemon GO", rarity: "UNCOMMON" as RarityTier, marketPrice: 5.00, imageUrl: "" },
    { name: "Arceus VSTAR", setName: "Brilliant Stars", rarity: "RARE" as RarityTier, marketPrice: 15.00, imageUrl: "" },
  ];

  const onePieceCards = [
    { name: "Monkey D. Luffy (Leader)", setName: "Romance Dawn", rarity: "RARE" as RarityTier, marketPrice: 20.00, imageUrl: "" },
    { name: "Shanks (Alt Art)", setName: "Romance Dawn", rarity: "SECRET_RARE" as RarityTier, marketPrice: 180.00, imageUrl: "" },
    { name: "Roronoa Zoro", setName: "Pillars of Strength", rarity: "ULTRA_RARE" as RarityTier, marketPrice: 40.00, imageUrl: "" },
    { name: "Nami", setName: "Romance Dawn", rarity: "UNCOMMON" as RarityTier, marketPrice: 5.00, imageUrl: "" },
    { name: "Portgas D. Ace", setName: "Paramount War", rarity: "ULTRA_RARE" as RarityTier, marketPrice: 55.00, imageUrl: "" },
    { name: "Kaido (Alt Art)", setName: "Pillars of Strength", rarity: "CHASE" as RarityTier, marketPrice: 400.00, imageUrl: "" },
    { name: "Boa Hancock", setName: "Romance Dawn", rarity: "RARE" as RarityTier, marketPrice: 15.00, imageUrl: "" },
    { name: "Trafalgar Law", setName: "Paramount War", rarity: "RARE" as RarityTier, marketPrice: 18.00, imageUrl: "" },
    { name: "Sanji", setName: "Romance Dawn", rarity: "UNCOMMON" as RarityTier, marketPrice: 4.00, imageUrl: "" },
    { name: "Tony Tony Chopper", setName: "Romance Dawn", rarity: "COMMON" as RarityTier, marketPrice: 1.50, imageUrl: "" },
    { name: "Nico Robin", setName: "Pillars of Strength", rarity: "UNCOMMON" as RarityTier, marketPrice: 6.00, imageUrl: "" },
    { name: "Luffy Gear 5 (Alt Art)", setName: "Wings of the Captain", rarity: "CHASE" as RarityTier, marketPrice: 800.00, imageUrl: "" },
    { name: "Yamato", setName: "Pillars of Strength", rarity: "SECRET_RARE" as RarityTier, marketPrice: 120.00, imageUrl: "" },
    { name: "Usopp", setName: "Romance Dawn", rarity: "COMMON" as RarityTier, marketPrice: 1.00, imageUrl: "" },
    { name: "Brook", setName: "Romance Dawn", rarity: "COMMON" as RarityTier, marketPrice: 1.00, imageUrl: "" },
  ];

  // Insert card templates
  const createdPokemon = [];
  for (const card of pokemonCards) {
    const created = await prisma.cardTemplate.create({
      data: { ...card, category: "POKEMON" as CardCategory },
    });
    createdPokemon.push(created);
  }

  const createdOnePiece = [];
  for (const card of onePieceCards) {
    const created = await prisma.cardTemplate.create({
      data: { ...card, category: "ONE_PIECE" as CardCategory },
    });
    createdOnePiece.push(created);
  }

  console.log(`Created ${createdPokemon.length} Pokemon cards`);
  console.log(`Created ${createdOnePiece.length} One Piece cards`);

  // Create gacha machines
  const machineConfigs = [
    { category: "POKEMON" as const, tier: "BASIC" as const, price: 25, name: "Pokemon Basic Pack" },
    { category: "POKEMON" as const, tier: "ELITE" as const, price: 100, name: "Pokemon Elite Pack" },
    { category: "POKEMON" as const, tier: "LEGENDARY" as const, price: 500, name: "Pokemon Legendary Pack" },
    { category: "ONE_PIECE" as const, tier: "BASIC" as const, price: 25, name: "One Piece Basic Pack" },
    { category: "ONE_PIECE" as const, tier: "ELITE" as const, price: 100, name: "One Piece Elite Pack" },
    { category: "ONE_PIECE" as const, tier: "LEGENDARY" as const, price: 500, name: "One Piece Legendary Pack" },
  ];

  // Rarity weights per tier
  const rarityWeights: Record<string, Record<string, number>> = {
    BASIC: { COMMON: 50, UNCOMMON: 30, RARE: 15, ULTRA_RARE: 4, SECRET_RARE: 0.9, CHASE: 0.1 },
    ELITE: { COMMON: 20, UNCOMMON: 30, RARE: 30, ULTRA_RARE: 14, SECRET_RARE: 5, CHASE: 1 },
    LEGENDARY: { COMMON: 5, UNCOMMON: 15, RARE: 30, ULTRA_RARE: 30, SECRET_RARE: 15, CHASE: 5 },
  };

  for (const config of machineConfigs) {
    const machine = await prisma.gachaMachine.create({
      data: {
        category: config.category,
        tier: config.tier,
        price: config.price,
        expectedValue: config.price * 1.1,
        name: config.name,
        description: `Open a ${config.name} for a chance at amazing cards!`,
      },
    });

    // Add cards to machine based on category
    const cards = config.category === "POKEMON" ? createdPokemon : createdOnePiece;
    const weights = rarityWeights[config.tier];

    for (const card of cards) {
      const weight = weights[card.rarity] || 1;
      await prisma.gachaMachineCard.create({
        data: {
          gachaMachineId: machine.id,
          cardTemplateId: card.id,
          weight,
          quantity: -1, // unlimited
        },
      });
    }

    console.log(`Created machine: ${config.name} with ${cards.length} cards`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
