import { readDB, writeDB, genId } from '../../../lib/db';

// Banner image base64 aane ki wajah se body size limit badhai
export const config = {
  api: {
    bodyParser: { sizeLimit: '10mb' }
  }
};

export default async function handler(req, res) {
  const db = await readDB();

  if (req.method === 'GET') {
    const sorted = [...db.banners].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return res.status(200).json(sorted);
  }

  if (req.method === 'POST') {
    const { image, link, title } = req.body || {};

    if (!image) {
      return res.status(400).json({ error: 'Banner image zaroori hai' });
    }

    const banner = {
      id: genId(),
      image,
      link: link || '',
      title: title || '',
      createdAt: new Date().toISOString()
    };

    db.banners.push(banner);
    await writeDB(db);
    return res.status(201).json(banner);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
