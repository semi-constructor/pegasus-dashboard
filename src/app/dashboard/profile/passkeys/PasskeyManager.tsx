"use client";

import { useState } from"react";
import { Fingerprint, MonitorSmartphone, Plus, Trash2, Edit2, Loader2 } from"lucide-react";
import { startRegistration } from"@simplewebauthn/browser";
import { deletePasskey, renamePasskey } from"./actions";
import { useRouter } from"next/navigation";

import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { useTranslations } from "next-intl";

export function PasskeyManager({ initialPasskeys }: { initialPasskeys: any[] }) {
 const t = useTranslations('profilePages');
 const [loading, setLoading] = useState(false);
 const [errorMsg, setErrorMsg] = useState<string | null>(null);
 const [renamingId, setRenamingId] = useState<string | null>(null);
 const [newName, setNewName] = useState("");
 const router = useRouter();

 const handleRegister = async () => {
 setLoading(true);
 setErrorMsg(null);
 try {
 if (!window.isSecureContext) {
 throw new Error("WebAuthn requires a secure context (HTTPS) or localhost.");
 }

 const resp = await fetch("/api/webauthn/register/options");
 if (!resp.ok) {
 const errorData = await resp.json().catch(() => ({}));
 throw new Error(errorData.error || "Failed to get registration options");
 }
 const options = await resp.json();

 const authResp = await startRegistration(options);

 const verificationResp = await fetch("/api/webauthn/register/verify", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 ...authResp,
 deviceName: navigator.userAgent.includes("Mac") ? "Mac Device" : "Windows/Linux Device"
 }),
 });

 if (!verificationResp.ok) {
 const errData = await verificationResp.json().catch(() => ({}));
 throw new Error(errData.error || "Verification failed");
 }

 router.refresh();
 } catch (e: any) {
 console.error(e);
 setErrorMsg(e.message || "Failed to register passkey. Ensure your browser supports it.");
 } finally {
 setLoading(false);
 }
 };

 const handleDelete = async (id: string) => {
 if (confirm("Are you sure you want to delete this passkey?")) {
 await deletePasskey(id);
 }
 };

 const handleRenameSubmit = async (id: string) => {
 if (newName.trim()) {
 await renamePasskey(id, newName.trim());
 }
 setRenamingId(null);
 };

 return (
 <div className="grid gap-6">
 <div className="flex items-center justify-between p-6 border border-white/10 rounded-xl bg-card/30 backdrop-blur-xl shadow-lg relative overflow-hidden group">
 <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"/>
 <div>
 <h3 className="text-lg font-medium flex items-center gap-2">
 <Fingerprint className="text-purple-400 h-5 w-5"/>
 {t('passkeys.registerNewTitle')}
 </h3>
 <p className="text-sm text-white/40 mt-1">{t('passkeys.registerNewDescription')}</p>
 </div>
 <Button
 onClick={handleRegister}
 disabled={loading}
 variant="secondary"
 className="flex items-center gap-2"
 >
 {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Plus className="h-4 w-4"/>}
 {t('passkeys.addPasskey')}
 </Button>
 </div>
 {errorMsg && (
   <div className="p-4 border border-red-500/30 bg-red-500/10 rounded-xl">
     <p className="text-sm text-red-200">{errorMsg}</p>
   </div>
 )}

 <div className="space-y-4">
 {initialPasskeys.map((key) => (
 <div key={key.credentialID} className="flex items-center justify-between p-5 border border-white/5 rounded-xl bg-card/20 hover:bg-card/40 transition-colors backdrop-blur-md">
 <div className="flex items-center gap-4">
 <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
 <MonitorSmartphone className="h-5 w-5 text-purple-400"/>
 </div>
 <div>
 {renamingId === key.credentialID ? (
 <div className="flex items-center gap-2">
 <Input
 autoFocus
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 value={newName}
 onChange={(e) => setNewName(e.target.value)}
 onKeyDown={(e) => {
 if (e.key ==="Enter") handleRenameSubmit(key.credentialID);
 if (e.key ==="Escape") setRenamingId(null);
 }}
 onBlur={() => handleRenameSubmit(key.credentialID)}
 />
 </div>
 ) : (
 <h4 className="font-medium text-sm flex items-center gap-2">
 {key.name ||"Unnamed Passkey"}
 <button
 onClick={() => {
 setRenamingId(key.credentialID);
 setNewName(key.name ||"");
 }}
 className="text-white/40 hover:text-white/80 transition-colors"
 >
 <Edit2 className="h-3 w-3"/>
 </button>
 </h4>
 )}
 <div className="flex items-center gap-3 text-xs text-white/40 mt-1">
 <span className="flex items-center gap-1">Added: {new Date().toLocaleDateString()}</span>
 <span className="flex items-center gap-1">Uses: {key.counter}</span>
 </div>
 </div>
 </div>
 <Button
 onClick={() => handleDelete(key.credentialID)}
 variant="destructive"
 size="icon"
 className="h-8 w-8"
 >
 <Trash2 className="h-4 w-4"/>
 </Button>
 </div>
 ))}
 </div>
 </div>
 );
}
