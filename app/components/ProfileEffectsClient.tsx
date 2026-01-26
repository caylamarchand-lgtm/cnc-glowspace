"use client";

import { useEffect, useState } from "react";
import ProfileEffects, { type Effect } from "./ProfileEffects";

export default function ProfileEffectsClient({ effect }: { effect: Effect }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // renders nothing on server + first client paint -> prevents hydration mismatch
  if (!mounted) return null;

  return <ProfileEffects effect={effect} />;
}
