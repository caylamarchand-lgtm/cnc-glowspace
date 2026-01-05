import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  about_me: string | null;

  // new (optional extras)
  music_url: string | null;
  background_url: string | null;
  theme: string | null;
  status: string | null;
};

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // If env vars are missing, treat as not found (or you can throw)
    return notFound();
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const raw = username ?? "";
  const clean = decodeURIComponent(raw).trim();

  if (!clean) return notFound();

  const { data: profile, error: profileError } = await supabase


  
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, about_me, music_url, background_url, theme, status")
    .ilike("username", clean)
    .maybeSingle<Profile>();

  // If the user doesn't exist, show 404
 if (profileError) {
  console.error("SUPABASE PROFILE ERROR:", profileError);
  throw new Error(profileError.message);
}

if (!profile) {
  console.log("NO PROFILE FOUND FOR:", clean);
  return notFound();
}
const pageStyle: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  padding: 24,
  minHeight: "100vh",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

if (profile.background_url) {
  pageStyle.backgroundImage = `url(${profile.background_url})`
}
  return (
    <main style={pageStyle}>
      <header style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 999,
            overflow: "hidden",
            background: "#222",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={`${profile.username} avatar`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: 24 }}>
              {profile.username?.[0]?.toUpperCase() ?? "U"}
            </span>
          )}
        </div>

        <div>
          <h1 style={{ fontSize: 28, margin: 0 }}>
          {profile.display_name || profile.username || "GlowSpace user"}
          </h1>
          <p style={{ margin: "6px 0 0 0", opacity: 0.8 }}>
            @{profile.username}
          </p>
        </div>
      </header>

      {(profile.about_me ?? profile.bio) ? (
  <section style={{ marginTop: 16 }}>
    <p style={{ lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>
      {profile.about_me ?? profile.bio}
    </p>
  </section>
) : null}

      <section style={{ marginTop: 28, paddingTop: 16, borderTop: "1px solid #333" }}>
        <h2 style={{ margin: "0 0 8px 0", fontSize: 18 }}>Posts</h2>
        <p style={{ margin: 0, opacity: 0.75 }}>
          (We can wire this to your posts table next.)
        </p>
      </section>
    </main>
  );
}