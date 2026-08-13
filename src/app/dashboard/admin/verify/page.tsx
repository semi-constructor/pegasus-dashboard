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
  <div className="max-w-md mx-auto mt-20 p-12 border border-border bg-background text-center">
  <div className="mx-auto w-16 h-16 border border-border/30 flex items-center justify-center mb-8 bg-foreground/5">
  <ShieldAlert className="w-8 h-8 text-foreground"/>
  </div>
  <h2 className="text-sm font-medium tracking-[0.3em] uppercase mb-4 text-foreground">{t('verify.title')}</h2>
  <p className="text-[10px] text-foreground/50 tracking-widest uppercase mb-12">
  {t('verify.description')}
  </p>
  
  {error && (
  <div className="p-4 mb-8 border border-rose-500/30 text-[10px] uppercase tracking-widest text-rose-500/70 bg-background">
  {error}
  </div>
  )}

  <button
  onClick={handleVerify}
  disabled={loading}
  className="w-full flex items-center justify-center gap-4 px-8 py-4 border border-border text-foreground hover:bg-foreground hover:text-background transition-colors text-xs tracking-[0.3em] uppercase disabled:opacity-50"
  >
  {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Fingerprint className="w-4 h-4"/>}
  {loading ? t('verify.verifying') : t('verify.verifyButton')}
  </button>
  </div>
  );
}
