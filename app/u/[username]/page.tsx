import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import type React from "react";
import FriendsList from "./FriendsList"
import ProfileEffectsClient from "../../components/ProfileEffectsClient";
import type { Effect } from "../../components/ProfileEffects";
import ClientOnly from "../../components/ClientOnly";
import ProfileCard from "../../components/ProfileCard";

type BaseProfile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  about_me: string | null;
  status: string | null;
  is_public: boolean | null;
};

type Customization = {
  background_url?: string | null;
  music_url?: string | null;
  custom_css?: string | null;
  theme?: string | null;
  profile_layout?: string | null;
  accent_color?: string | null;
  background_effect?: string | null;
};

type PageProps = {
  params: Promise<{ username: string }>;
};

const EFFECTS: Effect[] = [
  "stars_hearts",
  "bubbles",
  "snow",
  "fog",
  "ember",
  "neon_grid",
];

function isEffect(v: unknown): v is Effect {
  return typeof v === "string" && (EFFECTS as string[]).includes(v);
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase env vars");
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const clean = decodeURIComponent(username ?? "").trim();
  if (!clean) return notFound();

  // 1) base profile by username
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      `
      id,
      username,
      display_name,
      avatar_url,
      bio,
      about_me,
      status,
      is_public
    `
    )
    .ilike("username", clean)
    .maybeSingle<BaseProfile>();

  if (profileError || !profile) return notFound();
  if (profile.is_public === false) return notFound();

  // 2) customization by SAME id
  const { data: customization } = await supabase
    .from("profile_customization")
    .select(
      `
      background_url,
      music_url,
      custom_css,
      theme,
      profile_layout,
      accent_color,
      background_effect
    `
    )
    .eq("user_id", profile.id)
    .maybeSingle<Customization>();

  const mergedProfile = {
    ...profile,
    ...(customization ?? {}),
  };

  // background image
  const bgUrl =
    (mergedProfile as any)?.background_url ??
    (mergedProfile as any)?.backgroundUrl ??
    null;

  const pageStyle: React.CSSProperties = {
    maxWidth: 980,
    margin: "0 auto",
    padding: 24,
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  };

  if (bgUrl) pageStyle.backgroundImage = `url(${bgUrl})`;

  // effect
  const rawEffect =
    (mergedProfile as any)?.background_effect ??
    (mergedProfile as any)?.effect ??
    null;

  const effect: Effect | null = isEffect(rawEffect) ? rawEffect : null;

  return (
    <main style={pageStyle}>
      {/* Custom CSS */}
      {customization?.custom_css ? (
        <style dangerouslySetInnerHTML={{ __html: customization.custom_css }} />
      ) : null}

      {/* Effects behind */}
      <ClientOnly>
        {effect ? <ProfileEffectsClient effect={effect} /> : null}
      </ClientOnly>

      {/* Foreground */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <ProfileCard
          avatarUrl={profile.avatar_url}
          displayName={profile.display_name}
          username={profile.username}
          status={profile.status}
          aboutMe={profile.about_me}
          theme={customization?.theme ?? null}
          musicUrl={customization?.music_url ?? null}
        />
        <FriendsList profileId={profile.id} />
      </div>
    </main>
  );
}