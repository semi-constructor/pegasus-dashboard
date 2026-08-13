import { ReactNode } from "react";
import { redirect } from "next/navigation";
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
    <div className="w-full max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-500 flex flex-col gap-12">
      <div className="w-full relative min-h-[600px]">
        <div className="relative z-10 space-y-12">{children}</div>
      </div>
    </div>
  );
}
