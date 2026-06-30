import { Sidebar } from '@/components/Sidebar';
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
  
  const authorizedGuilds = allGuilds.filter((g: any) => 
    g.isAdmin === undefined ? true : (g.isAdmin && g.botInServer)
  );

  const isAuthorized = authorizedGuilds.some((g: any) => g.id === guildId);

  // If user is not logged in (!adminGuilds) or not authorized for this guild, redirect
  if (!adminGuilds || !isAuthorized) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col lg:flex-row w-full">
      <Sidebar guilds={authorizedGuilds} />
      <div className="flex-1 flex flex-col min-h-screen bg-black overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
