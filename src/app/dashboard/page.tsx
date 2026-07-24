import { Shield, ShieldAlert, ChevronRight, Plus } from"lucide-react";
import Link from"next/link";
import { redirect } from"next/navigation";
import { auth } from"@/auth";
import { db } from"@/lib/db";
import { eq, inArray, and, sql } from"drizzle-orm";
import { accounts, guilds as dbGuilds } from"../../../schemas";

export default async function DashboardPage() {
 const session = await auth();

 if (!session || !session.user) {
 redirect("/api/auth/signin");
 }

 const [account] = await db
 .select({ access_token: accounts.access_token })
 .from(accounts)
 .where(sql`${accounts.userId} = ${session.user.id} AND ${accounts.provider} = 'discord'`)
 .limit(1);

 if (!account || !account.access_token) {
 return (
 <div className="p-8 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
 <ShieldAlert className="w-12 h-12 text-destructive mb-4"/>
 <h1 className="text-2xl font-bold text-foreground">Authentication Error</h1>
 <p className="text-muted-foreground mt-2 text-center max-w-md mb-2">
 We couldn't retrieve your Discord access token. Please try logging out and logging back in.
 </p>
 <div className="bg-black/50 p-4 rounded-lg w-full text-left text-xs text-white/70 mb-6 overflow-auto">
 <p>Session User ID: {session?.user?.id}</p>
 <p>Account Found: {account ?"Yes":"No"}</p>
 <p>Access Token: {account?.access_token ?"Exists":"Null/Undefined"}</p>
 </div>
 <Link href="/api/auth/signout"className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors">
 Sign Out
 </Link>
 </div>
 );
 }

 const res = await fetch("https://discord.com/api/v10/users/@me/guilds", {
 headers: {
 Authorization: `Bearer ${account.access_token}`,
 },
 // Prevent caching for this request to always get fresh guilds
 cache: 'no-store',
 });

 if (!res.ok) {
 return (
 <div className="p-8 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
 <ShieldAlert className="w-12 h-12 text-destructive mb-4"/>
 <h1 className="text-2xl font-bold text-foreground">Failed to fetch servers</h1>
 <p className="text-muted-foreground mt-2 text-center max-w-md">
 We couldn't fetch your servers from Discord. Please try logging out and logging back in.
 </p>
 </div>
 );
 }

 const discordGuilds = await res.json();

 // Filter for Administrator permissions (0x8)
 const adminGuilds = discordGuilds.filter((guild: any) => {
 return (BigInt(guild.permissions) & BigInt(0x8)) === BigInt(0x8);
 });

 // Fetch configured guilds from database
 const adminGuildIds = adminGuilds.map((g: any) => g.id);
 let configuredGuildIds: string[] = [];
 if (adminGuildIds.length > 0) {
 const configured = await db
 .select({ id: dbGuilds.id })
 .from(dbGuilds)
 .where(inArray(dbGuilds.id, adminGuildIds));
 configuredGuildIds = configured.map((c) => c.id);
 }

 // Split adminGuilds into invited and not invited
 const invitedGuilds = adminGuilds.filter((g: any) =>
 configuredGuildIds.includes(g.id)
 );
 const notInvitedGuilds = adminGuilds.filter(
 (g: any) => !configuredGuildIds.includes(g.id)
 );

 const getGuildIconUrl = (guildId: string, iconHash: string | null) => {
 if (!iconHash) return null;
 return `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.png`;
 };

 return (
 <div className="p-8 max-w-6xl mx-auto space-y-8">
 <div>
 <h1 className="text-3xl font-bold text-foreground tracking-tight">
 Select a Server
 </h1>
 <p className="text-muted-foreground mt-2">
 Manage your Discord servers with Pegasus.
 </p>
 </div>

 <div className="space-y-8">
 <div>
 <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
 <Shield className="w-5 h-5 text-primary"/>
 Manage Servers
 </h2>
 {invitedGuilds.length === 0 ? (
 <div className="bg-card/50 border border-border/50 rounded-xl p-8 text-center">
 <p className="text-muted-foreground">No active servers found. Add Pegasus to a server below.</p>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {invitedGuilds.map((guild: any) => (
 <Link key={guild.id} href={`/dashboard/${guild.id}`}>
 <div className="bg-card border border-border/50 rounded-xl p-4 hover:border-primary/50 transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.1)] group h-full flex items-center">
 <div className="flex items-center gap-4 w-full">
 {guild.icon ? (
 <img
 src={getGuildIconUrl(guild.id, guild.icon)!}
 alt={`${guild.name} icon`}
 className="w-12 h-12 rounded-full object-cover border border-border/50"
 />
 ) : (
 <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg shrink-0">
 {guild.name.charAt(0)}
 </div>
 )}
 <div className="flex-1 min-w-0">
 <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
 {guild.name}
 </h3>
 <p className="text-xs text-muted-foreground">
 Manage settings
 </p>
 </div>
 <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0"/>
 </div>
 </div>
 </Link>
 ))}
 </div>
 )}
 </div>

 {notInvitedGuilds.length > 0 && (
 <div>
 <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
 <ShieldAlert className="w-5 h-5 text-muted-foreground"/>
 Add to Server
 </h2>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {notInvitedGuilds.map((guild: any) => (
 <div
 key={guild.id}
 className="bg-card/30 border border-border/50 rounded-xl p-4 opacity-80 hover:opacity-100 transition-opacity flex items-center"
 >
 <div className="flex items-center gap-4 w-full">
 {guild.icon ? (
 <img
 src={getGuildIconUrl(guild.id, guild.icon)!}
 alt={`${guild.name} icon`}
 className="w-12 h-12 rounded-full object-cover border border-border/50 grayscale opacity-75"
 />
 ) : (
 <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-lg shrink-0">
 {guild.name.charAt(0)}
 </div>
 )}
 <div className="flex-1 min-w-0">
 <h3 className="font-semibold text-foreground truncate">
 {guild.name}
 </h3>
 <p className="text-xs text-muted-foreground">
 Not invited
 </p>
 </div>
 <Link
 href={`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=872320742191095&integration_type=0&scope=bot+applications.commands&guild_id=${guild.id}`}
 target="_blank"
 rel="noopener noreferrer"
 >
 <button className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium rounded-lg transition-colors shrink-0">
 <Plus className="w-4 h-4"/>
 Invite
 </button>
 </Link>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 </div>
 );
}
