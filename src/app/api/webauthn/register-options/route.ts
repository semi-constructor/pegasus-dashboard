import { NextResponse } from "next/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import type { GenerateRegistrationOptionsOpts } from "@simplewebauthn/server";
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialDescriptorFuture,
} from "@simplewebauthn/typescript-types";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { authenticators } from "../../../../../schemas/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

const rpID: string = process.env.NODE_ENV === "development" ? "localhost" : "pegasus.cptcr.uk";
const rpName: string = "Pegasus Dashboard";

function base64urlToBuffer(base64url: string): Uint8Array {
  return new Uint8Array(Buffer.from(base64url, "base64url"));
}

export async function GET(): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId: string = session.user.id;

  const existingCredentials = await db.query.authenticators.findMany({
    where: eq(authenticators.userId, userId),
  });

  const excludeCredentials: PublicKeyCredentialDescriptorFuture[] = existingCredentials.map(
    (cred): PublicKeyCredentialDescriptorFuture => ({
      id: base64urlToBuffer(cred.credentialID),
      type: "public-key",
      transports: cred.transports
        ? (JSON.parse(cred.transports) as AuthenticatorTransport[])
        : undefined,
    })
  );

  const opts: GenerateRegistrationOptionsOpts = {
    rpName,
    rpID,
    userID: userId, // v9 expects a plain string here, not a Uint8Array
    userName: session.user.name ?? userId,
    attestationType: "none",
    excludeCredentials,
    authenticatorSelection: {
      authenticatorAttachment: "platform", // forces Touch ID/Face ID/Windows Hello, skips QR-code cross-device flow
      residentKey: "preferred",
      userVerification: "preferred",
    },
  };

  const options: PublicKeyCredentialCreationOptionsJSON = await generateRegistrationOptions(opts);

  const cookieStore = await cookies();
  cookieStore.set("webauthn_challenge", options.challenge, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 300,
    path: "/",
  });

  return NextResponse.json(options);
}