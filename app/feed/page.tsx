"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// ✅ CHANGE THIS IMPORT PATH to wherever your supabase client is.
// Common ones:
// import { supabase } from "@/lib/supabaseClient";
// import { supabase } from "@/utils/supabaseClient";
// import { supabase } from "@/lib/supabase";
import { supabase } from "../lib/supabaseClient";

type ProfileLite = {
  display_name: string | null;
  username: string | null;
} | null;

type Post = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: { display_name: string | null; username: string | null } | null;
};

export default function FeedPage() {
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = useMemo(() => 500 - newPost.length, [newPost]);

  useEffect(() => {
    let isMounted = true;

    const loadFeed = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Auth session check
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) console.error("Session error:", sessionError);

        if (!session) {
          router.push("/login");
          return;
        }

        // ✅ Fetch posts + joined profile info
        // NOTE: This requires a relationship (FK) posts.user_id -> profiles.id
        const { data, error: postsError } = await supabase
          .from("posts")
          .select("id, content, created_at, user_id")
          .order("created_at", { ascending: false });
console.log("postsError:", postsError);
console.log("postsData:", data);
if (isMounted) setPosts(data ?? []);
        if (postsError) throw new Error(postsError.message);

        if (isMounted) {
        
        }
      
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadFeed();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = newPost.trim();
    if (!trimmed) return;

    if (trimmed.length > 500) {
      setError("Post is too long (max 500 characters).");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) console.error("Session error:", sessionError);

      if (!session?.user?.id) {
        router.push("/login");
        return;
      }
// 🔍 Check for flagged terms (soft moderation)
const { data: flaggedCheck, error: flaggedError } = await supabase
  .rpc("contains_flagged_terms", { input: trimmed });

if (flaggedError) {
  console.error("Flag check failed:", flaggedError);
}
      // ✅ Insert post (RLS policy should check auth.uid() = user_id)
      const { error: insertError } = await supabase.from("posts").insert({
        content: trimmed,
        user_id: session.user.id,
      });

      if (insertError) {
  console.error("Create post failed:", insertError);

  const msg =
    insertError.code === "42501" ||
    insertError.message?.toLowerCase().includes("row-level security")
      ? "That post contains content that isn’t allowed."
      : "Couldn’t post right now. Please try again.";

  setError(msg);
  setSubmitting(false);
  return;
}

      setNewPost("");

      // ✅ Reload feed after posting (simple + reliable)
      setLoading(true);
      const { data, error: reloadError } = await supabase
        .from("posts")
        .select(
          `
          id,
          content,
          created_at,
          user_id,
          profiles (
            display_name,
            username
          )
        `
        )
        .order("created_at", { ascending: false });

      if (reloadError) throw reloadError;

    
    } catch (err: any) {
  console.error("Load feed error:", err);
  console.error("Load feed error JSON:", JSON.stringify(err, null, 2));
  setError(err?.message ?? "Something went wrong loading your GlowSpace feed.");
} finally {
  setLoading(false);
}
  };

 return (
  <div className="relative z-10 mx-auto w-full max-w-3xl">
<div className="pointer-events-none absolute inset-0 z-0">
{/* ✨ Premium Space Layers */}
<div className="pointer-events-none absolute inset-0 z-0">
  {/* aurora ribbons */}
  <div className="absolute -top-40 left-[-20%] h-[520px] w-[520px] rounded-full bg-fuchsia-400/20 blur-3xl" />
  <div className="absolute top-10 right-[-25%] h-[620px] w-[620px] rounded-full bg-cyan-300/18 blur-3xl" />
  <div className="absolute bottom-[-35%] left-1/2 h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-violet-400/18 blur-3xl" />

  {/* tiny stars */}
  <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(1px_1px_at_12px_18px,rgba(255,255,255,.55),transparent_60%),radial-gradient(1px_1px_at_90px_70px,rgba(255,255,255,.35),transparent_60%),radial-gradient(1px_1px_at_160px_130px,rgba(255,255,255,.28),transparent_60%),radial-gradient(1px_1px_at_240px_40px,rgba(255,255,255,.45),transparent_60%),radial-gradient(1px_1px_at_280px_160px,rgba(255,255,255,.25),transparent_60%)] [background-size:320px_220px]" />

  {/* a few “sparkle” stars (cross glint) */}
  <div className="absolute left-[12%] top-[18%] h-[6px] w-[6px] rounded-full bg-white/80 shadow-[0_0_18px_rgba(255,255,255,.65)]" />
  <div className="absolute left-[12%] top-[18%] h-[1px] w-[26px] bg-white/40 blur-[0.5px]" />
  <div className="absolute left-[12%] top-[18%] h-[26px] w-[1px] bg-white/40 blur-[0.5px]" />

  <div className="absolute right-[18%] top-[28%] h-[5px] w-[5px] rounded-full bg-white/70 shadow-[0_0_16px_rgba(255,255,255,.55)]" />
  <div className="absolute right-[18%] top-[28%] h-[1px] w-[22px] bg-white/35 blur-[0.5px]" />
  <div className="absolute right-[18%] top-[28%] h-[22px] w-[1px] bg-white/35 blur-[0.5px]" />

  <div className="absolute left-[65%] bottom-[22%] h-[4px] w-[4px] rounded-full bg-white/60 shadow-[0_0_14px_rgba(255,255,255,.5)]" />
  <div className="absolute left-[65%] bottom-[22%] h-[1px] w-[20px] bg-white/30 blur-[0.5px]" />
  <div className="absolute left-[65%] bottom-[22%] h-[20px] w-[1px] bg-white/30 blur-[0.5px]" />

  {/* subtle grain = premium */}
  <div className="absolute inset-0 opacity-[0.08] [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/></filter><rect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%220.35%22/></svg>')]" />
</div>
</div>
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-fuchsia-200 bg-clip-text text-transparent">
              GlowSpace
            </span>{" "}
            Feed
          </h1>
          <p className="mt-2 text-sm text-slate-400">
         See what the GlowFam is saying in real time ✨
          </p>
        </div>

        <form
          onSubmit={handleCreatePost}
          className="
  rounded-xl
  border border-cyan-400/30
  bg-gradient-to-br from-slate-900/60 to-slate-800/60
  shadow-[0_0_30px_rgba(34,211,238,0.18)]
  backdrop-blur-md
"
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Drop a Glow ✨
            </p>
            <p className={`text-xs ${remaining < 0 ? "text-red-400" : "text-slate-400"}`}>
              {remaining} characters left
            </p>
          </div>

          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind, baddie?"
            className="w-full resize-none rounded-xl border border-slate-800/80 bg-slate-950/30 p-3 text-slate-100 outline-none focus:border-cyan-400/60"
            rows={3}
          />

          <div className="mt-3 flex items-center justify-end">
            <button
              type="submit"
              disabled={submitting || !newPost.trim() || newPost.trim().length > 500}
              className="rounded-full bg-cyan-500/80 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post to GlowSpace"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/20 p-6 text-slate-300">

            Loading your GlowSpace feed...
          </div>
        ) : (
          <section className="space-y-4">
            {posts.map((post) => {
              const name =
                post.profiles?.display_name ||
                post.profiles?.username ||
                "GlowSpace user";

              return (
                <article
                  key={post.id}
                  className="group rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/60 to-slate-950/60 ring-1 ring-pink-400/40 shadow-[0_0_25px_rgba(236,72,153,0.45)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/60 to-fuchsia-300/40 text-xs font-bold text-slate-950">
                        GS
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          {name}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {new Date(post.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs text-slate-500 group-hover:text-cyan-300">
                      public
                    </span>
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-slate-100">
                    {post.content}
                  </p>
                </article>
              );
            })}

            {posts.length === 0 && (
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/20 p-6 text-slate-300">
                No posts yet. Be the first to drop a glow ✨
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

