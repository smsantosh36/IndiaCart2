import { readDB, writeDB } from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  const { id } = req.query;
  const db = await readDB();
  const index = db.videos.findIndex((v) => v.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Video nahi mila' });
  }

  db.videos[index].likeCount = (db.videos[index].likeCount || 0) + 1;
  await writeDB(db);
  return res.status(200).json({ likeCount: db.videos[index].likeCount });
}
