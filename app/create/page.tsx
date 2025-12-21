"use client";

import { useState } from "react";
import { createGlowcode } from "../lib/glowcodes";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [css, setCss] = useState("");
  const [tags, setTags] = useState(""); // comma separated
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    setSuccess(null);

    if (!title.trim()) return setError("Title is required.");
    if (!css.trim()) return setError("CSS is required.");

    setLoading(true);
    try {
      const tagArray =
        tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean) || [];

      await createGlowcode({
        title: title.trim(),
        description: description.trim() || undefined,
        css,
        tags: tagArray.length ? tagArray : undefined,
      });

      setSuccess("Saved! 🎉");
      setTitle("");
      setDescription("");
      setCss("");
      setTags("");

      // Optional: send them to profile after save
      setTimeout(() => router.push("/profile"), 600);
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong saving your GlowCode.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 6 }}>
        Create GlowCode
      </h1>
      <p style={{ opacity: 0.8, marginBottom: 18 }}>
        Share CSS that only affects your profile design.
      </p>

      {error && (
        <div
          style={{
            marginBottom: 12,
            padding: 12,
            borderRadius: 10,
            border: "1px solid rgba(255,0,0,0.35)",
            background: "rgba(255,0,0,0.08)",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            marginBottom: 12,
            padding: 12,
            borderRadius: 10,
            border: "1px solid rgba(0,255,140,0.35)",
            background: "rgba(0,255,140,0.08)",
          }}
        >
          {success}
        </div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 700 }}>Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Neon Pink Glow Card"
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(0,0,0,0.25)",
              color: "white",
            }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 700 }}>Description (optional)</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this style do?"
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(0,0,0,0.25)",
              color: "white",
            }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 700 }}>Tags (optional)</span>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="neon, pink, glitter, cards"
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(0,0,0,0.25)",
              color: "white",
            }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 700 }}>CSS</span>
          <textarea
            value={css}
            onChange={(e) => setCss(e.target.value)}
            placeholder={`/* Example */\n.profile-card {\n  border: 2px solid hotpink;\n  box-shadow: 0 0 20px hotpink;\n}\n`}
            rows={12}
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(0,0,0,0.25)",
              color: "white",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            }}
          />
        </label>

        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.18)",
            background: loading ? "rgba(255,255,255,0.08)" : "rgba(255, 105, 180, 0.25)",
            color: "white",
            fontWeight: 800,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Saving..." : "Save GlowCode"}
        </button>
      </div>
    </main>
  );
}