import { readDB, writeDB, slugify } from '../../../lib/db';

export const config = {
  api: {
    bodyParser: { sizeLimit: '10mb' }
  }
};

export default async function handler(req, res) {
  const { id } = req.query;
  const db = await readDB();
  const index = db.categories.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Category nahi mili' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(db.categories[index]);
  }

  if (req.method === 'PUT') {
    const { title, image, description, seoTitle, seoDescription } = req.body || {};
    const current = db.categories[index];
    const updated = {
      ...current,
      title: title && title.trim() ? title.trim() : current.title,
      slug: title && title.trim() ? slugify(title) : current.slug,
      image: typeof image === 'string' ? image : current.image,
      description: description !== undefined ? description : current.description,
      seoTitle: seoTitle !== undefined ? seoTitle : current.seoTitle,
      seoDescription: seoDescription !== undefined ? seoDescription : current.seoDescription
    };
    db.categories[index] = updated;
    await writeDB(db);
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    const removed = db.categories[index];
    db.categories.splice(index, 1);
    // is category ke products bhi hata do taake orphan na rahein
    db.products = db.products.filter((p) => p.categoryId !== removed.id);
    await writeDB(db);
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
