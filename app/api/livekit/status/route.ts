import { NextResponse } from "next/server";
import { RoomServiceClient } from "livekit-server-sdk";
import { createClient} from "@supabase/supabase-js";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const roomName = searchParams.get("roomName");
    const all = searchParams.get("all") === "true";

    // Server-side LiveKit URL (https)
    const host = process.env.LIVEKIT_URL;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!host || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Missing LIVEKIT_URL or LIVEKIT_API_KEY or LIVEKIT_API_SECRET" },
        { status: 500 }
      );
    }

// Supabase server client (for avatar + username lookup)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

    const roomService = new RoomServiceClient(host, apiKey, apiSecret);



    // ✅ 1) ALL rooms mode (for LiveBubbles)
   if (all) {
  const rooms = await roomService.listRooms();

  const results = await Promise.all(
    rooms.map(async (r) => {
      const participants = await roomService.listParticipants(r.name);

      if (participants.length === 0) return null;

      const userIds = participants.map((p) => p.identity);

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", userIds);

      return {
        roomName: r.name,
        count: participants.length,
        users: profiles ?? [],
      };
    })
  );

  return NextResponse.json({
    live: results.filter(Boolean),
  });
}


    // ✅ 2) Single room mode (nav indicator)
    if (!roomName) {
      return NextResponse.json(
        { error: "Missing roomName or use ?all=true" },
        { status: 400 }
      );
    }

    const rooms = await roomService.listRooms([roomName]);

    if (!rooms || rooms.length === 0) {
      return NextResponse.json({ isLive: false, count: 0 });
    }

    const participants = await roomService.listParticipants(roomName);

    return NextResponse.json({
      isLive: participants.length > 0,
      count: participants.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Status error" },
      { status: 500 }
    );
  }
}