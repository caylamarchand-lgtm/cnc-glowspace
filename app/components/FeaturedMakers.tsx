"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient"; // <-- if this path errors, tell me what your supabase client import path is

type PublicProfile = {
  id?: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at?: string;
};

export default function FeaturedMakers() {
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);

      // Newest profiles first (launch-friendly)
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, created_at")
        .not("username", "is", null)
        .order("created_at", { ascending: false })
        .limit(8);

      if (!ignore) {
        if (error) {
          console.error("FeaturedMakers load error:", error.message);
          setProfiles([]);
        } else {
          setProfiles((data ?? []) as PublicProfile[]);
        }
        setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-lg font-semibold">Featured Makers</h2>
        <Link
          href="/makers"
          className="text-sm opacity-80 hover:opacity-100 underline"
        >
          View all
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        {loading ? (
          <div className="text-sm opacity-80">Loading makers…</div>
        ) : profiles.length === 0 ? (
          <div className="text-sm opacity-80">
            No public profiles to show yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {profiles.map((p) => {
              const username = p.username ?? "";
              const name = p.display_name || (username ? `@${username}` : "User");
              const href = username ? `/profile/${username}` : "#";

              return (
                <Link
                  key={p.id ?? username ?? Math.random()}
                  href={href}
                  className="group rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-white/10 border border-white/10">
                      {p.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.avatar_url}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs opacity-70">
                          ✨
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate group-hover:underline">
                        {name}
                      </div>
                      {username ? (
                        <div className="text-xs opacity-70 truncate">
                          @{username}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}