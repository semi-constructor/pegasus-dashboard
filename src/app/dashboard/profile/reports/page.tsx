import { auth } from"@/auth";
import { redirect } from"next/navigation";
import { db } from"@/lib/db";
import { bugReports } from"@/../schemas/bug_reports";
import { eq, desc } from"drizzle-orm";
import UserBugReportsClient from"./_components/user-reports-client";

export default async function UserBugReportsPage() {
 const session = await auth();
 if (!session?.user?.id) redirect("/api/auth/signin");

 const userId = (session.user as any).discordId || session.user.id;
 const userReports = await db
 .select()
 .from(bugReports)
 .where(eq(bugReports.userId, userId))
 .orderBy(desc(bugReports.createdAt));

 return <UserBugReportsClient initialReports={userReports} />;
}
