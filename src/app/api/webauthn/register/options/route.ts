import { NextResponse } from "next/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { authenticators } from "../../../../../../schemas";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id!;
  const userAuthenticators = await db.query.authenticators.findMany({
    where: eq(authenticators.userId, userId),
  });

  const rpName = "Pegasus Dashboard";
  const host = req.headers.get("host") || "localhost:3000";
  const rpID = host.split(":")[0];

  const { isoBase64URL } = require('@simplewebauthn/server/helpers');
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: userId,
    userName: session.user.name || session.user.email || "User",
    // Don't prompt users for their authenticator if they already registered it
    excludeCredentials: userAuthenticators.map((authenticator) => ({
      id: isoBase64URL.toBuffer(authenticator.credentialID),
      type: "public-key",
      // Optional
      transports: authenticator.transports ? (authenticator.transports.split(",") as any) : undefined,
    })) as any,
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
    },
  });

  const cookieStore = await cookies();
  cookieStore.set("webauthn_challenge", options.challenge, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 5, // 5 minutes
    path: "/",
  });

  return NextResponse.json(options);
}
