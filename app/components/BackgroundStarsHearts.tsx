export default function BackgroundStarsHearts() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Stars layer 1 */}
      <div className="stars stars1 absolute inset-0 opacity-60" />
      {/* Stars layer 2 */}
      <div className="stars stars2 absolute inset-0 opacity-40" />
      {/* Hearts layer */}
      <div className="hearts absolute inset-0 opacity-35" />

      {/* Glow haze */}
      <div className="glow glowTop" />
      <div className="glow glowBottom" />

      {/* IMPORTANT: no "jsx" or "global" props */}
      <style>{`
        .stars {
  background-repeat: repeat;
  background-size: 110px 110px; /* 🔥 denser stars */
  image-rendering: auto;
}
  /* STARFIELD using layered radial gradients */
.stars1 {
  background-image:
    radial-gradient(4px 4px at 10% 20%, rgba(255,255,255,0.95) 99%, transparent 100%),
    radial-gradient(3px 3px at 30% 80%, rgba(255,255,255,0.85) 99%, transparent 100%),
    radial-gradient(3px 3px at 70% 30%, rgba(255,255,255,0.75) 99%, transparent 100%),
    radial-gradient(3px 3px at 90% 60%, rgba(255,255,255,0.65) 99%, transparent 100%),
    radial-gradient(4.5px 4.5px at 40% 40%, rgba(255,255,255,0.60) 99%, transparent 100%),
    radial-gradient(4px 4px at 80% 10%, rgba(255,255,255,0.55) 99%, transparent 100%);
  animation: drift1 30s linear infinite;
  filter: drop-shadow(0 0 6px rgba(255,255,255,0.55));
}

.stars2 {
  background-image:
    radial-gradient(3px 3px at 15% 35%, rgba(255,255,255,0.60) 99%, transparent 100%),
    radial-gradient(3px 3px at 50% 15%, rgba(255,255,255,0.55) 99%, transparent 100%),
    radial-gradient(3px 3px at 85% 75%, rgba(255,255,255,0.50) 99%, transparent 100%),
    radial-gradient(4px 4px at 25% 85%, rgba(255,255,255,0.45) 99%, transparent 100%),
    radial-gradient(4px 4px at 65% 55%, rgba(255,255,255,0.40) 99%, transparent 100%);
  animation: drift2 50s linear infinite;
  filter: drop-shadow(0 0 5px rgba(255,255,255,0.45));
}

/* HEARTS (bigger + glowy) */
.hearts {
  background-repeat: repeat;
  background-size: 120px 120px; /* bigger hearts */
  background-position: 0 0;
  opacity: 1;

  /* SVG heart outline tile */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cg fill='none' stroke='rgba(255,180,220,0.9)' stroke-width='4'%3E%3Cpath d='M90 150 C60 125 35 105 35 75 C35 55 50 40 70 40 C80 40 88 45 90 52 C92 45 100 40 110 40 C130 40 145 55 145 75 C145 105 120 125 90 150 Z'/%3E%3C/g%3E%3C/svg%3E");

  filter: drop-shadow(0 0 10px rgba(255, 180, 220, 0.85));
  animation: floatHearts 18s ease-in-out infinite;
}

/* Glow haze */
.glow {
  position: absolute;
  width: 520px;
  height: 520px;
  border-radius: 9999px;
  filter: blur(60px);
  opacity: 0.45;
}

.glowTop {
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  background: radial-gradient(circle, rgba(255,105,180,0.7), transparent 70%);
}

.glowBottom {
  bottom: -160px;
  right: -120px;
  background: radial-gradient(circle, rgba(99,102,241,0.65), transparent 70%);
}

/* Layering order: stars → hearts → glow → content */
.stars1,
.stars2 {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hearts {
  position: absolute;
  inset: 0;
  z-index: 1; /* behind cards */
}

.glow {
  position: absolute;
  z-index: 2;
}

@keyframes drift1 {
  from { transform: translateY(0px); }
  to   { transform: translateY(40px); }
}

@keyframes drift2 {
  from { transform: translateY(0px); }
  to   { transform: translateY(-40px); }
}

@keyframes floatHearts {
  0%, 100% { transform: translateY(0px); }
  50%      { transform: translateY(18px); }
}
  `}</style>
  </div>
  );
}
