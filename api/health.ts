import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db'; // Aqui você importa o db do seu lib/db.ts

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    // Teste simples para verificar a conexão com o banco
    const result = await db.execute('SELECT NOW() AS current_time');
    res.status(200).json({ ok: true, current_time: result.rows[0].current_time });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}