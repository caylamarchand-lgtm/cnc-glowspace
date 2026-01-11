export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
import { createClient } from "@supabase/supabase-js";
const tokenId = process.env.MUX_TOKEN_ID;
const tokenSecret = process.env.MUX_TOKEN_SECRET;

// ✅ Don’t print secrets. Just confirm they exist.
console.log("MUX tokenId exists?", !!tokenId);
console.log("MUX tokenSecret exists?", !!tokenSecret);
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const mux = new Mux({
  tokenId: tokenId!,
  tokenSecret: tokenSecret!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const user_id = body?.user_id ?? null;
    const caption = body?.caption ?? null;

    const upload = await mux.video.uploads.create({
      cors_origin: "http://localhost:3000",
      new_asset_settings: {
        playback_policy: ["public"],
      },
    });

    // ✅ Create a placeholder row in Supabase now
    const { data: reelRow, error: insertError } = await supabaseAdmin
      .from("reels")
      .insert({
        user_id,
        caption,
        mux_upload_id: upload.id,
        mux_asset_id: null,
        mux_playback_id: null,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create reel row", details: insertError },
        { status: 500 }
      );
    }

    return NextResponse.json({
      uploadUrl: upload.url,
      uploadId: upload.id,
      reelId: reelRow.id,
    });
  } catch (error: any) {
    console.error("Mux upload error full:", error);
    return NextResponse.json(
      {
        error: "Failed to create Mux upload",
        message: error?.message || String(error),
        status: error?.statusCode || error?.status || 500,
        details: error?.response?.data || error?.body || null,
      },
      { status: 500 }
    );
  }
}