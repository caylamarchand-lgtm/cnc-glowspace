"use client";

type ProfileCardProps = {
  avatarUrl?: string | null;
  displayName?: string | null;
  username?: string | null;
  status?: string | null;
  aboutMe?: string | null;
  theme?: string | null;
  musicUrl?: string | null;

  /** Optional: lets you size/position the card differently per page */
  className?: string;

  /**
   * Optional: lets you render background/effects behind the card content
   * Example: hearts/stars layer, neon glow overlay, etc.
   */
  backgroundSlot?: React.ReactNode;
};

export default function ProfileCard({
  avatarUrl,
  displayName,
  username,
  status,
  aboutMe,
  theme,
  musicUrl,
  className = "",
  backgroundSlot,
}: ProfileCardProps) {
  const initial = (displayName || username || "G")[0];

  return (
    <div
      className={[
        "relative z-10 overflow-hidden rounded-3xl border border-pink-500/40 bg-[#0b1020]/95",
        "shadow-[0_0_40px_rgba(255,180,220,0.35)]",
        className,
      ].join(" ")}
    >
      {/* Optional background layer (effects behind content) */}
      {backgroundSlot ? (
        <div className="absolute inset-0 pointer-events-none">{backgroundSlot}</div>
      ) : null}

      {/* Inner glow overlay (keeps your vibe) */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_30px_rgba(255,180,220,0.25)] rounded-3xl" />

      <div className="relative p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full border border-pink-400 overflow-hidden bg-slate-900">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full grid place-items-center text-slate-200 font-bold">
                {initial}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-300/70">
              Glow Status
            </div>

            <div className="text-lg font-bold text-pink-200">
              {status || "Level 1 — Just joined the universe."}
            </div>

            <div className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-300/60">
              Display name
            </div>

            <div className="text-xl font-extrabold text-pink-100">
              {displayName || username || "CNC Glow Legend"}
            </div>

            {username ? (
              <div className="text-slate-300/70 text-sm">@{username}</div>
            ) : null}
          </div>
        </div>

        <div className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-300/60">
          About me
        </div>

        <div className="text-slate-100/90 text-sm">
          {aboutMe || "This is my Glow profile."}
        </div>

        <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-200/80">
          <span className="px-2 py-1 rounded-full bg-slate-900/40 border border-pink-500/30">
            Theme: {theme || "neon-club"}
          </span>

          {musicUrl ? (
            <span className="px-2 py-1 rounded-full bg-slate-900/40 border border-emerald-400/30">
              🎵 Music linked
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}