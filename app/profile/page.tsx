"use client";
import RainbowHeartPlayer from "../components/RainbowHeartPlayer";
import { useEffect, useState, FormEvent } from "react";
import { supabase } from "../lib/supabaseClient"; // keep this path the same as your signup page

import NavBar from "../components/NavBar";
import { getMyGlowcodes, GlowCode } from "../lib/glowcodes";

export default function ProfilePage() {
  const uploadAvatar = async (file: File) => {
  console.log("Avatar selected:", file.name)
}
  const [profileImage, setProfileImage] = useState<string | null>(null)
const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [theme, setTheme] = useState("neon"); // neon | galaxy | gold – whatever you want
  const [status, setStatus] = useState("");
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const [glowCrew, setGlowCrew] = useState<GlowCode[]>([]);
  const [glowCrewNames, setGlowCrewNames] = useState<string[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [glowcodes, setGlowcodes] = useState<GlowCode[]>([]);
 const [glowcodesLoading, setGlowcodesLoading] = useState(true);
 const [glowcodesError, setGlowcodesError] = useState<string | null>(null);
 const [glowCss, setGlowCss] =useState<string | null>(null);
useEffect(() => {
    async function loadGlowcodes() {
      try {
        const data = await getMyGlowcodes();
        setGlowCrew(data);
      } catch (e: any) {
        setError(e.message ?? "Failed to load glowcodes");
      } finally {
        setLoadingProfile(false);
      }
    }

    loadGlowcodes();
  }, []);


  // Load current user + profile from Supabase
  useEffect(() => {
    const loadProfile = async () => {
      setLoadingProfile(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        setError(userError.message);
        setLoadingProfile(false);
        return;
      }

      if (!user) {
        setError("You need to be logged in to edit your GlowSpace.");
        setLoadingProfile(false);
        return;
      }

      setUserId(user.id);

      const { data, error: profileError } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .maybeSingle();

if (profileError) {
  setError(profileError.message);
  setLoadingProfile(false);
  return;
}

if (data) {
  setUsername(data.username ?? "");
  setDisplayName(data.display_name ?? "");
  setAvatarUrl(data.avatar_url ?? "");
  setAboutMe(data.about_me ?? "");
  setTheme(data.theme ?? "neon");
  setStatus(data.status ?? "");
  setBackgroundUrl(data.background_url ?? "");
  setMusicUrl(data.music_url ?? "");
  setGlowCrew(data.glow_crew ?? []);
  setGlowCss(data.glowcode_css ?? null);
}

setLoadingProfile(false);
    };

    loadProfile();
  }, []);

  // Save / upsert profile
  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data: authData, error: authErr } = await supabase.auth.getUser();
const authedUser = authData?.user;

if (authErr || !authedUser) {
  setError("You must be logged in to save your profile.");
  return;
}

const uid = authedUser.id;
    if (!userId) {
      setError("You must be logged in to save your profile.");
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

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
.select("id, music_url")
.single();
console.log("SAVED PROFILE:", saved);
if (saved?.music_url) {
  setMusicUrl(saved.music_url);
}
    if (saveError) {
      setError(saveError.message);
    } else {
      setMessage("Glow profile updated ✨");
    }

    setSaving(false);
  };

  const previewStyle = backgroundUrl
    ? {
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

  return (
  <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
    <div className="text-xs text-slate-400 mb-2">
      Glowcodes loaded: {glowCrew.length}
    </div>

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
            className={`relative rounded-3xl border border-pink-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 md:p-8 shadow-[0_0_40px_rgba(236,72,153,0.4)]`}
            style={previewStyle}
          >
            {/* background overlay for readability */}
            {backgroundUrl && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px]" />
            )}

            <div className="relative flex flex-col md:flex-row items-center gap-5">
              {/* Avatar */}
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full border-2 border-pink-400 bg-slate-900/70 overflow-hidden flex items-center justify-center text-xl font-bold">
                {(profileImage || avatarUrl)? (
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

              {/* Text info */}
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

            {/* Music badge */}
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
          </div>
          {/* Glow Crew strip */}
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
        </section>

        {/* RIGHT: Edit form */}
        <section>
          <h2 className="text-lg md:text-xl font-bold text-pink-300 mb-3">
            Customize your glow ✏️
          </h2>

{/* PROFILE IMAGES (FB STYLE) */}
<div className="mb-6 p-4 rounded-xl border border-purple-500/40 bg-purple-950/30">
  <h3 className="text-pink-300 font-semibold mb-4">
    Photos ✨
  </h3>

  {/* Profile picture row */}
  <div className="mb-6">
    <div className="flex items-center gap-4">
      <div className="h-16 w-16 rounded-full border border-pink-400 overflow-hidden bg-slate-950 flex items-center justify-center">
        {(profileImage || avatarUrl) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profileImage || avatarUrl}
            alt="Profile"
            className="h-full w-full object-contain p-2"
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
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const reader = new FileReader()
              reader.onload = () =>
                setProfileImage(reader.result as string)
              reader.readAsDataURL(file)
            }}
          />
        </label>

        {(profileImage || avatarUrl) && (
          <button
            type="button"
            className="ml-3 mt-2 text-xs text-slate-300 hover:text-white underline"
            onClick={() => setProfileImage(null)}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  </div>

  {/* Gallery grid */}
  <div>
    <p className="text-slate-200 font-medium mb-2">Photos</p>
    <p className="text-xs text-slate-400 mb-3">
      Add images to your Glow gallery (like Facebook).
    </p>

    <div className="grid grid-cols-4 gap-3">
      {/* Add tile */}
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
            if (!e.target.files) return
            Array.from(e.target.files).forEach((file) => {
              const reader = new FileReader()
              reader.onload = () =>
                setGalleryImages((prev) => [...prev, reader.result as string])
              reader.readAsDataURL(file)
            })
            e.currentTarget.value = ""
          }}
        />
      </label>

      {/* Thumbnails */}
      {galleryImages.map((img, i) => (
        <div
          key={i}
          className="relative rounded-lg overflow-hidden border border-white/10 bg-slate-950 aspect-square"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt={`Photo ${i}`}
            className="h-full w-full object-cover"
          />

          <button
            type="button"
            className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full w-7 h-7 flex items-center justify-center"
            onClick={() =>
              setGalleryImages((prev) =>
                prev.filter((_, idx) => idx !== i)
              )
            }
          >
            ✕
          </button>
        </div>
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

          <form
            onSubmit={handleSave}
            className="space-y-4 text-xs md:text-sm"
          >
            {/* Username */}
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

            {/* Display name */}
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

            {/* Status */}
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

            {/* About me */}
            <div>
              <label className="block text-slate-300 mb-1">About me</label>
              <textarea
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm min-h-[80px]"
                placeholder="Tell the universe who you are…"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
              />
            </div>
            {/* Avatar Upload */}
<div className="mb-4">
  <label className="block text-slate-300 mb-1">
    Profile picture (upload)
  </label>

  <input
    type="file"
    accept="image/*"
    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
    onChange={(e) => {
      const file = e.target.files?.[0]
      if (file) uploadAvatar(file)
    }}
  />

  <p className="text-xs text-slate-400 mt-1">
    Upload an image to use as your avatar
  </p>
</div>
            {/* Avatar URL */}
            <div>
              <label className="block text-slate-300 mb-1">
                Profile picture URL
              </label>
              <input
                type="url"
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                placeholder="https://your-image-link.com/avatar.png"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </div>

            {/* Background URL */}
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

            {/* Music URL */}
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
              <p className="mt-1 text-[10px] text-slate-500">
                Later we&apos;ll hook this into a floating MySpace-style
                player.
              </p>
            </div>

            {/* Theme (simple for now) */}
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
            {/* Profile Picture */}
<div className="mb-6">
  <label className="block text-slate-300 mb-2">
    Profile Picture
  </label>

  {profileImage && (
    <img
      src={profileImage}
      alt="Profile"
      className="w-32 h-32 rounded-full object-cover mb-3 border border-slate-600"
    />
  )}

  <input
    type="file"
    accept="image/*"
    className="text-sm text-slate-400"
    onChange={(e) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => setProfileImage(reader.result as string)
      reader.readAsDataURL(file)
    }}
  />
</div>
{/* Image Gallery */}
<div className="mb-6">
  <label className="block text-slate-300 mb-2">
    Gallery Images
  </label>

  <div className="flex flex-wrap gap-3 mb-3">
    {galleryImages.map((img, i) => (
      <img
        key={i}
        src={img}
        alt={`Gallery ${i}`}
        className="w-24 h-24 object-cover rounded-md border border-slate-700"
      />
    ))}
  </div>

  <input
    type="file"
    accept="image/*"
    multiple
    className="text-sm text-slate-400"
    onChange={(e) => {
      if (!e.target.files) return
      const files = Array.from(e.target.files)

      files.forEach((file) => {
        const reader = new FileReader()
        reader.onload = () =>
          setGalleryImages((prev) => [...prev, reader.result as string])
        reader.readAsDataURL(file)
      })
    }}
  />
</div>
{/* Glow Crew – top 4 friends */}
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
            {/* Save button */}
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
     <RainbowHeartPlayer key={musicUrl || "no-music"} src={musicUrl || ""} />
    </main>
  );
}