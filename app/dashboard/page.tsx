"use client";

import { useEffect, useMemo, useState } from "react";
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
  soyabean: 4300,
  mustard: 5400,
  sugarcane: 3400,
  onion: 1800,
  potato: 1600,
  tomato: 2000,
  "khapli wheat": 3200,
};

const METRO_LOCATIONS = [
  "mumbai",
  "delhi",
  "bengaluru",
  "bangalore",
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

function DashboardContent() {
  const searchParams = useSearchParams();
  const [selectedBuyer, setSelectedBuyer] = useState<any>(null);
const [showModal, setShowModal] = useState(false);
  const [showBuyers, setShowBuyers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState("Fetching AI insights...");

  const crop = searchParams.get("crop") ?? "Wheat";
  const quantity = searchParams.get("quantity") ?? "50";
  const location = searchParams.get("location") ?? "Nashik";
  const quantityValue = parseQuantity(quantity);

  const { mandiPrice, premiumPrice, profit } = useMemo(() => {
    const prices = getAIPrice(crop, quantity, location);

    return {
      ...prices,
      profit: prices.premiumPrice - prices.mandiPrice,
    };
  }, [crop, quantity, location]);

  const totalRevenue = premiumPrice * quantityValue;
  const mandiRevenue = mandiPrice * quantityValue;
  const premiumRevenue = premiumPrice * quantityValue;
  const extraEarnings = (premiumPrice - mandiPrice) * quantityValue;
  const recommendedAction =
  extraEarnings > 50000
    ? `🚀 You can earn ₹${formatCurrency(extraEarnings)} more via direct buyers`
    : "🏪 Mandi is safer currently due to lower demand";
  const demand = premiumPrice > mandiPrice ? "🔥 High" : "⚖️ Moderate";

  useEffect(() => {
    async function fetchInsight() {
      try {
        const res = await fetch("/api/ai-insight", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            crop,
            quantity,
            location,
            mandiPrice,
            premiumPrice,
          }),
        });

        const data = (await res.json()) as { insight?: string };
        setInsight(
          data.insight ?? "Market data unavailable. Showing estimated insights."
        );
      } catch {
        if (crop.toLowerCase().includes("khapli")) {
          setInsight(
            "Organic wheat demand is strong. Premium buyers recommended."
          );
        } else {
          setInsight("Standard mandi pricing with moderate premium opportunity.");
        }
      }
    }

    fetchInsight();
  }, [crop, quantity, location, mandiPrice, premiumPrice]);

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
          <p className="mt-2 text-sm text-emerald-300">
            Total Revenue: {formatCurrency(totalRevenue)}
          </p>
          <p className="mt-1 text-sm text-slate-300">
            Mandi: {formatCurrency(mandiRevenue)} | Premium:{" "}
            {formatCurrency(premiumRevenue)}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow shadow-black/20">
            <p className="text-sm text-slate-400">Farmer Input</p>

            <div className="mt-3 space-y-2 text-sm">
              <p>Crop: {crop}</p>
              <p>Quantity: {quantity}</p>
              <p>Location: {location}</p>
            </div>
          </section>

          <section className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6 shadow shadow-emerald-900/30">
            <p className="text-sm text-emerald-200">Mandi Price</p>
            <p className="mt-3 text-2xl font-semibold text-emerald-300">
              {formatCurrency(mandiPrice)} / quintal
            </p>
          </section>

          <section className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6 shadow shadow-emerald-900/30">
            <p className="text-sm text-emerald-200">Premium Price</p>
            <p className="mt-3 text-2xl font-semibold text-emerald-300">
              {formatCurrency(premiumPrice)} / quintal
            </p>
          </section>

          <section className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6 shadow shadow-emerald-900/30">
            <p className="text-sm text-emerald-200">Extra Profit</p>
            <p className="mt-3 text-2xl font-semibold text-emerald-300">
              {formatCurrency(profit)} / quintal
            </p>
            <p className="mt-3 text-sm text-emerald-100">{recommendedAction}</p>
          </section>
        </div>

        <div className="mt-10">
          <p className="mb-4 text-sm text-emerald-300">
            Demand in {location}: {demand}
          </p>

          <h2 className="mb-4 text-xl font-semibold">
            {showBuyers ? "Top Buyers" : "Find Best Buyers"}
          </h2>

          {loading ? (
            <div className="flex items-center gap-3 text-emerald-400">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
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
              className="rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-6 py-3 font-semibold text-black transition hover:scale-105"
            >
              Suggest Best Buyers
            </button>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  name: "24 Mantra Organic",
                  price: premiumPrice + 50,
                  rating: 4.8,
                },
                {
                  name: "Organic India",
                  price: premiumPrice,
                  rating: 4.6,
                },
                {
                  name: "ITC Aashirvaad",
                  price: premiumPrice - 30,
                  rating: 4.3,
                },
              ]
                .sort((a, b) => b.price - a.price)
                .map((buyer, index) => (
                  <div
                    key={buyer.name}
                    className={`flex flex-col gap-3 rounded-2xl p-5 ${
                      index === 0
                        ? "border-2 border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
                        : "border border-white/10 bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-lg font-bold text-black shadow-md">
                        {buyer.name.charAt(0)}
                      </div>
                      <p className="text-lg font-medium">{buyer.name}</p>
                      {index === 0 && (
  <span className="text-xs bg-emerald-500 text-black px-2 py-1 rounded-md">
    🏆 Best Price
  </span>
)}
                    </div>

                    <div className="mt-2">
                      <p className="text-xs text-slate-400">Offered Price</p>
                      <p className="font-semibold text-emerald-400">
                        {formatCurrency(buyer.price)} / quintal
                      </p>
                      <p className="mt-1 text-xs text-emerald-300">
                        +{formatCurrency((buyer.price - mandiPrice) * quantityValue)}{" "}
                        total gain
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        High demand in your region
                      </p>
                    </div>

                    <p className="mt-1 text-sm text-slate-400">⭐ {buyer.rating}</p>

                    <button
                      onClick={() => {
  setSelectedBuyer(buyer);
  setShowModal(true);
}}
                      className="mt-2 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-2 transition hover:scale-105"
                    >
                      Send Request
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      {showModal && selectedBuyer && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-slate-900 p-6 rounded-xl w-[350px] border border-emerald-500">
      
      <h2 className="text-xl font-semibold mb-3 text-emerald-400">
        ✅ Request Sent
      </h2>

      <p className="text-sm text-gray-300 mb-4">
        Connected with <span className="text-white font-medium">{selectedBuyer.name}</span>
      </p>

      <div className="text-sm text-gray-400 space-y-2">
        <p>📞 Contact: +91 98XXXXXXX</p>
        <p>💬 WhatsApp available</p>
        <p>⏱ Response: within 2–4 hrs</p>
        <p>🚚 Pickup: Available</p>
      </div>

      <button
        onClick={() => setShowModal(false)}
        className="mt-5 w-full bg-emerald-500 text-black py-2 rounded-lg font-medium hover:bg-emerald-400"
      >
        Done
      </button>
    </div>
  </div>
)}
    </main>
  );
}
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
