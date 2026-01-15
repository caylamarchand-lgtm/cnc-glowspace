"use client";

import { useMemo } from "react";

type Flake = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
  char: string;
};

export default function BackgroundSnow() {
  const flakes = useMemo<Flake[]>(() => {
    const chars = ["❄", "❅", "❆", "✻", "✼", "✶"];
    const count = 70; // more = more snow
    return Array.from({ length: count }).map((_, i) => {
      const size = 10 + Math.random() * 26; // 10px - 36px
      return {
        left: Math.random() * 100,
        size,
        duration: 7 + Math.random() * 10, // 7s - 17s
        delay: Math.random() * 8, // 0 - 8s
        opacity: 0.25 + Math.random() * 0.65,
        drift: (Math.random() * 80 - 40), // -40px to +40px
        char: chars[i % chars.length],
      };
    });
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {flakes.map((f, idx) => (
        <span
          key={idx}
          className="absolute top-[-10%] select-none"
          style={{
            left: `${f.left}%`,
            fontSize: `${f.size}px`,
            opacity: f.opacity,
            textShadow: "0 0 10px rgba(255,255,255,0.25)",
            animation: `snowFall ${f.duration}s linear ${f.delay}s infinite`,
            transform: `translateX(0px)`,
            filter: "drop-shadow(0 0 6px rgba(255,255,255,0.15))",
            // custom CSS vars for drift
            // @ts-ignore
            "--drift": `${f.drift}px`,
          }}
        >
          {f.char}
        </span>
      ))}

      <style jsx>{`
        @keyframes snowFall {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(var(--drift), 130vh, 0);
          }
        }
      `}</style>
    </div>
  );
}
