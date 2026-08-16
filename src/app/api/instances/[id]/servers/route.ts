import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { hostedInstances } from 'schemas/billing';
import { eq, and } from 'drizzle-orm';
import { decryptToken } from '@/lib/encryption';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const instances = await db.select().from(hostedInstances)
      .where(
        and(
          eq(hostedInstances.id, id),
          eq(hostedInstances.userId, session.user.id)
        )
      )
      .limit(1);

    if (instances.length === 0) {
      return NextResponse.json({ error: 'Instance not found or unauthorized' }, { status: 404 });
    }

    const instance = instances[0];
    if (!instance.encryptedBotToken) {
      return NextResponse.json({ servers: [] });
    }

    let token = '';
    try {
      token = decryptToken(instance.encryptedBotToken);
    } catch (e) {
      return NextResponse.json({ error: 'Failed to decrypt bot token' }, { status: 500 });
    }

    // Fetch guilds from Discord API
    const discordRes = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        Authorization: `Bot ${token}`
      }
    });

    if (!discordRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch guilds from Discord API' }, { status: 500 });
    }

    const guilds = await discordRes.json();

    // Optionally map guilds to a simplified format
    const servers = guilds.map((g: any) => ({
      id: g.id,
      name: g.name,
      icon: g.icon ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png` : null,
      isOwner: g.owner,
      permissions: g.permissions
    }));

    return NextResponse.json({ servers });
  } catch (error) {
    console.error('[SERVERS_GET_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
