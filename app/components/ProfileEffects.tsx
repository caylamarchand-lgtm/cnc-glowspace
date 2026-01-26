"use client";

import { useMemo } from "react";

export type Effect =
  | "stars_hearts"
  | "bubbles"
  | "snow"
  | "fog"
  | "ember"
  | "neon_grid";

type Particle = {
  left: number; // %
  size: number; // px
  duration: number; // s
  delay: number; // s
  opacity: number; // 0-1
  drift: number; // px
  bottom: number; // px
  char: string;
};

function makeParticles(effect: Effect): Particle[] {
  let count = 70;
  let chars: string[] = ["✦", "✧", "✨", "★"];
  let sizeMin = 12;
  let sizeMax = 34;

  if (effect === "stars_hearts") {
    count = 60;
    chars = ["💖", "✨", "✦", "💙", "🤍"];
    sizeMin = 12;
    sizeMax = 34;
  } else if (effect === "bubbles") {
    count = 40;
    chars = ["○", "◌", "◍"];
    sizeMin = 18;
    sizeMax = 56;
  } else if (effect === "snow") {
    count = 70;
    chars = ["❄", "❅", "❆", "✻", "✼", "✶"];
    sizeMin = 10;
    sizeMax = 30;
  } else if (effect === "fog") {
    count = 20;
    chars = ["●"];
    sizeMin = 90;
    sizeMax = 220;
  } else if (effect === "ember") {
    count = 55;
    chars = ["•", "·", "✦"];
    sizeMin = 10;
    sizeMax = 26;
  } else if (effect === "neon_grid") {
    // particles not used for grid; still return a few subtle sparkles
    count = 18;
    chars = ["✦", "·"];
    sizeMin = 10;
    sizeMax = 22;
  }

  return Array.from({ length: count }).map(() => {
    const size = sizeMin + Math.random() * (sizeMax - sizeMin);
    return {
      left: Math.random() * 100,
      size,
      duration: 7 + Math.random() * 10,
      delay: Math.random() * 4,
      opacity: 0.15 + Math.random() * 0.75,
      drift: -22 + Math.random() * 44,
      bottom: -40 - Math.random() * 240,
      char: chars[Math.floor(Math.random() * chars.length)],
    };
  });
}

export default function ProfileEffects({ effect }: { effect: Effect }) {
  // IMPORTANT: particles are created once per effect change (no re-random on every render)
  const particles = useMemo(() => makeParticles(effect), [effect]);

  const overlayStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 0,
    overflow: "hidden",
  };

  const commonSpan: React.CSSProperties = {
    position: "absolute",
    userSelect: "none",
    whiteSpace: "pre",
  };

  const filterForEffect =
    effect === "fog"
      ? "blur(10px)"
      : effect === "ember"
      ? "drop-shadow(0 0 10px rgba(255,140,0,0.18))"
      : "drop-shadow(0 0 10px rgba(255,255,255,0.12))";

  return (
    <div aria-hidden style={overlayStyle}>
      {/* Neon grid background */}
      {effect === "neon_grid" ? (
        <div
          style={{
            position: "absolute",
            inset: "-20%",
            opacity: 0.25,
            backgroundImage:
              "linear-gradient(rgba(0,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            transform: "skewY(-8deg)",
            animation: "gridPulse 6s ease-in-out infinite",
          }}
        />
      ) : null}

      {/* Floating particles */}
      {particles.map((p, i) => (
        <span
          key={`${effect}-${i}`}
          style={{
            ...commonSpan,
            left: `${p.left}%`,
            bottom: `${p.bottom}px`,
            fontSize: p.size,
            opacity: p.opacity,
            filter: filterForEffect,
            transform: `translateX(${p.drift}px)`,
            animation: `rise ${p.duration}s linear ${p.delay}s infinite`,
          }}
        >
          {p.char}
        </span>
      ))}

      {/* CSS (NO styled-jsx) */}
      <style>{`
        @keyframes rise {
          from { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          to { transform: translateY(-120vh) translateX(0); opacity: 0; }
        }
        @keyframes gridPulse {
          from { transform: skewY(-8deg) scale(0.95); opacity: 0.18; }
          to { transform: skewY(-8deg) scale(1.05); opacity: 0.30; }
        }
      `}</style>
    </div>
  );
}