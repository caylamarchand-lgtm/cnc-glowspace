"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LivestreamRoom from "../../components/LivestreamRoom";
import { supabase } from "../../lib/supabaseClient";

export default function LiveRoomPage() {
  const params = useParams();
  const roomName = params.roomName as string;

  const [ready, setReady] = useState(false);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    async function load() {
      if (!roomName) return;

      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      // fallback so it NEVER crashes
      const name =
        (user?.user_metadata?.username as string) ||
        (user?.user_metadata?.full_name as string) ||
        user?.email ||
        "Guest";

      setUserName(name);
      setReady(true);
    }

    load();
  }, [roomName]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading live...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#120018] to-black text-white">
      <LivestreamRoom roomName={roomName} userName={userName} />
    </main>
  );
}