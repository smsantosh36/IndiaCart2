import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/DashboardLayout';

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      });
  }

  useEffect(load, []);

  async function handleDelete(id) {
    if (!confirm('Ye category delete karein? Iske products bhi delete ho jayenge.')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <DashboardLayout
      title="Categories"
      action={
        <Link
          href="/dashboard/categories/new"
          className="bg-mango text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-500 transition-colors"
        >
          + Add category
        </Link>
      }
    >
      {loading && <p className="text-muted">Loading...</p>}

      {!loading && categories.length === 0 && (
        <div className="border border-dashed border-line rounded-2xl p-10 text-center text-muted">
          Koi category nahi hai. "+ Add category" par click karke shuru karein.
        </div>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white border border-line rounded-2xl overflow-hidden">
            <div className="aspect-video bg-paper">
              {cat.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted text-sm">
                  No image
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="font-display font-medium">{cat.title}</p>
              <p className="text-xs text-muted mb-2">/{cat.slug}</p>
              <p className="text-xs text-teal font-medium mb-3">
                👁 {cat.viewCount || 0} views
              </p>
              <div className="flex gap-3 text-sm">
                <Link
                  href={`/dashboard/categories/edit/${cat.id}`}
                  className="text-teal hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-500 hover:underline"
                >
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
