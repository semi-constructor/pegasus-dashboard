import { Activity, Server, Zap, Database, ArrowUpRight, BarChart3, Users, Globe } from"lucide-react";
import { db } from"@/lib/db";
import { users, guilds, members } from"../../../../schemas";
import { sql } from"drizzle-orm";

export const dynamic ="force-dynamic";

export default async function AdminDashboard() {
 const [guildCountRes, userCountRes, memberCountRes] = await Promise.all([
 db.select({ count: sql<number>`COUNT(*)` }).from(guilds),
 db.select({ count: sql<number>`COUNT(*)` }).from(users),
 db.select({ count: sql<number>`COUNT(*)` }).from(members),
 ]);

 const totalGuilds = guildCountRes[0]?.count || 0;
 const totalUsers = userCountRes[0]?.count || 0;
 const totalMembers = memberCountRes[0]?.count || 0;

 const metrics = [
 { label:"Total Users", value: totalUsers.toString(), icon: Zap, color:"text-foreground"},
 { label:"Active Guilds", value: totalGuilds.toString(), icon: Users, color:"text-foreground"},
 { label:"Total Memberships", value: totalMembers.toString(), icon: Activity, color:"text-foreground"},
 { label:"Database Status", value:"Online", icon: Server, color:"text-foreground"},
 ];

 return (
 <div className="space-y-8">
 <div>
 <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
 System Overview
 </h2>
 <p className="text-muted-foreground mt-1">Real-time metrics from the database.</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
 {metrics.map((metric, i) => (
 <div key={i} className="relative p-6 rounded-2xl border border-white/10 bg-card/30 backdrop-blur-xl overflow-hidden group">
 <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
 <div className="flex justify-between items-start mb-4">
 <div className={`p-2 rounded-lg bg-black/40 border border-white/5 ${metric.color}`}>
 <metric.icon className="h-5 w-5"/>
 </div>
 </div>
 <div>
 <h3 className="text-3xl font-bold text-white/90">{metric.value}</h3>
 <p className="text-sm text-muted-foreground mt-1">{metric.label}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
}
