"use client";

import { signIn as nextAuthSignIn } from "next-auth/react";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from "@simplewebauthn/typescript-types";
import { Key, ArrowRight, Lock, Shield, Server, Terminal } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
// @ts-expect-error - maath lacks declaration files for this specific subpath
import * as random from "maath/random/dist/maath-random.esm";

function StarBackground(props: Record<string, unknown>) {
  const ref = useRef<any>(null);
  const [sphere] = useState<Float32Array>(() =>
    random.inSphere(new Float32Array(5000), { radius: 1.5 })
  );

  useFrame((state, delta: number) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#5E5CE6" size={0.002} sizeAttenuation depthWrite={false} />
      </Points>
    </group>
  );
}

type PortalState = "discord" | "register-passkey" | "verify-passkey";

interface AdminLoginPortalProps {
  state: PortalState;
}

async function registerPasskey(): Promise<void> {
  const optionsRes: Response = await fetch("/api/webauthn/register-options", {
    credentials: "include",
  });

  if (!optionsRes.ok) {
    const err: { error?: string } = await optionsRes.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to get registration options");
  }

  const options: PublicKeyCredentialCreationOptionsJSON = await optionsRes.json();

  const attestationResponse: RegistrationResponseJSON = await startRegistration(options);

  const verifyRes: Response = await fetch("/api/webauthn/register-verify", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(attestationResponse),
  });

  if (!verifyRes.ok) {
    const err: { error?: string } = await verifyRes.json().catch(() => ({}));
    throw new Error(err.error ?? "Passkey registration failed");
  }

  window.location.reload();
}

async function authenticateWithPasskey(): Promise<void> {
  const optionsRes: Response = await fetch("/api/webauthn/authenticate-options", {
    credentials: "include",
  });

  if (!optionsRes.ok) {
    const err: { error?: string } = await optionsRes.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to get authentication options");
  }

  const options: PublicKeyCredentialRequestOptionsJSON = await optionsRes.json();

  const assertionResponse: AuthenticationResponseJSON = await startAuthentication(options);

  const verifyRes: Response = await fetch("/api/webauthn/authenticate-verify", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assertionResponse),
  });

  if (!verifyRes.ok) {
    const err: { error?: string } = await verifyRes.json().catch(() => ({}));
    throw new Error(err.error ?? "Passkey verification failed");
  }

  window.location.reload();
}

export default function AdminLoginPortal({ state }: AdminLoginPortalProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAction = async (): Promise<void> => {
    setError(null);
    setLoading(true);
    try {
      if (state === "discord") {
        await nextAuthSignIn("discord", { callbackUrl: "/admin" });
      } else if (state === "register-passkey") {
        await registerPasskey();
      } else {
        await authenticateWithPasskey();
      }
    } catch (err) {
      const message: string = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 w-full h-screen relative bg-black overflow-hidden flex items-center justify-center font-mono">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <StarBackground />
        </Canvas>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-lg p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="border border-[#5E5CE6]/30 bg-black/60 backdrop-blur-xl p-12 rounded-none flex flex-col items-center text-center relative overflow-hidden shadow-[0_0_50px_-12px_rgba(94,92,230,0.3)]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-50" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#5E5CE6] to-transparent opacity-80" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 relative"
          >
            <div className="absolute inset-0 bg-[#5E5CE6] blur-2xl opacity-20 rounded-full" />
            <div className="border border-[#5E5CE6]/40 bg-[#5E5CE6]/10 p-4 relative z-10">
              {state === "discord" && <Shield className="w-10 h-10 text-[#5E5CE6]" />}
              {state === "register-passkey" && <Lock className="w-10 h-10 text-amber-400" />}
              {state === "verify-passkey" && <Key className="w-10 h-10 text-emerald-400" />}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <h1 className="text-3xl font-light tracking-tight text-white mb-2 uppercase font-sans">
              {state === "discord" && "Master Console"}
              {state === "register-passkey" && "Security Requirement"}
              {state === "verify-passkey" && "Identify Required"}
            </h1>
            <p className="text-xs text-neutral-400 font-mono tracking-wider mb-6 leading-relaxed max-w-[280px] mx-auto">
              {state === "discord" && "Authenticate your identity through Discord to access the superuser portal."}
              {state === "register-passkey" && "Master Administrators must bind a hardware passkey to their account."}
              {state === "verify-passkey" && "Use your registered passkey to verify this active session."}
            </p>
          </motion.div>

          {error && (
            <p className="text-xs text-red-400 font-mono mb-6 max-w-[280px]">{error}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAction}
            disabled={loading}
            className={`px-8 py-4 text-xs font-mono transition-all rounded-none w-full tracking-widest uppercase flex items-center justify-center gap-3 group border disabled:opacity-50 ${
              state === "discord"
                ? "border-[#5E5CE6]/40 bg-[#5E5CE6]/10 text-[#5E5CE6] hover:bg-[#5E5CE6] hover:text-black hover:border-[#5E5CE6]"
                : state === "register-passkey"
                ? "border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-black hover:border-amber-500"
                : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black hover:border-emerald-500"
            }`}
          >
            <span>
              {loading
                ? "Working..."
                : state === "discord"
                ? "Login with Discord"
                : state === "register-passkey"
                ? "Register Device"
                : "Verify Passkey"}
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <div className="mt-8 flex items-center justify-center gap-4 text-[9px] text-neutral-600 uppercase tracking-widest">
            <span className="flex items-center gap-1"><Server className="w-3 h-3" /> Node Active</span>
            <span className="w-1 h-1 bg-neutral-800 rounded-full" />
            <span className="flex items-center gap-1"><Terminal className="w-3 h-3" /> Secure</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}