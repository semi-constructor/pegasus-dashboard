import { auth } from"@/auth";
import { db } from"@/lib/db";
import { authenticators } from"../../../../../schemas";
import { eq } from"drizzle-orm";
import { PasskeyManager } from"./PasskeyManager";
import { ShieldAlert } from"lucide-react";
import { getTranslations } from "next-intl/server";

export default async function PasskeyManagementPage() {
  const t = await getTranslations('profilePages');
  const session = await auth();
  if (!session?.user?.id) return null;

  let adminIds: string[] = [];
  try {
    adminIds = JSON.parse(process.env.ADMIN || "[]");
  } catch (e) {
    adminIds = (process.env.ADMIN_DISCORD_IDS || "").split(",").map(id => id.trim());
  }
  
  const discordId = (session.user as any).discordId || session.user.id;
  const isAdmin = adminIds.includes(discordId) || adminIds.length === 0;

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-red-500">{t('passkeys.accessDeniedTitle')}</h2>
        <p className="text-white/40 mt-2">{t('passkeys.accessDeniedDescription')}</p>
      </div>
    );
  }

 const userAuthenticators = await db.query.authenticators.findMany({
 where: eq(authenticators.userId, session.user.id),
 });

 return (
 <div className="max-w-4xl mx-auto space-y-6">
 <div>
 <h2 className="text-2xl font-bold tracking-tight">{t('passkeys.title')}</h2>
 <p className="text-white/40">{t('passkeys.description')}</p>
 </div>
 
 {userAuthenticators.length === 0 && (
 <div className="p-4 border border-orange-500/30 bg-orange-500/10 rounded-xl flex items-start gap-4">
 <ShieldAlert className="w-5 h-5 text-orange-400 shrink-0 mt-0.5"/>
 <div>
 <h3 className="font-medium text-orange-200">{t('passkeys.requiredTitle')}</h3>
 <p className="text-sm text-orange-200/70 mt-1">
 {t('passkeys.requiredDescription')}
 </p>
 </div>
 </div>
 )}

 <PasskeyManager initialPasskeys={userAuthenticators} />
 </div>
 );
}
