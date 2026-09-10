import { readDB, writeDB, genId, slugify, calcDiscount } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  const { products } = req.body || {};
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: 'Koi product data nahi mila' });
  }

  const db = await readDB();
  const results = { created: 0, errors: [] };

  products.forEach((row, i) => {
    const rowNumber = i + 2; // +2 = header row + 1-indexed
    const title = (row.title || '').trim();
    const categoryName = (row.category || '').trim();
    const affiliateUrl = (row.affiliateUrl || '').trim();

    if (!title) {
      results.errors.push(`Row ${rowNumber}: title missing`);
      return;
    }
    if (!categoryName) {
      results.errors.push(`Row ${rowNumber}: category missing`);
      return;
    }
    if (!affiliateUrl) {
      results.errors.push(`Row ${rowNumber}: affiliateUrl missing`);
      return;
    }

    // Category naam se dhoondo, na mile to nayi bana do
    let category = db.categories.find(
      (c) => c.title.toLowerCase() === categoryName.toLowerCase()
    );
    if (!category) {
      const baseCatSlug = slugify(categoryName);
      let catSlug = baseCatSlug;
      let catCounter = 1;
      while (db.categories.some((c) => c.slug === catSlug)) {
        catSlug = `${baseCatSlug}-${catCounter++}`;
      }
      category = {
        id: genId(),
        title: categoryName,
        slug: catSlug,
        image: '',
        description: '',
        seoTitle: '',
        seoDescription: '',
        viewCount: 0,
        createdAt: new Date().toISOString()
      };
      db.categories.push(category);
    }

    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (db.products.some((p) => p.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const regularPrice = Number(row.regularPrice) || 0;
    const salePrice = Number(row.salePrice) || 0;
    const images = (row.images || '')
      .split('|')
      .map((u) => u.trim())
      .filter(Boolean);

    const product = {
      id: genId(),
      title,
      slug,
      categoryId: category.id,
      regularPrice,
      salePrice,
      discountPercent: calcDiscount(regularPrice, salePrice),
      shortDescription: row.shortDescription || '',
      affiliateUrl,
      images,
      seoTitle: row.seoTitle || '',
      seoDescription: row.seoDescription || '',
      viewCount: 0,
      clickCount: 0,
      createdAt: new Date().toISOString()
    };

    db.products.push(product);
    results.created += 1;
  });

  await writeDB(db);
  return res.status(200).json(results);
}
