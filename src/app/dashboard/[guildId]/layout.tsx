import { GuildTopNav } from '@/components/GuildTopNav';
import { cookies } from 'next/headers';
import { getUserAdminGuilds, getDashboardGuilds } from '@/lib/api';
import { redirect } from 'next/navigation';

export default async function GuildDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('discord_access_token')?.value;
  const adminGuilds = await getUserAdminGuilds(accessToken);
  const fallbackGuilds = await getDashboardGuilds();

  const allGuilds = adminGuilds || fallbackGuilds;

  const userCookie = cookieStore.get('discord_user')?.value;
  let userId: string | null = null;
  if (userCookie) {
    try {
      userId = JSON.parse(userCookie).id;
    } catch (e) {}
  }
  let isSystemAdmin = false;
  if (userId) {
    let adminIds: string[] = [];
    try {
      adminIds = process.env.ADMIN ? JSON.parse(process.env.ADMIN) : [];
    } catch {
      adminIds = [process.env.ADMIN || ''];
    }
    isSystemAdmin = adminIds.includes(userId);
  }
  
  const authorizedGuilds = allGuilds.filter((g: any) => 
    g.isAdmin === undefined ? true : (g.isAdmin && g.botInServer)
  );

  const isAuthorized = authorizedGuilds.some((g: any) => g.id === guildId);

  // If user is not logged in (!adminGuilds) or not authorized for this guild, redirect
  if (!adminGuilds || !isAuthorized) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col w-full h-full relative z-10">
      <div className="flex-1 flex flex-col min-h-screen bg-transparent">
        <GuildTopNav guildId={guildId} guilds={authorizedGuilds} isSystemAdmin={isSystemAdmin} />
        {children}
      </div>
    </div>
  );
}
