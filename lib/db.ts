
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from '@/shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não está definida nas variáveis de ambiente');
}

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle({ client: pool, schema });

export type DbType = typeof db;
