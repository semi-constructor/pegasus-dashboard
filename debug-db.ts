import { db } from './src/lib/db';
import { authUsers, accounts, authenticators } from './schemas/auth';

async function run() {
  const users = await db.select().from(authUsers);
  const accs = await db.select().from(accounts);
  const auths = await db.select().from(authenticators);

  console.log("Users:", users);
  console.log("Accounts:", accs);
  console.log("Authenticators:", auths);
  process.exit(0);
}

run().catch(console.error);
