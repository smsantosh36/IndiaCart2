import { readDB, writeDB, genId, slugify } from '../../../lib/db';

export default async function handler(req, res) {
  const db = await readDB();

  if (req.method === 'GET') {
    return res.status(200).json(db.pages);
  }

  if (req.method === 'POST') {
    const { title, content, seoTitle, seoDescription } = req.body || {};
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Page title zaroori hai' });
    }

    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (db.pages.some((p) => p.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const page = {
      id: genId(),
      title: title.trim(),
      slug,
      content: content || '',
      seoTitle: seoTitle || '',
      seoDescription: seoDescription || '',
      createdAt: new Date().toISOString()
    };

    db.pages.push(page);
    await writeDB(db);
    return res.status(201).json(page);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
