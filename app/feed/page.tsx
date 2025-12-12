"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type FeedPost = {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [newContent, setNewContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [creatingPost, setCreatingPost] = useState(false);

  // 🔍 Debug: let’s see that the component is mounting
  console.log("✅ FeedPage mounted");

  // Load posts from Supabase
  async function loadPosts() {
    try {
      setError(null);
      setLoadingPosts(true);

      console.log("🔍 Calling supabase.from('posts').select");

      const { data, error } = await supabase
        .from("posts")
        .select("id, content, image_url, created_at")
        .order("created_at", { ascending: false });

      console.log("📥 loadPosts result:", { data, error });

      if (error) {
        console.error("❌ Error loading posts:", error.message, error);
        setError("Couldn't load the Glow feed.");
        return;
      }

      const fixed: FeedPost[] = (data ?? []).map((d: any) => ({
        id: d.id as string,
        content: (d.content as string) ?? "",
        image_url: (d.image_url as string | null) ?? null,
        created_at: d.created_at as string,
      }));

      setPosts(fixed);
    } catch (err) {
      console.error("❌ Unexpected error in loadPosts:", err);
      setError("Couldn't load the Glow feed.");
    } finally {
      setLoadingPosts(false);
    }
  }

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create a new post
  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();

    if (!newContent.trim()) return;

    try {
      setError(null);
      setCreatingPost(true);

      console.log("🔍 Getting current user from supabase.auth");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      console.log("👤 getUser result:", { user, userError });

      if (userError || !user) {
        console.error("❌ User error:", userError);
        setError("You must be logged in to post.");
        return;
      }

      console.log("📝 Inserting into posts:", {
        user_id: user.id,
        content: newContent.trim(),
        image_url: imageUrl.trim() || null,
      });

      const { data: insertData, error: insertError } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          content: newContent.trim(),
          image_url: imageUrl.trim() || null,
        })
        .select(); // return inserted row(s) for debugging

      console.log("📤 insert result:", { insertData, insertError });

      if (insertError) {
        console.error(
          "❌ Error creating post:",
          insertError.message,
          insertError
        );
        setError("Couldn't create your Glow post.");
        return;
      }

      setNewContent("");
      setImageUrl("");
      await loadPosts();
    } catch (err) {
      console.error("❌ Unexpected error in handleCreatePost:", err);
      setError("Couldn't create your Glow post.");
    } finally {
      setCreatingPost(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-3xl font-bold text-pink-400">
            GlowSpace Feed ✨
          </h1>
          <p className="text-sm text-slate-300">
            Post your glow, scroll the vibes, meet other legends.
          </p>
        </header>

        {/* Create post */}
        <section className="rounded-3xl border border-pink-500/40 bg-slate-900/70 p-5 shadow-lg shadow-pink-500/20">
          <form onSubmit={handleCreatePost} className="space-y-3">
            <label className="text-sm font-medium text-slate-100">
              Create a post
            </label>
            <textarea
              className="w-full rounded-2xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="What’s glowing in your world?"
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />

            <input
              className="w-full rounded-2xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Optional: Image URL (https://...)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={creatingPost}
                className="rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60"
              >
                {creatingPost ? "Posting..." : "Post to feed"}
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Your glow shows up with your profile name & avatar.
            </p>
          </form>
        </section>

        {/* Error box */}
        {error && (
          <div className="rounded-2xl border border-red-500/60 bg-red-950/50 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {/* Posts list */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-200">
            Latest glow drops
          </h2>

          {loadingPosts && (
            <p className="text-xs text-slate-400">Loading the Glow feed…</p>
          )}

          {!loadingPosts && posts.length === 0 && !error && (
            <p className="text-xs text-slate-400">
              Nobody has posted yet. Be the first Glow legend ✨
            </p>
          )}

          <div className="space-y-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm space-y-2"
              >
                <p className="whitespace-pre-wrap text-slate-100">
                  {post.content}
                </p>
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt="Glow post"
                    className="mt-2 max-h-64 w-full rounded-2xl object-cover"
                  />
                )}
                <p className="text-[11px] text-slate-500">
                  Dropped at{" "}
                  {new Date(post.created_at).toLocaleString(undefined, {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
