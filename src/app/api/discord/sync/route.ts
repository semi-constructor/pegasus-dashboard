import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSyncedGuilds } from "@/lib/discord";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const syncedGuilds = await getSyncedGuilds(session.user.id);

    return NextResponse.json(syncedGuilds);
  } catch (error) {
    console.error("Failed to sync guilds:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
