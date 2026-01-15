"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

type PostType = "sharing" | "sale" | "commissions";

type Author = {
  id: string;
  username: string | null;
  display_name: string | null;
};

type MakersPost = {
  id: string;
  created_at: string;
  post_type: "sharing" | "sale" | "commissions";
  title: string | null;
  description: string | null;
  price: string | null;
  contact: string | null;
  author_id: string;
  author: Author | null;
};

export default function MakersPage() {
  const [postType, setPostType] = useState<PostType>("sharing");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [contact, setContact] = useState("");

  const [posts, setPosts] = useState<MakersPost[]>([]);
  const [feedFilter, setFeedFilter] = useState<PostType | "all">("all");

  const [loadingPosts, setLoadingPosts] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showPrice = postType === "sale";
  const showContact = postType === "sale" || postType === "commissions";

  const filteredPosts = useMemo(() => {
    if (feedFilter === "all") return posts;
    return posts.filter((p) => p.post_type === feedFilter);
  }, [feedFilter, posts]);

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadPosts() {
    setLoadingPosts(true);
    setError(null);

    // IMPORTANT:
    // This uses your FK makers_posts.author_id -> public.profiles.id
    // If your FK name differs, change the "!makers_posts_author_id_fkey" part.
    const { data, error } = await supabase
  .from("makers_posts")
  .select(`
  id,
  created_at,
  post_type,
  title,
  description,
  price,
  contact,
  author_id,
  author:profiles!makers_posts_author_id_fkey (
    id,
    username,
    display_name
  )
`)
  .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("❌ loadPosts error:", error);
      setError(error.message);
      setPosts([]);
      setLoadingPosts(false);
      return;
    }

    const normalized: MakersPost[] = (data ?? []).map((p: any) => ({
  id: p.id,
  created_at: p.created_at,
  post_type: p.post_type,
  title: p.title ?? null,
  description: p.description ?? null,
  price: p.price ?? null,
  contact: p.contact ?? null,
  author_id: p.author_id,
  author: Array.isArray(p.author)
    ? p.author[0]
      ? {
          id: p.author[0].id,
          username: p.author[0].username ?? null,
          display_name: p.author[0].display_name ?? null,
        }
      : null
    : p.author
    ? {
        id: p.author.id,
        username: p.author.username ?? null,
        display_name: p.author.display_name ?? null,
      }
    : null,
}));

setPosts(normalized);
setLoadingPosts(false);
  }

  async function handleCreatePost() {
    if (creating) return;

    setError(null);

    const cleanTitle = title.trim();
    const cleanDesc = description.trim();
    const cleanPrice = price.trim();
    const cleanContact = contact.trim();

    // require at least something meaningful
    if (!cleanTitle && !cleanDesc) {
      setError("Add a title or description 🙂");
      return;
    }

    setCreating(true);

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    const user = userData?.user;

    if (userErr) {
      console.error("❌ getUser error:", userErr);
      setError(userErr.message);
      setCreating(false);
      return;
    }

    if (!user) {
      setError("You must be logged in to post.");
      setCreating(false);
      return;
    }

    const insertPayload = {
      author_id: user.id,
      post_type: postType,
      title: cleanTitle || null,
      description: cleanDesc || null,
      price: showPrice ? cleanPrice || null : null,
      contact: showContact ? cleanContact || null : null,
    };

    const { error: insertError } = await supabase
      .from("makers_posts")
      .insert(insertPayload);

    if (insertError) {
      console.error("❌ INSERT ERROR:", insertError);
      setError(insertError.message);
      setCreating(false);
      return;
    }

    // clear form
    setTitle("");
    setDescription("");
    setPrice("");
    setContact("");

    // refresh list
    await loadPosts();
    setCreating(false);
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white">🧶 Makers</h1>

      <p className="mt-3 text-zinc-300 max-w-2xl">
        A place to share what you make. Selling is welcome. Browsing is optional.
      </p>

      {/* Rules */}
      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
        <p className="text-sm text-zinc-200 font-semibold">
          Makers Rules (soft but firm)
        </p>
        <ul className="mt-2 text-sm text-zinc-300 list-disc pl-5 space-y-1">
          <li>No pressure selling. Keep it respectful.</li>
          <li>No spam. Post real work you made.</li>
          <li>Be clear: sharing vs for sale vs commissions.</li>
        </ul>
      </div>

      {/* Post box */}
      <section className="mt-8 rounded-2xl border border-zinc-800 bg-black/40 p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-lg font-semibold text-white">
            Create a Makers Post
          </h2>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPostType("sharing")}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                postType === "sharing"
                  ? "border-white text-white"
                  : "border-zinc-700 text-zinc-300 hover:text-white"
              }`}
            >
              ✅ Just sharing
            </button>

            <button
              type="button"
              onClick={() => setPostType("sale")}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                postType === "sale"
                  ? "border-white text-white"
                  : "border-zinc-700 text-zinc-300 hover:text-white"
              }`}
            >
              🏷️ For sale
            </button>

            <button
              type="button"
              onClick={() => setPostType("commissions")}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                postType === "commissions"
                  ? "border-white text-white"
                  : "border-zinc-700 text-zinc-300 hover:text-white"
              }`}
            >
              ✍️ Commissions open
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <span className="text-xs px-2 py-1 rounded-full border border-zinc-700 text-zinc-200">
            {postType === "sharing" && "✅ Just sharing"}
            {postType === "sale" && "🏷️ For sale"}
            {postType === "commissions" && "✍️ Commissions open"}
          </span>

          <p className="text-sm text-zinc-300">
            {postType === "sharing" && "Share your work with no pressure to sell."}
            {postType === "sale" && "List an item for sale (optional price + how to buy)."}
            {postType === "commissions" && "Let people know you're open for custom work/commissions."}
          </p>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        )}

        <div className="mt-5 grid gap-4">
          <div>
            <label className="text-sm text-zinc-300">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Sticker Pack / Crocheted Bee / Custom DTF Tee"
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell people what it is, materials, size, how it was made, etc."
              className="mt-1 w-full min-h-[120px] rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-zinc-500"
            />
          </div>

          {showPrice && (
            <div>
              <label className="text-sm text-zinc-300">Price (optional)</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Example: $12 or 12.00"
                className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-zinc-500"
              />
            </div>
          )}

          {showContact && (
            <div>
              <label className="text-sm text-zinc-300">
                How should people contact you?
              </label>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Example: DM me on GlowSpace / IG @name / Email"
                className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-zinc-500"
              />
            </div>
          )}

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleCreatePost}
              disabled={creating}
              className="mt-2 w-fit rounded-xl bg-white px-5 py-2.5 text-black font-semibold hover:opacity-90 disabled:opacity-60"
            >
              {creating ? "Posting..." : "Post"}
            </button>
          </div>
        </div>

        {/* Feed Filters */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFeedFilter("all")}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              feedFilter === "all"
                ? "border-white text-white"
                : "border-zinc-700 text-zinc-300 hover:text-white"
            }`}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => setFeedFilter("sharing")}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              feedFilter === "sharing"
                ? "border-white text-white"
                : "border-zinc-700 text-zinc-300 hover:text-white"
            }`}
          >
            🧶 Makers
          </button>

          <button
            type="button"
            onClick={() => setFeedFilter("sale")}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              feedFilter === "sale"
                ? "border-white text-white"
                : "border-zinc-700 text-zinc-300 hover:text-white"
            }`}
          >
            💰 For Sale
          </button>

          <button
            type="button"
            onClick={() => setFeedFilter("commissions")}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              feedFilter === "commissions"
                ? "border-white text-white"
                : "border-zinc-700 text-zinc-300 hover:text-white"
            }`}
          >
            ✍️ Commissions
          </button>
        </div>

        {/* Feed */}
        <div className="mt-10 space-y-4">
          {loadingPosts && (
            <p className="text-sm text-zinc-400">Loading makers posts…</p>
          )}

          {!loadingPosts && filteredPosts.length === 0 && (
            <p className="text-sm text-zinc-500">No makers posts yet.</p>
          )}

          {!loadingPosts &&
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
              >
                <div className="text-xs text-zinc-400 mb-1">
                  {post.post_type === "sharing" && "🧶 Just sharing"}
                  {post.post_type === "sale" && "💰 For sale"}
                  {post.post_type === "commissions" && "✍️ Commissions open"}
                </div>

                <h3 className="text-lg font-semibold text-white">
                  {post.title ?? "(No title)"}
                </h3>

                <p className="text-xs text-zinc-400 mt-1">
                  by{" "}
                  <span className="text-zinc-200">
                    {post.author?.display_name || post.author?.username || "Maker"}
                  </span>
                </p>

                {post.description && (
                  <p className="text-zinc-300 mt-1">{post.description}</p>
                )}

                {post.price && (
                  <p className="mt-2 text-sm text-zinc-300">
                    💵 Price: {post.price}
                  </p>
                )}

                {post.contact && (
                  <p className="mt-1 text-sm text-zinc-400">
                    📩 Contact: {post.contact}
                  </p>
                )}
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}