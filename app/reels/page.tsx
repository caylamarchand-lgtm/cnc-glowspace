"use client";

import ReelUpload from "../components/reels/ReelUpload";
import ReelsFeed from "../components/reels/ReelsFeed";

export default function ReelsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-zinc-100">
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Reels</h1>
          <p className="mt-2 text-zinc-400">
            Short videos from the GlowSpace universe.
          </p>
        </div>

        {/* Upload Card */}
        <div className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-zinc-100">
            Upload a Reel
          </h2>
          <ReelUpload />
        </div>

        {/* Feed */}
        <div className="space-y-6">
          <ReelsFeed />
        </div>
      </div>
    </main>
  );
}