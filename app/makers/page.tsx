"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

type PostType = "sharing" | "sale" | "commissions";

export default function MakersPage() {
  const [postType, setPostType] = useState<PostType>("sharing");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [contact, setContact] = useState("");
const [posts, setPosts] = useState<any[]>([]);
const [loadingPosts, setLoadingPosts] = useState(false);
const [feedFilter, setFeedFilter] = useState<PostType | "all">("all");
  const showPrice = postType === "sale";
  const showContact = postType === "sale" || postType === "commissions";
 useEffect(() => {
  loadPosts();
}, []);

 async function loadPosts() {
  setLoadingPosts(true);

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
    author:profiles (
      id,
      username,
      display_name
    )
  `)
  .order("created_at", { ascending: false })
  .limit(50);
console.log("POST 0 author:", data?.[0]?.author);
 if (error) {
  console.error("❌ SUPABASE ERROR (raw):", error);
  console.error("❌ SUPABASE ERROR (details):", {
    message: (error as any)?.message,
    code: (error as any)?.code,
    details: (error as any)?.details,
    hint: (error as any)?.hint,
  });

  alert("Could not load posts. Check console for details.");
  setPosts([]);
} else {
  console.log("🟩 POSTS:", data);
  setPosts(data ?? []);
}

  setLoadingPosts(false);
}
 async function handleCreatePost() {
  console.log("CREATE POST FIRED")
  const { data: userData } = await supabase.auth.getUser();
console.log("USER:",userData?.user)
  if (!userData.user) {
    alert("You must be logged in to post.");
    return;
  }

 const { data: inserted, error } = await supabase
  .from("makers_posts")
  .insert({
    author_id: userData.user.id,
    post_type: postType,
    title,
    description,
    price: showPrice ? price : null,
    contact: showContact ? contact : null,
  })
  .select()
  .single();



 if (error) {
  console.error("INSERT ERROR:", error);
  alert(error.message);
  return;
}

console.log("INSERTED ROW:", inserted);

alert("Post created!");
setTitle("");
setDescription("");
setPrice("");
setContact("");
loadPosts();
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
              <label className="text-sm text-zinc-300">How should people contact you?</label>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Example: DM me on GlowSpace / IG @name / Email"
                className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-zinc-500"
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleCreatePost}
            className="mt-2 w-fit rounded-xl bg-white px-5 py-2.5 text-black font-semibold hover:opacity-90"
          >
            Post (demo)
          </button>

          <p className="text-xs text-zinc-500">
            This is UI-only for now. Next step we’ll connect it to your database so posts actually save.
          </p>
        </div>
        {/* Makers Feed */}
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
<div className="mt-10 space-y-4">
  {loadingPosts && (
    <p className="text-sm text-zinc-400">Loading makers posts…</p>
  )}

  {!loadingPosts && posts.length === 0 && (
    <p className="text-sm text-zinc-500">No makers posts yet.</p>
  )}

  {!loadingPosts &&
  (feedFilter === "all"
    ? posts
    : posts.filter((p) => p.post_type === feedFilter)
  ).map((post) => (
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
          {post.title}
        </h3>
<p className="text-xs text-zinc-400 mt-1">
  by{" "}
  <span className="text-zinc-200">
    {post.author?.display_name || post.author?.username || "Maker"}
  </span>
</p>
        <p className="text-zinc-300 mt-1">{post.description}</p>

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