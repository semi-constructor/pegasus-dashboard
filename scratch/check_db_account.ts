import { db } from "../src/lib/db";
import { accounts, authUsers } from "../schemas/auth";

async function main() {
  try {
    const users = await db.select().from(authUsers).limit(5);
    console.log("Users:", users);

    const accs = await db.select().from(accounts).limit(5);
    console.log("Accounts:", accs);
  } catch (e) {
    console.error(e);
  }
}
main();
