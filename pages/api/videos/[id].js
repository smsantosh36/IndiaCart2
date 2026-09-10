import { readDB, writeDB } from '../../../lib/db';
import { getVideoEmbedInfo } from '../../../lib/videoEmbed';

export default async function handler(req, res) {
  const { id } = req.query;
  const db = await readDB();
  const index = db.videos.findIndex((v) => v.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Video nahi mila' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(db.videos[index]);
  }

  if (req.method === 'PUT') {
    const current = db.videos[index];
    const { url, caption, followUrl } = req.body || {};

    let platform = current.platform;
    let embedUrl = current.embedUrl;
    let nextUrl = current.url;

    if (url && url.trim() && url.trim() !== current.url) {
      nextUrl = url.trim();
      const info = getVideoEmbedInfo(nextUrl);
      platform = info.platform;
      embedUrl = info.embedUrl;
    }

    const updated = {
      ...current,
      url: nextUrl,
      platform,
      embedUrl,
      caption: caption !== undefined ? caption : current.caption,
      followUrl: followUrl !== undefined ? followUrl : current.followUrl
    };

    db.videos[index] = updated;
    await writeDB(db);
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    db.videos.splice(index, 1);
    await writeDB(db);
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
