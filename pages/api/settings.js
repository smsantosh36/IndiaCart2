import { readDB, writeDB } from '../../lib/db';

// Logo base64 aane ki wajah se body size limit badha di
export const config = {
  api: {
    bodyParser: { sizeLimit: '5mb' }
  }
};

export default async function handler(req, res) {
  const db = await readDB();

  if (req.method === 'GET') {
    return res.status(200).json(db.settings);
  }

  if (req.method === 'PUT') {
    const { logoImage, siteTitle, siteDescription, showBanners } = req.body || {};
    db.settings = {
      ...db.settings,
      logoImage: typeof logoImage === 'string' ? logoImage : db.settings.logoImage,
      siteTitle: typeof siteTitle === 'string' ? siteTitle : db.settings.siteTitle,
      siteDescription:
        typeof siteDescription === 'string' ? siteDescription : db.settings.siteDescription,
      showBanners: typeof showBanners === 'boolean' ? showBanners : db.settings.showBanners
    };
    await writeDB(db);
    return res.status(200).json(db.settings);
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
