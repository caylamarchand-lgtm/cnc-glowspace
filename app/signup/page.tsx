"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Redirect after they confirm their email
        emailRedirectTo: "https://www.cncglowspace.com/login",
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Account created! Check your email to confirm ✨");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-slate-950 to-black text-white p-6">
      <div className="w-full max-w-md rounded-3xl border border-pink-500/30 bg-black/70 p-8 shadow-[0_0_80px_rgba(236,72,153,0.35)] backdrop-blur">

        <h1 className="mb-1 text-center text-3xl font-extrabold text-pink-400 drop-shadow">
          Join GlowSpace ✨
        </h1>

        <p className="mb-8 text-center text-sm text-slate-300">
          Create your glowing account.
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-slate-200">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-700 bg-black/60 px-3 py-2 text-sm outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/60"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-slate-200">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-700 bg-black/60 px-3 py-2 text-sm outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/60"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-center text-red-400">{error}</p>
          )}

          {message && (
            <p className="text-sm text-center text-green-400">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 py-2.5 text-sm font-semibold shadow-lg shadow-pink-500/40 transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Creating your glow…" : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-slate-400">
          Already glowing?{" "}
          <a
            href="/login"
            className="text-pink-400 hover:text-pink-300 underline underline-offset-4"
          >
            Log in instead
          </a>
        </p>
      </div>
    </main>
  );
}