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
          background-size: 260px 260px;
          image-rendering: crisp-edges;
        }

        /* STARFIELD using layered radial gradients */
        .stars1 {
          background-image:
            radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.9) 99%, transparent 100%),
            radial-gradient(1px 1px at 30% 80%, rgba(255,255,255,0.😎 99%, transparent 100%),
            radial-gradient(1px 1px at 70% 30%, rgba(255,255,255,0.7) 99%, transparent 100%),
            radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,0.6) 99%, transparent 100%),
            radial-gradient(2px 2px at 40% 40%, rgba(255,255,255,0.55) 99%, transparent 100%),
            radial-gradient(2px 2px at 80% 10%, rgba(255,255,255,0.45) 99%, transparent 100%);
          animation: drift1 30s linear infinite;
        }

        .stars2 {
          background-image:
            radial-gradient(1px 1px at 15% 35%, rgba(255,255,255,0.55) 99%, transparent 100%),
            radial-gradient(1px 1px at 50% 15%, rgba(255,255,255,0.50) 99%, transparent 100%),
            radial-gradient(1px 1px at 85% 75%, rgba(255,255,255,0.45) 99%, transparent 100%),
            radial-gradient(2px 2px at 25% 85%, rgba(255,255,255,0.35) 99%, transparent 100%),
            radial-gradient(2px 2px at 65% 55%, rgba(255,255,255,0.30) 99%, transparent 100%);
          animation: drift2 50s linear infinite;
        }

        .hearts {
          background-repeat: repeat;
          background-size: 220px 220px;
          background-image:
            radial-gradient(circle at 30px 30px, rgba(255,105,180,0.45) 2px, transparent 3px),
            radial-gradient(circle at 120px 80px, rgba(255,105,180,0.35) 2px, transparent 3px),
            radial-gradient(circle at 180px 160px, rgba(255,105,180,0.28) 2px, transparent 3px);
          filter: blur(0.2px);
          animation: floatHearts 18s ease-in-out infinite;
        }

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

        @keyframes drift1 {
          from { transform: translateY(0px); }
          to { transform: translateY(40px); }
        }

        @keyframes drift2 {
          from { transform: translateY(0px); }
          to { transform: translateY(-40px); }
        }

        @keyframes floatHearts {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(18px); }
        }
      `}</style>
    </div>
  );
}
