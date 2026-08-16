import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env.development" });

const runCustomMigrate = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  
  const sql = postgres(process.env.DATABASE_URL, { max: 1 });
  
  try {
    console.log("Adding is_admin to dashboard_ticket_messages...");
    await sql`ALTER TABLE dashboard_ticket_messages ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false NOT NULL;`;
    console.log("Success");
  } catch (e: any) {
    console.error(`Failed to execute: ${e.message}`);
  }
  
  await sql.end();
};

runCustomMigrate().catch(console.error);
