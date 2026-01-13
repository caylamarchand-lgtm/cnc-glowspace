export default function BackgroundRain() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {Array.from({ length: 120 }).map((_, i) => (
        <span
          key={i}
          className="absolute top-[-10%] h-10 w-[1px] bg-blue-400/40 animate-rain"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${0.6 + Math.random()}s`,
          }}
        />
      ))}
    </div>
  );
}