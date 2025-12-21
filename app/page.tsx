"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

type Post = {
  id: string | number;
  content: string;
  created_at: string;
};

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("posts")
        .select("id, content, created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        setError(error.message);
        setPosts([]);
      } else {
        setPosts((data as Post[]) || []);
      }

      setLoading(false);
    };

    load();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Feed</h1>

      {loading && <p>Loading feed…</p>}
      {error && <p style={{ color: "tomato" }}>Supabase error: {error}</p>}

      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        {posts.map((p) => (
          <div
            key={p.id}
            style={{
              padding: 14,
              borderRadius: 14,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <div style={{ fontWeight: 800 }}>{p.content}</div>
            <div style={{ opacity: 0.7, marginTop: 6, fontSize: 12 }}>
              {new Date(p.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}