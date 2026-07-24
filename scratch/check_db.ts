import { db } from "../src/lib/db";
import { bugReports } from "../schemas/bug_reports";

async function main() {
  try {
    const res = await db.select().from(bugReports).limit(1);
    console.log(res);
  } catch (e) {
    console.error(e);
  }
}
main();
