import { NextResponse } from "next/server";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
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

  const host = req.headers.get("host") || "localhost:3000";
  const rpID = host.split(":")[0];

  const { isoBase64URL } = require('@simplewebauthn/server/helpers');
  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: userAuthenticators.map((authenticator) => ({
      id: isoBase64URL.toBuffer(authenticator.credentialID),
      type: "public-key",
      transports: authenticator.transports ? (authenticator.transports.split(",") as any) : undefined,
    })) as any,
    userVerification: "preferred",
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
