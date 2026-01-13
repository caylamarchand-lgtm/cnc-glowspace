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
      setMessage("Check your email to confirm your account, then come back and log in.");
      return;
    }

    router.push("/feed");
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 14 }}>
        Create your GlowSpace account
      </h1>

      <form onSubmit={handleSignup} style={{ display: "grid", gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 12, borderRadius: 10, border: "1px solid #333" }}
        />

        <input
          type="password"
          placeholder="Password (min 6)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          style={{ padding: 12, borderRadius: 10, border: "1px solid #333" }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ padding: 12, borderRadius: 10, border: "none", fontWeight: 700 }}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p>{message}</p>}
      </form>

      <p style={{ marginTop: 14 }}>
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
}