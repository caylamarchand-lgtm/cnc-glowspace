export default function BackgroundSnow() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {Array.from({ length: 90 }).map((_, i) => (
        <span
          key={i}
          className="absolute top-[-10%] rounded-full bg-white/70 blur-[0.2px] animate-snow"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            opacity: 0.35 + Math.random() * 0.55,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
          }}
        />
      ))}
    </div>
  );
}