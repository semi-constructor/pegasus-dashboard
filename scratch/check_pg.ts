import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const sql = postgres(process.env.DATABASE_URL!);
  try {
    const accs = await sql`SELECT * FROM account LIMIT 5`;
    console.log("Accounts:", accs);
  } catch (e) {
    console.error(e);
  } finally {
    await sql.end();
  }
}
main();
