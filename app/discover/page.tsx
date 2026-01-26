"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
const DEFAULT_AVATAR =
"https://bviwlkpofkfbntkppxtm.supabase.co/storage/v1/object/public/avatars/6fa745db-60cd-4bf3-8134-672181068f9e.jpg";
  
type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfiles() {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .limit(50);

      if (!error && data) {
        setProfiles(data);
      }

      setLoading(false);
    }

    loadProfiles();
  }, []);

  if (loading) {
    return <div className="p-6 text-zinc-400">Finding Glowers ✨</div>;
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Discover People</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {profiles.map((profile) => (
          <Link
            key={profile.id}
            href={`/profile/${profile.username ?? profile.id}`}
            className="rounded-lg bg-zinc-900 hover:bg-zinc-800 transition p-4 text-center"
          >
          <img
  src={profile.avatar_url || DEFAULT_AVATAR}
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = DEFAULT_AVATAR;
  }}
  alt=""
  className="w-20 h-20 mx-auto rounded-full object-cover mb-2 bg-zinc-800"
/>
            <div className="text-white text-sm font-medium">
              {profile.display_name || profile.username || "Unknown"}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}