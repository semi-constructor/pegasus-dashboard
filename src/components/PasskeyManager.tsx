"use client";

import { signIn } from "next-auth/webauthn";
import { Key, Server, CheckCircle2, Trash2, Edit2, Check, X } from "lucide-react";
import { deletePasskey, renamePasskey } from "../app/admin/security-settings/actions";
import { useTransition, useState } from "react";

function PasskeyCard({ auth }: { auth: any }) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(auth.name || "");

  const handleDelete = () => {
    if (confirm("Are you sure you want to remove this passkey? You might lose access if this is your only passkey.")) {
      startTransition(async () => {
        await deletePasskey(auth.credentialID);
      });
    }
  };

  const handleSave = () => {
    startTransition(async () => {
      await renamePasskey(auth.credentialID, name);
      setIsEditing(false);
    });
  };

  return (
    <div className="border border-white/10 bg-white/[0.01] p-6 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-[#5E5CE6]" />
      <div className="flex items-center justify-between mb-4">
        <Server className="w-5 h-5 text-[#5E5CE6]" />
        <span className="inline-flex items-center gap-1.5 border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
          <CheckCircle2 className="w-3 h-3" /> Active
        </span>
      </div>
      
      <div className="flex justify-between items-start gap-4 mb-2 min-h-[28px]">
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <input 
              autoFocus
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="Passkey Name"
              className="bg-black border border-[#5E5CE6]/40 text-white text-sm font-sans px-2 py-1 w-full focus:outline-none focus:border-[#5E5CE6]"
              disabled={isPending}
            />
            <button onClick={handleSave} disabled={isPending} className="text-emerald-400 hover:text-emerald-300">
              <Check className="w-4 h-4" />
            </button>
            <button onClick={() => { setIsEditing(false); setName(auth.name || ""); }} disabled={isPending} className="text-red-400 hover:text-red-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-sm font-semibold text-white tracking-wide font-sans truncate flex-1">
              {auth.name || `${auth.credentialDeviceType} Device`}
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditing(true)}
                disabled={isPending}
                className="text-neutral-500 hover:text-[#5E5CE6] transition-colors disabled:opacity-50"
                title="Rename Passkey"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="text-neutral-500 hover:text-red-400 transition-colors disabled:opacity-50"
                title="Delete Passkey"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
      <p className="text-[10px] font-mono text-neutral-500 truncate" title={auth.credentialID}>
        ID: {auth.credentialID.slice(0, 16)}...
      </p>
      <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-neutral-500 font-mono">
        Transports: {auth.transports || 'internal'}
      </div>
    </div>
  );
}

export default function PasskeyManager({ authenticators }: { authenticators: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <Key className="w-5 h-5 text-[#5E5CE6]" />
          <h2 className="text-xl font-light tracking-tight text-white">Registered Passkeys</h2>
        </div>
        <span className="border border-[#5E5CE6]/30 bg-[#5E5CE6]/10 px-2.5 py-1 text-xs font-mono text-[#5E5CE6]">
          {authenticators.length} Devices
        </span>
      </div>
      
      {authenticators.length === 0 ? (
        <div className="border border-white/5 bg-white/[0.005] p-8 text-center text-neutral-500 font-mono text-xs">
          No passkeys registered.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authenticators.map((auth) => (
            <PasskeyCard key={auth.credentialID} auth={auth} />
          ))}
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-white/5 max-w-sm">
        <h3 className="text-sm font-semibold text-white mb-2">Register Additional Device</h3>
        <p className="text-xs text-neutral-400 mb-4 font-mono">
          Add another passkey to your account for backup access to the master console.
        </p>
        <button
          onClick={() => signIn("webauthn", { action: "register" })}
          className="flex items-center justify-center gap-2 border border-[#5E5CE6]/30 bg-[#5E5CE6]/10 px-6 py-3 text-xs font-mono text-[#5E5CE6] hover:bg-[#5E5CE6] hover:text-black transition-colors uppercase tracking-widest font-semibold w-full"
        >
          <Key className="w-4 h-4" />
          <span>Add Passkey</span>
        </button>
      </div>
    </div>
  );
}
