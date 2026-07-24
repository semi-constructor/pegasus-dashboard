import { requireBotOwner } from"@/lib/auth-guard";
import { getAllBugReports } from"./actions";
import BugReportsAdminClient from"./_components/bug-reports-client";

export default async function AdminBugReportsPage() {
 await requireBotOwner();
 const reports = await getAllBugReports();

 return <BugReportsAdminClient initialReports={reports} />;
}
