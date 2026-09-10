import { readDB } from '../../../lib/db';

function csvEscape(value) {
  const str = String(value ?? '');
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end();
  }

  const db = await readDB();
  const categoryTitle = (id) => db.categories.find((c) => c.id === id)?.title || '';

  const headers = [
    'title',
    'category',
    'regularPrice',
    'salePrice',
    'shortDescription',
    'affiliateUrl',
    'images',
    'seoTitle',
    'seoDescription'
  ];

  const rows = db.products.map((p) => [
    p.title,
    categoryTitle(p.categoryId),
    p.regularPrice,
    p.salePrice,
    p.shortDescription,
    p.affiliateUrl,
    (p.images || []).join('|'),
    p.seoTitle,
    p.seoDescription
  ]);

  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
  return res.status(200).send(csv);
}
