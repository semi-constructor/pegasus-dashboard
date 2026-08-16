import { ReactNode } from"react";
import { DashboardLayout as DashboardLayoutComponent } from"@/components/dashboard/DashboardLayout";
import { auth } from"@/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
 const session = await auth();
 
  let adminIds: string[] = [];
  try {
    adminIds = JSON.parse(process.env.ADMIN || "[]");
  } catch (e) {
    adminIds = (process.env.ADMIN_DISCORD_IDS || "").split(",").map(id => id.trim());
  }
  adminIds = adminIds.filter(id => id.trim() !== "");
  
  const discordId = (session?.user as any)?.discordId || session?.user?.id;
  const isAdmin = adminIds.length > 0 && adminIds.includes(discordId);

  // Fallback to fetch image if missing from session
  if (session?.user && !session.user.image) {
    const { db } = await import("@/lib/db");
    const { authUsers } = await import("../../../schemas");
    const { eq } = await import("drizzle-orm");
    const [dbUser] = await db.select({ image: authUsers.image }).from(authUsers).where(eq(authUsers.id, session.user.id));
    if (dbUser?.image) {
      session.user.image = dbUser.image;
    }
  }

 return (
 <DashboardLayoutComponent session={session} isAdmin={isAdmin}>
 {children}
 </DashboardLayoutComponent>
 );
}
