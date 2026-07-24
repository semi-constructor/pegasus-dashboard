import { NextResponse } from "next/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { authenticators } from "../../../../../../schemas";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const cookieStore = await cookies();
  const expectedChallenge = cookieStore.get("webauthn_challenge")?.value;

  if (!expectedChallenge) {
    return NextResponse.json({ error: "Missing challenge" }, { status: 400 });
  }

  const origin = req.headers.get("origin") || `http://${req.headers.get("host") || "localhost:3000"}`;
  const rpID = new URL(origin).hostname;

  try {
    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    const { verified, registrationInfo } = verification;

    if (verified && registrationInfo) {
      const { credentialID, credentialPublicKey, counter, credentialDeviceType, credentialBackedUp } = registrationInfo;
      const { isoBase64URL } = require('@simplewebauthn/server/helpers');

      await db.insert(authenticators).values({
        userId: session.user.id!,
        credentialID: body.id,
        credentialPublicKey: isoBase64URL.fromBuffer(credentialPublicKey),
        counter,
        credentialDeviceType,
        credentialBackedUp,
        providerAccountId: body.id,
        name: body.deviceName || "New Passkey",
        transports: body.response.transports?.join(",") || "",
      } as any);

      // Clear the challenge
      cookieStore.delete("webauthn_challenge");

      cookieStore.set("admin_passkey_verified", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day session
        path: "/",
      });

      return NextResponse.json({ verified: true });
    }

    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  } catch (error: any) {
    console.error("WebAuthn register error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
