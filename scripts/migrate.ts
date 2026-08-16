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
    console.log("Dropping old constraints...");
    await sql`ALTER TABLE dashboard_tickets DROP CONSTRAINT IF EXISTS dashboard_tickets_user_id_users_id_fk;`;
    await sql`ALTER TABLE dashboard_ticket_messages DROP CONSTRAINT IF EXISTS dashboard_ticket_messages_user_id_users_id_fk;`;
    
    console.log("Adding new constraints to auth_user...");
    await sql`ALTER TABLE dashboard_tickets ADD CONSTRAINT dashboard_tickets_user_id_auth_user_id_fk FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE;`;
    await sql`ALTER TABLE dashboard_ticket_messages ADD CONSTRAINT dashboard_ticket_messages_user_id_auth_user_id_fk FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE;`;
    
    console.log("Success");
  } catch (e: any) {
    console.error(`Failed to execute: ${e.message}`);
  }
  
  await sql.end();
};

runCustomMigrate().catch(console.error);
