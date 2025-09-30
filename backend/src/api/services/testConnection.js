import { Client } from 'pg';

export async function GET(req) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    const result = await client.query('SELECT NOW()');
    await client.end();
    return new Response(JSON.stringify({ success: true, time: result.rows[0] }), { status: 200 });
  } catch (error) {
    console.error('Error connecting to the database', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}