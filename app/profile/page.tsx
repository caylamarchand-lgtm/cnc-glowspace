"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "../lib/supabaseClient";
import { getMyGlowcodes, GlowCode } from "../lib/glowcodes";

import BackgroundStarsHearts from "../components/BackgroundStarsHearts";
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
  if (!url) return "";

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

type BackgroundEffect =
  | "stars_hearts"
  | "bubbles"
  | "neon_grid"
  | "snow"
  | "ember"
  | "fog"
  | null;

export default function ProfilePage() {
  // ---------- State ----------
  const GLOWSPACE_BG = "/glowspace-logo.png";
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

  // 🎨 theme system (profile_themes)
  const [themeCss, setThemeCss] = useState<string>("");
  const [themePreviewUrl, setThemePreviewUrl] = useState<string>("");

  // glowcodes
  const [glowCrew, setGlowCrew] = useState<GlowCode[]>([]);
  const [glowCrewNames, setGlowCrewNames] = useState<string[]>([]);

  // profile_customization row
  const [customization, setCustomization] = useState<any>(null);

  // ui
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeTheme = customization?.theme ?? theme;
  const activeBackgroundEffect: BackgroundEffect =
    (customization?.background_effect as BackgroundEffect) ?? null;

  const panelClass =
    "rounded-2xl border border-pink-500/40 bg-[#0b1020]/95 shadow-[0_0_40px_rgba(255,180,220,0.25)]";

  // ---------- Effects ----------
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

  useEffect(() => {
    const loadProfile = async () => {
      setLoadingProfile(true);
      setError(null);

      try {
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

        // 🎨 Load selected theme for this user (profiles.theme_id -> profile_themes)
        const { data: themeRef, error: themeRefErr } = await supabase
          .from("profiles")
          .select("theme_id")
          .eq("id", authUser.id)
          .single();

        if (themeRefErr) console.log("theme ref error:", themeRefErr);

        if (themeRef?.theme_id) {
          const { data: themeRow, error: themeErr } = await supabase
            .from("profile_themes")
            .select("css, preview_url")
            .eq("id", themeRef.theme_id)
            .single();

          if (themeErr) console.log("theme load error:", themeErr);

          setThemeCss(themeRow?.css || "");
          setThemePreviewUrl(themeRow?.preview_url || "");
        } else {
          setThemeCss("");
          setThemePreviewUrl("");
        }

        // ✅ ensure customization row exists
        const customizationRow = await ensureProfileCustomization(authUser.id);
        setCustomization(customizationRow);

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
          setCustomization((prev: any) => ({
  ...prev,
  background_url: profileRow.background_url ?? null,
  effect: profileRow.effect ?? null,
  music_url: profileRow.music_url ?? null,
  custom_css: profileRow.custom_css ?? null,
  theme_id: profileRow.theme_id ?? null,
}));
        }
      } catch (e: any) {
        setError(e.message ?? "Failed to load profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  // ---------- Update background effect ----------
  const setBackgroundEffect = async (value: BackgroundEffect) => {
    if (!userId) return;

    // instant UI update
    setCustomization((prev: any) => ({
      ...(prev || {}),
      background_effect: value,
    }));

    // persist
    const { error: upErr } = await supabase
      .from("profile_customization")
      .update({ background_effect: value })
      .eq("user_id", userId);

    if (upErr) setError(upErr.message);
  };

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

const { error: upErr } = await supabase
  .from("profiles")
  .update({
    background_url: customization.background_url ?? null,
    effect: customization.effect ?? null,
    music_url: customization.music_url ?? null,
    custom_css: customization.custom_css ?? null,
    theme_id: customization.theme_id ?? null,
  })
  .eq("id", authedUser.id);

if (upErr) throw upErr;

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
  // Your custom background URL (still works)
  const previewStyle = backgroundUrl
    ? {
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

// 🌈 Theme preview background (so you can SEE the theme instantly)
const themeBgStyle = {
  backgroundImage: `url(${GLOWSPACE_BG})`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundSize: "contain",
  backgroundAttachment: "fixed",
  backgroundColor: "#020617", // dark fallback so text pops
};

const resolvedBackground =
  backgroundUrl ||
  themeBgStyle?.backgroundImage?.replace(/^url\(|\)$/g, "") ||
  "/glowspace-logo.png";

const mainBgStyle: React.CSSProperties = {
  backgroundImage: `url(${resolvedBackground})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
};



  const mainClassName =
    "min-h-screen relative overflow-hidden text-slate-100 px-4 py-10";

  const renderBackground = () => {
    switch (activeBackgroundEffect) {
      case "stars_hearts":
        return <BackgroundStarsHearts />;
      case "bubbles":
        return <BackgroundBubbles />;
      case "neon_grid":
        return <BackgroundNeonGrid />;
      case "snow":
        return <BackgroundSnow />;
      case "ember":
        return <BackgroundEmber />;
      case "fog":
        return <BackgroundFog />;
      default:
        return null;
    }
  };

  // ---------- UI ----------
  return (
<main
  className={mainClassName}
  style={{
    backgroundImage: `url(${GLOWSPACE_BG})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    backgroundColor: "#020617",
  }}
  >



      {/* BACKGROUND LAYER */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-95">
        {renderBackground()}
      </div>
<div className="text-xs text-slate-300/70 mb-2">
  themePreviewUrl: {themePreviewUrl || "EMPTY"}
</div>
      {/* CONTENT LAYER */}
      <div className="relative z-10">
        <div className="text-xs text-slate-300/70 mb-2">
          Glowcodes loaded: {glowCrew.length}
        </div>

        {/* ✅ Debug: confirms theme actually loaded */}
<div className="text-xs text-slate-300/70 mb-2">
  Theme loaded:
  {themeCss ?  `${themeCss.length} chars` : " none"}
 {" — "}
  {themePreviewUrl ? "preview available" : "no preview"}
</div>

        {customization && (
          <div className="text-xs opacity-70 mb-4">
            Customization theme: {activeTheme ?? "none"}
          </div>
        )}

        <div className="mx-auto max-w-6xl grid gap-10 md:grid-cols-2">
          {/* LEFT: Live preview */}
          <section>
            <h1 className="text-2xl md:text-3xl font-extrabold text-pink-300 mb-2 drop-shadow-[0_0_12px_rgba(236,72,153,0.5)]">
              Your Glow Profile ✨
            </h1>
            <p className="text-xs md:text-sm text-slate-300/70 mb-5">
              Live preview of how your GlowSpace card will look.
            </p>

            {/* ✅ PREVIEW CARD */}
            <div
              className="
                relative z-10 overflow-hidden
                rounded-3xl
                border border-pink-500/40
                bg-[#0b1020]/95
                shadow-[0_0_40px_rgba(255,180,220,0.35)]
              "
              style={previewStyle}
            >
              {/* inner glow */}
              <div
                className="
                  absolute inset-0 rounded-3xl pointer-events-none
                  shadow-[inset_0_0_30px_rgba(255,180,220,0.25)]
                "
              />

              <div className="relative p-6">
                <div className="relative flex flex-col md:flex-row items-center gap-5">
                  <div className="h-20 w-20 md:h-24 md:w-24 rounded-full border-2 border-pink-400 bg-slate-900/50 overflow-hidden flex items-center justify-center text-xl font-bold">
                    {profileImage || avatarUrl ? (
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
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300/70">
                      Glow Status
                    </p>
                    <p className="text-lg md:text-xl font-bold text-pink-200">
                      {status || "Level 1 — Just joined the universe."}
                    </p>

                    <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-slate-300/60">
                      Display name
                    </p>
                    <p className="text-xl md:text-2xl font-extrabold text-pink-100 drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]">
                      {displayName || username || "CNC Glow Legend"}
                    </p>

                    <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-slate-300/60">
                      About me
                    </p>
                    <p className="text-xs md:text-sm text-slate-100/90 max-w-md md:max-w-none mx-auto">
                      {aboutMe ||
                        "This is my Glow profile. Soon this space will be fully customizable like old-school MySpace."}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between text-[10px] text-slate-200/80">
                  <span className="px-2 py-1 rounded-full bg-slate-900/40 border border-pink-500/30">
                    Theme: {theme || "neon-club"}
                  </span>
                  {musicUrl && (
                    <span className="px-2 py-1 rounded-full bg-slate-900/40 border border-emerald-400/30">
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
                        className="px-2 py-1 text-xs rounded-md bg-pink-600/25 border border-pink-500/40 text-pink-100 hover:bg-pink-600/40"
                        onClick={() => console.log("clicked glowcode:", code.id)}
                      >
                        @{code.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* RIGHT: Edit form */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-pink-200 mb-3 drop-shadow-[0_0_10px_rgba(236,72,153,0.45)]">
              Customize your glow ✏️
            </h2>

            {/* 🌟 Background Effects */}
            <div className={`mt-4 p-4 ${panelClass}`}>
              <p className="text-sm font-semibold text-slate-100/90 mb-1">
                Background effects
              </p>
              <p className="text-xs text-slate-300/70 mb-3">
                Pick one. (This fixes the “multiple overlays” problem.)
              </p>

              {[
                { id: "stars_hearts", label: "Stars + Hearts ✨💖" },
                { id: "fog", label: "Smoke / Fog 🌫️" },
                { id: "ember", label: "Ember / Fire 🔥" },
                { id: "bubbles", label: "Bubbles 🫧" },
                { id: "neon_grid", label: "Neon Grid 🟩" },
                { id: "snow", label: "Snow ❄️" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="bg_effect"
                    checked={activeBackgroundEffect === (opt.id as any)}
                    onChange={() => setBackgroundEffect(opt.id as any)}
                    className="w-4 h-4 accent-pink-400"
                  />
                  <span className="text-sm opacity-90">{opt.label}</span>
                </label>
              ))}

              <button
                type="button"
                onClick={() => setBackgroundEffect(null)}
                className="mt-2 text-xs underline text-slate-200/80 hover:text-white"
              >
                Turn off background effect
              </button>
            </div>

            {/* ✅ Photos block */}
            <div className="relative mt-6 mb-6 p-4 rounded-xl border border-white/10 bg-[#0b1020]/95 shadow-[0_0_40px_rgba(255,180,220,0.18)]">
              <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_0_30px_rgba(255,180,220,0.20)]" />
              <h3 className="text-pink-200 font-semibold mb-4">Photos ✨</h3>

              {/* Profile picture row */}
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full border border-pink-400 overflow-hidden bg-slate-950/40 flex items-center justify-center">
                    {profileImage || avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profileImage || avatarUrl}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-slate-200 font-bold">
                        {(displayName || username || "G")[0]}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-slate-100 font-medium">Profile picture</p>
                    <p className="text-xs text-slate-300/70">
                      This shows in your avatar circle.
                    </p>

                    <label className="inline-flex mt-2 cursor-pointer items-center gap-2 rounded-md bg-pink-500/20 px-3 py-2 text-sm text-pink-100 hover:bg-pink-500/30">
                      Change photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const reader = new FileReader();
                          reader.onload = () => {
                            const base64 = reader.result as string;
                            setProfileImage(base64);
                            setAvatarUrl(base64);
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>

                    {(profileImage || avatarUrl) && (
                      <button
                        type="button"
                        className="ml-3 mt-2 text-xs text-slate-200/80 hover:text-white underline"
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
                <p className="text-slate-100 font-medium mb-2">Photos</p>
                <p className="text-xs text-slate-300/70 mb-3">
                  Add images to your Glow gallery (like Facebook).
                </p>

                <div className="grid grid-cols-4 gap-3">
                  <label className="cursor-pointer rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center aspect-square">
                    <div className="text-center">
                      <div className="text-2xl text-pink-200">+</div>
                      <div className="text-xs text-slate-200/80">Add</div>
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
              <p className="text-xs text-slate-300/70 mb-3">
                Loading your GlowSpace…
              </p>
            )}

            {error && (
              <p className="mb-3 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            {message && (
              <p className="mb-3 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-md px-3 py-2">
                {message}
              </p>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs md:text-sm">
              <div>
                <label className="block text-slate-200/80 mb-1">Username</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-white/10 bg-slate-950/30 backdrop-blur px-3 py-2 text-sm"
                  placeholder="glow_babe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-200/80 mb-1">
                  Display name
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-white/10 bg-slate-950/30 backdrop-blur px-3 py-2 text-sm"
                  placeholder="CNC Glow Queen"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-200/80 mb-1">
                  Glow status
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-white/10 bg-slate-950/30 backdrop-blur px-3 py-2 text-sm"
                  placeholder="Level 1 – Just joined the universe."
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-200/80 mb-1">About me</label>
                <textarea
                  className="w-full rounded-md border border-white/10 bg-slate-950/30 backdrop-blur px-3 py-2 text-sm min-h-[80px]"
                  placeholder="Tell the universe who you are…"
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-200/80 mb-1">
                  Background image URL
                </label>
                <input
                  type="url"
                  className="w-full rounded-md border border-white/10 bg-slate-950/30 backdrop-blur px-3 py-2 text-sm"
                  placeholder="https://your-image-link.com/background.jpg"
                  value={backgroundUrl}
                  onChange={(e) => setBackgroundUrl(e.target.value)}
                />
                <p className="mt-1 text-[10px] text-slate-300/60">
                  This image will show behind your Glow card preview.
                </p>
              </div>

              <div>
                <label className="block text-slate-200/80 mb-1">
                  Music URL (YouTube / MP3)
                </label>
                <input
                  type="url"
                  className="w-full rounded-md border border-white/10 bg-slate-950/30 backdrop-blur px-3 py-2 text-sm"
                  placeholder="https://youtube.com/watch?v=your-song"
                  value={musicUrl}
                  onChange={(e) => setMusicUrl(e.currentTarget.value)}
                />
              </div>

              <div>
                <label className="block text-slate-200/80 mb-1">
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
                          : "border-white/10 bg-slate-950/20"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-slate-200/80 mb-1">
                  Glow Crew (up to 4 usernames)
                </label>

                <p className="text-xs text-slate-300/60 mb-2">
                  Type up to 4 usernames separated by commas.
                </p>

                <input
                  type="text"
                  className="w-full rounded-md border border-white/10 bg-slate-950/30 backdrop-blur px-3 py-2 text-sm"
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

        {/* 🎵 Music Player */}
        {musicUrl ? (
          <iframe
            className="fixed bottom-6 right-6 z-50 h-[160px] w-[280px] rounded-xl border border-white/10 bg-black/40 backdrop-blur"
            src={toYouTubeEmbed(musicUrl)}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : null}
      </div>
    </main>
  );
}