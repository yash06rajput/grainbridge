export async function POST(req: Request) {
  try {
    const body = await req.json();

    const crop = body.crop || "";
    const quantity = body.quantity || "";
    const location = body.location || "";

    let insight = "";

    if (crop.toLowerCase().includes("khapli")) {
      insight = `Organic ${crop} demand is high in ${location}. Premium buyers can give ~15-20% higher returns.`;
    } else {
      insight = `${crop} has stable mandi demand in ${location}. Bulk selling recommended.`;
    }

    return Response.json({ insight });

  } catch (error) {
    return Response.json(
      { insight: "Fallback insight: Market demand stable." },
      { status: 500 }
    );
  }
}