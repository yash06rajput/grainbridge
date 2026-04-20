"use client";
import { useEffect } from "react";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type PriceResult = {
  mandiPrice: number;
  premiumPrice: number;
};

const BASE_PRICES: Record<string, number> = {
  wheat: 2200,
  rice: 2600,
  maize: 2100,
  cotton: 6800,
  soybean: 4300,
  mustard: 5400,
  sugarcane: 3400,
  onion: 1800,
  potato: 1600,
  tomato: 2000,
};

const METRO_LOCATIONS = [
  "mumbai",
  "delhi",
  "bengaluru",
  "hyderabad",
  "chennai",
  "pune",
  "kolkata",
  "ahmedabad",
];

function parseQuantity(value: string): number {
  const parsed = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function getAIPrice(
  crop: string,
  quantity: string,
  location: string
): PriceResult {
  const normalizedCrop = crop.trim().toLowerCase();
  const normalizedLocation = location.trim().toLowerCase();
  const quantityValue = parseQuantity(quantity);

  const basePrice = BASE_PRICES[normalizedCrop] ?? 2500;

  const locationBonus = METRO_LOCATIONS.some((city) =>
    normalizedLocation.includes(city)
  )
    ? 100
    : 0;

  let quantityBonus = 0;

  if (quantityValue >= 100) quantityBonus = 180;
  else if (quantityValue >= 50) quantityBonus = 120;
  else if (quantityValue >= 20) quantityBonus = 70;
  else if (quantityValue > 0) quantityBonus = 30;

  const mandiPrice = basePrice + locationBonus;
  const premiumPrice = mandiPrice + 250 + quantityBonus;

  return { mandiPrice, premiumPrice };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [showBuyers, setShowBuyers] = useState(false);
  const [loading, setLoading] = useState(false);

  const crop = searchParams.get("crop") ?? "Wheat";
  const quantity = searchParams.get("quantity") ?? "50";
  const location = searchParams.get("location") ?? "Nashik";

  const { mandiPrice, premiumPrice, profit } = useMemo(() => {
    const prices = getAIPrice(crop, quantity, location);

    return {
      ...prices,
      profit: prices.premiumPrice - prices.mandiPrice,
    };
    
  }, [crop, quantity, location]);
  const totalRevenue = premiumPrice * Number(quantity);
const mandiRevenue = mandiPrice * Number(quantity);
const extraEarnings = totalRevenue - mandiRevenue;

  const [insight, setInsight] = useState("Fetching AI insights...");

 useEffect(() => {
  async function fetchInsight() {
    try {
      const res = await fetch("/api/ai-insight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ crop, quantity, location }),
      });

      const data = await res.json();
      setInsight(data.insight);
    } catch (err) {
      if (crop.toLowerCase().includes("khapli")) {
  setInsight("Organic wheat demand is strong. Premium buyers recommended.");
} else {
  setInsight("Standard mandi pricing with moderate premium opportunity.");
}
    }
  }

  fetchInsight();
}, [crop, quantity, location]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-wide text-emerald-300">
            GrainBridge Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Market pricing insights
          </h1>

          <p className="mt-2 text-slate-400">{insight}</p>
          <p className="text-sm text-emerald-300 mt-2">
  Total Revenue: ₹{(premiumPrice * Number(quantity)).toLocaleString()}
</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {/* Input */}
          <section className="rounded-2xl bg-white/5 p-6 border border-white/10">
            <p className="text-sm text-slate-400">Farmer Input</p>

            <div className="mt-3 space-y-2 text-sm">
              <p>Crop: {crop}</p>
              <p>Quantity: {quantity}</p>
              <p>Location: {location}</p>
            </div>
          </section>

          {/* Mandi */}
          <section className="rounded-2xl bg-emerald-500/10 p-6 border border-emerald-400/30">
            <p className="text-sm text-emerald-200">Mandi Price</p>
            <p className="mt-3 text-2xl font-semibold text-emerald-300">
              {formatCurrency(mandiPrice)} / quintal
            </p>
          </section>

          {/* Premium */}
          <section className="rounded-2xl bg-emerald-500/10 p-6 border border-emerald-400/30">
            <p className="text-sm text-emerald-200">Premium Price</p>
            <p className="mt-3 text-2xl font-semibold text-emerald-300">
              {formatCurrency(premiumPrice)} / quintal
            </p>
          </section>

          {/* Profit */}
          <section className="rounded-2xl bg-emerald-500/10 p-6 border border-emerald-400/30">
            <p className="text-sm text-emerald-200">Extra Profit</p>
            <p className="mt-3 text-2xl font-semibold text-emerald-300">
              {formatCurrency(profit)} / quintal
            </p>
          </section>
        </div>

        {/* Buyers Section */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">
            {showBuyers ? "Top Buyers" : "Find Best Buyers"}
          </h2>

          {loading ? (
  <div className="flex items-center gap-3 text-emerald-400">
    <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
    <p>Finding best buyers...</p>
  </div>
) : !showBuyers ? (
  <button
    onClick={() => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShowBuyers(true);
      }, 1500);
    }}
    className="bg-gradient-to-r from-emerald-400 to-emerald-600 px-6 py-3 rounded-xl text-black font-semibold hover:scale-105 transition"
  >
    Suggest Best Buyers
  </button>
) : (
  <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  name: "Organic Grain Hub",
                  price: premiumPrice + 50,
                  rating: 4.8,
                },
                {
                  name: "Healthy Atta Co.",
                  price: premiumPrice,
                  rating: 4.6,
                },
                {
                  name: "Farm2Market Pvt Ltd",
                  price: premiumPrice - 30,
                  rating: 4.3,
                },
              ]
                .sort((a, b) => b.price - a.price)
                .map((buyer, index) => (
                <div
  key={index}
  className={`rounded-2xl p-5 flex flex-col gap-3 ${
   index === 0
  ? "border-2 border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
      : "border border-white/10 bg-white/5"
  }`}
>
  {/* Avatar + Name */}
  <div className="flex items-center gap-3">
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-black font-bold text-lg shadow-md">
  {buyer.name.charAt(0)}
</div>
    <p className="text-lg font-medium">{buyer.name}</p>
  </div>

  <div className="mt-2">
  <p className="text-xs text-slate-400">Offered Price</p>
  <p className="text-emerald-400 font-semibold">
    ₹{buyer.price.toLocaleString()} / quintal
  </p>
  <p className="text-xs text-emerald-300 mt-1">
  +₹{((buyer.price - mandiPrice) * Number(quantity)).toLocaleString()} total gain
</p>

<p className="text-xs text-slate-500 mt-1">
  High demand in your region
</p>
</div>

  <p className="text-sm text-slate-400 mt-1">
    ⭐ {buyer.rating}
  </p>

  <button
    onClick={() => alert("Request sent to " + buyer.name)}
    className="mt-2 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 transition"
  >
    Send Request
  </button>

                   
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}