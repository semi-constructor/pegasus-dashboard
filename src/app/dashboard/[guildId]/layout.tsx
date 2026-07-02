import { GuildTopNav } from '@/components/GuildTopNav';
import { auth } from '@/auth';
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
  const session = await auth();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const adminGuilds = await getUserAdminGuilds(accessToken);
  const fallbackGuilds = await getDashboardGuilds();

  const allGuilds = adminGuilds || fallbackGuilds;

  const discordId = (session as any)?.discordId as string | undefined;
  let isSystemAdmin = false;
  if (discordId) {
    let adminIds: string[] = [];
    try {
      adminIds = process.env.ADMIN ? JSON.parse(process.env.ADMIN) : [];
    } catch {
      adminIds = [process.env.ADMIN || ''];
    }
    isSystemAdmin = adminIds.includes(discordId);
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
