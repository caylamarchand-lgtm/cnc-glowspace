"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    // 1) Create the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: displayName,
          avatar_url: avatarUrl || null,
        },
      },
    });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    const user = data?.user;

    // 2) Insert a row into public.profiles for this user
    if (user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id, // FK to auth.users.id
            username,
            display_name: displayName,
            avatar_url: avatarUrl || null,
          },
        ]);

      if (profileError) {
        console.error(profileError);
        setLoading(false);
        setError(
          "Your account was created, but we couldn’t save your profile yet. Try again after logging in."
        );
        return;
      }
    }

    // 3) Success – clear form and go to /profile
    setLoading(false);
    setMessage("Glow account created! Redirecting you to your profile ✨");

    setUsername("");
    setDisplayName("");
    setAvatarUrl("");
    setEmail("");
    setPassword("");

    router.push("/profile");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center text-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-black/60 border border-pink-500/40 shadow-[0_0_40px_rgba(236,72,153,0.5)] p-8 space-y-6">
        <header className="text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-pink-400">
            Join the Glow Universe ✨
          </p>
          <h1 className="text-3xl font-extrabold text-pink-300">
            Create your GlowSpace
          </h1>
          <p className="text-xs text-slate-400">
            Pick your username & glow name — old-school MySpace vibes, new-school
            magic.
          </p>
        </header>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-300 mb-1">Username</label>
            <input
              type="text"
              required
              placeholder="glow_babe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Display name
            </label>
            <input
              type="text"
              placeholder="CNC Glow Queen"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Profile picture URL (optional)
            </label>
            <input
              type="url"
              placeholder="https://your-image-link.com/avatar.png"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          {message && (
            <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/40 rounded-md px-3 py-2">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-2.5 text-sm font-semibold tracking-wide shadow-lg shadow-pink-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating your glow..." : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-slate-400">
          Already glowing?{" "}
          <a
            href="/login"
            className="text-pink-400 hover:text-pink-300 underline underline-offset-2"
          >
            Log in instead
          </a>
        </p>
      </div>
    </main>
  );
}