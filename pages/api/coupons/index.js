import { readDB, writeDB, genId } from '../../../lib/db';

// Brand logo base64 aane ki wajah se body size limit badhai
export const config = {
  api: {
    bodyParser: { sizeLimit: '5mb' }
  }
};

export default async function handler(req, res) {
  const db = await readDB();

  if (req.method === 'GET') {
    const sorted = [...db.coupons].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return res.status(200).json(sorted);
  }

  if (req.method === 'POST') {
    const { brandName, brandLogo, discountText, code, affiliateUrl } = req.body || {};

    if (!brandName || !brandName.trim()) {
      return res.status(400).json({ error: 'Brand name zaroori hai' });
    }
    if (!discountText || !discountText.trim()) {
      return res.status(400).json({ error: 'Discount text zaroori hai' });
    }
    if (!code || !code.trim()) {
      return res.status(400).json({ error: 'Coupon code zaroori hai' });
    }

    const coupon = {
      id: genId(),
      brandName: brandName.trim(),
      brandLogo: brandLogo || '',
      discountText: discountText.trim(),
      code: code.trim().toUpperCase(),
      affiliateUrl: affiliateUrl || '',
      createdAt: new Date().toISOString()
    };

    db.coupons.push(coupon);
    await writeDB(db);
    return res.status(201).json(coupon);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
