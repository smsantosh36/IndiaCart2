import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/DashboardLayout';

export default function BrandsList() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch('/api/brands')
      .then((r) => r.json())
      .then((data) => {
        setBrands(data);
        setLoading(false);
      });
  }

  useEffect(load, []);

  async function handleDelete(id) {
    if (!confirm('Ye brand delete karein? Iske products se brand hat jaayega (products delete nahi honge).')) return;
    await fetch(`/api/brands/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <DashboardLayout
      title="Brands"
      action={
        <Link
          href="/dashboard/brands/new"
          className="bg-mango text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-500 transition-colors"
        >
          + Add brand
        </Link>
      }
    >
      {loading && <p className="text-muted">Loading...</p>}

      {!loading && brands.length === 0 && (
        <div className="border border-dashed border-line rounded-2xl p-10 text-center text-muted">
          Koi brand nahi hai. "+ Add brand" se shuru karein.
        </div>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <div key={brand.id} className="bg-white border border-line rounded-2xl overflow-hidden">
            <div className="aspect-video bg-paper flex items-center justify-center p-4">
              {brand.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={brand.logo} alt={brand.name} className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="text-muted text-sm">No logo</div>
              )}
            </div>
            <div className="p-4">
              <p className="font-display font-medium">{brand.name}</p>
              <p className="text-xs text-muted mb-3">/b/{brand.slug}</p>
              <div className="flex gap-3 text-sm">
                <Link href={`/b/${brand.slug}`} target="_blank" className="text-teal hover:underline">
                  View
                </Link>
                <Link href={`/dashboard/brands/edit/${brand.id}`} className="text-teal hover:underline">
                  Edit
                </Link>
                <button onClick={() => handleDelete(brand.id)} className="text-red-500 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
