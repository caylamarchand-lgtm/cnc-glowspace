"use client";

import React, { useEffect, useState } from "react";

type RainbowHeartPlayerProps = {
  src: string;
};

function extractYouTubeId(rawUrl: string): string | null {
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl.trim());

    // youtu.be/VIDEOID
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "");
    }

    // youtube.com/watch?v=VIDEOID
    if (url.hostname.includes("youtube.com")) {
      return url.searchParams.get("v");
    }

    return null;
  } catch {
    return null;
  }
}

const RainbowHeartPlayer: React.FC<RainbowHeartPlayerProps> = ({ src }) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(true); // panel visible by default

  // Whenever the musicUrl changes, extract the YouTube video ID
  useEffect(() => {
    if (!src) {
      setVideoId(null);
      return;
    }

    const id = extractYouTubeId(src);
    setVideoId(id);
  }, [src]);

  // If no valid YouTube video ID, show nothing
  if (!videoId) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      {/* Player card – stays mounted so music keeps playing, 
          we only fade it in/out visually */}
      <div
        className={`h-40 w-64 rounded-3xl border border-pink-500/60 bg-slate-950/90 shadow-lg shadow-pink-500/40 overflow-hidden transition-all duration-300 ${
          panelOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        <div className="h-32 w-full bg-slate-900">
          <iframe
            className="h-full w-full rounded-2xl"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`}
            title="GlowSpace music"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="mt-1 px-4 pb-3 text-right text-[10px] uppercase tracking-[0.2em] text-slate-300/80">
          Glow track · Retro Glow Mode
        </p>
      </div>

      {/* Floating rainbow heart toggle button */}
      <button
        type="button"
        onClick={() => setPanelOpen((prev) => !prev)}
        className={`group flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-500 to-amber-400 shadow-[0_0_20px_rgba(236,72,153,0.9)] transition-transform duration-300 hover:scale-110 active:scale-95 ${
          panelOpen ? "animate-pulse" : ""
        }`}
      >
        <span className="text-2xl">💖</span>
      </button>
    </div>
  );
};

export default RainbowHeartPlayer;