import { NextResponse } from "next/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import type {
  VerifyRegistrationResponseOpts,
  VerifiedRegistrationResponse,
} from "@simplewebauthn/server";
import type { RegistrationResponseJSON } from "@simplewebauthn/typescript-types";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { authenticators } from "../../../../../schemas/auth";
import { cookies } from "next/headers";

const rpID: string = process.env.NODE_ENV === "development" ? "localhost" : "pegasus.cptcr.uk";
const expectedOrigin: string =
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://pegasus.cptcr.uk";

function bufferToBase64url(buffer: Uint8Array): string {
  return Buffer.from(buffer).toString("base64url");
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

  const body: RegistrationResponseJSON = await req.json();

  const opts: VerifyRegistrationResponseOpts = {
    response: body,
    expectedChallenge,
    expectedOrigin,
    expectedRPID: rpID,
  };

  let verification: VerifiedRegistrationResponse;
  try {
    verification = await verifyRegistrationResponse(opts);
  } catch (err) {
    const message: string = err instanceof Error ? err.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (!verification.verified || !verification.registrationInfo) {
    return NextResponse.json({ error: "Registration not verified" }, { status: 400 });
  }

  // v9: credentialID and credentialPublicKey are raw Uint8Array here
  const { credentialID, credentialPublicKey, counter, credentialDeviceType, credentialBackedUp } =
    verification.registrationInfo;

  await db.insert(authenticators).values({
    credentialID: bufferToBase64url(credentialID),
    userId: session.user.id,
    providerAccountId: session.user.id,
    credentialPublicKey: bufferToBase64url(credentialPublicKey),
    counter,
    credentialDeviceType,
    credentialBackedUp,
    transports: body.response.transports ? JSON.stringify(body.response.transports) : null,
  });

  cookieStore.delete("webauthn_challenge");

  return NextResponse.json({ verified: true });
}