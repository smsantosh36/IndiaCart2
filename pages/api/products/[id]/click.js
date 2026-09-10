import { readDB, writeDB } from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  const { id } = req.query;
  const db = await readDB();
  const index = db.products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product nahi mila' });
  }

  db.products[index].clickCount = (db.products[index].clickCount || 0) + 1;
  await writeDB(db);
  return res.status(200).json({ clickCount: db.products[index].clickCount });
}
