'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Session } from '@supabase/supabase-js'

export default function NavBar() {
  const [isAuthed, setIsAuthed] = useState(false)
const [isLive, setIsLive] = useState(false)

useEffect(() => {
  // Initial session check
  supabase.auth.getSession().then(({ data }) => {
    setIsAuthed(!!data.session);
  });

  // Listen for auth changes
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setIsAuthed(!!session);
  });

  // Cleanup
  return () => {
    subscription.unsubscribe();
  };
}, []);

useEffect(() => {
 const checkLive = async () => {
  try {
    const res = await fetch("/api/livekit/status?roomName=glowspace-live");

    // 🔇 If LiveKit isn't ready, fail silently
    if (!res.ok) {
      console.warn("LiveKit status unavailable");
      return;
    }

    const data = await res.json();
    setIsLive(!!data?.isLive);
  } catch (err) {
    console.warn("LiveKit not ready yet");
  }
};

  checkLive();
  const interval = setInterval(checkLive, 15000);
  return () => clearInterval(interval);
}, []);

 return (
  <nav className="flex items-center gap-6 p-4 border-b border-zinc-800">
    <Link href="/" className="text-zinc-100 hover:text-white font-medium">
      GlowSpace
    </Link>

    <Link href="/feed" className="text-zinc-300 hover:text-white">
      Feed
    </Link>
<Link href="/makers" className="text-zinc-300 hover:text-white">
  Makers
</Link>
   {isAuthed && (
  <>
    <Link href="/create" className="text-zinc-300 hover:text-white">
      Create
    </Link>

    <Link href="/reels" className="text-zinc-300 hover:text-white">
      Reels
    </Link>


<Link
  href="/live"
  className={
    isLive
      ? "text-red-500 hover:text-red-400 font-semibold animate-pulse"
      : "text-zinc-400 hover:text-white"
  }
>
  {isLive ? "🔴 Live" : "Live"}
</Link>





    <Link href="/profile" className="text-zinc-300 hover:text-white">
      Profile
    </Link>

    <button
      onClick={() => supabase.auth.signOut()}
      className="ml-auto text-red-500 hover:text-red-400"
    >
      Logout
    </button>
  </>
)}


    {!isAuthed && (
      <Link href="/signin" className="ml-auto text-zinc-300 hover:text-white">
        Login
      </Link>
    )}
  </nav>
)
}