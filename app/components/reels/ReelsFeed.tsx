"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type ProfileShape =
  | { username: string | null }
  | { username: string | null }[]
  | null
  | undefined;

type Reel = {
  id: string;
  caption: string | null;
  created_at: string;
  video_path: string;
  profiles?: ProfileShape;
};

function getUsername(profiles: ProfileShape) {
  if (!profiles) return "GlowSpaceUser";
  if (Array.isArray(profiles)) return profiles[0]?.username ?? "GlowSpaceUser";
  return profiles.username ?? "GlowSpaceUser";
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ReelsFeed() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeReelId, setActiveReelId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("reels")
        .select("id, caption, created_at, video_path, profiles(username)")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        setReels([]);
        setLoading(false);
        return;
      }

      const rows = (data ?? []) as Reel[];
      setReels(rows);

      // ✅ default active reel = newest one
      if (rows.length > 0) setActiveReelId(rows[0].id);

      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <div className="text-zinc-300">Loading reels…</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {reels.map((reel) => (
        <ReelCard
          key={reel.id}
          reel={reel}
          isActive={activeReelId === reel.id}
          onActive={() => setActiveReelId(reel.id)}
        />
      ))}
    </div>
  );
}

function ReelCard({
  reel,
  isActive,
  onActive,
}: {
  reel: Reel;
  isActive: boolean;
  onActive: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const username = useMemo(() => getUsername(reel.profiles), [reel.profiles]);
  const timeText = useMemo(() => formatTime(reel.created_at), [reel.created_at]);

  // ✅ Get signed URL for private bucket videos
 
useEffect(() => {
  if (!reel.video_path) {
    setUrl(null);
    return;
  }

  const { data } = supabase.storage
    .from("reels")
    .getPublicUrl(reel.video_path);

  setUrl(data.publicUrl);
}, [reel.video_path]);

  // ✅ Optional: autoplay ONLY when active
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (isActive) {
      // try to play when active
      v.play().catch(() => {});
    } else {
      // pause + reset when not active
      v.pause();
      v.currentTime = 0;
    }
  }, [isActive, url]);

  return (
    <div
      onClick={onActive}
      className={`rounded-xl border p-4 bg-black/20 cursor-pointer transition
        ${isActive ? "border-zinc-500" : "border-zinc-800 hover:border-zinc-700"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-zinc-100 font-medium">@{username}</div>
        <div className="text-xs text-zinc-400">{timeText}</div>
      </div>

      {/* Caption */}
      {reel.caption ? (
        <div className="text-zinc-100 mt-2 whitespace-pre-wrap">
          {reel.caption}
        </div>
      ) : (
        <div className="text-zinc-500 mt-2">No caption</div>
      )}

      {/* Video */}
      <div className="mt-3">
       <div className="relative w-full overflow-hidden rounded-xl bg-black">
  <video
    ref={videoRef}
    src={url ?? undefined}
    className="aspect-[9/16] w-full object-cover"
    playsInline
    controls
    preload="metadata"
  />
</div>
      </div>
    </div>
  );
}
