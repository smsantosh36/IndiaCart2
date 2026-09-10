import { readDB, writeDB, genId, slugify } from '../../../lib/db';

// Category image base64 aane ki wajah se body size limit badha di
export const config = {
  api: {
    bodyParser: { sizeLimit: '10mb' }
  }
};

export default async function handler(req, res) {
  const db = await readDB();

  if (req.method === 'GET') {
    return res.status(200).json(db.categories);
  }

  if (req.method === 'POST') {
    const { title, image, description, seoTitle, seoDescription } = req.body || {};
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Category title zaroori hai' });
    }
    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (db.categories.some((c) => c.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }
    const category = {
      id: genId(),
      title: title.trim(),
      slug,
      image: image || '',
      description: description || '',
      seoTitle: seoTitle || '',
      seoDescription: seoDescription || '',
      viewCount: 0,
      createdAt: new Date().toISOString()
    };
    db.categories.push(category);
    await writeDB(db);
    return res.status(201).json(category);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
