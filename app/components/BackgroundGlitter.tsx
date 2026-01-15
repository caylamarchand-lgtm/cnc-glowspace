"use client";

import { useMemo } from "react";

type Glitter = {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
  char: string;
  blur: number;
  kind: "sparkle" | "bokeh";
};

export default function BackgroundGlitter() {
  const glitters = useMemo<Glitter[]>(() => {
    // Sparkle chars that read as GLITTER (not snow)
    const sparkleChars = ["✦", "✧", "✨", "✩", "✪", "⋆", "✶", "✷"];
    const countSparkles = 28;
    const countBokeh = 18;

    const sparkles = Array.from({ length: countSparkles }).map((_, i) => {
      const size = 18 + Math.random() * 46; // 18–64px (VISIBLE)
      return {
        kind: "sparkle" as const,
        left: Math.random() * 100,
        top: -10 - Math.random() * 40, // start above
        size,
        duration: 14 + Math.random() * 18, // slower = luxury
        delay: Math.random() * 8,
        opacity: 0.55 + Math.random() * 0.35,
        drift: Math.random() * 120 - 60, // -60..+60
        char: sparkleChars[i % sparkleChars.length],
        blur: Math.random() < 0.35 ? 0.6 : 0,
      };
    });

    // Big soft “glitter blobs” (bokeh) so you SEE glow even if sparkles miss your eye
    const bokeh = Array.from({ length: countBokeh }).map(() => {
      const size = 70 + Math.random() * 190; // 70–260px
      return {
        kind: "bokeh" as const,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size,
        duration: 10 + Math.random() * 14, // slow float
        delay: Math.random() * 6,
        opacity: 0.10 + Math.random() * 0.18,
        drift: Math.random() * 80 - 40,
        char: "",
        blur: 14 + Math.random() * 18,
      };
    });

    return [...bokeh, ...sparkles];
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
      {/* A subtle warm wash so gold/champagne reads on blue */}
      <div className="absolute inset-0" style={{ mixBlendMode: "screen", opacity: 0.22 }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(255,220,170,0.35), transparent 55%)," +
              "radial-gradient(circle at 70% 35%, rgba(255,214,160,0.28), transparent 60%)," +
              "radial-gradient(circle at 50% 80%, rgba(255,235,210,0.18), transparent 60%)",
          }}
        />
      </div>

      {glitters.map((g, idx) => {
        if (g.kind === "bokeh") {
          return (
            <span
              key={`bokeh-${idx}`}
              className="absolute rounded-full"
              style={{
                left: `${g.left}%`,
                top: `${g.top}%`,
                width: `${g.size}px`,
                height: `${g.size}px`,
                opacity: g.opacity,
                filter: `blur(${g.blur}px)`,
                transform: "translate3d(0,0,0)",
                animation: `glitterFloat ${g.duration}s ease-in-out ${g.delay}s infinite`,
                // @ts-ignore
                "--drift": `${g.drift}px`,
                background:
                  "radial-gradient(circle, rgba(255,225,185,0.85), rgba(255,214,160,0.35) 40%, transparent 70%)",
                mixBlendMode: "screen",
              }}
            />
          );
        }

        return (
          <span
            key={`spark-${idx}`}
            className="absolute select-none"
            style={{
              left: `${g.left}%`,
              top: `${g.top}%`,
              fontSize: `${g.size}px`,
              opacity: g.opacity,
              color: "rgba(255, 230, 200, 0.95)", // champagne base
              textShadow: `
                0 0 8px rgba(255, 215, 140, 0.95),
                0 0 18px rgba(255, 215, 140, 0.70),
                0 0 34px rgba(255, 215, 140, 0.40)
              `,
              filter: `blur(${g.blur}px) drop-shadow(0 0 14px rgba(255,215,140,0.75))`,
              mixBlendMode: "screen",
              animation: `glitterFall ${g.duration}s linear ${g.delay}s infinite, glitterTwinkle ${
                3.6 + Math.random() * 3.4
              }s ease-in-out ${g.delay}s infinite`,
              transform: "translate3d(0,0,0)",
              // @ts-ignore
              "--drift": `${g.drift}px`,
            }}
          >
            {g.char}
          </span>
        );
      })}

      <style>{`
        @keyframes glitterFall {
          0% { transform: translate3d(0, 0, 0) rotate(0deg); }
          100% { transform: translate3d(var(--drift), 140vh, 0) rotate(220deg); }
        }

        @keyframes glitterTwinkle {
          0%, 100% { opacity: 0.55; transform: scale(0.92); }
          50% { opacity: 1; transform: scale(1.08); }
        }

        @keyframes glitterFloat {
          0%, 100% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(var(--drift), -14px, 0); }
        }
      `}</style>
    </div>
  );
}
