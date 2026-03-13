import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY not set");
    }
    stripeInstance = new Stripe(key, {
      apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion,
    });
  }
  return stripeInstance;
}

/**
 * Create a checkout session for gacha pack purchase.
 */
export async function createGachaCheckoutSession(params: {
  machineId: string;
  machineName: string;
  price: number;
  userId: string;
  walletAddress: string;
}): Promise<string> {
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${params.machineName} Gacha Pack`,
            description: "Open a trading card gacha pack and receive an NFT",
          },
          unit_amount: Math.round(params.price * 100), // cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/gacha/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/gacha`,
    metadata: {
      machineId: params.machineId,
      userId: params.userId,
      walletAddress: params.walletAddress,
    },
  });

  return session.url || "";
}

/**
 * Verify a completed checkout session.
 */
export async function verifyCheckoutSession(sessionId: string): Promise<{
  verified: boolean;
  machineId: string;
  userId: string;
  walletAddress: string;
}> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return { verified: false, machineId: "", userId: "", walletAddress: "" };
  }

  return {
    verified: true,
    machineId: session.metadata?.machineId || "",
    userId: session.metadata?.userId || "",
    walletAddress: session.metadata?.walletAddress || "",
  };
}
