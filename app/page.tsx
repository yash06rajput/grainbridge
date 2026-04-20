export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold">
          GrainBridge 🌾
        </h1>

        <p className="text-lg text-gray-400">
          AI-powered platform to help farmers get the best price for their crops
        </p>

        <a
          href="/farmer"
          className="inline-block bg-green-500 px-6 py-3 rounded-xl text-black font-semibold hover:bg-green-400 transition"
        >
          Get Started
        </a>
      </div>
    </main>
  );
}