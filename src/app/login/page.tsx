import { cookies, headers } from 'next/headers';
import { Shield, Lock, ArrowRight, LogOut } from 'lucide-react';
import { auth, signIn, signOut } from '@/auth';
import { getUserAdminGuilds } from '@/lib/api';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await auth();
  const accessToken = (session as any)?.accessToken as string | undefined;

  let isAuthed = false;
  if (session && accessToken) {
    const adminGuilds = await getUserAdminGuilds(accessToken);
    if (adminGuilds) {
      isAuthed = true;
    }
  }

  if (isAuthed) {
    redirect('/dashboard');
  }

  return (
    <main className="flex-1 p-8 max-w-7xl mx-auto w-full flex flex-col items-center justify-center min-h-[70vh] font-mono">
      <div className="border border-white/10 bg-white/[0.01] p-12 max-w-lg w-full rounded-none flex flex-col items-center text-center relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#5E5CE6]" />
        
        {session ? (
          <>
            <Lock className="w-12 h-12 text-amber-500 mb-6" />
            <h1 className="text-3xl font-light tracking-tight text-white mb-4">Session Expired</h1>
            <p className="text-sm text-neutral-400 font-mono tracking-wide mb-8 leading-relaxed">
              Your Discord access token has expired or is invalid. Please log in again to refresh your connection with Pegasus Systems.
            </p>
            
            <div className="flex flex-col gap-4 w-full">
              <form action={async () => {
                'use server';
                await signIn('discord', { redirectTo: '/dashboard' });
              }} className="w-full">
                <button
                  type="submit"
                  className="border border-[#5E5CE6]/40 bg-[#5E5CE6]/10 px-8 py-4 text-xs font-mono text-[#5E5CE6] hover:bg-[#5E5CE6] hover:text-black hover:border-[#5E5CE6] transition-all rounded-none w-full tracking-widest uppercase flex items-center justify-center gap-3 group"
                >
                  <span>Re-authenticate</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <form action={async () => {
                'use server';
                await signOut({ redirectTo: '/login' });
              }} className="w-full">
                <button
                  type="submit"
                  className="border border-white/10 bg-white/[0.02] px-8 py-4 text-xs font-mono text-neutral-400 hover:border-red-500/40 hover:text-red-400 transition-colors rounded-none w-full tracking-widest uppercase flex items-center justify-center gap-3"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <Lock className="w-12 h-12 text-[#5E5CE6] mb-6" />
            <h1 className="text-3xl font-light tracking-tight text-white mb-4">Authorization Required</h1>
            <p className="text-sm text-neutral-400 font-mono tracking-wide mb-8 leading-relaxed">
              Connect your Discord account to authenticate with Pegasus Systems. Only real servers where you hold active Administrator permissions will be displayed.
            </p>
            
            <form action={async () => {
              'use server';
              await signIn('discord', { redirectTo: '/dashboard' });
            }} className="w-full">
              <button
                type="submit"
                className="border border-[#5E5CE6]/40 bg-[#5E5CE6]/10 px-8 py-4 text-xs font-mono text-[#5E5CE6] hover:bg-[#5E5CE6] hover:text-black hover:border-[#5E5CE6] transition-all rounded-none w-full tracking-widest uppercase flex items-center justify-center gap-3 group"
              >
                <span>Login with Discord</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
