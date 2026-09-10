import { readDB, writeDB } from '../../../lib/db';

export const config = {
  api: {
    bodyParser: { sizeLimit: '10mb' }
  }
};

export default async function handler(req, res) {
  const { id } = req.query;
  const db = await readDB();
  const index = db.banners.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Banner nahi mila' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(db.banners[index]);
  }

  if (req.method === 'PUT') {
    const current = db.banners[index];
    const { image, link, title } = req.body || {};

    const updated = {
      ...current,
      image: typeof image === 'string' && image ? image : current.image,
      link: link !== undefined ? link : current.link,
      title: title !== undefined ? title : current.title
    };

    db.banners[index] = updated;
    await writeDB(db);
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    db.banners.splice(index, 1);
    await writeDB(db);
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
