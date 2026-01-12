export default function BackgroundEmber() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Warm glow layer */}
      <div className="ember-glow absolute inset-0 opacity-40" />

      {/* Embers */}
      {Array.from({ length: 50 }).map((_, i) => (
        <span
          key={i}
          className="ember absolute bottom-[-10%] rounded-full opacity-80"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${3 + Math.random() * 6}s`,
          }}
        />
      ))}
    </div>
  );
}