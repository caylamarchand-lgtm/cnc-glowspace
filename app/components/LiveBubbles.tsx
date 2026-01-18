"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type LiveUser = {
  id: string;
  username: string;
  avatar_url: string | null;
};

type LiveRoom = {
  roomName: string;
  count: number;
  users: LiveUser[];
};

export default function LiveBubbles() {
  const [rooms, setRooms] = useState<LiveRoom[]>([]);

  useEffect(() => {
    const loadLive = async () => {
      try {
        const res = await fetch("/api/livekit/status?all=true");
        const data = await res.json();
        setRooms(data.live ?? []);
      } catch (err) {
        console.error("Live bubbles error:", err);
      }
    };

    loadLive();
    const interval = setInterval(loadLive, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  if (!rooms.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {rooms.map((room) => (
        <Link
          key={room.roomName}
          href={`/live/${room.roomName}`}
          className="group flex items-center gap-3 rounded-full bg-black/70 backdrop-blur-md px-4 py-2 border border-red-500/40 shadow-lg hover:scale-105 transition"
        >
          {/* avatars */}
          <div className="flex -space-x-2">
            {room.users.slice(0, 3).map((user) => (
              <img
                key={user.id}
                src={user.avatar_url || "/avatar-placeholder.png"}
                alt={user.username}
                className="h-8 w-8 rounded-full border border-red-500 bg-black object-cover"
              />
            ))}
          </div>

          {/* text */}
          <div className="flex flex-col leading-tight">
            <span className="text-red-400 text-sm font-semibold animate-pulse">
              🔴 LIVE
            </span>
            <span className="text-xs text-white/80">
              {room.users[0]?.username}
              {room.count > 1 && ` + ${room.count - 1}`}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}