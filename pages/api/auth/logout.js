export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }
  res.setHeader('Set-Cookie', 'dealloop_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');
  return res.status(200).json({ success: true });
}
