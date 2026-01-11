export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
import { createClient } from "@supabase/supabase-js";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { uploadId, reelId } = await req.json();

    if (!uploadId || !reelId) {
      return NextResponse.json(
        { error: "Missing uploadId or reelId" },
        { status: 400 }
      );
    }

    const upload = await mux.video.uploads.retrieve(uploadId);
    const assetId = (upload as any)?.asset_id;

    if (!assetId) {
      return NextResponse.json(
        { error: "Asset not ready yet", status: (upload as any)?.status ?? null },
        { status: 202 }
      );
    }

    const asset = await mux.video.assets.retrieve(assetId);
    const playbackId = (asset as any)?.playback_ids?.[0]?.id ?? null;

    const { error: updateError } = await supabaseAdmin
      .from("reels")
      .update({ mux_asset_id: assetId, mux_playback_id: playbackId })
      .eq("id", reelId);

    if (updateError) {
      return NextResponse.json(
        { error: "Supabase update failed", details: updateError },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, assetId, playbackId });
  } catch (error: any) {
    console.error("Finalize error:", error);
    return NextResponse.json(
      { error: "Finalize failed", message: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}