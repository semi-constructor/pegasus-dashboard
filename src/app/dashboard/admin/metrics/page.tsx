import MetricsClient from"./components/MetricsClient";

export const dynamic ="force-dynamic";

export default async function MetricsPage() {
 const defaultData = {
 status:"offline",
 uptime: 0,
 guilds: { total: 0 },
 users: { total: 0 },
 system: { memory_usage: 0, memory_total: 34359738368, cpu_usage: 0, latency: 0 },
 health: {
 components: {
 database: { latency: 0 },
 cache: { hitRate: 0, size: 0 },
 }
 }
 };

 let data = { ...defaultData };

 try {
 const apiUrl = process.env.API_URL ||"http://localhost:2000";
 
 // Fetch from bot stats API
 const [statsRes, healthRes] = await Promise.all([
 fetch(`${apiUrl}/stats`, { 
 headers: { Authorization: `Bearer ${process.env.BOT_API_TOKEN}` },
 next: { revalidate: 5 } // Cache for 5 seconds per API doc
 }).catch(() => null),
 fetch(`${apiUrl}/monitoring/health`, { 
 headers: { Authorization: `Bearer ${process.env.BOT_API_TOKEN}` },
 next: { revalidate: 5 }
 }).catch(() => null)
 ]);

 if (statsRes?.ok) {
 const stats = await statsRes.json();
 data.status = stats.status;
 data.uptime = stats.uptime;
 data.guilds = stats.guilds;
 data.users = stats.users;
 data.system = stats.system;
 } else {
 // Fallback to real DB stats
 const { db } = await import("@/lib/db");
 const { guilds, users } = await import("../../../../../schemas");
 const { sql } = await import("drizzle-orm");
 
 const [guildCount, userCount] = await Promise.all([
 db.select({ count: sql<number>`COUNT(*)` }).from(guilds),
 db.select({ count: sql<number>`COUNT(*)` }).from(users),
 ]);
 
 data.status ="offline";
 data.uptime = 0;
 data.guilds = { total: guildCount[0]?.count || 0 };
 data.users = { total: userCount[0]?.count || 0 };
 data.system = { memory_usage: 0, memory_total: 34359738368, cpu_usage: 0, latency: 0 };
 }

 if (healthRes?.ok) {
 const health = await healthRes.json();
 data.health = health;
 } else {
 data.health = {
 components: {
 database: { latency: 0 },
 cache: { hitRate: 0, size: 0 }
 }
 };
 }
 } catch (error) {
 console.error("Failed to fetch metrics:", error);
 }

 return <MetricsClient data={data} />;
}
