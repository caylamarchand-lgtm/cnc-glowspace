"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ReelUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Pick a video first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage("You must be logged in.");
        setLoading(false);
        return;
      }

      const ext = selectedFile.name.split(".").pop() ?? "mp4";
      const filePath = `${user.id}/${crypto.randomUUID()}.${ext}`;


      const { error: uploadError } = await supabase.storage
        .from("reels")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("reels").insert({
        user_id: user.id,
        video_path: filePath,
      });

      if (insertError) throw insertError;

      setMessage("Reel uploaded 🎉");
      setSelectedFile(null);
    } catch (err: any) {
      setMessage(err.message ?? "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <input
        id="reel-upload-input"
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
      />

      <button
        onClick={() => document.getElementById("reel-upload-input")?.click()}
        disabled={loading}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading ? "Uploading…" : "+ Upload Reel"}
      </button>

      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="text-sm text-zinc-300 underline"
        >
          Post
        </button>
      )}

      {message && <span className="text-sm text-zinc-400">{message}</span>}
    </div>
  );
}