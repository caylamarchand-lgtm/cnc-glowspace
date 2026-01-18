"use client";

import { LiveKitRoom, VideoConference, useRoomContext } from "@livekit/components-react";

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

  // ✅ LIVE PROTECTION STATES
  const [showRules, setShowRules] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [rulesError, setRulesError] = useState<string | null>(null);

  // ✅ IMPORTANT: In the browser, ONLY NEXT_PUBLIC_* env vars exist.
  const serverUrl = useMemo(() => {
    return process.env.NEXT_PUBLIC_LIVEKIT_URL || process.env.LIVEKIT_URL || "";
  }, []);

  // ✅ RULES TEXT (easy to edit later)
  const RULES = [
    "21+ only. No minors.",
    "No nudity or sexual content.",
    "No harassment, threats, hate speech, or bullying.",
    "No doxxing (private info), stalking, or violence.",
    "No illegal activity on stream.",
    "No scams, fraud, or selling illegal/restricted items.",
    "Respect copyright (don’t stream full movies/music as the main content).",
    "GlowSpace may end streams or suspend accounts for violations.",
  ];

  useEffect(() => {
    let cancelled = false;

    async function getToken() {
      try {
        setErr(null);
        setToken(null);

        // ✅ HOST PROTECTION:
        // Host must accept rules before token request
        if (isHost && !rulesAccepted) {
          setShowRules(true);
          return;
        }

        const res = await fetch("/api/livekit/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomName, userName, isHost }),
        });

        const data = await res.json();

        // ✅ HARDENED TOKEN EXTRACTION (prevents [object Object])
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
  }, [roomName, userName, isHost, rulesAccepted]);

  if (!serverUrl) {
    return (
      <div className="p-6 text-center">
        Missing LiveKit URL. Set <b>NEXT_PUBLIC_LIVEKIT_URL</b> in your env.
      </div>
    );
  }

  // ✅ RULES MODAL (shows BEFORE token request)
  if (showRules && isHost && !rulesAccepted) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          zIndex: 9999,
        }}
      >
        <div
          style={{
            width: "min(600px, 100%)",
            background: "rgba(0,0,0,0.92)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 18,
            color: "#fff",
            boxShadow: "0 0 30px rgba(0,0,0,0.6)",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>
            GlowSpace Live Rules (21+)
          </h2>

          <p style={{ marginTop: 0, opacity: 0.9 }}>
            To protect GlowSpace and our community, you must agree before going
            Live.
          </p>

          <ul style={{ lineHeight: 1.55, opacity: 0.95, paddingLeft: 18 }}>
            {RULES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>

          <label style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <input
              type="checkbox"
              checked={rulesAccepted}
              onChange={(e) => {
                setRulesAccepted(e.target.checked);
                setRulesError(null);
              }}
            />
            <span>
              I confirm I am <b>21+</b> and I agree to follow the Live Rules.
            </span>
          </label>

          {rulesError && (
            <p style={{ color: "#ff4d4d", marginTop: 10, marginBottom: 0 }}>
              {rulesError}
            </p>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button
              onClick={() => {
                if (!rulesAccepted) {
                  setRulesError("You must check the box to continue.");
                  return;
                }
                setShowRules(false);
              }}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                fontWeight: 800,
                cursor: "pointer",
                background:
                  "linear-gradient(90deg, rgba(255,0,200,0.9), rgba(120,80,255,0.9))",
                color: "#fff",
              }}
            >
              Continue to Live
            </button>

            <button
              onClick={() => {
                // Cancel = kick them out of live screen
                setShowRules(false);
                setRulesAccepted(false);
                setRulesError(null);
                setErr("Live cancelled. You must accept the rules to go Live.");
              }}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.2)",
                fontWeight: 700,
                cursor: "pointer",
                background: "transparent",
                color: "#fff",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
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
      token={token}
      serverUrl={serverUrl}
      connect
      video
      audio
      style={{ height: "100vh" }}
    >
      <VideoConference />
    </LiveKitRoom>
  );
}