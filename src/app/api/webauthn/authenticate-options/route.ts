import { NextResponse } from "next/server";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import type { GenerateAuthenticationOptionsOpts } from "@simplewebauthn/server";
import type {
  PublicKeyCredentialRequestOptionsJSON,
  PublicKeyCredentialDescriptorFuture,
} from "@simplewebauthn/typescript-types";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { authenticators } from "../../../../../schemas/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

const rpID: string = process.env.NODE_ENV === "development" ? "localhost" : "pegasus.cptcr.uk";

function base64urlToBuffer(base64url: string): Uint8Array {
  return new Uint8Array(Buffer.from(base64url, "base64url"));
}

export async function GET(): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId: string = session.user.id;

  const userAuthenticators = await db.query.authenticators.findMany({
    where: eq(authenticators.userId, userId),
  });

  const allowCredentials: PublicKeyCredentialDescriptorFuture[] = userAuthenticators.map(
    (cred): PublicKeyCredentialDescriptorFuture => ({
      id: base64urlToBuffer(cred.credentialID),
      type: "public-key",
      transports: cred.transports
        ? (JSON.parse(cred.transports) as AuthenticatorTransport[])
        : undefined,
    })
  );

  const opts: GenerateAuthenticationOptionsOpts = {
    rpID,
    userVerification: "preferred",
    allowCredentials,
  };

  const options: PublicKeyCredentialRequestOptionsJSON = await generateAuthenticationOptions(opts);

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