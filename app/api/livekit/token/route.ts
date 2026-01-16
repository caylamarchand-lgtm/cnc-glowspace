import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

type Body = {
  roomName: string;
  userName: string;
  isHost?: boolean;
};

export async function POST(req: Request) {
  try {
    const { roomName, userName, isHost = false } = (await req.json()) as Body;

    if (!roomName || !userName) {
      return NextResponse.json(
        { error: "Missing roomName or userName" },
        { status: 400 }
      );
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Missing LIVEKIT_API_KEY or LIVEKIT_API_SECRET" },
        { status: 500 }
      );
    }

    // identity must be unique per person
    const identity = `${userName}-${Math.random().toString(36).slice(2, 8)}`;

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