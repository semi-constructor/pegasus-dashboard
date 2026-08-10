import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../../schemas";

const connectionString = process.env.DATABASE_URL || "postgres://dummy:dummy@localhost:5432/dummy";

const globalForPostgres = globalThis as unknown as {
  postgresQueryClient: postgres.Sql | undefined;
};

const queryClient = globalForPostgres.postgresQueryClient ?? postgres(connectionString);

if (process.env.NODE_ENV !== "production") {
  globalForPostgres.postgresQueryClient = queryClient;
}

export const db = drizzle(queryClient, { schema });
