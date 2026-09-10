import { readDB, writeDB, genId, slugify } from '../../../lib/db';

// Featured image base64 + long rich-text content aane ki wajah se limit badhai
export const config = {
  api: {
    bodyParser: { sizeLimit: '10mb' }
  }
};

export default async function handler(req, res) {
  const db = await readDB();

  if (req.method === 'GET') {
    // Sabse naya blog sabse upar
    const sorted = [...db.blogs].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return res.status(200).json(sorted);
  }

  if (req.method === 'POST') {
    const { title, featuredImage, content, seoTitle, seoDescription } = req.body || {};
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Blog title zaroori hai' });
    }

    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (db.blogs.some((b) => b.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const blog = {
      id: genId(),
      title: title.trim(),
      slug,
      featuredImage: featuredImage || '',
      content: content || '',
      seoTitle: seoTitle || '',
      seoDescription: seoDescription || '',
      createdAt: new Date().toISOString()
    };

    db.blogs.push(blog);
    await writeDB(db);
    return res.status(201).json(blog);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
