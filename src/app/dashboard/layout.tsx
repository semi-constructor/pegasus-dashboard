import { ReactNode } from"react";
import { DashboardLayout as DashboardLayoutComponent } from"@/components/dashboard/DashboardLayout";
import { auth } from"@/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
 const session = await auth();
 
 let adminIds: string[] = [];
 try {
 adminIds = JSON.parse(process.env.ADMIN ||"[]");
 } catch (e) {
 adminIds = (process.env.ADMIN_DISCORD_IDS ||"").split(",").map(id => id.trim());
 }
 
 const discordId = (session?.user as any)?.discordId || session?.user?.id;
 const isAdmin = adminIds.includes(discordId) || adminIds.length === 0;

 return (
 <DashboardLayoutComponent session={session} isAdmin={isAdmin}>
 {children}
 </DashboardLayoutComponent>
 );
}
