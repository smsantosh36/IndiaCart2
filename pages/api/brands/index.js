import { readDB, writeDB, genId, slugify } from '../../../lib/db';

export default async function handler(req, res) {
  const db = await readDB();

  if (req.method === 'GET') {
    return res.status(200).json(db.brands);
  }

  if (req.method === 'POST') {
    const { name, logo, description, seoTitle, seoDescription } = req.body || {};

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Brand name zaroori hai' });
    }

    const baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;
    while (db.brands.some((b) => b.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const brand = {
      id: genId(),
      name: name.trim(),
      slug,
      logo: logo || '',
      description: description || '',
      seoTitle: seoTitle || '',
      seoDescription: seoDescription || '',
      createdAt: new Date().toISOString()
    };

    db.brands.push(brand);
    await writeDB(db);
    return res.status(201).json(brand);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
