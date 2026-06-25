import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const sql = neon(process.env.DATABASE_URL);

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS votes (
        id SERIAL PRIMARY KEY,
        user_name TEXT NOT NULL,
        date DATE NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('yes', 'no')),
        UNIQUE(user_name, date)
      )
    `;

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT user_name, date::text, status FROM votes
        WHERE date >= '2026-07-01' AND date <= '2026-09-30'
        ORDER BY date
      `;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { user_name, date, status } = req.body;
      if (!user_name || !date || !status) return res.status(400).json({ error: 'Chýbajú dáta' });

      const rows = await sql`
        INSERT INTO votes (user_name, date, status)
        VALUES (${user_name}, ${date}, ${status})
        ON CONFLICT (user_name, date) DO UPDATE SET status = EXCLUDED.status
        RETURNING user_name, date::text, status
      `;
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      const { user_name, date } = req.body;
      if (!user_name || !date) return res.status(400).json({ error: 'Chýbajú dáta' });

      await sql`DELETE FROM votes WHERE user_name = ${user_name} AND date = ${date}`;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Metóda nie je povolená' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
