"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // after successful signup, send them to login
    router.push("/login");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#0b0b0f] px-4">
      <div className="w-full max-w-md bg-[#11111a] rounded-2xl p-8 shadow-[0_0_25px_rgba(255,20,147,0.25)] border border-pink-500/20">
        <h1 className="text-3xl font-bold text-center text-pink-400 mb-2">
          Join GlowSpace ✨
        </h1>
        <p className="text-center text-slate-400 mb-6">
          Create your GlowSpace account and start customizing your universe.
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-lg bg-[#1a1a24] border border-pink-500/30 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-lg bg-[#1a1a24] border border-pink-500/30 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-center text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-400 to-pink-600 text-black font-semibold disabled:opacity-60"
          >
            {loading ? "Creating your glow..." : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-center text-slate-400 text-xs">
          Already glowing?{" "}
          <a
            href="/login"
            className="text-pink-400 underline underline-offset-2 hover:text-pink-300"
          >
            Log in instead
          </a>
        </p>

        <p className="mt-2 text-center text-slate-500 text-[11px]">
          By signing up you agree to the GlowSpace vibes ✨
        </p>
      </div>
    </main>
  );
}