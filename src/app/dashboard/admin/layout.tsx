import { ReactNode } from"react";
import { redirect } from"next/navigation";
import { ShieldAlert } from"lucide-react";
import { headers, cookies } from"next/headers";
import { eq } from"drizzle-orm";

import { auth } from"@/auth";
import { db } from"@/lib/db";
import { authenticators } from"../../../../schemas";

export default async function AdminLayout({ children }: { children: ReactNode }) {
 const session = await auth();

 if (!session?.user) {
 redirect("/dashboard");
 }

 const userId = (session.user as any).discordId || session.user.id;
 let adminIds: string[] = [];
 try {
 adminIds = JSON.parse(process.env.ADMIN ||"[]");
 } catch (e) {
 adminIds = (process.env.ADMIN_DISCORD_IDS ||"").split(",").map(id => id.trim());
 }
 const isAdmin = adminIds.length === 0 || (userId && adminIds.includes(userId));

 if (!isAdmin) {
 redirect("/dashboard");
 }

 const headersList = await headers();
 const pathname = headersList.get("x-pathname") ||"";

 const userAuthenticators = await db.query.authenticators.findMany({
 where: eq(authenticators.userId, session.user.id!),
 });

 const hasPasskeys = userAuthenticators.length > 0;
 const cookieStore = await cookies();
 const isVerified = cookieStore.get("admin_passkey_verified")?.value ==="true";

 if (!hasPasskeys) {
 redirect("/dashboard/profile/passkeys");
 }

 if (!isVerified && pathname !=="/dashboard/admin/verify") {
 redirect("/dashboard/admin/verify");
 }

 return (
 <>
 <div className="mb-6 flex items-center space-x-2 text-sm font-medium">
 <ShieldAlert className="h-5 w-5 text-purple-500"/>
 <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
 Admin Area
 </span>
 </div>
 <div className="space-y-4">
 {children}
 </div>
 </>
 );
}
