export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  const { username, password } = req.body || {};
  const validUser = process.env.DASHBOARD_USERNAME || 'admin';
  const validPass = process.env.DASHBOARD_PASSWORD || 'admin123';
  const secret = process.env.AUTH_SECRET || 'dealloop-dev-secret-change-me';

  if (username === validUser && password === validPass) {
    const isProd = process.env.NODE_ENV === 'production';
    const maxAge = 60 * 60 * 24 * 7; // 7 din
    res.setHeader(
      'Set-Cookie',
      `dealloop_session=${secret}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${
        isProd ? '; Secure' : ''
      }`
    );
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: 'Username ya password galat hai' });
}
