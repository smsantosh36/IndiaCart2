import { readDB, writeDB, slugify } from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  const db = await readDB();
  const index = db.brands.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Brand nahi mila' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(db.brands[index]);
  }

  if (req.method === 'PUT') {
    const current = db.brands[index];
    const { name, logo, description, seoTitle, seoDescription } = req.body || {};

    const updated = {
      ...current,
      name: name && name.trim() ? name.trim() : current.name,
      slug: name && name.trim() ? slugify(name) : current.slug,
      logo: typeof logo === 'string' ? logo : current.logo,
      description: description !== undefined ? description : current.description,
      seoTitle: seoTitle !== undefined ? seoTitle : current.seoTitle,
      seoDescription: seoDescription !== undefined ? seoDescription : current.seoDescription
    };

    db.brands[index] = updated;
    await writeDB(db);
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    const removed = db.brands[index];
    db.brands.splice(index, 1);
    // Is brand se link hue products ka brandId hata dete hain (orphan reference na rahe)
    db.products = db.products.map((p) =>
      p.brandId === removed.id ? { ...p, brandId: '' } : p
    );
    await writeDB(db);
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
