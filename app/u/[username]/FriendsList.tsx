"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient"; // if this path errors, read note below

type MiniProfile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

type FriendRow = {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
  user: MiniProfile | null;   // joined from user_id
  friend: MiniProfile | null; // joined from friend_id
};

export default function FriendsList({ profileId }: { profileId: string }) {
  const [rows, setRows] = useState<FriendRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadFriends() {
      setLoading(true);

      const { data, error } = await supabase
        .from("friends")
        .select(
          `
          id,
          user_id,
          friend_id,
          status,
          user:user_id (
            id,
            username,
            display_name,
            avatar_url
          ),
          friend:friend_id (
            id,
            username,
            display_name,
            avatar_url
          )
        `
        )
        .eq("status", "accepted")
        .or(`user_id.eq.${profileId},friend_id.eq.${profileId}`);

      if (cancelled) return;

      if (error) {
        console.error("FriendsList load error:", error);
        setRows([]);
        setLoading(false);
        return;
      }

      const safe = (data ?? []) as any[];

      // Keep only the OTHER person (not you)
      const filtered = safe
        .map((row) => {
          const other =
            row.user_id === profileId ? row.friend : row.user;

          return { rowId: row.id, other };
        })
        .filter((x) => x.other && x.other.id !== profileId) as {
          rowId: string;
          other: MiniProfile;
        }[];

      // Store it in a shape that's easy to render
      // (we’ll just reuse FriendRow[] style by faking it into rows)
      setRows(
        filtered.map((x) => ({
          id: x.rowId,
          user_id: profileId,
          friend_id: x.other.id,
          status: "accepted",
          user: null,
          friend: x.other,
        }))
      );

      setLoading(false);
    }

    loadFriends();

    return () => {
      cancelled = true;
    };
  }, [profileId]);

  if (loading) return <div>Loading friends...</div>;
  if (rows.length === 0) return <div>No friends yet 🌱</div>;

  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ marginBottom: 10 }}>Friends ({rows.length})</h3>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {rows.map((row) => {
          const p = row.friend; // we normalized it above
          const username = p?.username ?? "";
          const name = p?.display_name || p?.username || "Unknown";

          // If there’s no username yet, don’t make it a link
          const content = (
            <div
              style={{
                padding: "10px 12px",
                marginBottom: 10,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(0,0,0,0.25)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                maxWidth: 360,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)",
                  display: "grid",
                  placeItems: "center",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
                title={p?.username ?? ""}
              >
                {p?.avatar_url ? (
                  // If your avatars are public URLs, this works.
                  <img
                    src={p.avatar_url}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ fontSize: 14 }}>👤</span>
                )}
              </div>

              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontWeight: 700 }}>{name}</div>
                {p?.username && (
                  <div style={{ opacity: 0.75, fontSize: 12 }}>@{p.username}</div>
                )}
              </div>
            </div>
          );

          if (!username) return <li key={row.id}>{content}</li>;

          return (
            <li key={row.id}>
              <Link
                href={`/u/${username}`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {content}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}