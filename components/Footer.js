import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetch('/api/pages')
      .then((r) => r.json())
      .then(setPages)
      .catch(() => setPages([]));
  }, []);

  return (
    <footer className="border-t border-line mt-16">
      <div className="max-w-6xl mx-auto px-5 py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} DealLoop</p>
        {pages.length > 0 && (
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {pages.map((p) => (
              <Link key={p.id} href={`/${p.slug}`} className="hover:text-teal">
                {p.title}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
}
