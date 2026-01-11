"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

type NotificationRow = {
  id: string;
  user_id: string;
  actor_id: string;
  type: string;
  post_id: string | null;
  reaction: string | null;
  created_at: string;
  read: boolean;
};

export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    setItems(data ?? []);
    setLoading(false);
  }

  async function markAllRead() {
    await supabase.from("notifications").update({ read: true }).eq("read", false);
    loadNotifications();
  }

 const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative px-2 text-white"
      >
        <span>🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg bg-black border border-white/10 shadow-lg z-50">
          <div className="flex justify-between items-center p-3 border-b border-white/10">
            <span className="text-sm font-semibold">Notifications</span>
            <button
              onClick={markAllRead}
              className="text-xs text-cyan-400 hover:underline"
            >
              Mark all read
            </button>
          </div>

          {loading && (
            <div className="p-3 text-sm text-white/60">Loading…</div>
          )}

          {!loading && items.length === 0 && (
            <div className="p-3 text-sm text-white/60">
              No notifications yet
            </div>
          )}

          {!loading &&
            items.map((n) => (
              <Link
                key={n.id}
                href="/feed"
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 text-sm ${
                  n.read ? "text-white/60" : "text-white"
                } hover:bg-white/5`}
              >
                <span>
                  Someone reacted to your post
                  
                </span>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}