"use client";

import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useMemo, useState } from "react";

type Props = {
  roomName: string;
  userName: string;
  isHost?: boolean;
};

export default function LiveStreamRoom({
  roomName,
  userName,
  isHost = false,
}: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // ✅ IMPORTANT:
  // In the browser, ONLY NEXT_PUBLIC_* env vars exist.
  // If you accidentally set LIVEKIT_URL (without NEXT_PUBLIC), it will be undefined here.
  const serverUrl = useMemo(() => {
    
    return process.env.NEXT_PUBLIC_LIVEKIT_URL || process.env.LIVEKIT_URL || "";
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function getToken() {
      try {
        setErr(null);
        setToken(null);

        const res = await fetch("/api/livekit/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomName, userName, isHost }),
        });

        const data = await res.json();

        // ✅ HARDENED TOKEN EXTRACTION (prevents [object Object])
        // Accept either:
        // 1) { token: "JWT..." }
        // 2) "JWT..." (if your API returns the string directly)
        // 3) { token: { token: "JWT..." } } (common accidental nesting)
        const maybeToken =
          typeof data === "string"
            ? data
            : typeof data?.token === "string"
            ? data.token
            : typeof data?.token?.token === "string"
            ? data.token.token
            : null;

        if (!res.ok) {
          throw new Error(
            `Token API error (${res.status}): ${data?.error || "Unknown error"}`
          );
        }

        if (!maybeToken) {
          throw new Error(
            `Token response was not a string. Got: ${JSON.stringify(data)}`
          );
        }

        if (!cancelled) setToken(maybeToken);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Failed to get token");
      }
    }

    getToken();
    return () => {
      cancelled = true;
    };
  }, [roomName, userName, isHost]);

  if (!serverUrl) {
    return (
      <div className="p-6 text-center">
        Missing LiveKit URL. Set <b>NEXT_PUBLIC_LIVEKIT_URL</b> in your env.
      </div>
    );
  }

  if (err) {
    return (
      <div className="p-6 text-center">
        <div className="font-semibold mb-2">Live error</div>
        <pre className="text-left whitespace-pre-wrap text-sm opacity-80">
          {err}
        </pre>
      </div>
    );
  }

  if (!token) return <div className="p-6 text-center">Connecting…</div>;

  return (
    <LiveKitRoom
      token={token}                 // ✅ guaranteed string now
      serverUrl={serverUrl}         // ✅ guaranteed string now
      connect
      video
      audio
      style={{ height: "100vh" }}
    >
      <VideoConference />
    </LiveKitRoom>
  );
}