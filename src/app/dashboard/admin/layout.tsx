import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { headers, cookies } from "next/headers";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { authenticators } from "../../../../schemas";

import { getTranslations } from "next-intl/server";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const t = await getTranslations('adminPages');
  const session = await auth();

  if (!session?.user) {
    redirect("/dashboard");
  }

  const userId = (session.user as any).discordId || session.user.id;
  let adminIds: string[] = [];
  try {
    adminIds = JSON.parse(process.env.ADMIN || "[]");
  } catch (e) {
    adminIds = (process.env.ADMIN_DISCORD_IDS || "").split(",").map((id) => id.trim());
  }

  adminIds = adminIds.filter((id) => id.trim() !== "");
  const isAdmin = adminIds.length > 0 && userId && adminIds.includes(userId);

  if (!isAdmin) {
    redirect("/dashboard");
  }

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  const userAuthenticators = await db.query.authenticators.findMany({
    where: eq(authenticators.userId, session.user.id!),
  });

  const hasPasskeys = userAuthenticators.length > 0;
  const cookieStore = await cookies();
  const isVerified = cookieStore.get("admin_passkey_verified")?.value === "true";

  if (!hasPasskeys) {
    redirect("/dashboard/profile/passkeys");
  }

  if (!isVerified && pathname !== "/dashboard/admin/verify") {
    redirect("/dashboard/admin/verify");
  }

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-8">
        <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 backdrop-blur-md">
          <ShieldAlert className="h-8 w-8 text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 tracking-tight">
            {t('layout.title')}
          </h1>
          <p className="text-white/40 mt-3 text-sm font-medium tracking-wide">
            {t('layout.description')}
          </p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-md min-h-[600px] p-6 md:p-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 space-y-8">{children}</div>
      </div>
    </div>
  );
}
