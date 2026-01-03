'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import type { Session } from '@supabase/supabase-js'

export default function NavBar() {
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then((res) => {
      setIsAuthed(!!res.data.session)
    })

    // Listen for auth changes
    const { data } = supabase.auth.onAuthStateChange(
      (_event, session: Session | null) => {
        setIsAuthed(!!session)
      }
    )

    return () => {
      data.subscription.unsubscribe()
    }
  }, [])

  return (
    <nav className="flex items-center gap-6">
      {/* Brand / Home */}
      <Link href="/" className="text-zinc-100 hover:text-white font-medium">
        GlowSpace
      </Link>

      {/* Your main links */}
      <Link href="/feed" className="text-zinc-300 hover:text-white">
        Feed
      </Link>

      <Link href="/create" className="text-zinc-300 hover:text-white">
        Create
      </Link>

      <Link href="/makers" className="text-zinc-300 hover:text-white">
        Makers
      </Link>

      <Link href="/explore" className="text-zinc-300 hover:text-white">
        Explore
      </Link>

      {/* Auth link */}
      {isAuthed ? (
        <Link href="/profile" className="text-zinc-300 hover:text-white">
          Profile
        </Link>
      ) : (
        <Link href="/login" className="text-zinc-300 hover:text-white">
          Login
        </Link>
      )}
    </nav>
  )
}