import { readDB, writeDB, genId } from '../../../lib/db';
import { getVideoEmbedInfo } from '../../../lib/videoEmbed';

export default async function handler(req, res) {
  const db = await readDB();

  if (req.method === 'GET') {
    const sorted = [...db.videos].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return res.status(200).json(sorted);
  }

  if (req.method === 'POST') {
    const { url, caption, followUrl } = req.body || {};

    if (!url || !url.trim()) {
      return res.status(400).json({ error: 'Video URL zaroori hai' });
    }

    const { platform, embedUrl } = getVideoEmbedInfo(url.trim());

    const video = {
      id: genId(),
      url: url.trim(),
      platform,
      embedUrl,
      caption: caption || '',
      followUrl: followUrl || '',
      likeCount: 0,
      followClickCount: 0,
      createdAt: new Date().toISOString()
    };

    db.videos.push(video);
    await writeDB(db);
    return res.status(201).json(video);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
