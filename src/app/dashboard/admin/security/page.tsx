import { requireBotOwner } from"@/lib/auth-guard";
import { getSecurityData } from"./actions";
import SecurityClient from"./_components/security-client";

export default async function SecurityAdminPage() {
 await requireBotOwner();
 const data = await getSecurityData();

 return <SecurityClient initialData={data} />;
}
