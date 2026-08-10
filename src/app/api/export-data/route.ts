import { auth } from "@/auth";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { userXp } from "../../../../schemas/xp";
import { economyBalances, economyTransactions } from "../../../../schemas/economy";
import { members } from "../../../../schemas/members";
import { bugReports } from "../../../../schemas/bug_reports";
import JSZip from "jszip";

export async function GET(request: Request) {
  const session = await auth();
  
  if (!session?.user?.discordId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const discordId = session.user.discordId;



  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "json";

  // Fetch all related data
  const [
    userXpData,
    economyBalancesData,
    economyTransactionsData,
    membersData,
    bugReportsData,
  ] = await Promise.all([
    db.select().from(userXp).where(eq(userXp.userId, discordId)),
    db.select().from(economyBalances).where(eq(economyBalances.userId, discordId)),
    db.select().from(economyTransactions).where(eq(economyTransactions.userId, discordId)),
    db.select().from(members).where(eq(members.userId, discordId)),
    db.select().from(bugReports).where(eq(bugReports.userId, discordId)),
  ]);

  const exportData = {
    userXp: userXpData,
    economyBalances: economyBalancesData,
    economyTransactions: economyTransactionsData,
    members: membersData,
    bugReports: bugReportsData,
  };

  if (format === "zip") {
    const zip = new JSZip();
    
    Object.entries(exportData).forEach(([tableName, data]) => {
      zip.file(`${tableName}.json`, JSON.stringify(data, null, 2));
    });

    const zipBuffer = await zip.generateAsync({ type: "blob" });

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="pegasus_data_export_${discordId}.zip"`,
      },
    });
  } else {
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="pegasus_data_export_${discordId}.json"`,
      },
    });
  }
}
