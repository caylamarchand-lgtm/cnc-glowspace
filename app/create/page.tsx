"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGlowcode } from "../lib/glowcodes";

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
    console.log("HANDLE SAVE FIRED");

    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!css.trim()) {
      setError("CSS is required.");
      return;
    }

    setLoading(true);

    try {
      const tagArray =
        tags
          ?.split(",")
          .map((t) => t.trim())
          .filter(Boolean) || [];

      await createGlowcode({
        title: title.trim(),
        description: description.trim() || undefined,
        css,
        tags: tagArray.length ? tagArray : undefined,
      });

      setSuccess("Saved! ✨");
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
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto", color: "white" }}>
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
            borderRadius: 8,
            background: "rgba(255,0,0,0.15)",
            border: "1px solid rgba(255,255,255,0.12)",
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
            borderRadius: 8,
            background: "rgba(0,255,180,0.15)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {success}
        </div>
      )}

      {/* THIS is the "card wrapper" that makes the form always visible */}
      <div
        style={{
          display: "grid",
          gap: 12,
          maxWidth: 900,

          // force visibility (in case global CSS is messing with forms)
          opacity: 1,
          visibility: "visible",
          height: "auto",
          pointerEvents: "auto",

          // card look so you can SEE it
          padding: 16,
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(0,0,0,0.25)",
          backdropFilter: "blur(8px)",
        }}
      >
        <label style={{ fontWeight: 700 }}>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Retro Pink Glow"
          style={{
            display: "block",
            width: "100%",
            appearance: "none",
            padding: 12,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.06)",
            color: "white",
            outline: "none",
          }}
        />

        <label style={{ fontWeight: 700 }}>Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description..."
          style={{
            display: "block",
            width: "100%",
            appearance: "none",
            padding: 12,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.06)",
            color: "white",
            outline: "none",
          }}
        />

        <label style={{ fontWeight: 700 }}>GlowCode CSS</label>
        <textarea
          value={css}
          onChange={(e) => setCss(e.target.value)}
          placeholder={`/* CSS here */\n.profileCard { box-shadow: 0 0 20px rgba(255,105,180,.5); }`}
          style={{
            display: "block",
            width: "100%",
            appearance: "none",
            padding: 12,
            borderRadius: 10,
            minHeight: 220,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.06)",
            color: "white",
            fontFamily: "monospace",
            outline: "none",
            resize: "vertical",
          }}
        />

        <label style={{ fontWeight: 700 }}>Tags (comma separated)</label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="pink, retro, glow"
          style={{
            display: "block",
            width: "100%",
            appearance: "none",
            padding: 12,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.06)",
            color: "white",
            outline: "none",
          }}
        />

        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            fontWeight: 800,
            border: "1px solid rgba(255,255,255,0.18)",
            background: loading
              ? "rgba(255,255,255,0.08)"
              : "rgba(255,105,180,0.25)",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            width: 220,
          }}
        >
          {loading ? "Saving..." : "Save GlowCode"}
        </button>
      </div>
    </main>
  );
}