import { readDB, writeDB, slugify, calcDiscount } from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  const db = await readDB();
  const index = db.products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product nahi mila' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(db.products[index]);
  }

  if (req.method === 'PUT') {
    const current = db.products[index];
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

    const nextRegular =
      regularPrice !== undefined ? Number(regularPrice) : current.regularPrice;
    const nextSale = salePrice !== undefined ? Number(salePrice) : current.salePrice;

    let slug = current.slug;
    const titleChanged = title && title.trim() && title.trim() !== current.title;
    if (titleChanged || !slug) {
      const baseSlug = slugify(title && title.trim() ? title : current.title);
      slug = baseSlug;
      let counter = 1;
      while (db.products.some((p) => p.id !== id && p.slug === slug)) {
        slug = `${baseSlug}-${counter++}`;
      }
    }

    const updated = {
      ...current,
      title: title && title.trim() ? title.trim() : current.title,
      slug,
      categoryId: categoryId || current.categoryId,
      brandId: brandId !== undefined ? brandId : current.brandId,
      regularPrice: nextRegular,
      salePrice: nextSale,
      discountPercent: calcDiscount(nextRegular, nextSale),
      shortDescription:
        shortDescription !== undefined ? shortDescription : current.shortDescription,
      affiliateUrl:
        affiliateUrl && affiliateUrl.trim() ? affiliateUrl.trim() : current.affiliateUrl,
      images: Array.isArray(images)
        ? images.filter((u) => u && u.trim())
        : current.images,
      seoTitle: seoTitle !== undefined ? seoTitle : current.seoTitle,
      seoDescription: seoDescription !== undefined ? seoDescription : current.seoDescription
    };

    db.products[index] = updated;
    await writeDB(db);
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    db.products.splice(index, 1);
    await writeDB(db);
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
