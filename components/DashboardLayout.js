import Link from 'next/link';
import { useRouter } from 'next/router';

const links = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/categories', label: 'Categories' },
  { href: '/dashboard/brands', label: 'Brands' },
  { href: '/dashboard/products', label: 'Products' },
  { href: '/dashboard/coupons', label: 'Coupons' },
  { href: '/dashboard/videos', label: 'Videos' },
  { href: '/dashboard/banners', label: 'Banners' },
  { href: '/dashboard/blogs', label: 'Blog' },
  { href: '/dashboard/pages', label: 'Pages' },
  { href: '/dashboard/settings', label: 'Settings' }
];

export default function DashboardLayout({ title, action, children }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-paper flex">
      <aside className="w-56 bg-ink text-white shrink-0 hidden sm:flex flex-col">
        <Link href="/" className="font-display text-lg px-5 py-5 border-b border-white/10">
          Deal<span className="text-mango">Loop</span>
        </Link>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((link) => {
            const active = router.pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  active ? 'bg-mango text-white' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 px-5 py-4 space-y-2">
          <Link href="/" className="block text-xs text-white/60 hover:text-white">
            ← View public site
          </Link>
          <button
            onClick={handleLogout}
            className="block text-xs text-white/60 hover:text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-line px-6 h-16 flex items-center justify-between">
          <h1 className="font-display text-xl font-medium">{title}</h1>
          {action}
        </header>
        <main className="p-6 max-w-5xl">{children}</main>
      </div>
    </div>
  );
}
