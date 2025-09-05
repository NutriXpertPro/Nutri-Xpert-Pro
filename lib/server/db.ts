import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";

// Configurações do WebSocket (para o ambiente serverless)
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não está definida.");
}

// Configura o pool de conexões com Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  webSocketConstructor: ws,
});

// Cria o Drizzle ORM com a conexão ao Neon
export const db = drizzle({ client: pool, schema });