import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  try {
    const res = await fetch(`https://discord.com/api/v10/users/${id}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = await res.json();
    const avatarUrl = data.avatar 
      ? `https://cdn.discordapp.com/avatars/${id}/${data.avatar}.${data.avatar.startsWith('a_') ? 'gif' : 'png'}?size=512`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(data.discriminator) % 5}.png`;

    return NextResponse.json({ avatarUrl, username: data.username, globalName: data.global_name });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
