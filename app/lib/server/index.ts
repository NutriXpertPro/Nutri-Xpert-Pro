import express from 'express';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const app = express();
const port = process.env.PORT || 3001;

// Configuração básica do Express
app.use(express.json());

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`✅ Backend rodando na porta ${port}`);
});