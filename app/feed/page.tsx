"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import SpaceBackground from "../components/SpaceBackground";

type ProfileLite = {
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
};

type Post = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: ProfileLite | ProfileLite[] | null;
};

function timeAgo(dateInput: string | Date) {
  const date =
    typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (Number.isNaN(seconds)) return "";
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

export default function FeedPage() {
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = useMemo(() => 500 - newPost.length, [newPost]);

  async function loadFeed() {
    setLoading(true);
    setError(null);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        id,
        content,
        created_at,
        user_id,
        profiles:profiles!posts_user_id_fkey (
          display_name,
          username,
          avatar_url
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setPosts((data ?? []) as Post[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 🌌 BACKGROUND — DO NOT TOUCH */}
      <SpaceBackground />

      {/* 🌟 FEED CONTENT */}
      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-4xl font-extrabold mb-6 text-white">
          GlowSpace Feed ✨
        </h1>

        {/* CREATE POST */}
        <div className="mb-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            maxLength={500}
            placeholder="What’s on your mind, baddie?"
            className="w-full bg-transparent resize-none outline-none text-white"
          />
          <div className="flex justify-between items-center mt-2 text-sm text-white/60">
            <span>{remaining} characters left</span>
            <button
              disabled={submitting}
              className="rounded-xl px-4 py-2 bg-pink-500/30 hover:bg-pink-500/40 transition"
            >
              Post to GlowSpace
            </button>
          </div>
        </div>

        {/* STATUS */}
        {loading && <p className="text-white/70">Loading feed…</p>}
        {error && <p className="text-red-400">{error}</p>}

        {/* POSTS */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4"
            >
              {/* NAME + TIME */}
              <div className="flex items-center gap-2 mb-2 text-sm text-white/70">
                <span className="font-semibold text-white">
                  {Array.isArray(post.profiles)
                    ? post.profiles[0]?.display_name ||
                      post.profiles[0]?.username ||
                      "Unknown"
                    : post.profiles?.display_name ||
                      post.profiles?.username ||
                      "Unknown"}
                </span>
                <span className="text-white/40">
                  • {timeAgo(post.created_at)}
                </span>
              </div>

              {/* CONTENT */}
              <p className="text-white">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}