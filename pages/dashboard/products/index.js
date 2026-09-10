import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/DashboardLayout';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json())
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    });
  }

  useEffect(load, []);

  async function handleDelete(id) {
    if (!confirm('Ye product delete karein?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    load();
  }

  // Products ko unki category ke hisaab se group karte hain, taake sab
  // ek hi page par — category-wise, image ke saath — dikh sakein.
  const groups = categories
    .map((cat) => ({
      category: cat,
      items: products.filter((p) => p.categoryId === cat.id)
    }))
    .filter((group) => group.items.length > 0);

  const uncategorized = products.filter(
    (p) => !categories.some((c) => c.id === p.categoryId)
  );

  return (
    <DashboardLayout
      title="Products"
      action={
        <div className="flex items-center gap-2">
          <a
            href="/api/products/export"
            className="border border-line text-sm px-4 py-2 rounded-full font-medium hover:bg-paper transition-colors"
          >
            Export CSV
          </a>
          <Link
            href="/dashboard/products/import"
            className="border border-line text-sm px-4 py-2 rounded-full font-medium hover:bg-paper transition-colors"
          >
            Import CSV
          </Link>
          <Link
            href="/dashboard/products/new"
            className="bg-mango text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-500 transition-colors"
          >
            + Add product
          </Link>
        </div>
      }
    >
      {loading && <p className="text-muted">Loading...</p>}

      {!loading && products.length === 0 && (
        <div className="border border-dashed border-line rounded-2xl p-10 text-center text-muted">
          Koi product nahi hai. "+ Add product" par click karke shuru karein.
        </div>
      )}

      {!loading &&
        groups.map(({ category, items }) => (
          <div key={category.id} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-display text-lg font-medium">{category.title}</h2>
              <span className="text-xs text-muted bg-paper border border-line rounded-full px-2 py-0.5">
                {items.length}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((p) => {
                const cover = p.images && p.images.length > 0 ? p.images[0] : null;
                return (
                  <div key={p.id} className="bg-white border border-line rounded-2xl overflow-hidden">
                    <div className="aspect-square bg-paper">
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cover} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted text-sm">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-medium text-sm line-clamp-2 min-h-[2.5em]">{p.title}</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-semibold">₹{p.salePrice}</span>
                        {p.regularPrice > p.salePrice && (
                          <span className="text-xs text-muted line-through">₹{p.regularPrice}</span>
                        )}
                        {p.discountPercent > 0 && (
                          <span className="text-xs text-teal font-medium">{p.discountPercent}% off</span>
                        )}
                      </div>
                      <p className="text-xs text-muted mt-2">
                        👁 {p.viewCount || 0} views · 🔗 {p.clickCount || 0} clicks
                      </p>
                      <div className="flex gap-3 text-sm mt-3">
                        <Link href={`/pd/${p.slug}`} target="_blank" className="text-teal hover:underline">
                          View
                        </Link>
                        <Link href={`/dashboard/products/edit/${p.id}`} className="text-teal hover:underline">
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      {!loading && uncategorized.length > 0 && (
        <div className="mb-10">
          <h2 className="font-display text-lg font-medium mb-4">Uncategorized</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uncategorized.map((p) => {
              const cover = p.images && p.images.length > 0 ? p.images[0] : null;
              return (
                <div key={p.id} className="bg-white border border-line rounded-2xl overflow-hidden">
                  <div className="aspect-square bg-paper">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cover} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted text-sm">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-sm line-clamp-2 min-h-[2.5em]">{p.title}</p>
                    <div className="flex gap-3 text-sm mt-3">
                      <Link href={`/pd/${p.slug}`} target="_blank" className="text-teal hover:underline">
                        View
                      </Link>
                      <Link href={`/dashboard/products/edit/${p.id}`} className="text-teal hover:underline">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
