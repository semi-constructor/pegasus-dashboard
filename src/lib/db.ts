import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../../schemas/index';

// Use exact DATABASE_URL from .env with fallback
const connectionString: string = (process.env.DATABASE_URL || '').toString();
const sql = neon(connectionString);

export const db = drizzle(sql, { schema });
