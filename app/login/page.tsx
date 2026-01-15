"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/profile");
  };

  return (
    <>
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-slate-950 to-black text-white p-6">
        <div className="w-full max-w-md rounded-3xl border border-pink-500/30 bg-black/70 p-8 shadow-[0_0_80px_rgba(236,72,153,0.35)] backdrop-blur">
          <h1 className="mb-1 text-center text-3xl font-extrabold text-pink-400 drop-shadow">
            Welcome back to
          </h1>
          <h2 className="mb-4 text-center text-4xl font-extrabold text-pink-500">
            GlowSpace
          </h2>
          <p className="mb-8 text-center text-sm text-slate-300">
            Log in to your glowing universe.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-slate-200">Email</label>
              <input
                type="email"
                className="w-full rounded-xl border border-slate-700 bg-black/60 px-3 py-2 text-sm outline-none ring-0 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/60"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

<div className="text-right">
  <Link
    href="/forgot-password"
    className="text-sm text-pink-400 hover:text-pink-300 underline"
  >
    Forgot password?
  </Link>
</div>

            <div>
              <label className="mb-1 block text-sm text-slate-200">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-700 bg-black/60 px-3 py-2 text-sm outline-none ring-0 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/60"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-center text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/40 transition hover:from-pink-400 hover:to-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Logging you in…" : "Log in"}
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] text-slate-400">
            New here?{" "}
            <a
              href="/signup"
              className="text-purple-300 hover:text-purple-200 underline"
            >
              Join the Glow Universe ✨ Sign up now!
            </a>
          </p>

          <p className="mt-4 text-center text-[11px] text-slate-500">
            <a
              href="/"
              className="text-pink-400 hover:text-pink-300 underline underline-offset-4"
            >
              ← Back to CNC GlowSpace
            </a>
          </p>
        </div>
      </main>
    </>
  );
}