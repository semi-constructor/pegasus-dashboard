import { NextResponse } from "next/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { authenticators } from "../../../../../../schemas";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const cookieStore = await cookies();
  const expectedChallenge = cookieStore.get("webauthn_challenge")?.value;

  if (!expectedChallenge) {
    return NextResponse.json({ error: "Missing challenge" }, { status: 400 });
  }

  const userId = session.user.id!;
  const userAuthenticators = await db.query.authenticators.findMany({
    where: eq(authenticators.userId, userId),
  });

  const authenticator = userAuthenticators.find((auth) => auth.credentialID === body.id);

  if (!authenticator) {
    return NextResponse.json({ error: "Authenticator not found" }, { status: 400 });
  }

  const origin = req.headers.get("origin") || `http://${req.headers.get("host") || "localhost:3000"}`;
  const rpID = new URL(origin).hostname;

  try {
    const { isoBase64URL } = require('@simplewebauthn/server/helpers');
    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: isoBase64URL.toBuffer(authenticator.credentialID),
        credentialPublicKey: isoBase64URL.toBuffer(authenticator.credentialPublicKey),
        counter: authenticator.counter,
        transports: authenticator.transports ? (authenticator.transports.split(",") as any) : undefined,
      },
    });

    const { verified, authenticationInfo } = verification;

    if (verified) {
      await db
        .update(authenticators)
        .set({ counter: authenticationInfo.newCounter })
        .where(eq(authenticators.credentialID, authenticator.credentialID));

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
    console.error("WebAuthn authenticate error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
