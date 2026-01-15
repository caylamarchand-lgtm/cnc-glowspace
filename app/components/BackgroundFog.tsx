"use client";

export default function BackgroundFog() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Slight dark tint so the fog reads, but NOT overpowering */}
      <div className="absolute inset-0 bg-[#050814]/15" />

      {/* --- SOFT BASE FOG (keep it subtle) --- */}
      <div
        className="absolute -inset-[30%] opacity-30"
        style={{
          background:
            "radial-gradient(closest-side at 25% 35%, rgba(255,255,255,0.16), transparent 72%)," +
            "radial-gradient(closest-side at 75% 40%, rgba(200,230,255,0.12), transparent 75%)," +
            "radial-gradient(closest-side at 50% 78%, rgba(255,180,220,0.10), transparent 78%)",
          filter: "blur(42px)",
          animation: "fogFloat1 16s ease-in-out infinite",
        }}
      />

      <div
        className="absolute -inset-[35%] opacity-25"
        style={{
          background:
            "radial-gradient(closest-side at 35% 65%, rgba(255,255,255,0.14), transparent 74%)," +
            "radial-gradient(closest-side at 70% 70%, rgba(160,210,255,0.10), transparent 78%)," +
            "radial-gradient(closest-side at 55% 30%, rgba(255,180,220,0.08), transparent 76%)",
          filter: "blur(52px)",
          animation: "fogFloat2 20s ease-in-out infinite",
        }}
      />

      {/* --- LIGHT MIST TEXTURE (very low) --- */}
      <div
        className="absolute inset-0 opacity-18"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.10), transparent 35%)," +
            "radial-gradient(circle at 60% 55%, rgba(255,255,255,0.08), transparent 40%)," +
            "radial-gradient(circle at 80% 25%, rgba(255,255,255,0.06), transparent 38%)",
          filter: "blur(16px)",
          animation: "fogMist 12s ease-in-out infinite",
        }}
      />

      {/* =========================================================
          MOVING SMOKE (THIS is what you want to SEE moving)
          We put it ABOVE the fog layers + give it clear motion.
         ========================================================= */}

      {/* Smoke layer 1 */}
      <div
        className="absolute -inset-[55%] opacity-60"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent 0px, rgba(255,255,255,0.10) 60px, transparent 140px)",
          filter: "blur(18px)",
          mixBlendMode: "screen",
          willChange: "transform",
          animation: "smokeDrift1 10s linear infinite",
        }}
      />

      {/* Smoke layer 2 */}
      <div
        className="absolute -inset-[60%] opacity-45"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent 0px, rgba(180,220,255,0.10) 80px, transparent 180px)",
          filter: "blur(22px)",
          mixBlendMode: "screen",
          willChange: "transform",
          animation: "smokeDrift2 14s linear infinite",
        }}
      />

      {/* Smoke layer 3 (slow, big drift) */}
      <div
        className="absolute -inset-[65%] opacity-30"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent 0px, rgba(255,180,220,0.08) 100px, transparent 220px)",
          filter: "blur(26px)",
          mixBlendMode: "screen",
          willChange: "transform",
          animation: "smokeDrift3 18s linear infinite",
        }}
      />

      <style jsx>{`
        @keyframes fogFloat1 {
          0% {
            transform: translate3d(-2%, -1%, 0) scale(1);
          }
          50% {
            transform: translate3d(2%, 1%, 0) scale(1.04);
          }
          100% {
            transform: translate3d(-2%, -1%, 0) scale(1);
          }
        }

        @keyframes fogFloat2 {
          0% {
            transform: translate3d(2%, 1%, 0) scale(1.01);
          }
          50% {
            transform: translate3d(-2%, -1%, 0) scale(1.05);
          }
          100% {
            transform: translate3d(2%, 1%, 0) scale(1.01);
          }
        }

        @keyframes fogMist {
          0% {
            transform: translate3d(0%, 0%, 0);
          }
          50% {
            transform: translate3d(1.2%, -0.8%, 0);
          }
          100% {
            transform: translate3d(0%, 0%, 0);
          }
        }

        /* ✅ THESE WERE MISSING IN YOUR FILE */
        @keyframes smokeDrift1 {
          0% {
            transform: translate3d(-8%, 0%, 0);
          }
          100% {
            transform: translate3d(8%, 0%, 0);
          }
        }

        @keyframes smokeDrift2 {
          0% {
            transform: translate3d(10%, -1%, 0);
          }
          100% {
            transform: translate3d(-10%, 1%, 0);
          }
        }

        @keyframes smokeDrift3 {
          0% {
            transform: translate3d(-6%, 1%, 0);
          }
          100% {
            transform: translate3d(6%, -1%, 0);
          }
        }
      `}</style>
    </div>
  );
}
