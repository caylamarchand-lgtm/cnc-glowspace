import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
          Welcome back to GlowSpace
        </h1>
        <p className="text-sm text-gray-300 mb-6 text-center">
          Log in to your glowing universe.
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-md bg-black/60 border border-white/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-md bg-black/60 border border-white/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 py-2 text-sm font-semibold shadow-lg hover:opacity-80 transition"
          >
            Log in
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-400 text-center">
          Don&apos;t have an account yet?{" "}
          <span className="text-purple-300">Sign-up page coming soon ✨</span>
        </p>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-purple-300 underline-offset-2 hover:underline"
          >
            ← Back to CNC GlowSpace
          </Link>
        </div>
      </div>
    </main>
  );
}