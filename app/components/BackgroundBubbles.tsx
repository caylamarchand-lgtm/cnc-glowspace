export default function BackgroundBubbles() {
  // Lightweight "floating bubbles" overlay
  const bubbles = Array.from({ length: 22 });

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-80">
      {bubbles.map((_, i) => {
        // Deterministic-ish variety without needing useMemo
        const size = 14 + ((i * 7) % 34);
        const left = (i * 37) % 100;
        const dur = 9 + ((i * 13) % 10);
        const delay = ((i * 5) % 12) * -1;
        const blur = i % 4 === 0 ? 2 : 0;

        return (
          <span
            key={i}
            className="absolute bottom-[-10%] rounded-full bg-white/10 border border-white/15"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              filter: blur ? `blur(${blur}px)` : undefined,
              animation: `bubbleFloat ${dur}s linear infinite`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}