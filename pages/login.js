import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    setLoading(false);
    if (res.ok) {
      const redirect = router.query.redirect || '/dashboard';
      router.push(redirect);
    } else {
      const data = await res.json();
      setError(data.error || 'Login nahi ho saka');
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-8 w-full max-w-sm space-y-5"
      >
        <div className="text-center mb-2">
          <p className="font-display text-2xl">
            Deal<span className="text-mango">Loop</span>
          </p>
          <p className="text-muted text-sm mt-1">Dashboard login</p>
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-mango text-white font-medium py-2.5 rounded-full hover:bg-orange-500 transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
