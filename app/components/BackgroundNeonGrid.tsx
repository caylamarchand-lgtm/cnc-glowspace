import React from "react";
export default function BackgroundNeonGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* soft glow wash */}
      <div className="absolute inset-0 neonGridGlow" />

      {/* grid */}
      <div className="absolute inset-0 neonGridLines" />

      {/* subtle moving shine */}
      <div className="absolute inset-0 neonGridScan" />
    </div>
  );
}

export {};