"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Check your email for a password reset link 💌");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-slate-950 to-black p-6">
      <div className="w-full max-w-md rounded-3xl border border-pink-500/30 bg-black/40 p-6 shadow-[0_0_60px_rgba(236,72,153,0.25)]">
        <h1 className="text-3xl font-extrabold text-pink-400 text-center">
          Forgot your password?
        </h1>

        <p className="mt-2 text-center text-sm text-slate-300">
          Enter your email and we’ll send you a reset link.
        </p>

        <form onSubmit={handleReset} className="mt-6 space-y-4">
          <div>
            <label className="block mb-1 text-sm text-slate-200">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-700 bg-black/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-pink-400"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-pink-500 py-2 font-semibold text-black hover:bg-pink-400 disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>

          {message && (
            <p className="text-center text-sm text-slate-200">{message}</p>
          )}
        </form>

        <div className="mt-5 text-center">
          <Link
            href="/login"
            className="text-sm text-pink-400 hover:text-pink-300 underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}