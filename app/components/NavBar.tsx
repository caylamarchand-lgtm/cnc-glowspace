"use client";

import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full bg-black border-b border-zinc-800 px-6 py-4 flex gap-6 text-sm">
     <Link href="/glowspace" className="font-bold text-white hover:text-yellow-400">
  GlowSpace
</Link>

      <Link href="/feed" className="text-zinc-300 hover:text-white">
        Feed
      </Link>

      <Link href="/create" className="text-zinc-300 hover:text-white">
        Create
      </Link>

      <Link href="/explore" className="text-zinc-300 hover:text-white">
        Explore
      </Link>
      <Link href="/login" className="text-zinc-300 hover:text-white">
      Login
    </Link>
      <Link href="/profile" className="ml-auto text-zinc-300 hover:text-white">
        Profile
      </Link>
    </nav>
  );
}