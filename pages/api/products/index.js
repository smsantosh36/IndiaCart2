import { readDB, writeDB, genId, slugify, calcDiscount } from '../../../lib/db';

export default async function handler(req, res) {
  const db = await readDB();

  if (req.method === 'GET') {
    const { categoryId, brandId } = req.query;
    let products = db.products;
    if (categoryId) {
      products = products.filter((p) => p.categoryId === categoryId);
    }
    if (brandId) {
      products = products.filter((p) => p.brandId === brandId);
    }
    return res.status(200).json(products);
  }

  if (req.method === 'POST') {
    const {
      title,
      categoryId,
      brandId,
      regularPrice,
      salePrice,
      shortDescription,
      affiliateUrl,
      images,
      seoTitle,
      seoDescription
    } = req.body || {};

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Product title zaroori hai' });
    }
    if (!categoryId) {
      return res.status(400).json({ error: 'Category select karein' });
    }
    if (!affiliateUrl || !affiliateUrl.trim()) {
      return res.status(400).json({ error: 'Affiliate URL zaroori hai' });
    }

    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (db.products.some((p) => p.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const product = {
      id: genId(),
      title: title.trim(),
      slug,
      categoryId,
      brandId: brandId || '',
      regularPrice: Number(regularPrice) || 0,
      salePrice: Number(salePrice) || 0,
      discountPercent: calcDiscount(regularPrice, salePrice),
      shortDescription: shortDescription || '',
      affiliateUrl: affiliateUrl.trim(),
      images: Array.isArray(images) ? images.filter((u) => u && u.trim()) : [],
      seoTitle: seoTitle || '',
      seoDescription: seoDescription || '',
      viewCount: 0,
      clickCount: 0,
      createdAt: new Date().toISOString()
    };

    db.products.push(product);
    await writeDB(db);
    return res.status(201).json(product);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
