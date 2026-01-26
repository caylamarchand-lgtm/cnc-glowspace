"use client";

import type React from "react";
import ProfileEffectsClient from "./ProfileEffectsClient";
import type { Effect } from "./ProfileEffects";

type ProfileLite = {
  username: string;
  display_name: string | null;
  avatar_url: string | null;

  bio?: string | null;
  about_me?: string | null;
  status?: string | null;

  background_url?: string | null;
  music_url?: string | null;
  effect?: string | null;
};

type Props = {
  profile: ProfileLite;
  // optional: pass a mergedProfile if you already merge customization elsewhere
  bgUrl?: string | null;
  effectLabel?: Effect | null;
};

export default function ProfileViewClient({ profile, bgUrl, effectLabel }: Props) {
  const pageStyle: React.CSSProperties = {
    maxWidth: 980,
    margin: "0 auto",
    padding: "24px 16px",
    minHeight: "100vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    position: "relative",
    overflow: "hidden",
  };

  const finalBg = bgUrl ?? profile.background_url ?? null;
  if (finalBg) pageStyle.backgroundImage = `url(${finalBg})`;

  return (
    <main style={pageStyle}>
      {/* EFFECTS ALWAYS BEHIND */}
      {effectLabel ? <ProfileEffectsClient effect={effectLabel} /> : null}

      {/* FOREGROUND */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {/* ✅ HEADER REMOVED (this is what caused the double display name) */}

        {/* main card (this is the “TRUE” look you want people to see) */}
        <div
          style={{
            borderRadius: 18,
            padding: 18,
            background: "rgba(10, 14, 25, 0.62)",
            border: "1px solid rgba(255,255,255,0.16)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
            maxWidth: 760,
          }}
        >
          {/* top row inside card: avatar + name */}
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt=""
                style={{ width: 54, height: 54, borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)",
                }}
              />
            )}

            <div>
              <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.1 }}>
                {profile.display_name?.trim() || profile.username}
              </div>
              <div style={{ opacity: 0.8 }}>@{profile.username}</div>
            </div>

            {/* optional badge */}
            {effectLabel ? (
              <div style={{ marginLeft: "auto", opacity: 0.85, fontSize: 12 }}>
                Effect: {effectLabel}
              </div>
            ) : null}
          </div>

          {profile.status ? (
            <div style={{ marginBottom: 10, opacity: 0.9, fontWeight: 700 }}>
              {profile.status}
            </div>
          ) : null}

          {profile.about_me ? (
            <div style={{ marginBottom: 8, opacity: 0.95 }}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>About</div>
              <div style={{ whiteSpace: "pre-wrap" }}>{profile.about_me}</div>
            </div>
          ) : null}

          {profile.bio ? (
            <div style={{ opacity: 0.9, whiteSpace: "pre-wrap" }}>{profile.bio}</div>
          ) : null}
        </div>

        {/* music */}
        {profile.music_url ? (
          <div style={{ marginTop: 18, maxWidth: 760 }}>
            <iframe
              width="100%"
              height="120"
              src={profile.music_url}
              title="music"
              style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.15)" }}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        ) : null}
      </div>
    </main>
  );
}
