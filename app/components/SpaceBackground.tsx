"use client";

export default function SpaceBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Deep space base */}
      <div className="absolute inset-0 bg-[#050814]" />

      {/* Big visible stars (layer 1) */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.95) 1.4px, transparent 1.6px)," +
            "radial-gradient(circle, rgba(180,220,255,0.85) 1.2px, transparent 1.5px)," +
            "radial-gradient(circle, rgba(255,180,220,0.75) 1.1px, transparent 1.4px)",
          backgroundSize: "160px 160px, 220px 220px, 280px 280px",
          backgroundPosition: "0 0, 40px 70px, 90px 30px",
          filter: "drop-shadow(0 0 6px rgba(255,255,255,0.25))",
        }}
      />

      {/* Stars layer 2 (slightly smaller + denser) */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.85) 1.0px, transparent 1.2px)," +
            "radial-gradient(circle, rgba(160,210,255,0.65) 0.9px, transparent 1.15px)",
          backgroundSize: "120px 120px, 180px 180px",
          backgroundPosition: "30px 20px, 80px 120px",
          filter: "blur(0.2px)",
        }}
      />

      {/* Soft nebula glow (adds “space depth”) */}
      <div
        className="absolute -inset-[30%] opacity-70"
        style={{
          background:
            "radial-gradient(closest-side at 18% 25%, rgba(255,180,220,0.22), transparent 60%)," +
            "radial-gradient(closest-side at 85% 22%, rgba(160,210,255,0.20), transparent 60%)," +
            "radial-gradient(closest-side at 55% 85%, rgba(120,255,210,0.12), transparent 62%)",
          filter: "blur(48px)",
        }}
      />

      {/* Planets (VISIBLE, not tiny) */}
      <div
        className="absolute right-[-120px] top-[60px] h-[360px] w-[360px] rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.35), transparent 45%)," +
            "radial-gradient(circle at 55% 55%, rgba(160,210,255,0.35), rgba(90,120,255,0.18) 55%, transparent 70%)",
          filter: "blur(0.4px)",
          boxShadow: "0 0 80px rgba(140,170,255,0.18)",
        }}
      />

      <div
        className="absolute left-[-110px] bottom-[40px] h-[280px] w-[280px] rounded-full opacity-65"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.25), transparent 45%)," +
            "radial-gradient(circle at 50% 55%, rgba(255,180,220,0.30), rgba(236,72,153,0.16) 55%, transparent 72%)",
          boxShadow: "0 0 70px rgba(236,72,153,0.16)",
        }}
      />

      {/* Small extra planet */}
      <div
        className="absolute left-[18%] top-[18%] h-[120px] w-[120px] rounded-full opacity-55"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 55%)," +
            "radial-gradient(circle at 60% 60%, rgba(120,255,210,0.22), rgba(60,180,140,0.14) 55%, transparent 72%)",
          boxShadow: "0 0 40px rgba(120,255,210,0.12)",
        }}
      />
    </div>
  );
}