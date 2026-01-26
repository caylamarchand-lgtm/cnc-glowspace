import Link from "next/link";
import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function UsersIndexPage() {
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .not("username", "is", null)
    .limit(50);

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">People on GlowSpace</h1>

      {!profiles || profiles.length === 0 ? (
        <p className="opacity-70">No public profiles yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {profiles.map((p) => (
            <Link
              key={p.id}
              href={`/u/${p.username}`}
              className="group rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={p.avatar_url || "/avatar-placeholder.png"}
                  className="h-10 w-10 rounded-full object-cover"
                  alt=""
                />
                <div>
                  <div className="font-medium">
                    {p.display_name || `@${p.username}`}
                  </div>
                  <div className="text-xs opacity-70">@{p.username}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
