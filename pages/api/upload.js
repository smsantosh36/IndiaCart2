export const config = {
  api: {
    bodyParser: { sizeLimit: '10mb' }
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  const { dataUri, filename } = req.body || {};
  if (!dataUri || !dataUri.startsWith('data:')) {
    return res.status(400).json({ error: 'Valid image data zaroori hai' });
  }

  const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

  if (!hasBlob) {
    // Local dev mein (bina Vercel Blob connect kiye) base64 hi wapas kar dete hain,
    // taake bina extra setup ke bhi sab kaam karta rahe.
    return res.status(200).json({ url: dataUri });
  }

  const matches = dataUri.match(/^data:(.+);base64,(.*)$/);
  if (!matches) {
    return res.status(400).json({ error: 'Image data parse nahi ho saka' });
  }

  const contentType = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  const ext = contentType.split('/')[1] || 'jpg';
  const safeName = (filename || 'image').replace(/[^a-zA-Z0-9-_]/g, '-');
  const key = `${safeName}-${Date.now()}.${ext}`;

  try {
    const { put } = await import('@vercel/blob');
    const blob = await put(key, buffer, {
      access: 'public',
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    return res.status(200).json({ url: blob.url });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Upload fail ho gaya' });
  }
}
