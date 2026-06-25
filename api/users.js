import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const sql = neon(process.env.DATABASE_URL);

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        color TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    if (req.method === 'GET') {
      const rows = await sql`SELECT name, color FROM users ORDER BY created_at`;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { name, color } = req.body;
      if (!name || !color) return res.status(400).json({ error: 'Chýba meno alebo farba' });

      const rows = await sql`
        INSERT INTO users (name, color)
        VALUES (${name}, ${color})
        ON CONFLICT (name) DO UPDATE SET color = EXCLUDED.color
        RETURNING name, color
      `;
      return res.status(200).json(rows[0]);
    }

    return res.status(405).json({ error: 'Metóda nie je povolená' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
