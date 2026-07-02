import { NextResponse } from "next/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import type {
  VerifyAuthenticationResponseOpts,
  VerifiedAuthenticationResponse,
} from "@simplewebauthn/server";
import type {
  AuthenticationResponseJSON,
  AuthenticatorDevice,
} from "@simplewebauthn/typescript-types";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { authenticators } from "../../../../../schemas/auth";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";

const rpID: string = process.env.NODE_ENV === "development" ? "localhost" : "pegasus.cptcr.uk";
const expectedOrigin: string =
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://pegasus.cptcr.uk";

function base64urlToBuffer(base64url: string): Uint8Array {
  return new Uint8Array(Buffer.from(base64url, "base64url"));
}

export async function POST(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const cookieStore = await cookies();
  const expectedChallenge: string | undefined = cookieStore.get("webauthn_challenge")?.value;
  if (!expectedChallenge) {
    return NextResponse.json({ error: "Missing or expired challenge" }, { status: 400 });
  }
  const body: AuthenticationResponseJSON = await req.json();
  const storedAuthenticator = await db.query.authenticators.findFirst({
    where: and(
      eq(authenticators.credentialID, body.id),
      eq(authenticators.userId, session.user.id)
    ),
  });
  if (!storedAuthenticator) {
    return NextResponse.json({ error: "Authenticator not recognized" }, { status: 400 });
  }
  const authenticatorDevice: AuthenticatorDevice = {
    credentialID: base64urlToBuffer(storedAuthenticator.credentialID),
    credentialPublicKey: base64urlToBuffer(storedAuthenticator.credentialPublicKey),
    counter: storedAuthenticator.counter,
    transports: storedAuthenticator.transports
      ? (JSON.parse(storedAuthenticator.transports) as AuthenticatorTransport[])
      : undefined,
  };
  const opts: VerifyAuthenticationResponseOpts = {
    response: body,
    expectedChallenge,
    expectedOrigin,
    expectedRPID: rpID,
    authenticator: authenticatorDevice,
  };
  let verification: VerifiedAuthenticationResponse;
  try {
    verification = await verifyAuthenticationResponse(opts);
  } catch (err) {
    const message: string = err instanceof Error ? err.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  if (!verification.verified) {
    return NextResponse.json({ error: "Authentication not verified" }, { status: 400 });
  }
  await db
    .update(authenticators)
    .set({ counter: verification.authenticationInfo.newCounter })
    .where(eq(authenticators.credentialID, storedAuthenticator.credentialID));

  cookieStore.delete("webauthn_challenge");

  const response: NextResponse = NextResponse.json({ verified: true });
  response.cookies.set("webauthn_verified", session.user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  return response;
}