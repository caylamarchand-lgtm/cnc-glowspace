"use client";

import { useEffect, useState, FormEvent } from "react";
import NavBar from "../components/NavBar";
import BackgroundStarsHearts from "../components/BackgroundStarsHearts";
import { supabase } from "../lib/supabaseClient";
import { getMyGlowcodes, GlowCode } from "../lib/glowcodes";
import BackgroundNeonGrid from "../components/BackgroundNeonGrid";
import BackgroundBubbles from "../components/BackgroundBubbles";
import BackgroundSnow from "../components/BackgroundSnow";
import BackgroundEmber from "../components/BackgroundEmber";
import BackgroundFog from "../components/BackgroundFog";
// ✅ Ensures 1 row exists per user in profile_customization
async function ensureProfileCustomization(userId: string) {
  const { data, error } = await supabase
    .from("profile_customization")
    .upsert({ user_id: userId }, { onConflict: "user_id" })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

function toYouTubeEmbed(input: string) {
  const url = (input || "").trim();

  if (url.includes("youtube.com/embed/")) return url;

  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split(/[?&]/)[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  if (url.includes("watch?v=")) {
    const id = url.split("watch?v=")[1].split(/[?&]/)[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  if (url.includes("/shorts/")) {
    const id = url.split("/shorts/")[1].split(/[?&]/)[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  return url;
}

export default function ProfilePage() {
  // ---------- State ----------
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const [userId, setUserId] = useState<string | null>(null);

  // profiles table fields
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [theme, setTheme] = useState("neon");
  const [status, setStatus] = useState("");
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const [glowCss, setGlowCss] = useState<string | null>(null);
const [customization, setCustomization] = useState<any>(null);

const activeTheme = customization?.theme ?? theme;

  // glowcodes
  const [glowCrew, setGlowCrew] = useState<GlowCode[]>([]);
  const [glowCrewNames, setGlowCrewNames] = useState<string[]>([]);

  // profile_customization row
  

  // ui
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ---------- Effects ----------

  // ✅ load glowcodes
  useEffect(() => {
    async function loadGlowcodes() {
      try {
        const data = await getMyGlowcodes();
        setGlowCrew(data);
      } catch (e: any) {
        setError(e.message ?? "Failed to load glowcodes");
      }
    }
    loadGlowcodes();
  }, []);

  // ✅ load user + ensure customization row + load profiles row
  useEffect(() => {
    const loadProfile = async () => {
      setLoadingProfile(true);
      setError(null);

      try {
        // ✅ get user ONCE
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!authUser) {
          setError("You need to be logged in to edit your GlowSpace.");
          setLoadingProfile(false);
          return;
        }

        setUserId(authUser.id);

        // ✅ ensure profile_customization row exists
        const customizationRow = await ensureProfileCustomization(authUser.id);
        setCustomization(customizationRow);
        console.log("customization row:", customizationRow);

        // ✅ load profiles row
        const { data: profileRow, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (profileRow) {
          setUsername(profileRow.username ?? "");
          setDisplayName(profileRow.display_name ?? "");
          setAvatarUrl(profileRow.avatar_url ?? "");
          setAboutMe(profileRow.about_me ?? "");
          setTheme(profileRow.theme ?? "neon");
          setStatus(profileRow.status ?? "");
          setBackgroundUrl(profileRow.background_url ?? "");
          setMusicUrl(profileRow.music_url ?? "");
          setGlowCss(profileRow.glowcode_css ?? null);
          setGlowCrew(profileRow.glow_crew ?? []);
        }
      } catch (e: any) {
        setError(e.message ?? "Failed to load profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  // ---------- Save ----------
  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const { data: authData, error: authErr } = await supabase.auth.getUser();
      const authedUser = authData?.user;

      if (authErr || !authedUser) {
        setError("You must be logged in to save your profile.");
        setSaving(false);
        return;
      }

      const uid = authedUser.id;

      const { data: saved, error: saveError } = await supabase
        .from("profiles")
        .upsert({
          id: uid,
          username,
          display_name: displayName,
          avatar_url: avatarUrl,
          about_me: aboutMe,
          theme,
          status,
          background_url: backgroundUrl,
          music_url: musicUrl,
          glow_crew: glowCrew,
        })
        .select("id, music_url, avatar_url")
        .single();

      if (saveError) throw saveError;

      console.log("SAVED PROFILE:", saved);

      if (saved?.music_url) setMusicUrl(saved.music_url);
      if (saved?.avatar_url) setAvatarUrl(saved.avatar_url);

      setMessage("Glow profile updated ✨");
    } catch (e: any) {
      setError(e.message ?? "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // ---------- Styling helpers ----------
  const previewStyle = backgroundUrl
  ? {
      backgroundImage: `url(${backgroundUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }
  : undefined;

  // ✅ This is the safe way to theme the page background
 const mainClassName =
  "min-h-screen relative overflow-hidden text-slate-100 px-4 py-10";


return (
  <main className={mainClassName}>
    {customization?.background_effect === "stars_hearts" && <BackgroundStarsHearts />}
{customization?.background_effect === "bubbles" && <BackgroundBubbles />}
{customization?.background_effect === "neon_grid" && <BackgroundNeonGrid />}
{customization?.background_effect === "snow" && <BackgroundSnow />}
{customization?.background_effect === "ember" && <BackgroundEmber />}
{customization?.background_effect === "fog" && <BackgroundFog />}

)
    {/* ⭐💗 Stars + Hearts Background */}
<div
  aria-hidden
  className="pointer-events-none absolute inset-0 z-0"
  style={{
    backgroundImage: `
      radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,.9) 99%, transparent 100%),
      radial-gradient(1px 1px at 30% 80%, rgba(255,255,255,.6) 99%, transparent 100%),
      radial-gradient(1px 1px at 70% 30%, rgba(255,255,255,.7) 99%, transparent 100%),
      radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,.5) 99%, transparent 100%),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cg fill='none' stroke='%23ff4fd8' stroke-opacity='.35' stroke-width='2'%3E%3Cpath d='M110 78c-11-19-44-12-44 13 0 30 44 48 44 48s44-18 44-48c0-25-33-32-44-13z'/%3E%3C/g%3E%3C/svg%3E")
    `,
    backgroundRepeat: "repeat",
    backgroundSize: "260px 260px, 260px 260px, 260px 260px, 260px 260px, 240px 240px",
  }}
/>
<div className="relative z-10">
</div>

    
      

      <div className="text-xs text-slate-400 mb-2">
        Glowcodes loaded: {glowCrew.length}
      </div>

      {customization && (
        <div className="text-xs opacity-70 mb-4">
          Customization theme: {customization.theme ?? "none"}
        </div>
      )}

      <div className="mx-auto max-w-6xl grid gap-10 md:grid-cols-2">
        {/* LEFT: Live preview */}
        <section>
          <h1 className="text-2xl md:text-3xl font-extrabold text-pink-400 mb-2">
            Your Glow Profile ✨
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mb-5">
            Live preview of how your GlowSpace card will look.
          </p>

          <div
            className="relative rounded-3xl border border-pink-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 md:p-8 shadow-[0_0_40px_rgba(236,72,153,0.4)]"
            style={previewStyle} > 
          
            {backgroundUrl && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px]" />
            )}

            <div className="relative flex flex-col md:flex-row items-center gap-5">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full border-2 border-pink-400 bg-slate-900/70 overflow-hidden flex items-center justify-center text-xl font-bold">
                {(profileImage || avatarUrl) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profileImage || avatarUrl}
                    alt="Glow avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{(displayName || username || "✨")[0]}</span>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  Glow Status
                </p>
                <p className="text-lg md:text-xl font-bold text-pink-300">
                  {status || "Level 1 — Just joined the universe."}
                </p>

                <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Display name
                </p>
                <p className="text-xl md:text-2xl font-extrabold text-pink-200 drop-shadow-[0_0_8px_rgba(236,72,153,0.7)]">
                  {displayName || username || "CNC Glow Legend"}
                </p>

                <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  About me
                </p>
                <p className="text-xs md:text-sm text-slate-200 max-w-md md:max-w-none mx-auto">
                  {aboutMe ||
                    "This is my Glow profile. Soon this space will be fully customizable like old-school MySpace."}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between text-[10px] text-slate-300">
              <span className="px-2 py-1 rounded-full bg-slate-900/70 border border-pink-500/40">
                Theme: {theme || "neon-club"}
              </span>
              {musicUrl && (
                <span className="px-2 py-1 rounded-full bg-slate-900/70 border border-emerald-400/40">
                  🎵 Music linked
                </span>
              )}
            </div>

            {/* Glow Crew strip */}
            {glowCrew.length > 0 && (
              <div className="absolute bottom-2 left-2 right-2 flex gap-2 justify-center">
                {glowCrew.map((code) => (
                  <button
                    key={code.id}
                    type="button"
                    className="px-2 py-1 text-xs rounded-md bg-pink-600/30 border border-pink-500 text-pink-200 hover:bg-pink-600/50"
                    onClick={() => console.log("clicked glowcode:", code.id)}
                  >
                    @{code.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* RIGHT: Edit form */}
        <section>
          <h2 className="text-lg md:text-xl font-bold text-pink-300 mb-3">
            Customize your glow ✏️
          </h2>
{/* 🌟 Background Effects */}
<div className="mt-6 space-y-2">
  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="checkbox"
      checked={customization?.background_effect === "stars_hearts"}
      onChange={async (e) => {
  if (!userId) return;

  const value = e.target.checked ? "stars_hearts" : null;

  setCustomization((prev: any) => ({
    ...(prev || {}),
    background_effect: value,
  }));

{/* 🫧 Bubbles */}
<label className="flex items-center gap-3 cursor-pointer">
  <input
    type="checkbox"
    checked={customization?.background_effect === "bubbles"}
    onChange={async (e) => {
      if (!userId) return;

      const value = e.target.checked ? "bubbles" : null;

      setCustomization((prev: any) => ({
        ...(prev || {}),
        background_effect: value,
      }));

      await supabase
        .from("profile_customization")
        .update({ background_effect: value })
        .eq("user_id", userId);
    }}
    className="w-4 h-4 accent-pink-400"
  />
  <span className="text-sm opacity-80">Bubbles 🫧</span>
</label>

{/* 🟩 Neon Grid */}
<label className="flex items-center gap-3 cursor-pointer">
  <input
    type="checkbox"
    checked={customization?.background_effect === "neon_grid"}
    onChange={async (e) => {
      if (!userId) return;

      const value = e.target.checked ? "neon_grid" : null;

      setCustomization((prev: any) => ({
        ...(prev || {}),
        background_effect: value,
      }));

      await supabase
        .from("profile_customization")
        .update({ background_effect: value })
        .eq("user_id", userId);
    }}
    className="w-4 h-4 accent-pink-400"
  />
  <span className="text-sm opacity-80">Neon Grid 🟩</span>
</label>
}}
      className="w-4 h-4 accent-pink-400"
    />

    <span className="text-sm opacity-80">
      Stars + Hearts background ✨💖
    </span>
  </label>

<label className="flex items-center gap-3 cursor-pointer">
  <input
    type="checkbox"
    checked={customization?.background_effect === "ember"}
    onChange={async (e) => {
      if (!userId) return;

      const value = e.target.checked ? "ember" : null;

      setCustomization((prev: any) => ({
        ...(prev || {}),
        background_effect: value,
      }));

      await supabase
        .from("profile_customization")
        .update({ background_effect: value })
        .eq("user_id", userId);
    }}
    className="w-4 h-4 accent-pink-400"
  />
  <span className="text-sm opacity-80">Ember / Fire 🔥</span>
</label>

<label className="flex items-center gap-3 cursor-pointer">
  <input
    type="checkbox"
    checked={customization?.background_effect === "fog"}
    onChange={async (e) => {
      if (!userId) return;

      const value = e.target.checked ? "fog" : null;

      setCustomization((prev: any) => ({
        ...(prev || {}),
        background_effect: value,
      }));

      await supabase
        .from("profile_customization")
        .update({ background_effect: value })
        .eq("user_id", userId);
    }}
    className="w-4 h-4 accent-pink-400"
  />
  <span className="text-sm opacity-80">Smoke / Fog 🌫️</span>
</label>



</div>
          {/* ✅ ONE Photos block (no duplicates) */}
          <div className="mb-6 p-4 rounded-xl border border-purple-500/40 bg-purple-950/30">
            <h3 className="text-pink-300 font-semibold mb-4">Photos ✨</h3>

            {/* Profile picture row */}
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full border border-pink-400 overflow-hidden bg-slate-950 flex items-center justify-center">
                  {(profileImage || avatarUrl) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profileImage || avatarUrl}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-slate-300 font-bold">
                      {(displayName || username || "G")[0]}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-slate-200 font-medium">Profile picture</p>
                  <p className="text-xs text-slate-400">
                    This shows in your avatar circle.
                  </p>

                  <label className="inline-flex mt-2 cursor-pointer items-center gap-2 rounded-md bg-pink-500/20 px-3 py-2 text-sm text-pink-200 hover:bg-pink-500/30">
                    Change photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onload = () => {
                          const base64 = reader.result as string;
                          setProfileImage(base64);
                          setAvatarUrl(base64); // ✅ shows immediately + will save to profiles on Save
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>

                  {(profileImage || avatarUrl) && (
                    <button
                      type="button"
                      className="ml-3 mt-2 text-xs text-slate-300 hover:text-white underline"
                      onClick={() => {
                        setProfileImage(null);
                        setAvatarUrl("");
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div>
              <p className="text-slate-200 font-medium mb-2">Photos</p>
              <p className="text-xs text-slate-400 mb-3">
                Add images to your Glow gallery (like Facebook).
              </p>

              <div className="grid grid-cols-4 gap-3">
                <label className="cursor-pointer rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center aspect-square">
                  <div className="text-center">
                    <div className="text-2xl text-pink-200">+</div>
                    <div className="text-xs text-slate-300">Add</div>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (!e.target.files) return;
                      Array.from(e.target.files).forEach((file) => {
                        const reader = new FileReader();
                        reader.onload = () =>
                          setGalleryImages((prev) => [
                            ...prev,
                            reader.result as string,
                          ]);
                        reader.readAsDataURL(file);
                      });
                      e.currentTarget.value = "";
                    }}
                  />
                </label>

                {galleryImages.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={img}
                    alt={`Gallery ${i}`}
                    className="rounded-lg border border-white/10 object-cover aspect-square"
                  />
                ))}
              </div>
            </div>
          </div>

          {loadingProfile && (
            <p className="text-xs text-slate-400 mb-3">
              Loading your GlowSpace…
            </p>
          )}

          {error && (
            <p className="mb-3 text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          {message && (
            <p className="mb-3 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/40 rounded-md px-3 py-2">
              {message}
            </p>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs md:text-sm">
            <div>
              <label className="block text-slate-300 mb-1">Username</label>
              <input
                type="text"
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                placeholder="glow_babe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Display name</label>
              <input
                type="text"
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                placeholder="CNC Glow Queen"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Glow status</label>
              <input
                type="text"
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                placeholder="Level 1 – Just joined the universe."
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">About me</label>
              <textarea
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm min-h-[80px]"
                placeholder="Tell the universe who you are…"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">
                Background image URL
              </label>
              <input
                type="url"
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                placeholder="https://your-image-link.com/background.jpg"
                value={backgroundUrl}
                onChange={(e) => setBackgroundUrl(e.target.value)}
              />
              <p className="mt-1 text-[10px] text-slate-500">
                This image will show behind your Glow card preview.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">
                Music URL (YouTube / MP3)
              </label>
              <input
                type="url"
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                placeholder="https://youtube.com/watch?v=your-song"
                value={musicUrl}
                onChange={(e) => setMusicUrl(e.currentTarget.value)}
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">
                Theme (for future styling)
              </label>
              <div className="flex gap-2 flex-wrap">
                {["neon", "galaxy", "gold"].map((value) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setTheme(value)}
                    className={`px-3 py-1 rounded-full border text-[11px] ${
                      theme === value
                        ? "border-pink-400 bg-pink-500/20"
                        : "border-slate-600 bg-slate-900"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-slate-300 mb-1">
                Glow Crew (up to 4 usernames)
              </label>

              <p className="text-xs text-slate-500 mb-2">
                Type up to 4 usernames separated by commas.
              </p>

              <input
                type="text"
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                placeholder="friend1, friend2, friend3, friend4"
                value={glowCrewNames.join(", ")}
                onChange={(e) =>
                  setGlowCrewNames(
                    e.target.value
                      .split(",")
                      .map((x) => x.trim())
                      .filter((x) => x !== "")
                      .slice(0, 4)
                  )
                }
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-2.5 text-sm font-semibold shadow-lg shadow-pink-500/40 disabled:opacity-60"
            >
              {saving ? "Saving your glow…" : "Save profile"}
            </button>
          </form>
        </section>
      </div>
<div></div>
    {/* 🎵 Music Player */}
{musicUrl ? (
  <iframe
    className="fixed bottom-6 right-6 z-50 h-[160px] w-[280px] rounded-xl border border-white/10 bg-black/40 backdrop-blur"
    src={toYouTubeEmbed(musicUrl)}
    allow="autoplay; encrypted-media; picture-in-picture"
    allowFullScreen
  />
) : null}

   
    </main>
  );
}