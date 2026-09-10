import { readDB, writeDB } from '../../../lib/db';

export const config = {
  api: {
    bodyParser: { sizeLimit: '5mb' }
  }
};

export default async function handler(req, res) {
  const { id } = req.query;
  const db = await readDB();
  const index = db.coupons.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Coupon nahi mila' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(db.coupons[index]);
  }

  if (req.method === 'PUT') {
    const current = db.coupons[index];
    const { brandName, brandLogo, discountText, code, affiliateUrl } = req.body || {};

    const updated = {
      ...current,
      brandName: brandName && brandName.trim() ? brandName.trim() : current.brandName,
      brandLogo: typeof brandLogo === 'string' ? brandLogo : current.brandLogo,
      discountText:
        discountText && discountText.trim() ? discountText.trim() : current.discountText,
      code: code && code.trim() ? code.trim().toUpperCase() : current.code,
      affiliateUrl: typeof affiliateUrl === 'string' ? affiliateUrl : current.affiliateUrl
    };

    db.coupons[index] = updated;
    await writeDB(db);
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    db.coupons.splice(index, 1);
    await writeDB(db);
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
