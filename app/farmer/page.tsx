"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CROPS = [
  "Khapli Wheat",
  "Wheat",
  "Rice",
  "Maize",
  "Cotton",
  "Soyabean",
  "Mustard",
  "Sugarcane",
  "Onion",
  "Potato",
  "Tomato"
];
const STATES = [
  "Delhi",
  "Punjab",
  "Haryana",
  "Uttar Pradesh",
  "Maharashtra",
  "Rajasthan"
];

export default function FarmerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    crop: "",
    quantity: "",
    location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
  event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const target = event.target as HTMLInputElement | HTMLSelectElement;

  const { name, value } = target;

  setFormData((current) => ({
    ...current,
    [name]: value,
  }));
};

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const crop = formData.crop.trim();
    const quantity = formData.quantity.trim();
    const location = formData.location.trim();

    if (!crop || !quantity || !location) {
      setError("Please fill in all fields before continuing.");
      return;
    }

    setIsSubmitting(true);
    console.log(crop, quantity, location);
    router.push(`/dashboard?crop=${crop}&quantity=${quantity}&location=${location}`);

    const farmerRequest = {
      crop,
      quantity,
      location,
      submittedAt: new Date().toISOString(),
    };

    localStorage.setItem("grainbridgeFarmerRequest", JSON.stringify(farmerRequest));
    
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.12),_transparent_28%)]" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-12 sm:px-8 lg:px-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="max-w-xl">
              <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-200">
                GrainBridge for Farmers
              </span>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Sell smarter with AI-backed crop price guidance.
              </h1>

              <p className="mt-4 text-lg leading-8 text-slate-300">
                Share your crop details and GrainBridge will estimate the best
                selling opportunity across mandi rates and premium buyers.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-sm text-slate-400">Compare</p>
                  <p className="mt-2 text-base font-medium text-white">
                    Mandi vs premium buyers
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-sm text-slate-400">Discover</p>
                  <p className="mt-2 text-base font-medium text-white">
                    Suggested selling price
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-sm text-slate-400">Connect</p>
                  <p className="mt-2 text-base font-medium text-white">
                    Buyer recommendations
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
              <div className="mb-6">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-200">
                  Farmer Intake Form
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Enter crop details
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  This takes less than a minute and helps us generate your price
                  insights dashboard.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="crop"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Crop
                  </label>
                  <select
                    id="crop"
                    name="crop"
                    value={formData.crop}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                  >
                    <option value="">Select a crop</option>
                    {CROPS.map((crop) => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="quantity"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Quantity
                  </label>
                 <select
  id="quantity"
  name="quantity"
  value={formData.quantity}
  onChange={handleChange}
  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3"
>
  <option value="">Select quantity</option>
  <option value="100">100 quintals</option>
  <option value="200">200 quintals</option>
  <option value="500">500 quintals</option>
  <option value="1000">1000 quintals</option>
</select>
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    State
                  </label>
                 <select
  id="location"
  name="location"
  value={formData.location}
  onChange={handleChange}
  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3"
>
  <option value="">Select state</option>
  {STATES.map((state) => (
    <option key={state} value={state}>
      {state}
    </option>
  ))}
</select>
                </div>

                {error ? (
                  <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Preparing dashboard..." : "Continue to Dashboard"}
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
