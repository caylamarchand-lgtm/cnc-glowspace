import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

type Body = {
  roomName: string;
  userName: string;
  isHost?: boolean;
};

export async function POST(req: Request) {
  try {
    // Expect userId from the client (from Supabase session)
const { roomName, userName, userId, isHost } = await req.json();

if (!roomName || !userName || !userId) {
  return NextResponse.json(
    { error: "Missing roomName, userName, or userId" },
    { status: 400 }
  );
}

// identity should be stable + unique per user
const identity = userId; // ✅ Supabase auth user.id

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Missing LIVEKIT_API_KEY or LIVEKIT_API_SECRET" },
        { status: 500 }
      );
    }

    

    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      name: userName,
    });

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      roomAdmin: !!isHost, // host powers if you want them
    });

    const jwt = await at.toJwt();

    return NextResponse.json({ token: jwt });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Token error" },
      { status: 500 }
    );
  }
}