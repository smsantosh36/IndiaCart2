import { readDB, writeDB, slugify } from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  const db = await readDB();
  const index = db.pages.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Page nahi mili' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(db.pages[index]);
  }

  if (req.method === 'PUT') {
    const current = db.pages[index];
    const { title, content, seoTitle, seoDescription } = req.body || {};

    const updated = {
      ...current,
      title: title && title.trim() ? title.trim() : current.title,
      slug: title && title.trim() ? slugify(title) : current.slug,
      content: content !== undefined ? content : current.content,
      seoTitle: seoTitle !== undefined ? seoTitle : current.seoTitle,
      seoDescription: seoDescription !== undefined ? seoDescription : current.seoDescription
    };

    db.pages[index] = updated;
    await writeDB(db);
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    db.pages.splice(index, 1);
    await writeDB(db);
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
