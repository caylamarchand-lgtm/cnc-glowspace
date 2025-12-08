"use client";

import Link from "next/link";
import { useState } from "react";

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState("CNC Glow Legend");
  const [status, setStatus] = useState("Level 1 — Just joined the universe.");
  const [aboutMe, setAboutMe] = useState(
    "This is my glow profile. Soon this space will be fully customizable like old-school MySpace."
  );
  const [theme, setTheme] = useState<"neon" | "galaxy" | "soft">("neon");

  const themeClasses =
    theme === "neon"
      ? {
          bg: "from-pink-900 via-black to-purple-900",
          accent: "text-pink-400",
        }
      : theme === "galaxy"
      ? {
          bg: "from-indigo-900 via-black to-sky-900",
          accent: "text-indigo-300",
        }
      : {
          bg: "from-slate-900 via-slate-950 to-purple-800",
          accent: "text-purple-200",
        };

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${themeClasses.bg} text-white flex items-center justify-center p-4`}
    >
      <div className="max-w-5xl w-full grid gap-6 md:grid-cols-2">
        {/* LEFT: preview */}
        <section className="rounded-3xl bg-black/60 border border-white/10 p-6 md:p-8 shadow-2xl">
          <h1 className="text-3xl font-extrabold mb-2">
            Your Glow Profile <span>✨</span>
          </h1>
          <p className="text-sm text-gray-300 mb-4">
            Live preview of how your GlowSpace card will look.
          </p>

          <div className="rounded-2xl bg-black/60 border border-white/10 p-4 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                Display Name
              </p>
              <p className={`text-xl font-bold ${themeClasses.accent}`}>
                {displayName || "Your Glow Name"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                Glow Status
              </p>
              <p className="text-sm text-gray-200">
                {status || "Add a status"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                About Me
              </p>
              <p className="text-sm text-gray-100 whitespace-pre-line">
                {aboutMe || "Tell the universe who you are."}
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
            <span>Profile customization is preview-only (no backend yet).</span>
            <Link
              href="/"
              className="underline underline-offset-4 hover:text-pink-300"
            >
              ← Back to CNC GlowSpace home
            </Link>
          </div>
        </section>

        {/* RIGHT: controls */}
        <section className="rounded-3xl bg-black/40 border border-white/10 p-6 space-y-5">
          <h2 className="text-xl font-bold">Customize your glow 💅</h2>

          {/* Theme buttons */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">
              Theme
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTheme("neon")}
                className={`px-3 py-1.5 rounded-full text-xs border ${
                  theme === "neon"
                    ? "bg-white text-black border-white"
                    : "bg-black/40 border-white/20"
                }`}
              >
                Neon Pop
              </button>
              <button
                type="button"
                onClick={() => setTheme("galaxy")}
                className={`px-3 py-1.5 rounded-full text-xs border ${
                  theme === "galaxy"
                    ? "bg-white text-black border-white"
                    : "bg-black/40 border-white/20"
                }`}
              >
                Galaxy Drift
              </button>
              <button
                type="button"
                onClick={() => setTheme("soft")}
                className={`px-3 py-1.5 rounded-full text-xs border ${
                  theme === "soft"
                    ? "bg-white text-black border-white"
                    : "bg-black/40 border-white/20"
                }`}
              >
                Soft Glow
              </button>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">
                Display Name
              </label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
                placeholder="Your glow name"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">
                Glow Status
              </label>
              <input
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
                placeholder="What level are you on?"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">
                About Me
              </label>
              <textarea
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                rows={4}
                className="w-full rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 resize-none"
                placeholder="Drop your chaos, hobbies, favorite glitter colors, and MySpace song."
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}