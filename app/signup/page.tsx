"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://www.cncglowspace.com/login",
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // If email confirmations are ON, there may be no session yet
    if (!data.session) {
      setMessage(
        "Check your email to confirm your account, then come back and log in."
      );
      return;
    }

    router.push("/feed");
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 20 }}>
      {/* Card wrapper */}
      <div
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          padding: 24,
          borderRadius: 16,
          boxShadow: "0 0 30px rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(8px)",
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 14, color: "#fff" }}>
          Create your GlowSpace account
        </h1>

        <form onSubmit={handleSignup} style={{ display: "grid", gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: 12,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.18)",
              backgroundColor: "#0b0f1a",
              color: "#ffffff",
              outline: "none",
            }}
          />

          <input
            type="password"
            placeholder="Password (min 6)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{
              padding: 12,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.18)",
              backgroundColor: "#0b0f1a",
              color: "#ffffff",
              outline: "none",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: 12,
              borderRadius: 10,
              border: "none",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              background: "linear-gradient(90deg, rgba(255,0,200,0.9), rgba(120,80,255,0.9))",
              color: "#fff",
            }}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          {error && <p style={{ color: "#ff4d4d", margin: 0 }}>{error}</p>}
          {message && <p style={{ color: "#fff", opacity: 0.9, margin: 0 }}>{message}</p>}
        </form>

        <p style={{ marginTop: 14, color: "#fff", opacity: 0.9 }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#ff7ad9", fontWeight: 700 }}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}