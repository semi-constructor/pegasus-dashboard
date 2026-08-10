import { Download, ShieldAlert, Archive, FileJson, Info } from"lucide-react";
import { auth } from"@/auth";
import { redirect } from"next/navigation";
import Link from"next/link";
import { getTranslations } from "next-intl/server";

export default async function PersonalDataPage() {
 const t = await getTranslations('profilePages');
 const session = await auth();
 if (!session?.user?.discordId) {
 redirect("/");
 }

 let adminIds: string[] = [];
 try {
 adminIds = JSON.parse(process.env.ADMIN ||"[]");
 } catch (e) {
 adminIds = (process.env.ADMIN_DISCORD_IDS ||"").split(",").map(id => id.trim());
 }
 
 const isAdmin = adminIds.includes(session.user.discordId);

 if (!isAdmin) {
  return (
  <div className="p-8 max-w-5xl mx-auto h-[60vh] flex flex-col items-center justify-center text-center">
  <ShieldAlert className="w-16 h-16 text-destructive mb-4"/>
  <h1 className="text-3xl font-bold text-foreground mb-2">{t('dataExport.accessDeniedTitle')}</h1>
  <p className="text-white/40 max-w-md">
  {t('dataExport.accessDeniedDescription')}
  </p>
  </div>
  );
  }

 return (
 <div className="p-8 max-w-5xl mx-auto space-y-8">
 <div>
 <h1 className="text-3xl font-bold text-foreground tracking-tight">{t('dataExport.title')}</h1>
 <p className="text-white/40 mt-2">{t('dataExport.description')}</p>
 </div>

 <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex gap-4">
 <Info className="w-6 h-6 text-primary flex-shrink-0"/>
 <div>
 <h3 className="text-primary font-semibold mb-1">{t('dataExport.privacyTitle')}</h3>
 <p className="text-sm text-foreground/80" dangerouslySetInnerHTML={{ __html: t.raw('dataExport.privacyDescription') }} />
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-colors group">
 <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
 <Archive className="w-6 h-6 text-primary"/>
 </div>
 <h3 className="text-lg font-bold text-foreground mb-2">{t('dataExport.exportZipTitle')}</h3>
 <p className="text-sm text-white/40 mb-6">
 {t('dataExport.exportZipDescription')}
 </p>
 <Link href="/api/export-data?format=zip"className="w-full py-2.5 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-lg flex items-center justify-center gap-2 transition-colors">
 <Download className="w-4 h-4"/>
 {t('dataExport.generateZip')}
 </Link>
 </div>

 <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-colors group">
 <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
 <FileJson className="w-6 h-6 text-blue-500"/>
 </div>
 <h3 className="text-lg font-bold text-foreground mb-2">{t('dataExport.exportJsonTitle')}</h3>
 <p className="text-sm text-white/40 mb-6">
 {t('dataExport.exportJsonDescription')}
 </p>
 <Link href="/api/export-data?format=json"className="w-full py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors">
 <Download className="w-4 h-4"/>
 {t('dataExport.generateJson')}
 </Link>
 </div>
 </div>
 </div>
 );
}
