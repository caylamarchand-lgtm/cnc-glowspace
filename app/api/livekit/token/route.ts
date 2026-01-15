import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roomName, userName, isHost } = body;

    if (!roomName || !userName) {
      return NextResponse.json(
        { error: "Missing roomName or userName" },
        { status: 400 }
      );
    }

    const token = new AccessToken(
      process.env.LIVEKIT_API_KEY!,
      process.env.LIVEKIT_API_SECRET!,
      {
        identity: userName,
      }
    );

    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: !!isHost,
      canSubscribe: true,
    });

    return NextResponse.json({
      token: token.toJwt(),
    });
  } catch (err) {
    console.error("LiveKit token error:", err);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
