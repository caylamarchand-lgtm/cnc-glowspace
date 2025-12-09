'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (!email || !password) {
      setError('Please enter your email and password.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message || 'Something went wrong while logging in.');
        return;
      }

      if (data.user) {
        setMessage('Welcome back! Redirecting to your glow profile… ✨');
        setEmail('');
        setPassword('');
        router.push('/profile');
      }
    } catch (err: any) {
      setError(err.message || 'Unexpected error while logging in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="w-full max-w-md rounded-3xl bg-slate-950/70 border border-pink-500/40 shadow-[0_0_40px_rgba(236,72,153,0.45)] px-8 py-10">
        <h1 className="text-3xl font-extrabold text-center text-pink-300 drop-shadow-[0_0_18px_rgba(244,114,182,0.7)]">
          Welcome back to
          <span className="block text-4xl mt-1 text-pink-400">GlowSpace</span>
        </h1>

        <p className="mt-3 text-center text-sm text-slate-400">
          Log in to your glowing universe.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-slate-900/70 border border-slate-700 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/60 px-3 py-2 text-sm outline-none"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-slate-900/70 border border-slate-700 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/60 px-3 py-2 text-sm outline-none"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-500/40 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {message && (
            <p className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-500/40 rounded-lg px-3 py-2">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 py-2.5 text-sm font-semibold tracking-wide text-white shadow-[0_0_25px_rgba(236,72,153,0.7)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging you in…' : 'Log in'}
          </button>
        </form>

        {/* ✅ REAL SIGN-UP LINK – NO MORE “COMING SOON” */}
        <p className="mt-4 text-center text-[11px] text-slate-400">
          New here?
        </p>
        <p className="mt-1 text-center text-[11px] text-slate-100">
          <a
            href="/signup"
            className="text-pink-400 hover:text-pink-300 underline underline-offset-2"
          >
            Join the Glow Universe ✨ Sign up now!
          </a>
        </p>

        {/* Back to main site */}
        <p className="mt-4 text-center text-[11px] text-slate-500">
          <a
            href="/"
            className="text-pink-400 hover:text-pink-300 underline underline-offset-2"
          >
            ← Back to CNC GlowSpace
          </a>
        </p>
      </div>
    </main>
  );
}