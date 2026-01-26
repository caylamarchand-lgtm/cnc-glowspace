"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import SpaceBackground from "../components/SpaceBackground";

const COMMENT_COOLDOWN_MS = 8000; // 8 seconds
const REPLY_COOLDOWN_MS = 8000;

function msLeft(lastMs: number, cooldownMs: number) {
  const left = cooldownMs - (Date.now() - lastMs);
  return Math.max(0, left);
}

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

type CommentProfileLite = { username: string | null; avatar_url: string | null };

type CommentRow = {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
  user_id: string;
  parent_comment_id?: string | null;
  profiles: CommentProfileLite | CommentProfileLite[] | null;
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

function pickCommentProfile(p: CommentProfileLite | CommentProfileLite[] | null) {
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

  // Replies + cooldown
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<Record<string, boolean>>({});
  const [lastSentAt, setLastSentAt] = useState<Record<string, number>>({});
  const [cooldownError, setCooldownError] = useState<Record<string, string>>({});

  // ✅ Report Modal State (KEEPING YOUR STUFF)
  const [reportOpen, setReportOpen] = useState(false);
  const [reportType, setReportType] = useState<"post" | "comment">("post");
  const [reportId, setReportId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  // Comments state
  const [commentsByPost, setCommentsByPost] = useState<Record<string, CommentRow[]>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  const remaining = useMemo(() => 500 - newPost.length, [newPost]);

  useEffect(() => {
    loadFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------
  // REPORT (fancy modal)
  // -----------------------------
  function openReportModal(contentType: "post" | "comment", contentId: string) {
    setReportType(contentType);
    setReportId(contentId);
    setReportReason("");
    setReportDetails("");
    setReportOpen(true);
  }

  function closeReportModal() {
    setReportOpen(false);
    setReportId(null);
    setReportReason("");
    setReportDetails("");
  }

  async function submitReport() {
    if (!reportId) return;

    const reason = reportReason.trim();
    const details = reportDetails.trim();

    if (!reason) {
      alert("Please select/enter a reason.");
      return;
    }

    setReportSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { error: insertErr } = await supabase.from("reports").insert({
        reporter_id: user.id,
        content_type: reportType,
        content_id: reportId,
        reason: reason.slice(0, 200),
        details: details.slice(0, 500),
      });

      if (insertErr) {
        console.error("Report failed:", insertErr);
        alert("Could not submit report. Try again.");
        return;
      }

      alert("Report submitted 💜");
      closeReportModal();
    } finally {
      setReportSubmitting(false);
    }
  }

  // -----------------------------
  // LOAD FEED
  // -----------------------------
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

    // 1) Posts + author profile
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

    // 2) Comments for all loaded posts
    const postIds = safePosts.map((p) => p.id);
    if (postIds.length) {
      const { data: commentsData, error: commentsErr } = await supabase
        .from("comments")
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
        .in("post_id", postIds)
        .order("created_at", { ascending: true });

      if (commentsErr) {
        setError(commentsErr.message);
        setLoading(false);
        return;
      }

      const safeComments = (commentsData ?? []) as CommentRow[];

      const grouped: Record<string, CommentRow[]> = {};
      for (const c of safeComments) {
        if (!grouped[c.post_id]) grouped[c.post_id] = [];
        grouped[c.post_id].push(c);
      }
      setCommentsByPost(grouped);
    } else {
      setCommentsByPost({});
    }

    setLoading(false);
  }

  // -----------------------------
  // CREATE POST
  // -----------------------------
  async function submitPost() {
    if (submitting) return;
    const content = newPost.trim();
    if (!content) return;

    setSubmitting(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { error: insertErr } = await supabase.from("posts").insert({
        user_id: user.id,
        content: content.slice(0, 500),
      });

      if (insertErr) {
        setError(insertErr.message);
        return;
      }

      setNewPost("");
      await loadFeed();
    } finally {
      setSubmitting(false);
    }
  }

  // -----------------------------
  // COMMENT
  // -----------------------------
  async function submitComment(postId: string) {
    const text = (commentText[postId] || "").trim();
    if (!text) return;

    const key = `comment:${postId}`;
    if (sending[key]) return;

    const last = lastSentAt[key] ?? 0;
    const left = msLeft(last, COMMENT_COOLDOWN_MS);
    if (left > 0) {
      setCooldownError((p) => ({
        ...p,
        [key]: `Wait ${Math.ceil(left / 1000)}s before sending again.`,
      }));
      return;
    }

    setSending((p) => ({ ...p, [key]: true }));
    setCooldownError((p) => ({ ...p, [key]: "" }));

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { error: insertErr } = await supabase.from("comments").insert({
        post_id: postId,
        user_id: user.id,
        content: text.slice(0, 500),
        parent_comment_id:null,
      });

      if (insertErr) {
        setError(insertErr.message);
        return;
      }

      setCommentText((p) => ({ ...p, [postId]: "" }));
     
      await loadFeed();
    } finally {
      setSending((p) => ({ ...p, [key]: false }));
       setLastSentAt((p) => ({ ...p, [key]: Date.now() }));
    }
  }

  // -----------------------------
  // REPLY (stored in comments table with parent_comment_id)
  // -----------------------------
  async function submitReply(parentCommentId: string, postId: string) {
    const text = (replyText[parentCommentId] || "").trim();
    if (!text) return;

    const key = `reply:${parentCommentId}`;
    if (sending[key]) return;

    const last = lastSentAt[key] ?? 0;
    const left = msLeft(last, REPLY_COOLDOWN_MS);
    if (left > 0) {
      setCooldownError((p) => ({
        ...p,
        [key]: `Wait ${Math.ceil(left / 1000)}s before replying again.`,
      }));
      return;
    }

    setSending((p) => ({ ...p, [key]: true }));
    setCooldownError((p) => ({ ...p, [key]: "" }));

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { error: insertErr } = await supabase.from("comments").insert({
        post_id: postId,
        user_id: user.id,
        parent_comment_id: parentCommentId,
        content: text.slice(0, 500),
      });

      if (insertErr) {
        setError(insertErr.message);
        return;
      }

      setReplyText((p) => ({ ...p, [parentCommentId]: "" }));
      setReplyingTo(null);
      
      await loadFeed();
    } finally {
      setSending((p) => ({ ...p, [key]: false }));
      setLastSentAt((p) => ({ ...p, [key]: Date.now() }));
    }
  }

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="relative min-h-screen">
      <SpaceBackground />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 py-6">
        <div className="mb-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4">
          <div className="text-white/90 text-lg font-semibold mb-2">Feed</div>

          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Write a post..."
            className="w-full min-h-[90px] rounded-xl bg-black/40 border border-white/10 p-3 text-white outline-none"
            maxLength={500}
          />

          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-white/50">{remaining} left</div>

            <button
              type="button"
              onClick={submitPost}
              disabled={submitting || !newPost.trim()}
              className="px-4 py-2 rounded-xl bg-pink-500/30 text-pink-100 border border-pink-400/30 hover:bg-pink-500/40 disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post"}
            </button>
          </div>

          {error && <div className="mt-3 text-red-200 text-sm">{error}</div>}
        </div>

        {/* Feed */}
        {loading ? (
          <div className="text-white/70">Loading...</div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const author = pickProfile(post.profiles);
              const authorName =
                author?.display_name || author?.username || "Unknown";
              const username = author?.username || null;

              const postComments = commentsByPost[post.id] || [];
              const topLevel = postComments.filter((c) => !c.parent_comment_id);
              const repliesFor = (parentId: string) =>
                postComments.filter((c) => c.parent_comment_id === parentId);

              const commentCooldownKey = `comment:${post.id}`;
              const commentCooldownMsg = cooldownError[commentCooldownKey];

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
                      <span className="text-white/50"> · </span>
                      <span className="text-white/60">
                        {timeAgo(post.created_at)}
                      </span>
                    </div>

                    {/* ✅ Report post button (fancy modal) */}
                    <button
                      type="button"
                      onClick={() => openReportModal("post", post.id)}
                      className="text-xs text-white/40 hover:text-red-400 underline"
                    >
                      Report
                    </button>
                  </div>

                  {/* Content */}
                  <div className="text-white whitespace-pre-wrap">
                    {post.content}
                  </div>

                  {/* Comments */}
                  <div className="mt-4 border-t border-white/10 pt-3 space-y-3">
                    <div className="text-white/70 text-sm font-semibold">
                      Comments
                    </div>

                    {/* Add comment */}
                    <div className="flex gap-2">
                      <input
                        value={commentText[post.id] || ""}
                        onChange={(e) =>
                          setCommentText((p) => ({
                            ...p,
                            [post.id]: e.target.value,
                          }))
                        }
                        placeholder="Write a comment..."
                        className="flex-1 px-3 py-2 rounded-lg bg-black/40 text-white text-sm border border-white/10 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => submitComment(post.id)}
                        className="px-3 py-2 rounded-lg text-sm bg-pink-500/30 text-pink-100 border border-pink-400/30 hover:bg-pink-500/40"
                      >
                        Send
                      </button>
                    </div>

                    {commentCooldownMsg ? (
                      <div className="text-xs text-red-200">
                        {commentCooldownMsg}
                      </div>
                    ) : null}

                    {/* Comments list */}
                    {topLevel.length > 0 && (
                      <div className="space-y-3">
                        {topLevel.map((c) => {
                          const cp = pickCommentProfile(c.profiles);
                          const cu = cp?.username || "user";
                          const replyKey = `reply:${c.id}`;
                          const replyCooldownMsg = cooldownError[replyKey];

                          return (
                            <div
                              key={c.id}
                              className="rounded-xl bg-black/20 border border-white/10 p-3"
                            >
                              <div className="flex items-center justify-between">
                                <div className="text-white/80 text-sm">
                                  <span className="font-semibold text-white">
                                    {cu}
                                  </span>
                                  <span className="text-white/50"> · </span>
                                  <span className="text-white/60">
                                    {timeAgo(c.created_at)}
                                  </span>
                                </div>

                                {/* ✅ Report comment button (fancy modal) */}
                                <button
                                  type="button"
                                  onClick={() => openReportModal("comment", c.id)}
                                  className="text-xs text-white/40 hover:text-red-400 underline"
                                >
                                  Report
                                </button>
                              </div>

                              <div className="mt-1 text-white whitespace-pre-wrap text-sm">
                                {c.content}
                              </div>

                              <div className="mt-2 flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setReplyingTo(replyingTo === c.id ? null : c.id)
                                  }
                                  className="text-xs text-pink-200/80 hover:text-pink-200 underline"
                                >
                                  Reply
                                </button>

                                {replyCooldownMsg ? (
                                  <span className="text-xs text-red-200">
                                    {replyCooldownMsg}
                                  </span>
                                ) : null}
                              </div>

                              {/* Reply input */}
                              {replyingTo === c.id && (
                                <div className="mt-2 flex gap-2">
                                  <input
                                    value={replyText[c.id] || ""}
                                    onChange={(e) =>
                                      setReplyText((p) => ({
                                        ...p,
                                        [c.id]: e.target.value,
                                      }))
                                    }
                                    placeholder="Write a reply..."
                                    className="flex-1 px-3 py-2 rounded-lg bg-black/40 text-white text-sm border border-white/10 outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => submitReply(c.id, post.id)}
                                    className="px-3 py-2 rounded-lg text-sm bg-pink-500/30 text-pink-100 border border-pink-400/30 hover:bg-pink-500/40"
                                  >
                                    Send
                                  </button>
                                </div>
                              )}

                              {/* Replies */}
                              {repliesFor(c.id).length > 0 && (
                                <div className="mt-3 space-y-2 pl-3 border-l border-white/10">
                                  {repliesFor(c.id).map((r) => {
                                    const rp = pickCommentProfile(r.profiles);
                                    const ru = rp?.username || "user";

                                    return (
                                      <div
                                        key={r.id}
                                        className="rounded-xl bg-black/15 border border-white/10 p-2"
                                      >
                                        <div className="text-white/80 text-xs">
                                          <span className="font-semibold text-white">
                                            {ru}
                                          </span>
                                          <span className="text-white/50"> · </span>
                                          <span className="text-white/60">
                                            {timeAgo(r.created_at)}
                                          </span>
                                        </div>
                                        <div className="mt-1 text-white/90 text-sm whitespace-pre-wrap">
                                          {r.content}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ✅ Fancy Report Modal */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl bg-zinc-950/90 border border-white/10 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="text-white font-semibold">
                Report {reportType === "post" ? "Post" : "Comment"}
              </div>
              <button
                type="button"
                onClick={closeReportModal}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 space-y-2">
              <div className="text-white/70 text-sm">Reason</div>

              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/10 text-white p-2 outline-none"
              >
                <option value="">Select a reason...</option>
                <option value="spam">Spam</option>
                <option value="harassment">Harassment</option>
                <option value="hate">Hate</option>
                <option value="sexual content">Sexual content</option>
                <option value="other">Other</option>
              </select>

              <div className="text-white/70 text-sm mt-2">
                Details (optional)
              </div>
              <textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Add any extra context..."
                className="w-full min-h-[90px] rounded-xl bg-black/40 border border-white/10 text-white p-2 outline-none"
                maxLength={500}
              />

              <div className="mt-4 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={closeReportModal}
                  className="px-4 py-2 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={submitReport}
                  disabled={reportSubmitting}
                  className="px-4 py-2 rounded-xl bg-red-500/30 text-red-100 border border-red-400/30 hover:bg-red-500/40 disabled:opacity-50"
                >
                  {reportSubmitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}