export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      crop?: string;
      location?: string;
      mandiPrice?: number;
      premiumPrice?: number;
    };

    const crop = body.crop?.trim() || "the selected crop";
    const location = body.location?.trim() || "your area";
    const mandiPrice =
      typeof body.mandiPrice === "number" && Number.isFinite(body.mandiPrice)
        ? body.mandiPrice
        : 0;
    const premiumPrice =
      typeof body.premiumPrice === "number" && Number.isFinite(body.premiumPrice)
        ? body.premiumPrice
        : mandiPrice;

    const priceDifference = Math.max(premiumPrice - mandiPrice, 0);
    const insight = `In ${location}, ${crop} demand is strong. Premium buyers offer ₹${priceDifference} more per quintal. Consider direct selling for higher profit.`;

    return Response.json({ insight });
  } catch (error) {
    console.error("API ERROR:", error);

    return Response.json({
      insight:
        "In your area, crop demand is steady. Compare mandi and premium offers before selling.",
    });
  }
}
