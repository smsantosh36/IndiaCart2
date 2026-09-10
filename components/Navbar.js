import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [logo, setLogo] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => setLogo(data?.logoImage || ''));
  }, []);

  return (
    <header className="bg-ink text-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="Logo" className="h-9 w-auto object-contain" />
          ) : (
            <span className="font-display text-xl tracking-tight">
              Deal<span className="text-mango">Loop</span>
            </span>
          )}
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-mango transition-colors">
            Home
          </Link>
          <Link
            href="/dashboard"
            className="bg-mango text-white px-4 py-2 rounded-full font-medium hover:bg-orange-500 transition-colors"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
