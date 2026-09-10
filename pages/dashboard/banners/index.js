import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/DashboardLayout';

export default function BannersList() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch('/api/banners')
      .then((r) => r.json())
      .then((data) => {
        setBanners(data);
        setLoading(false);
      });
  }

  useEffect(load, []);

  async function handleDelete(id) {
    if (!confirm('Ye banner delete karein?')) return;
    await fetch(`/api/banners/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <DashboardLayout
      title="Banners"
      action={
        <Link
          href="/dashboard/banners/new"
          className="bg-mango text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-500 transition-colors"
        >
          + Add banner
        </Link>
      }
    >
      <p className="text-sm text-muted mb-6">
        Homepage par "Advertisement" heading ke saath har 3 category ke baad ye banners dikhte
        hain. Section poora dikhana/chupana chahte hain to{' '}
        <Link href="/dashboard/settings" className="text-teal hover:underline">
          Settings
        </Link>{' '}
        mein toggle karein.
      </p>

      {loading && <p className="text-muted">Loading...</p>}

      {!loading && banners.length === 0 && (
        <div className="border border-dashed border-line rounded-2xl p-10 text-center text-muted">
          Koi banner nahi hai. "+ Add banner" se shuru karein.
        </div>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white border border-line rounded-2xl overflow-hidden">
            <div className="aspect-video bg-paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={banner.image} alt={banner.title || 'Banner'} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <p className="text-sm text-muted mb-3 truncate">{banner.link || 'No click-through link'}</p>
              <div className="flex gap-3 text-sm">
                <Link href={`/dashboard/banners/edit/${banner.id}`} className="text-teal hover:underline">
                  Edit
                </Link>
                <button onClick={() => handleDelete(banner.id)} className="text-red-500 hover:underline">
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
