export default function BackgroundFog() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="fog fog-1 absolute inset-0 opacity-35" />
      <div className="fog fog-2 absolute inset-0 opacity-25" />
      <div className="fog fog-3 absolute inset-0 opacity-20" />
    </div>
  );
}

export {};