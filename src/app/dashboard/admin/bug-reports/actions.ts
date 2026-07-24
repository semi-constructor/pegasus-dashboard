"use server";

import { db } from"@/lib/db";
import { bugReports } from"@/../schemas/bug_reports";
import { eq, desc } from"drizzle-orm";
import { revalidatePath } from"next/cache";
import { requireBotOwner } from"@/lib/auth-guard";
import { auth } from"@/auth";

export async function getAllBugReports() {
 await requireBotOwner();
 try {
 return await db
 .select()
 .from(bugReports)
 .orderBy(desc(bugReports.createdAt));
 } catch (error) {
 console.error("Failed to fetch bug reports:", error);
 return [];
 }
}

export async function updateBugReport(
 reportId: string,
 data: {
 status: string;
 assignee?: string;
 developerNote?: string;
 }
) {
 await requireBotOwner();
 try {
 await db
 .update(bugReports)
 .set({
 status: data.status,
 assignee: data.assignee || null,
 developerNote: data.developerNote || null,
 updatedAt: new Date(),
 })
 .where(eq(bugReports.id, reportId));
 revalidatePath("/dashboard/admin/bug-reports");
 return { success: true };
 } catch (error) {
 console.error("Failed to update bug report:", error);
 return { success: false, error:"Failed to update bug report"};
 }
}

export async function submitBugReport(data: {
 category: string;
 command?: string;
 title: string;
 description: string;
 stepsToReproduce?: string;
}) {
 const session = await auth();
 if (!session?.user?.id) return { success: false, error:"Unauthorized"};

 try {
 await db.insert(bugReports).values({
 userId: (session.user as any).discordId || session.user.id,
 category: data.category,
 command: data.command || null,
 title: data.title,
 description: data.description,
 stepsToReproduce: data.stepsToReproduce || null,
 status:"open",
 });
 revalidatePath("/dashboard/profile/reports");
 return { success: true };
 } catch (error) {
 console.error("Failed to submit bug report:", error);
 return { success: false, error:"Failed to submit bug report"};
 }
}
