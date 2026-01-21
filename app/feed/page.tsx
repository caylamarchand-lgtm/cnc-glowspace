"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import SpaceBackground from "../components/SpaceBackground";

type ProfileLite = {
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
};

type PostRow = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: ProfileLite | ProfileLite[] | null;
};

type CommentRow = {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
  user_id: string;
  profiles:
    | { username: string | null; avatar_url: string | null }
    | { username: string | null; avatar_url: string | null }[]
    | null;
};

function timeAgo(dateInput: string | Date) {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (Number.isNaN(seconds)) return "";
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function pickProfile(p: ProfileLite | ProfileLite[] | null) {
  if (!p) return null;
  return Array.isArray(p) ? p[0] : p;
}

function pickCommentProfile(
  p:
    | { username: string | null; avatar_url: string | null }
    | { username: string | null; avatar_url: string | null }[]
    | null
) {
  if (!p) return null;
  return Array.isArray(p) ? p[0] : p;
}

export default function FeedPage() {
  const router = useRouter();

  const [posts, setPosts] = useState<PostRow[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
const [replyingTo, setReplyingTo] = useState<string | null>(null);
const [replyText, setReplyText] = useState<Record<string, string>>({});


  // Comments state
  const [commentsByPost, setCommentsByPost] = useState<
    Record<string, CommentRow[]>
  >({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  const remaining = useMemo(() => 500 - newPost.length, [newPost]);

  useEffect(() => {
    loadFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadFeed() {
    setLoading(true);
    setError(null);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      router.push("/login");
      setLoading(false);
      return;
    }

    // 1) Load posts + author profile
    const { data: postsData, error: postsErr } = await supabase
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

    if (postsErr) {
      setError(postsErr.message);
      setLoading(false);
      return;
    }

    const safePosts = (postsData ?? []) as PostRow[];
    setPosts(safePosts);

    // 2) Load comments for these posts
    const postIds = safePosts.map((p) => p.id);
    if (postIds.length === 0) {
      setCommentsByPost({});
      setLoading(false);
      return;
    }

    const { data: commentsData, error: commentsErr } = await supabase
      .from("comments")
      .select(
        `
        id,
        content,
        created_at,
        post_id,
        user_id,
        profiles:profiles!comments_user_id_fkey (
          username,
          avatar_url
        )
      `
      )
      .in("post_id", postIds)
      .order("created_at", { ascending: true });

    if (commentsErr) {
      // Not fatal to showing posts, but we want to know
      console.log("comments load error:", commentsErr);
      setCommentsByPost({});
      setLoading(false);
      return;
    }

    const safeComments = (commentsData ?? []) as CommentRow[];

    const map: Record<string, CommentRow[]> = {};
    for (const c of safeComments) {
      if (!map[c.post_id]) map[c.post_id] = [];
      map[c.post_id].push(c);
    }
    setCommentsByPost(map);

    setLoading(false);
  }

  async function createPost() {
    if (submitting) return;

    const content = newPost.trim();
    if (!content) {
      setError("Type something first 🙂");
      return;
    }

    setSubmitting(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      setSubmitting(false);
      return;
    }

    const { error: insertErr } = await supabase.from("posts").insert({
      content,
      user_id: user.id,
    });

    if (insertErr) {
      setError(insertErr.message);
      setSubmitting(false);
      return;
    }

    setNewPost("");
    setSubmitting(false);

    // Reload to show newest post + keep it simple
    await loadFeed();
  }

  async function submitComment(postId: string) {
    const text = (commentText[postId] || "").trim();
    if (!text) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        user_id: user.id,
        content: text,
      })
      .select(
        `
        id,
        content,
        created_at,
        post_id,
        user_id,
        profiles:profiles!comments_user_id_fkey (
          username,
          avatar_url
        )
      `
      )
      .single();

    if (error) {
      console.log("comment insert error:", error);
      setError(error.message);
      return;
    }

    // Optimistically append the comment
    if (data) {
      const newComment = data as CommentRow;
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment],
      }));
    }

    // Clear input
    setCommentText((prev) => ({ ...prev, [postId]: "" }));
    await loadFeed();
  }
async function submitReply(parentCommentId: string, postId: string) {
  const text = (replyText[parentCommentId] || "").trim();
  if (!text) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      user_id: user.id,
      parent_comment_id: parentCommentId,
      content: text,
    })
    .select(
      `
      id,
      content,
      created_at,
      post_id,
      user_id,
      parent_comment_id,
      profiles:profiles!comments_user_id_fkey (
        username,
        avatar_url
      )
    `
    )
    .single();

  if (error) {
    console.log("reply insert error:", error);
    return;
  }

  if (data) {
    // add reply into the same list for that post (it will render under parent later)
    setCommentsByPost((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), data],
    }));
  }

  // clear reply input for that parent comment
  setReplyText((prev) => ({ ...prev, [parentCommentId]: "" }));
} {
  // paste the full submitReply code here
}

  
  return (
    <div className="relative min-h-screen">
      <SpaceBackground />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-extrabold text-white drop-shadow mb-6">
          GlowSpace Feed ✨
        </h1>

        {/* Composer */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4 mb-6">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind, baddie?"
            className="w-full min-h-[90px] bg-transparent text-white placeholder:text-white/60 outline-none resize-none"
            maxLength={500}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-white/60 text-sm">
              {remaining} characters left
            </span>

            <button
              onClick={createPost}
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-pink-500/30 text-pink-100 border border-pink-400/30 hover:bg-pink-500/40 disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post to GlowSpace"}
            </button>
          </div>

          {error && <div className="mt-3 text-red-200 text-sm">{error}</div>}
        </div>

        {/* Feed */}
        {loading ? (
          <div className="text-white/70">Loading…</div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const author = pickProfile(post.profiles);
              const authorName =
                author?.display_name || author?.username || "Unknown";
              const username = author?.username || null;

              const postComments = commentsByPost[post.id] || [];

              return (
                <div
                  key={post.id}
                  className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white/80 text-sm">
                      {username ? (
                        <Link
                          href={`/profile/${username}`}
                          className="font-semibold text-white hover:underline"
                        >
                          {username}
                        </Link>
                      ) : (
                        <span className="font-semibold text-white">
                          {authorName}
                        </span>
                      )}
                      <span className="text-white/50"> • </span>
                      <span className="text-white/60">
                        {timeAgo(post.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-white whitespace-pre-wrap">
                    {post.content}
                  </div>

                  {/* Comments list */}
                  <div className="mt-3 border-t border-white/10 pt-3 space-y-2">
                    {postComments.length > 0 && (
                      <div className="space-y-1">
                        {postComments.map((c) => {
                          const cp = pickCommentProfile(c.profiles);
                          const cu = cp?.username || "user";
                          return (
  <div key={c.id} className="text-sm text-white/80">
    <div>
      <span className="font-semibold text-white/90">@{cu}</span>{" "}
      {c.content}
    </div>

    <button
      type="button"
      onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
      className="mt-1 text-xs text-pink-200/80 hover:text-pink-200 underline"
    >
      Reply
    </button>

    {replyingTo === c.id && (
      <div className="mt-2 flex gap-2">
        <input
          value={replyText[c.id] || ""}
          onChange={(e) =>
            setReplyText((prev) => ({ ...prev, [c.id]: e.target.value }))
          }
          placeholder="Write a reply..."
          className="flex-1 px-3 py-2 rounded-lg bg-black/40 text-white text-sm border border-white/10"
        />
        <button
          type="button"
          onClick={() => submitReply(c.id, post.id)}
          className="px-3 py-2 rounded-lg text-sm bg-pink-500/30 text-pink-200 border border-pink-400/30 hover:bg-pink-500/40"
        >
          Send
        </button>
      </div>
    )}
  </div>
);

                        })}
                      </div>
                    )}

                   {/* Comment input */}
<div className="mt-2 flex gap-2">
  <input
    value={commentText[post.id] ?? ""}
    onChange={(e) =>
      setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))
    }
    placeholder="Write a comment..."
    className="flex-1 px-3 py-2 rounded-lg bg-black/40 text-white text-sm border border-white/10"
  />

  <button
    type="button"
    onClick={() => submitComment(post.id)}
    className="px-3 py-2 rounded-lg text-sm bg-pink-500/30 text-pink-200 border border-pink-400/30 hover:bg-pink-500/40"
  >
    Send
  </button>
</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}