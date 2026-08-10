import MetricsClient from"./components/MetricsClient";
import { AutoRefresh } from "@/components/AutoRefresh";

export const dynamic ="force-dynamic";

export default async function MetricsPage() {
 const defaultData = {
 status:"offline",
 uptime: 0,
 guilds: { total: 0 },
 users: { total: 0 },
 system: { memory_usage: 0, memory_total: 34359738368, cpu_usage: 0, latency: 0, shard_count: 1 },
 commands: { perMinute: 0 },
 health: {
  components: {
  database: { latency: 0, size: 0 },
  cache: { hitRate: 0, size: 0 },
  }
  }
 };

 let data = { ...defaultData };
 let shardsData: any[] = [];

 try {
 const apiUrl = process.env.API_URL ||"http://localhost:2000";
 
 // Fetch from bot stats API
 const [statsRes, healthRes, statusRes] = await Promise.all([
 fetch(`${apiUrl}/stats`, { 
 headers: { Authorization: `Bearer ${process.env.BOT_API_TOKEN}` },
 cache: 'no-store'
 }).catch(() => null),
 fetch(`${apiUrl}/monitoring/health`, { 
 headers: { Authorization: `Bearer ${process.env.BOT_API_TOKEN}` },
 cache: 'no-store'
 }).catch(() => null),
 fetch(`${apiUrl}/status`, { 
 headers: { Authorization: `Bearer ${process.env.BOT_API_TOKEN}` },
 cache: 'no-store'
 }).catch(() => null)
 ]);

 if (statsRes?.ok) {
 const stats = await statsRes.json();
 data.status = stats.status;
 data.uptime = stats.uptime;
 data.guilds = stats.guilds;
 data.users = stats.users;
 data.system = stats.system;
 data.commands = stats.commands || { perMinute: 0 };
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
 data.system = { memory_usage: 0, memory_total: 34359738368, cpu_usage: 0, latency: 0, shard_count: 1 };
 data.commands = { perMinute: 0 };
 }

 if (healthRes?.ok) {
 const health = await healthRes.json();
 data.health = {
   components: {
     database: { 
       latency: health.services?.database?.pool?.active || 0, // Using active connections as placeholder if latency isn't provided
       size: 0 
     },
     cache: { 
       hitRate: health.services?.cache?.hitRate || 0, 
       size: health.services?.cache?.size || 0 
     }
   }
 };
 } else {
  data.health = {
  components: {
  database: { latency: 0, size: 0 },
  cache: { hitRate: 0, size: 0 }
  }
  };
 }
 
  shardsData = [];
  if (statusRes?.ok) {
    const statusData = await statusRes.json();
    shardsData = statusData?.services?.discord?.shards || [];
    data.system.shard_count = shardsData.length || 1;
    if (statusData?.services?.database?.size) {
      if (!data.health.components.database) data.health.components.database = { latency: 0, size: 0 };
      data.health.components.database.size = statusData.services.database.size;
    }
  }
 } catch (error) {
 console.error("Failed to fetch metrics:", error);
 }

  return (
    <>
      <AutoRefresh interval={5000} />
      <MetricsClient data={{ ...data, shards: shardsData }} />
    </>
  );
}
