"use client";

import { useState } from"react";
import { Fingerprint, ShieldAlert, Loader2 } from"lucide-react";
import { useRouter } from"next/navigation";
import { startAuthentication } from"@simplewebauthn/browser";
import { Button } from"@/components/ui/button";
import { useTranslations } from "next-intl";

export default function VerifyPasskey() {
 const t = useTranslations('adminPages');
 const [error, setError] = useState<string | null>(null);
 const [loading, setLoading] = useState(false);
 const router = useRouter();

 const handleVerify = async () => {
 setLoading(true);
 setError(null);
 try {
 const resp = await fetch("/api/webauthn/authenticate/options");
 if (!resp.ok) throw new Error("Failed to get authentication options");
 const options = await resp.json();

 const authResp = await startAuthentication(options);

 const verificationResp = await fetch("/api/webauthn/authenticate/verify", {
 method:"POST",
 headers: {"Content-Type":"application/json"},
 body: JSON.stringify(authResp),
 });

 if (!verificationResp.ok) {
 throw new Error("Verification failed");
 }

 router.push("/dashboard/admin");
 router.refresh();
 } catch (e: any) {
 setError(e.message ||"Failed to authenticate");
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="max-w-md mx-auto mt-20 p-8 border border-white/10 rounded-2xl bg-card/30 backdrop-blur-xl shadow-2xl text-center">
 <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 mb-6">
 <ShieldAlert className="w-8 h-8 text-purple-400"/>
 </div>
 <h2 className="text-2xl font-bold tracking-tight mb-2">{t('verify.title')}</h2>
 <p className="text-white/40 mb-8">
 {t('verify.description')}
 </p>
 
 {error && (
 <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
 {error}
 </div>
 )}

 <Button
 onClick={handleVerify}
 disabled={loading}
 className="w-full flex items-center justify-center gap-2"
 size="lg"
 >
 {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Fingerprint className="w-5 h-5"/>}
 {loading ? t('verify.verifying') : t('verify.verifyButton')}
 </Button>
 </div>
 );
}
