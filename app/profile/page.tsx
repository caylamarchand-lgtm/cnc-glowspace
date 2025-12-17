"use client";
import RainbowHeartPlayer from "../components/RainbowHeartPlayer";
import { useEffect, useState, FormEvent } from "react";
import { supabase } from "../lib/supabaseClient"; // keep this path the same as your signup page
import { url } from "inspector";
import NavBar from "../components/NavBar";

export default function ProfilePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [theme, setTheme] = useState("neon"); // neon | galaxy | gold – whatever you want
  const [status, setStatus] = useState("");
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const [glowCrew, setGlowCrew] = useState<string[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);



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
      } else if (data) {
        setUsername(data.username ?? "");
        setDisplayName(data.display_name ?? "");
        setAvatarUrl(data.avatar_url ?? "");
        setAboutMe(data.about_me ?? "");
        setTheme(data.theme ?? "neon");
        setStatus(data.status ?? "");
        setBackgroundUrl(data.background_url ?? "");
        setMusicUrl(data.music_url ?? "");
        setGlowCrew(data.glow_crew ?? []);
      }

      setLoadingProfile(false);
    };

    loadProfile();
  }, []);

  // Save / upsert profile
  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      setError("You must be logged in to save your profile.");
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    const { error: saveError } = await supabase.from("profiles").upsert({
      id: userId,
      username,
      display_name: displayName,
      avatar_url: avatarUrl,
      about_me: aboutMe,
      theme,
      status,
      background_url: backgroundUrl,
      music_url: musicUrl,
      glow_crew: glowCrew,
    });

    if (saveError) {
      setError(saveError.message);
    } else {
      setMessage("Glow profile updated ✨");
    }

    setSaving(false);
  };

  const previewStyle = backgroundUrl
    ? {
        backgroundImages: `url(${backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
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
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
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
{glowCrew.length > 0 && (
  <div className="absolute bottom-2 left-2 right-2 flex gap-2 justify-center">
    {glowCrew.map((name, i) => (
      <div 
        key={i}
        className="px-2 py-1 text-xs rounded-md bg-pink-600/30 border border-pink-400/50 backdrop-blur-md shadow-lg"
      >
        @{name}
      </div>
    ))}
  </div>
)}
        </section>

        {/* RIGHT: Edit form */}
        <section>
          <h2 className="text-lg md:text-xl font-bold text-pink-300 mb-3">
            Customize your glow ✏️
          </h2>

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
                onChange={(e) => setMusicUrl(e.target.value)}
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
    value={glowCrew.join(", ")}
    onChange={(e) =>
      setGlowCrew(
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
      <RainbowHeartPlayer src={musicUrl || ""} />
    </main>
  );
}