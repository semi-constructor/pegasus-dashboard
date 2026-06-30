import { AmbientBackground } from '@/components/AmbientBackground';
import { ScrollHeader } from '@/components/ScrollHeader';
import { cookies } from 'next/headers';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('discord_user')?.value;
  let user: { username?: string; id?: string } | null = null;
  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
    } catch (e) {}
  }

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 flex flex-col w-full relative selection:bg-[#5E5CE6]/30 selection:text-white">
      <AmbientBackground />
      <ScrollHeader user={user} />
      <div className="flex-1 flex flex-col min-h-screen bg-transparent relative z-10 pt-16">
        {children}
      </div>
    </div>
  );
}
