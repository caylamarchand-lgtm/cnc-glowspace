import { createClient } from "@supabase/supabase-js";
import BackgroundStarsHearts from "../../components/BackgroundStarsHearts";
import BackgroundSnow from "../../components/BackgroundSnow";
import BackgroundNeonGrid from "../../components/BackgroundNeonGrid";
import BackgroundBubbles from "../../components/BackgroundBubbles";
import BackgroundFog from "../../components/BackgroundFog";
import BackgroundEmber from "../../components/BackgroundEmber";


type Props = {
  params: Promise<{
     username: string;
  }>;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Profile = {
  id: string;
  username: string | null;
  user_id: string | null;
  username_lower: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  about_me: string | null;
  vibe: string | null;
};

type Customization = {
  user_id: string;
  background_url: string | null;
  music_url: string | null;
  theme: string | null;
  top8: string[] | null;
};

type Photo = {
  id: string;
  user_id: string;
  url: string;
  created_at: string;
};

function normalizeUsername(input: string) {
  return decodeURIComponent(input).trim().replace(/^@/, "").toLowerCase();
}

function safeEmbed(url: string) {
  const u = url.trim();

  if (u.includes("youtube.com/watch?v=")) {
    const id = u.split("watch?v=")[1]?.split("&")[0];
    if (id) return `https://www.youtube.com/embed/${id}`;
  }
  if (u.includes("youtu.be/")) {
    const id = u.split("youtu.be/")[1]?.split("?")[0];
    if (id) return `https://www.youtube.com/embed/${id}`;
  }

  if (u.includes("open.spotify.com/")) {
    return u.replace("open.spotify.com/", "open.spotify.com/embed/");
  }

  return "";
}

export default async function ProfileByUsernamePage({ params }: Props) {
  const { username: rawUsername } = await params;
  const username = normalizeUsername(rawUsername);


  // ✅ IMPORTANT: your table has username_lower (see your screenshot)
  // Some rows might have NULL username_lower. If so, we fallback to username ilike.
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
   .select("id, username, username_lower, display_name, avatar_url, bio, about_me, vibe")
    .or(`username_lower.eq.${username},username.ilike.${username}`)
    .maybeSingle<Profile>();

  if (profileErr || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/80">
        Profile not found.
        <div className="mt-2 text-white/50 text-sm">
          url param: {username}
          <br />
          details: {profileErr?.message || "No profile row matched."}
        </div>
      </div>
    );
  }

  // ⚠️ You said earlier you might NOT have profiles.user_id in your table.
  // So we do customization lookup by profile.id FIRST, then by user_id only if you add it later.
  const { data: customization } = await supabase
    .from("profile_customization")
    .select("user_id, background_url, music_url, theme, top8")
    .eq("user_id", profile.id)
    .maybeSingle<Customization>();

  // ✅ Photos must match the same key your photos table uses.
  // Most likely profile_photos.user_id equals profiles.id (not auth user id)
  const { data: photos } = await supabase
    .from("profile_photos")
    .select("id, user_id, url, created_at")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(24)
    .returns<Photo[]>();

    const debugTheme = customization?.theme;
  const theme = (customization?.theme || "").toLowerCase().trim();
  const music = customization?.music_url || "";
  const embed = music ? safeEmbed(music) : "";

  return (
    <div
      className="min-h-screen px-4 py-10 text-white">
<div className="text-xs text-white/60 mb-2">
      debug theme: {String(debugTheme)} | normalized: {theme}
    </div>


{/* ✅ Profile background (shows the OTHER user's chosen effect) */}
<div className="fixed inset-0 -z-10 pointer-events-none">
  {theme === "stars_hearts" && <BackgroundStarsHearts />}
  {theme === "snow" && <BackgroundSnow />}
 {(theme === "neon" || theme === "neon_grid") && <BackgroundNeonGrid />}
  {theme === "bubbles" && <BackgroundBubbles />}
  {theme === "fog" && <BackgroundFog />}
  {theme === "ember" && <BackgroundEmber />}
</div>


      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* HEADER CARD */}
          <div className="rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-6 flex gap-4 items-center">
            <div className="h-16 w-16 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-white/50 text-sm">no pic</div>
              )}
            </div>

            <div className="flex-1">
              <div className="text-2xl font-bold">
                {profile.display_name || profile.username || "Unknown"}
              </div>
              <div className="text-white/70">@{profile.username || username}</div>

              {(profile.vibe || profile.bio || profile.about_me) && (
                <div className="mt-3 space-y-1 text-white/85">
                  {profile.vibe && (
                    <div>
                      ✨ <span className="text-white/90">{profile.vibe}</span>
                    </div>
                  )}
                  {profile.bio && <div>{profile.bio}</div>}
                  {profile.about_me && <div>{profile.about_me}</div>}
                </div>
              )}
            </div>
          </div>

          {/* MUSIC */}
          <div className="rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-6">
            <div className="font-semibold mb-3">🎵 Music</div>

            {embed ? (
              <iframe
                src={embed}
                className="w-full h-64 rounded-xl border border-white/10"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : music ? (
              <div className="text-white/80">
                Music link saved, but embed type isn’t supported yet:
                <div className="mt-2 underline break-all">{music}</div>
              </div>
            ) : (
              <div className="text-white/60">No music set.</div>
            )}
          </div>

          {/* PHOTOS */}
          <div className="rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-6">
            <div className="font-semibold mb-3">📸 Photos</div>

            {photos && photos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {photos.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl overflow-hidden border border-white/10 bg-white/5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.url}
                      alt="photo"
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white/60">No photos yet.</div>
            )}
          </div>

          {/* TOP 8 */}
          <div className="rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-6">
            <div className="font-semibold mb-3">⭐ Top 8</div>

            {customization?.top8 && customization.top8.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {customization.top8.slice(0, 8).map((x: string, idx: number) => (
                  <div
                    key={`${x}-${idx}`}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 text-white text-center"
                  >
                    {x}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white/60">No Top 8 set yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}