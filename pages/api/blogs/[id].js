import { readDB, writeDB, slugify } from '../../../lib/db';

export const config = {
  api: {
    bodyParser: { sizeLimit: '10mb' }
  }
};

export default async function handler(req, res) {
  const { id } = req.query;
  const db = await readDB();
  const index = db.blogs.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Blog nahi mila' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(db.blogs[index]);
  }

  if (req.method === 'PUT') {
    const current = db.blogs[index];
    const { title, featuredImage, content, seoTitle, seoDescription } = req.body || {};

    const updated = {
      ...current,
      title: title && title.trim() ? title.trim() : current.title,
      slug: title && title.trim() ? slugify(title) : current.slug,
      featuredImage: typeof featuredImage === 'string' ? featuredImage : current.featuredImage,
      content: content !== undefined ? content : current.content,
      seoTitle: seoTitle !== undefined ? seoTitle : current.seoTitle,
      seoDescription: seoDescription !== undefined ? seoDescription : current.seoDescription
    };

    db.blogs[index] = updated;
    await writeDB(db);
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    db.blogs.splice(index, 1);
    await writeDB(db);
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
